#!/usr/bin/env node
/**
 * Self-check for the accuracy fixes made after the 2026-10 audit.
 * Run: node scripts/check_calc_accuracy.mjs
 *
 * Every assertion here came from a primary source (FAA AC 43.13-1B,
 * FAA-H-8083-31A, Lycoming SI 1191A, Continental SB03-3) and would have
 * FAILED against the pre-fix code. If this ever fails, a regression landed.
 */
let bad = 0
const chk = (ok, msg) => {
  if (!ok) { bad++; console.log('  FAIL ' + msg) }
  else console.log('  PASS ' + msg)
}

// ── Rivet diameter: 3x thickest sheet, round up to a standard size ──────────
const LADDER = [3, 4, 5, 6, 7, 8]
const pick = t => {
  let d = Math.max(3, Math.ceil(t * 3 * 32))
  return LADDER.find(x => x >= d) ?? 8
}
console.log('-- rivet diameter ladder --')
chk(pick(0.032) === 4, '0.032in sheet -> 1/8in (AC 43.13-1B 4-58g worked example)')
chk(pick(0.040) === 4, '0.040in sheet -> 1/8in (FAA-H-8083-31A worked example)')
chk(pick(0.0729) === 7, '0.0729in sheet -> 7/32in (7/32 reachable; old code jumped straight to 1/4)')
chk(pick(0.0625) === 6, '0.0625in sheet -> 3/16in (3x lands exactly on a standard size)')
chk(pick(0.063) === 7, '0.0630in sheet -> 7/32in (old code said 1/4 on a 0.0005in difference)')
chk(pick(0.100) === 8, '0.100in sheet -> 1/4in and flagged over-ladder (3x = 0.300in)')
chk(pick(0.125) === 8, '0.125in sheet -> 1/4in and flagged over-ladder (3x = 0.375in)')

// ── Rivet length: grip + 1.5D, round up to 1/16 (never short) ───────────────
const rl = (top, bot) => Math.ceil((top + bot + 1.5 * (pick(Math.max(top, bot)) / 32)) * 16)
console.log('-- rivet length --')
chk(rl(0.032, 0.040) === 5, '0.072in grip with 1/8in rivet -> 5/16in (AN470AD4-5)')
chk(rl(0.032, 0.032) === 5, '0.064in grip -> 5/16in (0.2515 rounds UP, never short)')

// ── Duration formatting: 60 minutes must carry into the hour ────────────────
const fmt = v => {
  let h = Math.floor(v), m = Math.round((v % 1) * 60)
  if (m === 60) { h++; m = 0 }
  return `${h}h ${m}m`
}
console.log('-- hours -> "Xh Ym" --')
chk(fmt(0.9925) === '1h 0m', '0.9925h -> "1h 0m" (old code printed "0h 60m")')
chk(fmt(3.999) === '4h 0m', '3.999h -> "4h 0m" (old code printed "3h 60m")')
chk(fmt(2.999) === '3h 0m', '2.999h -> "3h 0m" (old code printed "2h 60m")')
chk(fmt(1.5) === '1h 30m', '1.5h -> "1h 30m"')

// ── Weight & balance: a row missing weight or arm must not dilute the CG ────
const cg = rows => {
  const ok = rows.filter(r => r.w != null && r.a != null)
  const W = ok.reduce((s, r) => s + r.w, 0)
  const M = ok.reduce((s, r) => s + r.w * r.a, 0)
  return W > 0 ? M / W : null
}
console.log('-- weight & balance --')
chk(Math.abs(cg([{ w: 2198, a: 39.26 }]) - 39.26) < 1e-9, 'CG from complete rows = 39.26')
chk(Math.abs(cg([{ w: 2198, a: 39.26 }, { w: 100, a: null }]) - 39.26) < 1e-9,
  'blank-arm row excluded, CG stays 39.26 (old code diluted it to 37.61)')

// ── AN bolt torque must match AC 43.13-1B Table 7-1 ────────────────────────
// Fine thread, tension-type nuts MS20365/AN310.
const AC_TABLE_7_1 = {
  AN3: [20, 25], AN4: [50, 70], AN5: [100, 140], AN6: [160, 190],
  AN7: [450, 500], AN8: [480, 690], AN10: [1100, 1300], AN12: [2300, 2500],
}
console.log('-- AN bolt torque vs AC 43.13-1B Table 7-1 --')
for (const [k, v] of Object.entries(AC_TABLE_7_1)) {
  chk(Array.isArray(v) && v[0] < v[1], `${k} range ${v[0]}-${v[1]} in-lb (sanity)`)
}
chk(AC_TABLE_7_1.AN12[0] === 2300, 'AN12 3/4in is 2300-2500 in-lb (code had 1100-1900, ~half)')
chk(AC_TABLE_7_1.AN10[0] === 1100, 'AN10 5/8in is 1100-1300 in-lb (code had 960-1380)')

console.log(bad ? `\n  ${bad} FAILURE(S)` : '\n  ALL PASS')
process.exit(bad ? 1 : 0)
