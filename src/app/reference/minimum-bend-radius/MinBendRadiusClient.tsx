'use client'

import { useState } from 'react'
import Link from 'next/link'

interface BendRow {
  material: string
  temper: string
  /** [min,max] multiplier bands per thickness column — AC 43.13-1B Table 4-6 gives ranges, not single values. */
  ranges: [number, number][]
}

const RANGE_LABELS = ['Up to 0.032"', '0.033–0.064"', '0.065–0.125"', '0.126–0.182"', '0.183–0.258"']
const RANGE_MAX = [0.032, 0.064, 0.125, 0.182, 0.258]

// AC 43.13-1B Table 4-6, "Recommended radii for 90-degree bends in aluminum alloys".
// Columns map to sheet thicknesses 0.016 / 0.032 / 0.064 / 0.128 / 0.182 / 0.258.
// The AC's 0.016 column is merged into the "Up to 0.032\"" band.
const DATA: BendRow[] = [
  { material: '2024 Aluminum', temper: 'O (annealed)', ranges: [[0, 1], [0, 1], [0, 1], [0, 1], [0, 1]] },
  { material: '2024 Aluminum', temper: 'T3',           ranges: [[1.5, 3], [2, 4], [3, 5], [4, 6], [5, 7]] },
  { material: '2024 Aluminum', temper: 'T61',          ranges: [[2, 4], [3, 5], [3, 5], [4, 6], [6, 10]] },
  { material: '5052 Aluminum', temper: 'O (annealed)', ranges: [[0, 0], [0, 0], [0, 1], [0, 1], [0, 1]] },
  { material: '5052 Aluminum', temper: 'H32',          ranges: [[0, 0], [0, 0], [0.5, 1], [0.5, 1.5], [0.5, 1.5]] },
  { material: '5052 Aluminum', temper: 'H34',          ranges: [[0, 0], [0, 0], [0.5, 1.5], [1.5, 2.5], [2, 3]] },
  { material: '5052 Aluminum', temper: 'H36',          ranges: [[0, 1], [0.5, 1.5], [1, 2], [1.5, 3], [2, 4]] },
  { material: '5052 Aluminum', temper: 'H38',          ranges: [[0.5, 1.5], [1, 2], [1.5, 3], [2, 4], [4, 6]] },
  { material: '6061 Aluminum', temper: 'O (annealed)', ranges: [[0, 0], [0, 1], [0, 1], [0, 1], [0, 1]] },
  { material: '6061 Aluminum', temper: 'T4',           ranges: [[0, 1], [0, 1], [0.5, 1.5], [1, 2], [2.5, 4]] },
  { material: '6061 Aluminum', temper: 'T6',           ranges: [[0, 1], [0.5, 1.5], [1, 2], [1.5, 3], [3, 4]] },
  { material: '7075 Aluminum', temper: 'O (annealed)', ranges: [[0, 0], [0, 1], [0, 1], [1, 2], [1.5, 3]] },
  { material: '7075 Aluminum', temper: 'T6',           ranges: [[2, 4], [3, 5], [4, 6], [5, 7], [6, 10]] },
]

const MATERIALS = Array.from(new Set(DATA.map(r => r.material)))

function getRangeIndex(thickness: number): number {
  for (let i = 0; i < RANGE_MAX.length; i++) {
    if (thickness <= RANGE_MAX[i]) return i
  }
  return RANGE_MAX.length - 1
}

export default function MinBendRadiusClient() {
  const [activeMatFilter, setActiveMatFilter] = useState<string | null>(null)
  const [calcThickness, setCalcThickness] = useState('')
  const [calcRowIndex, setCalcRowIndex] = useState(0)

  const filtered = activeMatFilter ? DATA.filter(r => r.material === activeMatFilter) : DATA

  const calcT = parseFloat(calcThickness)
  const calcRow = DATA[calcRowIndex]
  const calcRangeIdx = !isNaN(calcT) && calcT > 0 ? getRangeIndex(calcT) : null
  // Minimum radius = upper bound of the band; range shown for context.
  const calcBand = calcRangeIdx !== null ? calcRow.ranges[calcRangeIdx] : null
  const calcActual = calcBand && !isNaN(calcT) ? calcBand[1] * calcT : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Minimum Bend Radius Reference Table</h1>
        <p className="text-slate-400">Minimum bend radius by material, temper, and thickness per AC 43.13-1B.</p>
      </div>

      {/* Material Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveMatFilter(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!activeMatFilter ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#1e293b] text-slate-300 border border-slate-700 hover:border-slate-500'}`}
        >
          All Materials
        </button>
        {MATERIALS.map(mat => (
          <button
            key={mat}
            onClick={() => setActiveMatFilter(activeMatFilter === mat ? null : mat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeMatFilter === mat ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#1e293b] text-slate-300 border border-slate-700 hover:border-slate-500'}`}
          >
            {mat}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-[#0f172a]">
                <th className="text-left text-slate-400 font-medium py-3 px-4">Material</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">Temper</th>
                {RANGE_LABELS.map(label => (
                  <th key={label} className="text-center text-slate-400 font-medium py-3 px-3 whitespace-nowrap">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{row.material}</td>
                  <td className="py-3 px-4 text-slate-300">{row.temper}</td>
                  {row.ranges.map((band, j) => (
                    <td key={j} className="py-3 px-3 text-center font-mono text-[#38bdf8]">
                      {band[0] === band[1] ? `${band[0].toFixed(1)}T` : `${band[0].toFixed(1)}–${band[1].toFixed(1)}T`}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculate Actual Radius Helper */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Calculate Actual Minimum Radius</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Material Thickness (decimal inches)</label>
            <input
              type="number"
              step="0.001"
              placeholder="e.g. 0.063"
              value={calcThickness}
              onChange={e => setCalcThickness(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Material / Temper</label>
            <select
              value={calcRowIndex}
              onChange={e => setCalcRowIndex(parseInt(e.target.value))}
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#38bdf8] transition-colors"
            >
              {DATA.map((row, i) => (
                <option key={i} value={i}>{row.material} — {row.temper}</option>
              ))}
            </select>
          </div>
        </div>

        {calcActual !== null && !isNaN(calcT) ? (
          <div className="bg-[#0f172a] rounded-lg p-4 border border-[#38bdf8]/30">
            <p className="text-sm text-slate-400 mb-1">
              Minimum Bend Radius for {calcT}&quot; {calcRow.material} ({calcRow.temper})
            </p>
            <p className="text-4xl font-bold text-[#38bdf8]">
              {calcActual.toFixed(4)}&quot;
            </p>
            <p className="text-xs text-slate-400 mt-1">
              = {calcBand![1].toFixed(1)}T × {calcT}&quot; thickness
              &nbsp;(AC band {calcBand![0].toFixed(1)}–{calcBand![1].toFixed(1)}T for {RANGE_LABELS[calcRangeIdx!]})
            </p>
          </div>
        ) : (
          <div className="bg-[#0f172a] rounded-lg p-4 text-center text-slate-400 text-sm">
            Enter a thickness value to calculate the actual minimum radius.
          </div>
        )}
      </div>

      {/* Source Note */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 mb-6 text-sm text-slate-400">
        Reference: FAA Advisory Circular 43.13-1B, Chapter 4 — Acceptable Methods, Techniques, and Practices — Aircraft Inspection and Repair. Values are minimums; always consult the applicable aircraft structural repair manual.
      </div>

      {/* Related Tools */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Related Tools</h3>
        <Link
          href="/tools/bend-allowance-calculator"
          className="block p-3 rounded-md border border-slate-700 hover:border-[#38bdf8]/50 hover:bg-slate-800 transition-all group"
        >
          <p className="text-sm font-medium text-white group-hover:text-[#38bdf8] transition-colors">Bend Allowance Calculator</p>
          <p className="text-xs text-slate-400 mt-1">Calculate bend allowance and flat blank lengths for sheet metal work.</p>
        </Link>
      </div>
    </div>
  )
}
