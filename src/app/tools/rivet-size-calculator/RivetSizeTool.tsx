'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

// ── Helpers ──────────────────────────────────────────────────────────────────

function toFraction(decimal: number): string {
  const nearest32nd = Math.round(decimal * 32)
  if (nearest32nd === 0) return '0"'
  let num = nearest32nd
  let den = 32
  while (num % 2 === 0 && den % 2 === 0) {
    num /= 2
    den /= 2
  }
  const whole = Math.floor(num / den)
  const remainder = num % den
  if (remainder === 0) return `${whole}"`
  if (whole === 0) return `${remainder}/${den}"`
  return `${whole} ${remainder}/${den}"`
}

function fmt4(n: number): string {
  return n.toFixed(4).replace(/\.?0+$/, '')
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TOOLING: Record<number, { drill: string; drillDecimal: number; cleco: string; clecoColor: string }> = {
  3: { drill: '#40', drillDecimal: 0.098,  cleco: 'Silver',     clecoColor: 'silver' },
  4: { drill: '#30', drillDecimal: 0.1285, cleco: 'Copper',     clecoColor: 'copper' },
  5: { drill: '#21', drillDecimal: 0.159,  cleco: 'Black',      clecoColor: 'black'  },
  6: { drill: '#11', drillDecimal: 0.191,  cleco: 'Brass/Gold', clecoColor: 'gold'   },
  8: { drill: 'F / 1/4"', drillDecimal: 0.257, cleco: 'Copper (large)', clecoColor: 'copper' },
}

const CS_DEPTH: Record<number, number> = {
  3: 0.036,
  4: 0.042,
  5: 0.055,
  6: 0.070,
  8: 0.095,
}

const relatedTools = [
  {
    name: 'Bend Allowance Calculator',
    href: '/tools/bend-allowance-calculator',
    description: 'Calculate flat blank length for sheet metal bends',
  },
  {
    name: 'Decimal/Fraction Converter',
    href: '/tools/decimal-fraction-converter',
    description: 'Convert between fractional, decimal, and metric',
  },
  {
    name: 'AN Hardware Decoder',
    href: '/tools/an-hardware-decoder',
    description: 'Decode AN part numbers',
  },
]

// ── Cleco dot ─────────────────────────────────────────────────────────────────

function ClecoDot({ color }: { color: string }) {
  const cls: Record<string, string> = {
    silver: 'bg-slate-300',
    copper: 'bg-amber-600',
    black:  'bg-slate-900 border border-slate-600',
    gold:   'bg-yellow-400',
  }
  return (
    <span
      className={`inline-block w-4 h-4 rounded-full flex-shrink-0 ${cls[color] ?? 'bg-slate-500'}`}
    />
  )
}

// ── Spacing value box ─────────────────────────────────────────────────────────

function ValBox({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div className="bg-[#0f172a] rounded-md p-2 text-center">
      <p className="text-[10px] text-slate-500 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-[#38bdf8]' : 'text-white'}`}>
        {toFraction(value)}
      </p>
      <p className={`text-[10px] ${highlight ? 'text-[#38bdf8]/70' : 'text-slate-500'}`}>
        {fmt4(value)}&quot;
      </p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function RivetSizeTool() {
  const [topSheet, setTopSheet]       = useState('')
  const [botSheet, setBotSheet]       = useState('')
  const [repairLen, setRepairLen]     = useState('')
  const [headStyle, setHeadStyle]     = useState<'470' | '426'>('470')
  const [alloy, setAlloy]             = useState('AD')
  const [material, setMaterial]       = useState('2024-T3 Al')

  // ── Parse ──────────────────────────────────────────────────────────────────

  const topT  = parseFloat(topSheet)
  const botT  = parseFloat(botSheet)
  const repL  = parseFloat(repairLen)

  const hasInputs = !isNaN(topT) && topT > 0 && !isNaN(botT) && botT > 0

  // ── Calculations ───────────────────────────────────────────────────────────

  let calc: {
    diaIn32nds: number
    actualDiameter: number
    lengthIn16ths: number
    partNumber: string
    totalThickness: number
    edgeMin: number
    edgeRec: number
    edgeMax: number
    pitchMin: number
    pitchRec: number
    pitchMax: number
    transversePitch: number
    estimatedRivets: number
    tooling: typeof TOOLING[number]
    warnings: string[]
    shopW: number
    shopH: number
  } | null = null

  if (hasInputs) {
    const thickestSheet = Math.max(topT, botT)
    const totalThickness = topT + botT

    let diaIn32nds = Math.ceil(thickestSheet * 3 * 32)
    if      (diaIn32nds <= 3) diaIn32nds = 3
    else if (diaIn32nds === 4) diaIn32nds = 4
    else if (diaIn32nds === 5) diaIn32nds = 5
    else if (diaIn32nds === 6) diaIn32nds = 6
    else                       diaIn32nds = 8

    const actualDiameter = diaIn32nds / 32

    const shopHeadAllowance = 1.5 * actualDiameter
    const exactLength       = totalThickness + shopHeadAllowance
    const lengthIn16ths     = Math.ceil(exactLength * 16)

    const partNumber = `AN${headStyle}${alloy}${diaIn32nds}-${lengthIn16ths}`

    const edgeMin = (headStyle === '426' ? 2.5 : 2.0) * actualDiameter
    const edgeRec = (headStyle === '426' ? 3.0 : 2.5) * actualDiameter
    const edgeMax = 4.0 * actualDiameter

    const pitchMin = 3.0  * actualDiameter
    const pitchRec = 4.5  * actualDiameter
    const pitchMax = 10.0 * actualDiameter

    const transversePitch = 0.75 * pitchRec

    const estimatedRivets =
      !isNaN(repL) && repL > 0 ? Math.floor(repL / pitchRec) + 1 : 0

    const tooling = TOOLING[diaIn32nds]

    const warnings: string[] = []
    if (headStyle === '426') {
      const csDepth = CS_DEPTH[diaIn32nds]
      if (topT < csDepth) {
        warnings.push(
          `Top sheet too thin to machine countersink (need ≥ ${fmt4(csDepth)}") — dimpling required`
        )
      }
    }
    if (totalThickness > 3 * actualDiameter) {
      warnings.push(
        'High grip-to-diameter ratio — verify bearing and shear strength per applicable data'
      )
    }

    const shopW = 1.5 * actualDiameter
    const shopH = 0.5 * actualDiameter

    calc = {
      diaIn32nds,
      actualDiameter,
      lengthIn16ths,
      partNumber,
      totalThickness,
      edgeMin,
      edgeRec,
      edgeMax,
      pitchMin,
      pitchRec,
      pitchMax,
      transversePitch,
      estimatedRivets,
      tooling,
      warnings,
      shopW,
      shopH,
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <ToolLayout
      title="Rivet Size Calculator"
      description="Calculate recommended AN rivet diameter, part number, spacing, grip length, and tooling for aircraft sheet metal repairs."
      relatedTools={relatedTools}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column: inputs ── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Material parameters card */}
          <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-5">
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Material Parameters
            </h2>

            {/* Top sheet */}
            <div className="mb-3">
              <label className="block text-sm text-slate-400 mb-1">
                Top Sheet Thickness (in)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                placeholder="e.g. 0.040"
                value={topSheet}
                onChange={e => setTopSheet(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors text-sm"
              />
            </div>

            {/* Bottom sheet */}
            <div className="mb-3">
              <label className="block text-sm text-slate-400 mb-1">
                Bottom Sheet Thickness (in)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                placeholder="e.g. 0.040"
                value={botSheet}
                onChange={e => setBotSheet(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors text-sm"
              />
            </div>

            {/* Repair length */}
            <div className="mb-3">
              <label className="block text-sm text-slate-400 mb-1">
                Repair / Crack Length (in) <span className="text-slate-600">— optional</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 3.0"
                value={repairLen}
                onChange={e => setRepairLen(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors text-sm"
              />
            </div>

            {/* Material selector */}
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-1">Material</label>
              <select
                value={material}
                onChange={e => setMaterial(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#38bdf8] transition-colors text-sm"
              >
                <option>2024-T3 Al</option>
                <option>6061-T6 Al</option>
                <option>4130 Steel</option>
                <option>Titanium</option>
              </select>
            </div>

            {/* Head style (radio) */}
            <div className="mb-4">
              <p className="text-sm text-slate-400 mb-2">Rivet Head Style</p>
              <div className="flex flex-col gap-2">
                {[
                  { val: '470' as const, label: 'AN470 Universal' },
                  { val: '426' as const, label: 'AN426 Countersunk' },
                ].map(({ val, label }) => (
                  <label
                    key={val}
                    className={`flex items-center gap-2.5 cursor-pointer rounded-lg border px-3 py-2 transition-colors text-sm ${
                      headStyle === val
                        ? 'border-[#38bdf8]/60 bg-[#38bdf8]/10 text-[#38bdf8]'
                        : 'border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="headStyle"
                      value={val}
                      checked={headStyle === val}
                      onChange={() => setHeadStyle(val)}
                      className="accent-[#38bdf8]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Alloy */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Rivet Alloy</label>
              <select
                value={alloy}
                onChange={e => setAlloy(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#38bdf8] transition-colors text-sm"
              >
                <option value="A">A — 1100 (Plain/Soft)</option>
                <option value="AD">AD — 2117-T3 (Standard, most common)</option>
                <option value="D">D — 2017 (Icebox)</option>
                <option value="DD">DD — 2024 (Icebox)</option>
              </select>
            </div>
          </div>

          {/* Warnings card (only when present) */}
          {calc && calc.warnings.length > 0 && (
            <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4">
              <h3 className="text-amber-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <span>⚠</span> Warnings
              </h3>
              <ul className="space-y-1.5">
                {calc.warnings.map((w, i) => (
                  <li key={i} className="text-amber-300 text-xs leading-snug">
                    • {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Right 2 columns: outputs ── */}
        <div className="lg:col-span-2 space-y-4">

          {calc ? (
            <>
              {/* Row 1 — Hardware card */}
              <div className="bg-[#1e293b] border border-slate-700 rounded-lg overflow-hidden">
                <div className="bg-[#0f172a] border-b border-slate-700 px-5 py-3">
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
                    Recommended Hardware
                  </h3>
                </div>
                <div className="p-5">
                  <p className="text-4xl font-black text-[#38bdf8] font-mono tracking-tight mb-4">
                    {calc.partNumber}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#0f172a] rounded-lg p-3">
                      <p className="text-[10px] text-slate-500 mb-1">Diameter</p>
                      <p className="text-white font-semibold text-sm">
                        {toFraction(calc.actualDiameter)}
                      </p>
                      <p className="text-slate-400 text-xs">{fmt4(calc.actualDiameter)}&quot;</p>
                    </div>
                    <div className="bg-[#0f172a] rounded-lg p-3">
                      <p className="text-[10px] text-slate-500 mb-1">Total Length</p>
                      <p className="text-white font-semibold text-sm">
                        {toFraction(calc.lengthIn16ths / 16)}
                      </p>
                      <p className="text-slate-400 text-xs">{calc.lengthIn16ths}/16&quot;</p>
                    </div>
                    <div className="bg-[#0f172a] rounded-lg p-3">
                      <p className="text-[10px] text-slate-500 mb-1">Grip Thickness</p>
                      <p className="text-white font-semibold text-sm">
                        {toFraction(calc.totalThickness)}
                      </p>
                      <p className="text-slate-400 text-xs">{fmt4(calc.totalThickness)}&quot;</p>
                    </div>
                    <div className="bg-[#0f172a] rounded-lg p-3">
                      <p className="text-[10px] text-slate-500 mb-1">Rivets / Row</p>
                      <p className="text-white font-semibold text-sm">
                        {calc.estimatedRivets > 0 ? calc.estimatedRivets : '—'}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {calc.estimatedRivets > 0 ? 'estimated' : 'enter length'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2 — Spacing + Tooling side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Spacing Layout card */}
                <div className="bg-[#1e293b] border border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-[#0f172a] border-b border-slate-700 px-5 py-3">
                    <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
                      Spacing Layout
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">

                    {/* Edge Distance */}
                    <div>
                      <p className="text-xs text-slate-400 mb-1.5 font-medium">Edge Distance</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        <ValBox label="Min" value={calc.edgeMin} />
                        <ValBox label="Rec" value={calc.edgeRec} highlight />
                        <ValBox label="Max" value={calc.edgeMax} />
                      </div>
                    </div>

                    {/* Pitch */}
                    <div>
                      <p className="text-xs text-slate-400 mb-1.5 font-medium">Pitch (rivet spacing)</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        <ValBox label="Min" value={calc.pitchMin} />
                        <ValBox label="Rec" value={calc.pitchRec} highlight />
                        <ValBox label="Max" value={calc.pitchMax} />
                      </div>
                    </div>

                    {/* Transverse Pitch */}
                    <div>
                      <p className="text-xs text-slate-400 mb-1.5 font-medium">Transverse Pitch (row spacing)</p>
                      <div className="bg-[#0f172a] rounded-md p-2 text-center">
                        <p className="text-[#38bdf8] font-semibold text-sm">{toFraction(calc.transversePitch)}</p>
                        <p className="text-[#38bdf8]/70 text-[10px]">{fmt4(calc.transversePitch)}&quot;</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tooling card */}
                <div className="bg-[#1e293b] border border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-[#0f172a] border-b border-slate-700 px-5 py-3">
                    <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
                      Tooling
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">

                    {/* Drill bit */}
                    <div>
                      <p className="text-xs text-slate-400 mb-2 font-medium">Drill Bit</p>
                      <div className="flex items-center gap-3">
                        <div className="bg-[#0f172a] rounded-lg px-4 py-2 text-center min-w-[3.5rem]">
                          <p className="text-[#38bdf8] font-black text-xl font-mono">
                            {calc.tooling.drill}
                          </p>
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{fmt4(calc.tooling.drillDecimal)}&quot;</p>
                          <p className="text-slate-500 text-xs">decimal equivalent</p>
                        </div>
                      </div>
                    </div>

                    {/* Cleco */}
                    <div>
                      <p className="text-xs text-slate-400 mb-2 font-medium">Cleco Fastener</p>
                      <div className="flex items-center gap-2.5 bg-[#0f172a] rounded-lg px-3 py-2">
                        <ClecoDot color={calc.tooling.clecoColor} />
                        <span className="text-white text-sm font-semibold">{calc.tooling.cleco}</span>
                      </div>
                    </div>

                    {/* Shop head verification */}
                    <div>
                      <p className="text-xs text-slate-400 mb-2 font-medium">Shop Head Verification</p>
                      <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-xs text-slate-400 leading-relaxed">
                        After bucking verify:<br />
                        <span className="text-white">Width = 1.5D</span>{' '}
                        <span className="text-[#38bdf8]">({fmt4(calc.shopW)}&quot;)</span>
                        <br />
                        <span className="text-white">Height = 0.5D</span>{' '}
                        <span className="text-[#38bdf8]">({fmt4(calc.shopH)}&quot;)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rivet type info card */}
              <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-5 space-y-3">
                <div>
                  <h4 className="text-[#38bdf8] font-semibold text-sm mb-1">
                    AN{headStyle} — {headStyle === '426' ? 'Flush / Countersunk (100°)' : 'Universal Head'}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {headStyle === '426'
                      ? 'Flush/countersunk (100°). Used on aerodynamic surfaces where protrusion would cause drag. Requires countersinking or dimpling. Countersinking weakens thin sheets — use dimpling when top sheet is thinner than the countersink depth.'
                      : 'Universal head. Standard for most structural applications where aerodynamic smoothness is not required. Stronger than flush rivets for given diameter. Most common choice for interior structure.'}
                  </p>
                </div>
                <div className="border-t border-slate-700 pt-3">
                  <p className="text-slate-500 text-xs leading-relaxed">
                    <span className="text-slate-300 font-medium">Alloy note:</span>{' '}
                    AD (2117-T3) is the standard alloy for most repairs. D and DD rivets require
                    refrigeration (icebox rivets) and must be driven within minutes of removal from
                    freezer.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-16 text-center text-slate-500">
              Enter top and bottom sheet thicknesses to calculate rivet specifications.
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
