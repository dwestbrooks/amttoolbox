#!/usr/local/bin/python3
"""Live-link gate for the AMTToolbox guides.

Every outbound product link in a guide is a claim: "this product exists and you can buy it here". A
retired SKU, a renumbered item or an Amazon search URL silently breaks the claim while the page keeps
rendering perfectly, so nothing on the site tells you. This walks the links in the SOURCE (not the live
page, which lags the deploy) and says which ones no longer stand up.

It is the ORACLE, not the fixer. It never invents a replacement URL; it tells you a link is dead and
gives you the product name to search for. Fixing is a research step, so pair it with the candidate gate:

    # the fix loop: try a candidate, keep the first one that passes, cap 2 per link
    /usr/local/bin/python3 scripts/check_links.py --url 'https://www.amazon.com/dp/B01N1H4N5X'

Two fetch paths, because the retailers wall opposite clients: Amazon answers urllib with a ~3.7 KB stub
and a browser with the real 2.5 MB product page, Harbor Freight the reverse. A 200 with no product on it
is not verification.

Retries follow the house doctrine (see inscope/scripts/retry_failures.py): only 408/429/5xx and socket
errors are retried -- they are OUR rate limit or the vendor's blip. A 403 (bot wall) and a 404 (genuinely
gone) are never retried: retrying a wall anonymously is dishonest and a 404 does not heal.

Exit codes: 0 = every link stands up, 1 = at least one BROKEN / DEAD_PRODUCT / SEARCH_PAGE, 2 = setup error.

Usage:
    /usr/local/bin/python3 scripts/check_links.py                    # every guide source
    /usr/local/bin/python3 scripts/check_links.py --url URL          # verify ONE candidate (exit 0 = OK)
    /usr/local/bin/python3 scripts/check_links.py --no-browser       # curl-only pass, faster, less sure
    /usr/local/bin/python3 scripts/check_links.py --root ~/path/to/site/src/app/guides   # another guide repo
    /usr/local/bin/python3 scripts/check_links.py --json
    /usr/local/bin/python3 scripts/check_links.py --selftest
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from urllib.parse import urlparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from check_prices import UA, WALL, ssl_context          # noqa: E402  (proven fetch + wall behaviour)

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUIDES = os.path.join(REPO, "src", "app", "guides")
# Link shapes actually used in this repo: data arrays (`url: '...'`) and JSX anchors.
LINK = re.compile(r"url:\s*'(https?://[^']+)'"
                  r"|href=\"(https?://[^\"]+)\""
                  r"|href=\{'?(https?://[^']+)'?\}")
NAME = re.compile(r"name:\s*'([^']{2,80})'")

SKIP_HOSTS = {"amttoolbox.com", "www.amttoolbox.com", "biohackbuyer.com", "www.biohackbuyer.com",
              "schema.org", "www.w3.org", "googletagmanager.com", "google.com", "www.google.com",
              "vercel.com"}

# Bot walls and dead pages
SOFT404 = re.compile(r"page not found|we'?re sorry\. the web address|the web address you entered is not "
                      r"a functioning page|looking for something\?|no longer available|"
                      r"this listing was ended|item you requested is not available|404 not found|"
                      r"page you were looking for|product not found", re.I)
# A live product page offers a way to buy. Strong signal beats a stray "no longer available"
# string in a recommendations carousel -- but only inside the head of the document.
BUY = re.compile(r"add to cart|addtocart|add-to-cart|corePrice|\"price\"\s*:|itemprop=\"price\"|buy now",
                 re.I)
HEAD = 80000                     # where a soft-404 banner lives, if there is one
TRANSIENT = {408, 425, 429, 500, 502, 503, 504}
STUB_HOSTS = ("amazon.",)        # answers urllib with a ~3.7 KB stub, so go straight to the browser
DEAD = ("BROKEN", "DEAD_PRODUCT", "SEARCH_PAGE")
# Paths that are a browse/search/storefront/root page, never the thing a product link promised.
# Matching a bare "starts with /s" instead flagged /solawave (an Amazon storefront) as a search URL and
# /scripts/cdrh/.../pmn.cfm (a LIVE FDA 510(k) record) as a dead product.
BROWSE_PATHS = ("/s", "/search", "/browse", "/collections/all")


def is_browse(path):
    p = (path or "/").rstrip("/").lower() or "/"
    return (p == "/" or p in BROWSE_PATHS
            or any(p.startswith(b + "/") for b in BROWSE_PATHS)
            or p.startswith("/stores/page/") or p.startswith("/store/"))


def wrong_destination(path, final):
    """The link resolved to a browse page although a specific page was asked for."""
    return is_browse(urlparse(final).path) and not is_browse(path)


def status_of(url, retries=2, gap=5):
    """(code|None, final_url, html, why). Retries the transient classes only."""
    why = ""
    for attempt in range(retries + 1):
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9",
                                                   "Accept-Encoding": "identity"})
        try:
            with urllib.request.urlopen(req, timeout=30, context=ssl_context()) as r:
                return r.status, r.geturl(), r.read().decode("utf-8", "ignore"), ""
        except urllib.error.HTTPError as e:
            why = f"HTTP {e.code}"
            if e.code in TRANSIENT and attempt < retries:
                time.sleep(gap)
                continue
            return e.code, url, "", why
        except Exception as e:                       # socket error / timeout / TLS
            why = type(e).__name__
            if attempt < retries:
                time.sleep(gap)
                continue
            return None, url, "", why
    return None, url, "", why


def judge(url, code, final, html, why=""):
    """OK / BROKEN / DEAD_PRODUCT / SEARCH_PAGE / RATE_LIMITED / UNVERIFIED / UNKNOWN."""
    host, path = urlparse(url).netloc, urlparse(url).path
    if code is None:
        return "UNKNOWN" if why else "UNKNOWN"
    if code in (404, 410) or code >= 500:
        return "BROKEN"
    if code == 403 or (html and WALL.search(html)):
        return "UNVERIFIED"                          # a wall is our limitation, not a client defect
    if code == 429:
        return "RATE_LIMITED"
    if code != 200:
        return "UNKNOWN"
    if is_browse(path) and "amazon." in host:
        return "SEARCH_PAGE"                        # /s?k= is a search, not a listing
    if wrong_destination(path, final):
        return "DEAD_PRODUCT"                       # the item now lands on a browse page
    head = html[:HEAD]
    if SOFT404.search(head) and not BUY.search(head):
        return "DEAD_PRODUCT"
    if BUY.search(html) or SOFT404.search(head):
        return "OK"                                  # a buy path on the page; the soft-404 strings lost
    return "UNVERIFIED"                              # a 200 stub with no product on it is not proof


def challenged(html):
    """A bot wall / challenge stub, not a product page: an empty, tiny or wall-marked document."""
    return (not html) or len(html) < 20000 or bool(WALL.search(html))


def browser_pass(urls, gap=3.5, backoff=10):
    """{url: (code, final_url, html, why)} through one headless Chromium, paced per host.

    Pacing is not politeness here, it is correctness: Amazon answers a burst of 70 product pages with
    robot stubs (measured: 56 of 74 links read "UNVERIFIED" in one burst pass, all of them OK one at a
    time at a 5 s spacing), which would make the gate's own verdicts depend on how fast it ran. A
    challenged page gets one retry after a longer pause, then its result stands as UNVERIFIED -- a wall
    is reported, never retried until it looks green.
    """
    out = {}
    if not urls:
        return out
    from playwright.sync_api import sync_playwright
    last = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(user_agent=UA, locale="en-US")
        for u in urls:
            host = urlparse(u).netloc
            for attempt in range(2):
                wait = gap - (time.time() - last.get(host, 0.0))
                if wait > 0:
                    time.sleep(wait)
                page = ctx.new_page()
                try:
                    resp = page.goto(u, wait_until="domcontentloaded", timeout=45000)
                    page.wait_for_timeout(1500)          # let the buy box settle
                    html = page.content()
                    out[u] = (resp.status if resp else None, page.url, html, "")
                except Exception as e:
                    out[u] = (None, u, "", type(e).__name__)
                finally:
                    page.close()
                    last[host] = time.time()
                if attempt == 0 and challenged(out[u][2]) and out[u][0] in (200, 403, None):
                    time.sleep(backoff)                  # throttled by our own burst, not by policy
                    continue
                break
        browser.close()
    return out


def inspect(urls, use_browser=True):
    """{url: {verdict, code, final, why, seen}} -- cheap path first, browser only where it must.

    The two paths disagree in both directions, so the verdicts are merged by how much they prove, not
    by which path ran last: the browser seeing a 404 beats urllib's stub, and urllib reading the real
    Harbor Freight page beats the browser's "Access to this page has been denied".

    ponytail: a stub that carries a buy marker without being a product page would outrank the browser.
    Amazon's stub is a 3.7 KB wall with no buy marker, so this has not happened; rank the paths rather
    than the verdicts if a vendor starts serving decoy pages.
    """
    RANK = {"OK": 4, "DEAD_PRODUCT": 3, "SEARCH_PAGE": 3, "BROKEN": 3,
            "RATE_LIMITED": 1, "UNVERIFIED": 0, "UNKNOWN": 0}
    results, need = {}, []
    for u in urls:
        if any(s in urlparse(u).netloc for s in STUB_HOSTS):
            # the cheap path only ever sees a wall here; asking anyway just feeds the rate limit
            results[u] = {"verdict": "UNVERIFIED", "code": None, "final": u, "why": "", "seen": "http"}
            if use_browser:
                need.append(u)
            continue
        code, final, html, why = status_of(u)
        v = judge(u, code, final, html, why)
        results[u] = {"verdict": v, "code": code, "final": final, "why": why, "seen": "http"}
        if use_browser and v in ("UNVERIFIED", "UNKNOWN"):
            need.append(u)
    if need:
        for u, (code, final, html, why) in browser_pass(need).items():
            v = judge(u, code, final, html, why)
            if code is not None and RANK[v] >= RANK[results[u]["verdict"]]:
                results[u].update(verdict=v, code=code, final=final, why=why, seen="browser")
            else:
                results[u]["why"] = (results[u]["why"] + " + browser wall").strip(" +")
    return results


def source_links(root=None):
    """[(slug, product_name, url)] for every outbound link in the guide sources."""
    rows = []
    root = root or GUIDES
    if not os.path.isdir(root):
        return rows
    for slug in sorted(os.listdir(root)):
        page = os.path.join(root, slug, "page.tsx")
        if not os.path.isfile(page):
            continue
        last_name = ""
        for line in open(page, encoding="utf-8", errors="ignore"):
            nm = NAME.search(line)
            if nm:
                last_name = nm.group(1)
            lm = LINK.search(line)
            if not lm:
                continue
            url = next(g for g in lm.groups() if g)
            if urlparse(url).netloc in SKIP_HOSTS:
                continue
            rows.append((slug, last_name, url))
    seen, uniq = set(), []
    for r in rows:
        if r[2] not in seen:
            seen.add(r[2])
            uniq.append(r)
    return uniq


def run(as_json=False, use_browser=True, root=None):
    rows = source_links(root)
    if not rows:
        print("no guide links found", file=sys.stderr)
        return 2
    res = inspect([r[2] for r in rows], use_browser)
    bad = [(s, n, u, res[u]) for s, n, u in rows if res[u]["verdict"] in DEAD]
    out = [{"guide": s, "product": n, "url": u, **{k: v for k, v in r.items() if k != "final"}}
           for s, n, u, r in [(s, n, u, res[u]) for s, n, u in rows]]
    if as_json:
        print(json.dumps(out, indent=2))
        return 1 if bad else 0
    print(f"link gate: {len(rows)} outbound links in {len({r[0] for r in rows})} guides")
    if not bad:
        print("every link stands up")
    for s, n, u, r in bad:
        print(f"\n{r['verdict']} [{s}] {n or '(no name parsed)'}\n  {u}\n  {r['why'] or 'HTTP ' + str(r['code'])}"
              + (f" -> {r['final']}" if r.get("final") and r["final"] != u else ""))
        print(f"  fix: find the current listing for this product, then gate the candidate with"
              f" --url '<candidate>' (cap 2 candidates, then escalate)")
    soft = [(s, u, r) for s, n, u, r in [(s, n, u, res[u]) for s, n, u in rows]
            if r["verdict"] in ("UNVERIFIED", "RATE_LIMITED")]
    if soft:
        print(f"\nUNVERIFIED ({len(soft)}) - could not confirm, NOT proof of a dead link:")
        for s, u, r in soft:
            print(f"  [{s}] {u} [{r['why'] or r['verdict']}, {r['seen']}]")
        print("  a bot wall is our limitation: never record one as broken and never retry it as if it heals")
    ok = sum(1 for s, n, u in rows if res[u]["verdict"] == "OK")
    print(f"\nOK: {ok}/{len(rows)}")
    return 1 if bad else 0


def selftest():
    amz, hf = "https://www.amazon.com/dp/B01N1H4N5X", "https://www.harborfreight.com/cart-70369.html"
    buy = '<div id="corePrice_feature_div"><span class="a-offscreen">$69.98</span><button>Add to Cart</button></div>'
    gone = '<title>Amazon.com</title><h1>Page Not Found</h1><p>Looking for something?</p>'
    # a 200 stub with no product on it is not verification
    assert judge(amz, 200, amz, "<html><body>robot check</body></html>") == "UNVERIFIED"
    assert judge(amz, 200, amz, buy) == "OK"
    assert judge(amz, 200, amz, gone) == "DEAD_PRODUCT"
    # a dead ASIN that redirects to the search page is dead, whatever the status says
    assert judge(amz, 200, "https://www.amazon.com/s?k=dewalt+box", buy) == "DEAD_PRODUCT"
    assert judge(amz, 200, amz + "/ref=sr_1_1", buy) == "OK"        # a canonical redirect is normal
    assert judge(amz, 404, amz, "") == "BROKEN"
    assert judge(amz, 410, amz, "") == "BROKEN"
    assert judge(amz, 503, amz, "") == "BROKEN"
    assert judge(hf, 403, hf, "") == "UNVERIFIED"
    assert judge(hf, 429, hf, "") == "RATE_LIMITED"
    assert judge(hf, None, hf, "", "URLError") == "UNKNOWN"
    assert judge("https://www.amazon.com/s?k=toolbox", 200, "https://www.amazon.com/s?k=toolbox", buy) == "SEARCH_PAGE"
    # a path that merely begins with "/s" is not a search page: /solawave is a storefront, and a live
    # FDA 510(k) record under /scripts/... must never be reported as a dead product
    assert judge("https://www.amazon.com/solawave", 200, "https://www.amazon.com/stores/page/ABC", buy) == "DEAD_PRODUCT"
    fda = "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfPMN/pmn.cfm?ID=K232863"
    assert judge(fda, 200, fda, "<title>510(k) Premarket Notification</title>") == "UNVERIFIED"
    assert wrong_destination("/scripts/cdrh/cfdocs/cfPMN/pmn.cfm", fda) is False
    assert wrong_destination("/dp/B01N1H4N5X", "https://www.amazon.com/s?k=x") is True
    assert is_browse("/") and is_browse("/s") and not is_browse("/solawave")
    assert wrong_destination("/dp/B01", "https://www.amazon.com/s?k=x") is True
    assert judge(hf, 200, hf, '<title>Access to this page has been denied</title>') == "UNVERIFIED"
    # a stray "no longer available" in a recommendations carousel must not kill a live product page
    live = buy + "<h2>Products related to this item</h2><p>This item is no longer available</p>"
    assert judge(amz, 200, amz, live) == "OK"
    # only the transient classes retry, and never a wall or a real 404
    assert TRANSIENT == {408, 425, 429, 500, 502, 503, 504}
    assert 403 not in TRANSIENT and 404 not in TRANSIENT
    # Amazon's cheap path is a stub, so it must be routed to the browser rather than believed
    assert any(s in "www.amazon.com" for s in STUB_HOSTS)
    assert not any(s in "www.harborfreight.com" for s in STUB_HOSTS)
    assert challenged("") and challenged("<title>Access to this page has been denied</title>")
    assert not challenged(buy + "x" * 20000)
    # the source parser, against this repo's own guides
    rows = source_links()
    assert 70 <= len(rows) <= 100, f"expected the ~98 guide links (~74 unique), found {len(rows)}"
    assert len({u for _, _, u in rows}) == len(rows), "the same URL is checked twice"
    assert any("harborfreight.com" in u for _, _, u in rows), "the Harbor Freight links went missing"
    assert all(u.startswith("http") for _, _, u in rows)
    assert all(n for _, n, u in rows if "amazon.com/dp" in u), "product names stop being parsed"
    assert not any(urlparse(u).netloc in SKIP_HOSTS for _, _, u in rows)
    print(f"selftest: verdict ladder, retry class and source parser behave "
          f"({len(rows)} real links across {len({r[0] for r in rows})} guides)")
    return 0


def main():
    ap = argparse.ArgumentParser(description="does every outbound product link still stand up?")
    ap.add_argument("--url", help="verify ONE candidate URL (the fix loop's oracle); exit 0 = OK")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--no-browser", action="store_true")
    ap.add_argument("--root", help="another site's src/app/guides dir (default: this repo)")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        return selftest()
    if a.url:
        r = inspect([a.url], not a.no_browser)[a.url]
        print(f"{r['verdict']}: {a.url}"
              + (f" [{r['why']}]" if r["why"] else "")
              + (f" -> {r['final']}" if r["final"] != a.url else "")
              + f" ({r['seen']})")
        return 0 if r["verdict"] == "OK" else 1
    return run(a.json, not a.no_browser, a.root)


if __name__ == "__main__":
    sys.exit(main())
