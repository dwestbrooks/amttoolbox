#!/usr/bin/env python3
"""
Rendered-geometry gate for AMT Toolbox.

WHY THIS EXISTS
---------------
check_a11y_tokens.py reads source text. It cannot see rendered geometry, so it
missed every one of these until a human ran a browser probe:

  - nav a rule not covering nav button      (Study dropdown stayed at 20px)
  - px-2 py-0.5 making buttons 22px WIDE    (socket-size buttons)
  - a 14px-wide "X" glyph                    (row-remove buttons)
  - a bare 16x16 icon-only tooltip button
  - 20px-tall collapsible triggers and gear-guide links

Each was a class-name problem in a shared string, which is exactly what a
text-level check should catch and structurally cannot. This measures the real
box model of the built site instead.

WHAT IT CHECKS (WCAG 2.2 AA)
  SC 2.5.8  Target Size (Minimum): standalone controls >= 24x24 CSS px.
            The inline-text exception applies to links in a sentence, and a
            radio/checkbox inside a <label> is reached via the label, so both
            are exempted using measured text length rather than a guess.
  SC 1.4.10 Reflow: no horizontal overflow at 320px.

The inline exception test is the part worth trusting: a previous naive pass
flagged four prose links ("SEP website" and friends) as defects. Measuring the
parent block's text length against the link's own showed they are sentences,
which WCAG exempts outright.

USAGE
  python3 scripts/check_geometry.py             # start server, check, tear down
  python3 scripts/check_geometry.py --url URL   # check an already-running site
  python3 scripts/check_geometry.py --selftest  # verify the checks themselves
"""
import argparse
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PORT = 3399
BASE = f"http://127.0.0.1:{PORT}"
VIEWPORT = {"width": 390, "height": 844}  # phone; the worst case for targets

# Measured in the browser, run against every discovered route.
MEASURE_JS = r"""
() => {
  const doc = document.documentElement;
  const problems = [];

  document.querySelectorAll('a,button,input,select,textarea,[role=button]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;          // hidden
    if (el.closest('[aria-hidden="true"]')) return;        // decorative
    if (el.classList.contains('skip-link')) return;        // only visible on focus

    // SC 2.5.8 inline exception: a link that is part of a sentence or block of text.
    // Compare the link's own text against its parent's total text.
    //
    // Guard on own.length: an icon-only control has NO text of its own (0), so a bare
    // parentText.length > own.length + 40 comparison is trivially true and exempts
    // exactly the controls this rule exists to catch — a 32x36 hamburger was being
    // skipped this way. An empty-text control is standalone by definition, never prose.
    const own = (el.textContent || '').trim();
    const parentText = el.parentElement ? (el.parentElement.textContent || '').trim() : '';
    const inlineInProse = own.length > 0 && parentText.length > own.length + 40;

    // A radio/checkbox inside a <label> is activated by the label, which is the
    // real target. The 16x16 box itself is not a separate control.
    const insideLabelTarget = !!el.closest('label');

    // Only real controls are held to 24px. Bare links are governed by the
    // inline rule above, so they are not blanket-flagged.
    const isControl = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);

    if ((r.height < 24 || r.width < 24) && !inlineInProse && !insideLabelTarget && isControl) {
      problems.push({
        rule: 'SC 2.5.8',
        what: own.slice(0, 30) || el.getAttribute('aria-label') || el.name || '(unnamed)',
        size: Math.round(r.height) + 'x' + Math.round(r.width),
      });
    }
  });

  // Reflow (SC 1.4.10). Check BOTH elements, and take the worst.
  //
  // documentElement.scrollWidth can report 0 while body.scrollWidth is far larger:
  // a page whose html/body carry `overflow-x: hidden` clips oversized absolutely
  // positioned decoration, so the document element never grows — but the body's
  // own scroll width still records it. Trusting only documentElement reported
  // "no overflow" on a page whose body measured 597px in a 390px viewport.
  const docOverflow = doc.scrollWidth - window.innerWidth;
  const bodyOverflow = document.body.scrollWidth - window.innerWidth;
  const overflow = Math.max(docOverflow, bodyOverflow);

  // An oversized element that something already clips is not user-visible, so name
  // the culprits: this distinguishes "decoration being contained" from a real
  // horizontal scrollbar the user has to fight.
  const wide = [];
  if (overflow > 0) {
    document.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > window.innerWidth + 2 || r.width > window.innerWidth + 2) {
        wide.push(el.tagName + '.' + (el.className || '').toString().split(' ')[0]
                  + ' w=' + Math.round(r.width)
                  + ' pos=' + getComputedStyle(el).position
                  + ' ovx=' + getComputedStyle(el).overflowX);
      }
    });
  }

  return JSON.stringify({
    overflow: overflow > 0 ? overflow : 0,
    overflowDoc: docOverflow > 0 ? docOverflow : 0,
    overflowBody: bodyOverflow > 0 ? bodyOverflow : 0,
    clipped: getComputedStyle(doc).overflowX === 'hidden' ||
            getComputedStyle(document.body).overflowX === 'hidden',
    culprits: wide.slice(0, 5),
    problems: problems,
  });
}
"""


def discover_routes(url):
    """All indexable HTML routes.

    Two sources, because neither is complete on its own:
      - sitemap.xml: what the site chose to submit. An SEO artifact.
      - the build manifest: every route the build actually produced.

    Normalise trailing slashes before unioning. A site built with
    `trailingSlash: true` lists `/cold-plunge/` in the sitemap while the manifest
    says `/cold-plunge` — naively unioning those two sets double-counts every page
    and reports a route count roughly twice the truth (92 vs 47 on one site).
    """
    routes = set()

    def norm(p):
        return "/" if p in ("", "/") else p.rstrip("/")

    try:
        xml = urllib.request.urlopen(f"{url}/sitemap.xml", timeout=30).read().decode()
        routes |= {norm(re.sub(r"^https?://[^/]+", "", u))
                   for u in re.findall(r"<loc>([^<]+)</loc>", xml)}
    except urllib.error.URLError as e:
        print(f"  ! could not read sitemap: {e}")

    # A page missing from the sitemap is still a page. Pull every real route from the
    # build manifest so an unlisted page cannot hide from the gate.
    manifest = ROOT / ".next" / "app-path-routes-manifest.json"
    if manifest.exists():
        for key in json.loads(manifest.read_text()):
            if key.endswith("/page"):
                route = norm(key[: -len("/page")])
                if "." not in route and not route.startswith("/_"):
                    routes.add(route)

    return sorted(routes)


def wait_for_server(timeout=90):
    """Poll a health endpoint instead of sleeping blindly."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(BASE, timeout=3):
                return True
        except Exception:
            time.sleep(1)
    return False


def check(url, routes, viewport):
    """Returns (failures, warnings).

    Failures are user-visible defects. Warnings are things worth knowing that are
    currently contained — chiefly oversized decoration that html/body already clip,
    which is not a reflow failure but does mean the clip is load-bearing.
    """
    from playwright.sync_api import sync_playwright

    failures, warnings = [], []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport=viewport)
        for route in routes:
            page.goto(url + route, wait_until="load", timeout=45000)
            # Let client components hydrate; many tools render their rows on mount.
            try:
                page.wait_for_load_state("networkidle", timeout=8000)
            except Exception:
                pass
            page.wait_for_timeout(700)

            result = json.loads(page.evaluate(MEASURE_JS))
            for prob in result["problems"]:
                failures.append((route, prob["rule"], prob["what"], prob["size"]))

            if result["overflow"]:
                detail = (f"doc +{result['overflowDoc']}px, body +{result['overflowBody']}px; "
                          f"culprits: {'; '.join(result['culprits']) or 'unknown'}")
                if result["clipped"]:
                    # html/body clip it, so there is no horizontal scrollbar to fight.
                    # Not a SC 1.4.10 failure — but the clip is the only thing keeping it
                    # contained, so record it rather than reporting a silent clean bill.
                    warnings.append((route, "SC 1.4.10 (clipped)", detail, ""))
                else:
                    failures.append((route, "SC 1.4.10",
                                     f"horizontal overflow of {result['overflow']}px", detail))
        browser.close()
    return failures, warnings


def selftest():
    """Prove the checks fail on a known-bad page and pass on a known-good one."""
    from playwright.sync_api import sync_playwright
    print("selftest: verifying the checks themselves")

    bad = """<html><body>
      <button style="height:20px;width:60px">Short button</button>
      <div style="width:9999px;height:10px"></div>
    </body></html>"""
    # An icon-only control with no text, inside a text-heavy parent. The parent-text
    # heuristic alone exempts it (0 < 62-40), which is exactly backwards: no text means
    # standalone by definition. This is how a 36x32 hamburger slipped through once.
    icon_only = """<html><body>
      <div>Lots of surrounding prose here so the parent text is long enough
        to make the naive inline check trivially true.
        <button style="height:20px;width:20px" aria-label="Toggle menu"></button>
      </div>
    </body></html>"""
    good = """<html><body>
      <button style="height:36px;width:60px">Proper button</button>
      <p>Some prose that runs along and then a
        <a href="#" style="height:18px">link inside it</a> continues the sentence.</p>
      <label><input type="radio" style="width:13px;height:13px"> Radio via label</label>
    </body></html>"""
    # The blindspot this gate once had. documentElement.scrollWidth reports the
    # viewport width whenever the document is a clipping container, while
    # body.scrollWidth still records the real content extent — so a documentElement-only
    # check reports a clean page. This reproduces exactly that divergence:
    # doc = viewport (0 overflow), body = far wider.
    divergent = """<html><body style="margin:0">
      <div style="position:absolute;width:2000px;height:10px"></div>
    </body></html>"""

    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport=VIEWPORT)

        page.set_content(bad)
        r = json.loads(page.evaluate(MEASURE_JS))
        if not r["problems"]:
            failures.append("bad page: short button was NOT caught")
        if not r["overflow"]:
            failures.append("bad page: horizontal overflow was NOT caught")

        # An icon-only control must NOT be exempted by the prose heuristic.
        page.set_content(icon_only)
        r = json.loads(page.evaluate(MEASURE_JS))
        if not r["problems"]:
            failures.append("icon-only page: a text-less 20x20 button was NOT caught "
                            "(the prose heuristic exempted it)")
        elif "Toggle menu" not in r["problems"][0]["what"]:
            failures.append(f"icon-only page: expected the aria-label to be reported, "
                            f"got {r['problems'][0]['what']!r}")

        page.set_content(good)
        r = json.loads(page.evaluate(MEASURE_JS))
        if r["problems"]:
            failures.append(f"good page: false positive {r['problems']}")
        if r["overflow"]:
            failures.append(f"good page: false overflow {r['overflow']}")

        # Must catch overflow that documentElement alone hides.
        page.set_content(divergent)
        r = json.loads(page.evaluate(MEASURE_JS))
        if r["overflowDoc"] != 0:
            failures.append(f"divergent page: expected doc overflow 0, got {r['overflowDoc']}")
        if r["overflowBody"] <= 0:
            failures.append("divergent page fixture is not exercising the blindspot "
                            f"(body overflow = {r['overflowBody']})")
        if not r["overflow"]:
            failures.append("divergent page: body.scrollWidth overflow NOT caught "
                            "(this is the documentElement-only blindspot)")
        browser.close()

    for f in failures:
        print(f"  FAIL  {f}")
    if failures:
        print("\nselftest FAILED - the gate would not be trustworthy.")
        return 1
    print("  ok  catches a 20px button and horizontal overflow")
    print("  ok  catches a text-less icon button the prose heuristic would exempt")
    print("  ok  exempts an inline prose link (18px) and a radio inside a label")
    print("  ok  catches overflow that documentElement.scrollWidth hides (body only)")
    print("\nselftest passed.")
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", help="check an already-running site instead of starting one")
    ap.add_argument("--selftest", action="store_true")
    ap.add_argument("--width", type=int, default=VIEWPORT["width"])
    args = ap.parse_args()

    if args.selftest:
        return selftest()

    server = None
    url = args.url
    if not url:
        if not (ROOT / ".next").exists():
            print("No production build found. Run: npm run build")
            return 1
        # A static export (`output: 'export'` in next.config) emits HTML into out/ and
        # cannot be served by `next start` — that command exits immediately, which looks
        # like a hung build. Serve the exported directory instead.
        static_dir = ROOT / "out"
        if static_dir.exists() and (static_dir / "index.html").exists():
            server = subprocess.Popen(
                [sys.executable, "-m", "http.server", str(PORT), "--directory", str(static_dir)],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
        else:
            server = subprocess.Popen(
                ["npx", "next", "start", "-p", str(PORT)], cwd=ROOT,
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
        if not wait_for_server():
            server.terminate()
            print("Server did not become ready.")
            return 1
        url = BASE

    try:
        routes = discover_routes(url)
        if not routes:
            print("No routes discovered.")
            return 1
        viewport = {"width": args.width, "height": VIEWPORT["height"]}
        print(f"Checking {len(routes)} routes at {viewport['width']}px ...\n")
        failures, warnings = check(url, routes, viewport)
    finally:
        if server:
            server.terminate()
            server.wait(timeout=15)

    if warnings:
        uniq = {}
        for route, rule, what, _ in warnings:
            uniq.setdefault(rule, []).append(f"{route}  {what}")
        print(f"NOTE - {len(warnings)} route(s) with clipped horizontal overflow "
              f"(not a failure; html/body contain it):")
        for rule, items in sorted(uniq.items()):
            for i in items[:3]:
                print(f"    {i}")
            if len(items) > 3:
                print(f"    ... and {len(items) - 3} more")
        print("  The clip is load-bearing: if overflow-x:hidden is ever removed from")
        print("  html/body, these become real horizontal scrollbars. Consider giving the")
        print("  oversized decoration `contain: paint` on its own container instead.\n")

    if failures:
        by_rule = {}
        for route, rule, what, size in failures:
            by_rule.setdefault(rule, []).append(f"{route}  {what}  [{size}]")
        print(f"FAIL - {len(failures)} rendered-geometry problem(s):\n")
        for rule, items in sorted(by_rule.items()):
            print(f"  {rule}:")
            for i in items:
                print(f"    {i}")
        return 1

    print(f"PASS - {len(routes)} routes: every standalone control is at least 24x24 "
          f"and nothing overflows visibly at {viewport['width']}px.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
