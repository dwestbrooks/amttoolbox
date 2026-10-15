#!/usr/bin/env python3
"""Price re-verification gate for AMTToolbox guides.

Shipped guides quote vendor prices, and a price is the one fact that expires on the vendor's
schedule rather than ours. This walks the three structured price shapes in src/app/guides/, loads
each product page in a real browser, and reports any claim the live page no longer supports.

DETECTOR, not a fixer: it says "the number we published is not on the live page" and shows the live
numbers so a human decides. It never writes a replacement figure.

Why a real browser rather than curl: Amazon answers a plain urllib request with a ~3.7 KB stub, and
sep.snapon.com answers with ~4.6 KB behind a student login. A 200 with no product on it is not
verification, so both would silently read as "could not check". Playwright is already this repo's
proven fetch path (see scripts/check_geometry.py).

Exit codes: 0 = nothing to review, 1 = at least one NOT FOUND or DRIFTED, 2 = setup error.

Usage:
    /usr/local/bin/python3 scripts/check_prices.py            # every guide
    /usr/local/bin/python3 scripts/check_prices.py --selftest # offline parser checks, no network
    /usr/local/bin/python3 scripts/check_prices.py --json
"""

import argparse
import json
import os
import re
import sys
from decimal import Decimal, InvalidOperation

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUIDES = os.path.join(REPO, "src", "app", "guides")

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")

DOLLAR = re.compile(r"\$\s?(\d[\d,]*(?:\.\d\d)?)")
# Retailers ship the price in the page's app data, not as visible text: Harbor Freight's product page
# has "price":289.99 in JSON and no dollar sign anywhere in the server-rendered HTML. Scanning only
# for "$" made a page that plainly states its price read as a bot wall.
PRICE_FIELD = re.compile(r'"price"\s*:\s*"?([\d.,]+)"?', re.I)

# The three shapes actually in this repo. Each yields (guide, name, claim, url).
# kit-builder: the verified price of the linked budget pick, a planning figure: { price, url }
KIT = re.compile(r"id:\s*'([^']*)'.*?name:\s*'([^']*)'.*?priority:\s*\d+,\s*price:\s*(\d+(?:\.\d+)?)\s*,\s*url:\s*'(https?://[^']*)'", re.S)
# best-toolboxes: a prose price note that sometimes carries a number: { priceNote, url }
NOTE = re.compile(r"name:\s*'([^']*)'.*?priceNote:\s*'([^']*)'.*?url:\s*'(https?://[^']*)'", re.S)
# snap-on: a quoted catalog price with no per-item URL on the page: { sku, name, price }
SKU = re.compile(r"sku:\s*'([^']*)'\s*,\s*name:\s*'([^']*)'\s*,\s*price:\s*'([^']*)'", re.S)

APPROX = re.compile(r"\b(?:about|around|roughly|approx|approximately)\b|~", re.I)
# The product's own buy-box price, in preference to every dollar amount on the page.
OWN_PRICE_SEL = (".a-price .a-offscreen, #corePrice_feature_div .a-offscreen, "
                 "#price_inside_buybox, .price--main .price__current, [data-testid='price']")
WALL = re.compile(r"access to this page has been denied|captcha|unusual traffic|incapsula|"
                  r"enable javascript|request blocked", re.I)


def num(s):
    """'$1,234.50' / '1234.5' -> Decimal, or None."""
    try:
        return Decimal(str(s).replace(",", "").replace("$", "").strip())
    except (InvalidOperation, AttributeError):
        return None


def claimed_values(price_str):
    """Every number in a price string is a separate claim."""
    return [v for v in (num(m.group(1)) for m in DOLLAR.finditer(price_str)) if v is not None]


def live_values(html):
    """Prices the live page offers: price fields anywhere in the page data, then visible dollar amounts.

    ponytail: this collects every number the page associates with a price, so OK means "the figure is on
    the page", not "it is this SKU's price". Good enough for a detector (a real drift removes the number
    entirely, and a human reads the live list before trusting it). Tighten to the product's own offer node
    if vendor pages start carrying decoy prices that mask drift.
    """
    vals = set()
    for m in PRICE_FIELD.finditer(html):
        v = num(m.group(1))
        if v is not None:
            vals.add(v)
    body = re.sub(r"<script.*?</script>", " ", html, flags=re.S)
    body = re.sub(r"<style.*?</style>", " ", body, flags=re.S)
    body = re.sub(r"<[^>]+>", " ", body)
    for m in DOLLAR.finditer(body):
        v = num(m.group(1))
        if v is not None:
            vals.add(v)
    return vals


def parse_guides():
    """[(guide, name, kind, claim, url)] for every structured price in the guides.

    kind: 'planning' (a kit planning figure) | 'price' (a quoted figure) | 'approx' (prose)
    """
    out = []
    if not os.path.isdir(GUIDES):
        return out
    for slug in sorted(os.listdir(GUIDES)):
        page = os.path.join(GUIDES, slug, "page.tsx")
        if not os.path.isfile(page):
            continue
        src = open(page, encoding="utf-8", errors="ignore").read()
        for _id, name, price, url in KIT.findall(src):
            out.append((slug, name, "planning", [num(price)], url))
        for name, price_note, url in NOTE.findall(src):
            vals = claimed_values(price_note)
            if vals:                      # "Check current price on Amazon" claims nothing
                kind = "approx" if APPROX.search(price_note) else "price"
                out.append((slug, name, kind, vals, url))
        for sku, name, price in SKU.findall(src):
            # the page has no per-item URL, but the student program has one per SKU
            out.append((slug, name, "price", claimed_values(price),
                        f"https://sep.snapon.com/product/{sku}"))
    # de-dup: a page can repeat an entry in a schema block
    seen, uniq = set(), []
    for row in out:
        key = (row[0], row[1], str(row[3]), row[4])
        if key not in seen:
            seen.add(key)
            uniq.append(row)
    return uniq


def own_price(html):
    """The buy box price from server HTML, or None.

    Amazon renders #corePrice* with the product's price; every other dollar amount on the page belongs
    to a different product. Harbor Freight and Shopify-style stores are already precise because their
    JSON carries one product, so this only has to help where it is ambiguous.
    """
    for anchor in (r'id="corePrice_feature_div"', r'id="corePriceDisplay_desktop_feature_div"',
                   r'id="corePrice_desktop"', r'class="a-offscreen"'):
        m = re.search(anchor + r"(.{0,4000}?)</div>", html, re.S)
        if not m:
            continue
        hit = DOLLAR.search(m.group(1))
        if hit:
            v = num(hit.group(1))
            if v is not None:
                return v
    return None


def ssl_context():
    """A verifying context for an interpreter that has no CA store of its own.

    /usr/local/bin/python3 is a python.org build with zero CA certificates -- and it is also the only
    interpreter here with Playwright, so the gate would fail every urllib fetch with
    CERTIFICATE_VERIFY_FAILED and then blame the vendor for a bot wall.
    """
    import ssl
    ctx = ssl.create_default_context()
    if ctx.cert_store_stats().get("x509_ca"):
        return ctx
    cafiles = []
    try:
        import certifi
        cafiles.append(certifi.where())
    except Exception:
        pass
    cafiles.append("/etc/ssl/cert.pem")
    for cafile in cafiles:
        if cafile and os.path.exists(cafile):
            try:
                ctx.load_verify_locations(cafile)
                return ctx
            except Exception:
                continue
    return ctx


def simple_fetch(url):
    """(html, reason). No JavaScript, so it sees server-rendered prices only.

    The reason matters: returning a silent "" made a 403 look identical to a bot wall, and the gate then
    reported "wall" for a vendor that was refusing the request outright.
    """
    import gzip
    import urllib.error
    import urllib.request
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9",
                                               "Accept-Encoding": "gzip"})
    try:
        with urllib.request.urlopen(req, timeout=45, context=ssl_context()) as r:
            raw = r.read()
            if r.headers.get("Content-Encoding") == "gzip":
                raw = gzip.decompress(raw)
            return raw.decode("utf-8", "ignore"), ""
    except urllib.error.HTTPError as e:
        return "", f"HTTP {e.code}"
    except Exception as e:
        return "", type(e).__name__


def fetch_html(urls):
    """{url: html} trying the cheap path first, the browser second; '' when neither saw the page.

    The two vendors wall opposite clients: harbor freight answers urllib with the product page and a
    headless Chromium with "Access to this page has been denied", while Amazon serves the browser a 2.5 MB
    product page and urllib a 3.7 KB stub. One path cannot cover both, so take whichever returned a real
    page -- HTML with prices in it and no bot-wall marker.
    """
    pages, own = {}, {}
    reasons = {}
    need_browser = []
    for u in urls:
        html, why = simple_fetch(u)
        if why:
            reasons[u] = why
        if html and not WALL.search(html) and live_values(html):
            pages[u] = html
            op = own_price(html)
            if op is not None:
                own[u] = f"${op}"
        else:
            need_browser.append(u)
    if need_browser:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch()
            ctx = browser.new_context(user_agent=UA, locale="en-US")
            for u in need_browser:
                page = ctx.new_page()
                try:
                    page.goto(u, wait_until="domcontentloaded", timeout=45000)
                    page.wait_for_timeout(2500)          # let price widgets settle
                    html = page.content()
                    el = page.query_selector(OWN_PRICE_SEL)
                    own[u] = (el.inner_text() or "").strip() if el else ""
                    if not own[u]:
                        op = own_price(html)
                        if op is not None:
                            own[u] = f"${op}"
                    if not live_values(html) and live_values(pages.get(u, "")):
                        continue                          # keep the better of the two
                    pages[u] = html
                    if not live_values(html):
                        reasons[u] = (reasons.get(u, "") + " + browser wall").strip(" +")
                except Exception as exc:
                    pages[u] = pages.get(u, "")
                    reasons[u] = (reasons.get(u, "") + f" + {type(exc).__name__}").strip(" +")
                finally:
                    page.close()
            browser.close()
    return pages, own, reasons


def judge(kind, claim, vals):
    """OK / DRIFTED / NOT FOUND / UNVERIFIED.

    'About $120' is an approximate claim about a page whose price moves with the seller, so it gets a
    tolerance; a quoted catalog figure ('$3,060') has to be there exactly. Judging an approximate note
    by exact equality is what made the DeWalt box read as drift when the live page said $120.99.
    """
    if not vals:
        return "UNVERIFIED"
    if kind == "planning":
        # a planning figure on an Amazon pick: flag a real move, not a five-dollar wobble
        c = claim[0]
        return "OK" if any(abs(v - c) <= c * Decimal("0.25") for v in vals) else "DRIFTED"
    if any(v in vals for v in claim):
        return "OK"
    if kind == "approx":
        for c in claim:
            tol = max(Decimal("5"), c * Decimal("0.1"))
            if any(abs(v - c) <= tol for v in vals):
                return "OK"
    return "NOT FOUND"


def run(as_json=False):
    rows = parse_guides()
    if not rows:
        print("no structured prices found", file=sys.stderr)
        return 2
    urls = sorted({r[4] for r in rows if r[4]})
    print(f"price re-verification: {len(rows)} claims, {len(urls)} product URLs")
    pages, own, reasons = fetch_html(urls)
    results, bad = [], 0
    for slug, name, kind, claim, url in rows:
        html = pages.get(url, "") if url else ""
        vals = live_values(html) if html else set()
        blocked = bool(html) and not vals
        source = "page"
        if url and own.get(url):
            precise = set(claimed_values(own[url]))
            if precise:                # the buy box beats a page-wide scan
                vals, source = precise, "own price"
        verdict = judge(kind, claim, vals)
        if verdict in ("NOT FOUND", "DRIFTED"):
            bad += 1
        results.append({"guide": slug, "name": name, "kind": kind,
                        "claim": [str(c) for c in (claim if isinstance(claim, tuple) else claim)],
                        "url": url, "verdict": verdict, "blocked": blocked,
                        "why": reasons.get(url, "") if url else "no product URL on the page",
                        "source": source,
                        "live_sample": sorted(str(v) for v in vals)[:8]})
    if as_json:
        print(json.dumps(results, indent=2))
    else:
        for v in ("NOT FOUND", "DRIFTED", "UNVERIFIED"):
            hits = [r for r in results if r["verdict"] == v]
            if not hits:
                continue
            label = {"NOT FOUND": "NOT FOUND (the signal)", "DRIFTED": "DRIFTED (the signal)",
                     "UNVERIFIED": "UNVERIFIED - could not confirm, not proof of drift"}[v]
            print(f"\n{label} ({len(hits)}):")
            for r in hits:
                why = r["live_sample"][:6] if r["live_sample"] else (
                    f"blocked: {r['why']}" if r.get("why") else "no page reached")
                print(f"  {r['name'][:52]:<52} [{r['guide'][:26]}] claim={r['claim']} live={why}"
                      f" ({r.get('source','page')})")
        ok = sum(1 for r in results if r["verdict"] == "OK")
        print(f"\nOK: {ok}/{len(results)}")
    return 1 if bad else 0


def selftest():
    # price strings
    assert claimed_values("About $290 at Harbor Freight") == [Decimal("290")], claimed_values("x$290")
    assert claimed_values("$3,060") == [Decimal("3060")]
    assert claimed_values("Check current price on Amazon") == []
    assert claimed_values("$4,390 to $4,890") == [Decimal("4390"), Decimal("4890")]
    # live page extraction, JSON-LD preferred
    html = ('<script type="application/ld+json">{"offers":{"price":"290.00"}}</script>'
            '<div>Only <span>$289.99</span> today</div>')
    assert live_values(html) == {Decimal("290.00"), Decimal("289.99")}, live_values(html)
    hf = '<script>window.__data={"product":{"price":289.99,"priceCurrency":"USD"}}</script><p>In stock</p>'
    assert live_values(hf) == {Decimal("289.99")}, live_values(hf)
    # verdicts
    assert judge("price", [Decimal("290")], {Decimal("290"), Decimal("1")}) == "OK"
    assert judge("price", [Decimal("290")], {Decimal("310")}) == "NOT FOUND"
    assert judge("price", [Decimal("290")], set()) == "UNVERIFIED"
    assert judge("planning", [Decimal("100")], {Decimal("110")}) == "OK"        # a normal wobble
    assert judge("planning", [Decimal("100")], {Decimal("131")}) == "DRIFTED"   # the wrench-set case
    assert judge("planning", [Decimal("100")], set()) == "UNVERIFIED"
    # an approximate note tolerates a moved price; a quoted figure does not
    assert judge("approx", [Decimal("120")], {Decimal("120.99")}) == "OK"
    assert judge("approx", [Decimal("120")], {Decimal("160")}) == "NOT FOUND"
    assert judge("price", [Decimal("3060")], {Decimal("3060.00")}) == "OK"
    assert judge("price", [Decimal("3060")], {Decimal("2999")}) == "NOT FOUND"
    # the interpreter this runs on may ship no CA store, so the guard must produce a usable context
    assert ssl_context().cert_store_stats().get("x509_ca", 0) > 0, "no CA certs loaded: HTTPS would fail"
    amz = '<div id="corePrice_feature_div"><span class="a-offscreen">$69.98</span><span>$66.48</span></div>'
    assert own_price(amz) == Decimal("69.98"), own_price(amz)
    assert own_price('<div>no price block here</div>') is None
    # a wall must be recognisable, or a blocked page reads as "vendor changed the price"
    assert WALL.search('<title>Access to this page has been denied</title>')
    assert not WALL.search('<title>US General 30 in. 5-Drawer Mechanics Cart</title>')
    # the real parsers, against this repo's own files
    rows = parse_guides()
    assert rows, "parser found no price claims in the guides"
    kinds = {r[2] for r in rows}
    assert kinds <= {"planning", "price", "approx"}, kinds
    assert any(r[2] == "approx" for r in rows), "the 'About $290' prose claims should be marked approx"
    kit = [r for r in rows if r[2] == "planning"]
    assert len(kit) == 25, f"expected the 25 kit items, found {len(kit)}"
    assert all(r[3] for r in rows), [r for r in rows if not r[3]]   # never a claimless claim
    print(f"selftest: parsing, price extraction and the verdict ladder behave "
          f"({len(rows)} real claims found: {sum(1 for r in rows if r[2]=='planning')} kit figures, "
          f"{sum(1 for r in rows if r[2]=='price')} quoted prices)")
    return 0


def main():
    ap = argparse.ArgumentParser(description="does the live product page still support our price?")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        return selftest()
    return run(a.json)


if __name__ == "__main__":
    sys.exit(main())
