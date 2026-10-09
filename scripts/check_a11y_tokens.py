#!/usr/bin/env python3
"""Guard the AMT Toolbox contrast + a11y invariants.

Run after `next build` (reads the prerendered HTML in .next/server/app), or against
the live site with --url.

Why this exists: the dark theme used `text-slate-500` (#64748b) and `text-slate-600`
(#475569) for tertiary text. On these backgrounds those measure 1.59:1 to 3.75:1 -
well under the 4.5:1 that 12px text needs. It looked fine on a bright monitor and
was invisible in review, because the page still *looked* dark and deliberate. A
contrast sweep across 28 pages found 9 distinct failing (colour, background) pairs.
So the tokens are asserted mechanically rather than eyeballed.

Honest limits:
- This checks the utility CLASSES in source, not rendered pixels. It cannot see a
  colour that arrives via inline style, a CSS variable, or an arbitrary value like
  bg-[#...]. Those need the browser probe (see the review doc).
- slate-400 passes with only 0.21:1 of headroom on the lightest real background
  (#21384e). If a lighter surface is ever introduced behind tertiary text, this
  gate will NOT catch it - re-measure in a browser.
- --url mode cannot run the source assertions (no source there), only the HTML.
"""

import argparse
import re
import sys
import urllib.request
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "src"

# --- the invariants ---------------------------------------------------------
# Tertiary text must not use these; both fail on every real background in use.
BANNED_TEXT_TOKENS = ["text-slate-500", "text-slate-600",
                      "placeholder-slate-500", "placeholder-slate-600"]
# These share the slate-500/600 *number* but are borders/fills, not text, and are
# deliberately left alone (borders are held to 3:1, not 4.5:1).
ALLOWED_NON_TEXT = ["border-slate-500", "border-slate-600",
                    "bg-slate-500", "bg-slate-600", "bg-slate-700",
                    "divide-slate-800", "border-slate-700", "border-slate-800"]

# WCAG contrast, mirroring the browser probe.
def _lum(rgb):
    f = [v / 255 for v in rgb]
    f = [v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4 for v in f]
    return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]


def ratio(a, b):
    x, y = _lum(a), _lum(b)
    hi, lo = max(x, y), min(x, y)
    return (hi + 0.05) / (lo + 0.05)


def hexrgb(s):
    return (int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16))


# Every background a tertiary-text element actually sits on, read from the live
# site. #21384e is the binding constraint (lightest of them).
REAL_BACKGROUNDS = ["1e293b", "0f172a", "172133", "21384e", "0e2138", "1b1840", "251b26"]
TEXT_COLOURS = {"slate-400": "94a3b8", "slate-500": "64748b", "slate-600": "475569"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", help="also check a live URL for the landmarks/skip link")
    args = ap.parse_args()

    fails = []

    # --- 1. no banned text tokens in source ---------------------------------
    hits = {}
    for path in SRC.rglob("*"):
        if path.suffix not in {".tsx", ".ts", ".jsx", ".js", ".css"}:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for tok in BANNED_TEXT_TOKENS:
            n = text.count(tok)
            if n:
                hits.setdefault(tok, []).append((path.relative_to(SRC), n))
    for tok, where in sorted(hits.items()):
        files = ", ".join(f"{p} x{n}" for p, n in where[:4])
        fails.append(f"{tok} used {sum(n for _, n in where)}x in text ({files}) - "
                     f"fails 4.5:1 on every background in use")

    # --- 2. the replacement actually passes ---------------------------------
    for name, hexv in TEXT_COLOURS.items():
        if name != "slate-400":
            continue
        worst = min(ratio(hexrgb(hexv), hexrgb(b)) for b in REAL_BACKGROUNDS)
        print(f"  {name} #{hexv}: worst {worst:.2f}:1 across {len(REAL_BACKGROUNDS)} backgrounds")
        if worst < 4.5:
            fails.append(f"{name} no longer clears 4.5:1 (worst {worst:.2f})")

    # --- 3. the a11y chrome is still wired ----------------------------------
    css = (SRC / "app/globals.css").read_text(encoding="utf-8")
    layout = (SRC / "app/layout.tsx").read_text(encoding="utf-8")

    if ".skip-link" not in css:
        fails.append("globals.css lost the .skip-link rule")
    if "href=\"#main\"" not in layout:
        fails.append("layout.tsx lost the skip link")
    if 'id="main"' not in layout:
        fails.append('layout.tsx <main> lost id="main" - the skip link would go nowhere')

    # The skip link must out-stack the nav. The nav is `sticky z-50` (in Nav.tsx, not
    # layout.tsx) and comes later in the DOM, so at equal z-index it paints on top and
    # hides the focused link completely. This shipped broken once - verified live via
    # elementFromPoint, which returned the logo instead of the link.
    nav_tsx = next((p for p in (SRC / "components").glob("Nav.*")), None)
    nav_src = nav_tsx.read_text(encoding="utf-8") if nav_tsx else ""
    nav_z = re.search(r"\bz-\[?(\d+)\]?", nav_src)
    nav_sticky = "sticky" in nav_src
    if nav_sticky or nav_z:
        nav_level = int(nav_z.group(1)) if nav_z else 0
        m = re.search(r"\.skip-link:focus\s*\{[^}]*z-index:\s*(\d+)", css)
        if not m:
            fails.append(".skip-link:focus has no z-index - the sticky nav will cover it")
        elif nav_level and int(m.group(1)) <= nav_level:
            fails.append(
                f".skip-link:focus z-index is {m.group(1)}, must exceed the nav's z-{nav_level} "
                f"(nav is sticky and later in the DOM) or it paints over the focused link"
            )

    if "prefers-reduced-motion" not in css:
        fails.append("globals.css lost the prefers-reduced-motion guard for .animate-pulse")
    if ":focus-visible" not in css:
        fails.append("globals.css lost the :focus-visible ring")

    # --- 4. tap targets: zero-specificity selector still used --------------
    if "pointer: coarse" in css:
        if ":where(" not in css:
            fails.append("the coarse-pointer tap-target rule must be wrapped in :where() "
                         "or it will outrank utilities")
        # It must cover nav BUTTONS as well as links. The Study dropdown is a <button>,
        # not an <a>. A `nav a`-only rule silently misses it - measured live at 20px tall.
        if "nav button" not in css:
            fails.append("the tap-target rule must cover nav button as well as nav a "
                         "(the Study dropdown is a button, and was left at 20px)")
    else:
        fails.append("globals.css lost the coarse-pointer tap-target rule")

    # --- 4b. standalone controls must carry their own padding ---------------
    # WCAG 2.2 SC 2.5.8 (Target Size Minimum, AA) = 24x24, and the inline-text
    # exception does NOT cover buttons with no padding, icon-only buttons, or
    # toggle switches. All of these measured under 24px live before the fix.
    #
    # Anchor on the className itself rather than on the button's text: "Skip" also
    # matches "Skip to content", so a text-anchored pattern silently passes the
    # broken case (it failed its own test once).
    STANDALONE_CLASSES = [
        # (file, exact class string, human label)
        ("QuizEngine.tsx",
         "text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
         "the Skip button"),
        ("HydraulicTool.tsx",
         "flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors",
         "the Common Examples toggle"),
        ("WeightBalanceTool.tsx",
         "no-print text-slate-400 hover:text-red-400 transition-colors text-lg flex items-center justify-center",
         "the row delete button"),
    ]
    for fname, base_classes, label in STANDALONE_CLASSES:
        path = next((p for p in SRC.rglob(fname)), None)
        if not path:
            continue
        src = path.read_text(encoding="utf-8")
        # Find the className that STARTS with these classes and check it carries padding.
        for m in re.finditer(r'className=\{?[`"\']' + re.escape(base_classes) + r'([^`"\']*)', src):
            if not re.search(r"\b(p-|py-)", m.group(1)):
                fails.append(f"{fname} {label} lost its vertical padding - it renders under "
                             f"24px tall (WCAG 2.2 SC 2.5.8)")

    # Class fragments that must always be followed by vertical padding. These don't
    # share a common prefix (mt-3 vs mb-4 vs nothing), so anchor on the middle instead.
    MUST_PAD = [
        ("text-xs text-slate-400 hover:text-[#38bdf8] transition-colors flex items-center gap-1.5",
         "the 'Copy result' button"),
        ("inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white",
         "the 'Back to ...' link"),
    ]
    for fragment, label in MUST_PAD:
        for path in SRC.rglob("*.tsx"):
            src = path.read_text(encoding="utf-8")
            for m in re.finditer(re.escape(fragment) + r'([^`"\']*)', src):
                if not re.search(r"\b(p-|py-)", m.group(1)):
                    fails.append(f"{path.name}: {label} lost its vertical padding - it renders "
                                 f"under 24px tall (WCAG 2.2 SC 2.5.8)")

    # toggle switches: h-5 is 20px, under the 24px floor
    for path in SRC.rglob("*.tsx"):
        s = path.read_text(encoding="utf-8")
        if "h-5 w-10 items-center rounded-full" in s:
            fails.append(f"{path.name}: toggle switch is h-5 (20px tall), below the 24px "
                         f"floor of WCAG 2.2 SC 2.5.8 - use h-6 w-11")

    # --- 5. optional live check --------------------------------------------
    if args.url:
        try:
            req = urllib.request.Request(args.url, headers={"User-Agent": "Mozilla/5.0"})
            html = urllib.request.urlopen(req, timeout=20).read().decode("utf-8", "replace")
            missing = []
            if 'id="main"' not in html:
                missing.append("no main#main")
            if "skip-link" not in html:
                missing.append("no skip link")
            if missing:
                fails.append(f"{args.url}: {', '.join(missing)} in the served HTML")
            else:
                print(f"  live {args.url}: main#main + skip link present")
        except Exception as e:  # noqa: BLE001 - report, don't crash the gate
            fails.append(f"could not fetch {args.url}: {e}")

    if fails:
        print("\nFAIL:")
        for f in fails:
            print(f"  - {f}")
        return 1
    print("\nAll AMT Toolbox a11y + contrast invariants hold.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
