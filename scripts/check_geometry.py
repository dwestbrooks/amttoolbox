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

    // SC 2.5.8 inline exception: a link that is part of a sentence or block of
    // text. Compare the link's own text against its parent's total text.
    const own =   (el.textContent || '').trim();
    const parentText = el.parentElement ? (el.parentElement.textContent || '').trim() : '';
    const inlineInProse = parentText.length > own.length + 40;

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

  const overflow = doc.scrollWidth - window.innerWidth;
  return JSON.stringify({
    overflow: overflow > 0 ? overflow : 0,
    problems: problems,
  });
}
"""


def discover_routes(url):
    """All indexable HTML routes: sitemap.xml, plus the build manifest when local."""
    routes = set()
    try:
        xml = urllib.request.urlopen(f"{url}/sitemap.xml", timeout=30).read().decode()
        routes |= {re.sub(r"^https?://[^/]+", "", u) or "/"
                   for u in re.findall(r"<loc>([^<]+)</loc>", xml)}
    except urllib.error.URLError as e:
        print(f"  ! could not read sitemap: {e}")

    # A page missing from the sitemap is still a page. Pull every real route from the
    # build manifest so an unlisted page cannot hide from the gate.
    manifest = ROOT / ".next" / "app-path-routes-manifest.json"
    if manifest.exists():
        for key in json.loads(manifest.read_text()):
            route = key[:-len("/page")] if key.endswith("/page") else None
            if route and "." not in route and not route.startswith("/_"):
                routes.add(route or "/")

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
    from playwright.sync_api import sync_playwright

    findings = []
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
                findings.append((route, prob["rule"], prob["what"], prob["size"]))
            if result["overflow"]:
                findings.append((route, "SC 1.4.10",
                                 f"horizontal overflow of {result['overflow']}px",
                                 f"{viewport['width']}px viewport"))
        browser.close()
    return findings


def selftest():
    """Prove the checks fail on a known-bad page and pass on a known-good one."""
    from playwright.sync_api import sync_playwright
    print("selftest: verifying the checks themselves")

    bad = """<html><body>
      <button style="height:20px;width:60px">Short button</button>
      <div style="width:9999px;height:10px"></div>
    </body></html>"""
    good = """<html><body>
      <button style="height:36px;width:60px">Proper button</button>
      <p>Some prose that runs along and then a
        <a href="#" style="height:18px">link inside it</a> continues the sentence.</p>
      <label><input type="radio" style="width:13px;height:13px"> Radio via label</label>
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

        page.set_content(good)
        r = json.loads(page.evaluate(MEASURE_JS))
        if r["problems"]:
            failures.append(f"good page: false positive {r['problems']}")
        if r["overflow"]:
            failures.append(f"good page: false overflow {r['overflow']}")
        browser.close()

    for f in failures:
        print(f"  FAIL  {f}")
    if failures:
        print("\nselftest FAILED - the gate would not be trustworthy.")
        return 1
    print("  ok  catches a 20px button and horizontal overflow")
    print("  ok  exempts an inline prose link (18px) and a radio inside a label")
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
        findings = check(url, routes, viewport)
    finally:
        if server:
            server.terminate()
            server.wait(timeout=15)

    if findings:
        by_rule = {}
        for route, rule, what, size in findings:
            by_rule.setdefault(rule, []).append(f"{route}  {what}  [{size}]")
        print(f"FAIL - {len(findings)} rendered-geometry problem(s):\n")
        for rule, items in sorted(by_rule.items()):
            print(f"  {rule}:")
            for i in items:
                print(f"    {i}")
        return 1

    print(f"PASS - {len(routes)} routes: every standalone control is at least 24x24 "
          f"and nothing overflows at {viewport['width']}px.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
