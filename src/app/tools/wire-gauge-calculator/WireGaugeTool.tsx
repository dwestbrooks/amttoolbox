'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

const AWG_TABLE = [
  { awg: 4,  cm: 41740, singleA: 95, bundledA: 70,  ohm: 0.253 },
  { awg: 6,  cm: 26250, singleA: 75, bundledA: 55,  ohm: 0.403 },
  { awg: 8,  cm: 16510, singleA: 55, bundledA: 40,  ohm: 0.641 },
  { awg: 10, cm: 10380, singleA: 40, bundledA: 30,  ohm: 1.018 },
  { awg: 12, cm:  6530, singleA: 30, bundledA: 20,  ohm: 1.619 },
  { awg: 14, cm:  4107, singleA: 20, bundledA: 15,  ohm: 2.575 },
  { awg: 16, cm:  2583, singleA: 13, bundledA: 10,  ohm: 4.094 },
  { awg: 18, cm:  1624, singleA: 10, bundledA:  7,  ohm: 6.510 },
  { awg: 20, cm:  1022, singleA:7.5, bundledA:  5,  ohm: 10.35 },
  { awg: 22, cm:   642, singleA:  5, bundledA:  3,  ohm: 16.46 },
  { awg: 24, cm:   404, singleA:  3, bundledA:  2,  ohm: 26.17 },
  { awg: 26, cm:   254, singleA:  2, bundledA:1.5,  ohm: 41.62 },
  { awg: 28, cm:   160, singleA:  1, bundledA:0.7,  ohm: 66.17 },
]

const K = 10.75

interface CircuitPreset {
  label: string
  voltage: string
  current: string
  length: string
  drop: string
  installation: 'single' | 'bundled'
}

const CIRCUIT_PRESETS: CircuitPreset[] = [
  { label: 'Nav Light',      voltage: '28', current: '2',   length: '20', drop: '5', installation: 'single' },
  { label: 'Landing Light',  voltage: '28', current: '10',  length: '15', drop: '5', installation: 'single' },
  { label: 'Avionics Bus',   voltage: '28', current: '5',   length: '8',  drop: '2', installation: 'bundled' },
  { label: 'Starter Circuit',voltage: '28', current: '200', length: '4',  drop: '2', installation: 'single' },
]

export default function WireGaugeTool() {
  const [voltage, setVoltage] = useState('28')
  const [current, setCurrent] = useState('')
  const [length, setLength] = useState('')
  const [dropPct, setDropPct] = useState('2')
  const [installation, setInstallation] = useState<'single' | 'bundled'>('single')

  const V = parseFloat(voltage)
  const I = parseFloat(current)
  const L = parseFloat(length)
  const pct = parseFloat(dropPct)

  const hasInputs = !isNaN(V) && V > 0 && !isNaN(I) && I > 0 && !isNaN(L) && L > 0 && !isNaN(pct) && pct > 0

  function applyPreset(p: CircuitPreset) {
    setVoltage(p.voltage)
    setCurrent(p.current)
    setLength(p.length)
    setDropPct(p.drop)
    setInstallation(p.installation)
  }

  let calcResult: {
    minCM: number
    vdropAWG: { awg: number; cm: number; actualDrop: number; dropPct: number } | null
    ampacityAWG: { awg: number } | null
    recommended: { awg: number } | null
    ampacityWarning: boolean
  } | null = null

  if (hasInputs) {
    const minCM = (K * L * 2 * I) / (V * (pct / 100))
    const vdropEntry = AWG_TABLE.find(row => row.cm >= minCM) ?? null

    let vdropResult = null
    if (vdropEntry) {
      const R = (K * L * 2) / vdropEntry.cm
      const actualDrop = I * R
      const actualDropPct = (actualDrop / V) * 100
      vdropResult = { awg: vdropEntry.awg, cm: vdropEntry.cm, actualDrop, dropPct: actualDropPct }
    }

    const ampEntry = AWG_TABLE.find(row => {
      const cap = installation === 'single' ? row.singleA : row.bundledA
      return cap >= I
    }) ?? null

    let recommended: { awg: number } | null = null
    if (vdropResult && ampEntry) {
      recommended = { awg: Math.min(vdropResult.awg, ampEntry.awg) }
    } else if (vdropResult) {
      recommended = { awg: vdropResult.awg }
    } else if (ampEntry) {
      recommended = { awg: ampEntry.awg }
    }

    const ampacityWarning = vdropResult !== null && ampEntry !== null && ampEntry.awg < vdropResult.awg

    calcResult = { minCM, vdropAWG: vdropResult, ampacityAWG: ampEntry, recommended, ampacityWarning }
  }

  // Actual voltage drop in volts from recommended AWG
  const actualVoltsDrop: number | null = (() => {
    if (!calcResult?.recommended || !hasInputs) return null
    const row = AWG_TABLE.find(r => r.awg === calcResult!.recommended!.awg)
    if (!row) return null
    const R = (K * L * 2) / row.cm
    return I * R
  })()

  return (
    <ToolLayout
      title="Aircraft Wire Gauge Calculator"
      description="Calculate minimum recommended AWG wire size for aircraft electrical circuits based on current, voltage, wire length, and allowable voltage drop."
      relatedTools={[
        { name: 'Torque Unit Converter', href: '/tools/torque-unit-converter', description: 'Convert between torque units.' },
        { name: 'Decimal / Fraction Converter', href: '/tools/decimal-fraction-converter', description: 'Convert fractional to decimal inches.' },
      ]}
    >
      {/* Inputs */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Inputs</h2>

        {/* Quick Presets */}
        <div className="mb-5">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Quick Presets</p>
          <div className="flex gap-2 flex-wrap">
            {CIRCUIT_PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-[#0f172a] text-slate-400 border border-slate-600 hover:border-[#38bdf8] hover:text-[#38bdf8]"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Circuit Voltage (V)</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {['12', '14', '24', '28', '115'].map(v => (
                <button
                  key={v}
                  onClick={() => setVoltage(v)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${voltage === v ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#0f172a] text-slate-400 border border-slate-600 hover:border-slate-400'}`}
                >
                  {v}V
                </button>
              ))}
            </div>
            <input
              type="number"
              step="any"
              placeholder="e.g. 28"
              value={voltage}
              onChange={e => setVoltage(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Current Draw (A)</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 10"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">One-Way Wire Length (ft)</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 20"
              value={length}
              onChange={e => setLength(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">Calculator doubles for round trip</p>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Allowable Voltage Drop (%)</label>
            <div className="flex gap-2 mb-2">
              <button onClick={() => setDropPct('2')} className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${dropPct === '2' ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#0f172a] text-slate-400 border border-slate-600 hover:border-slate-400'}`}>2% Critical</button>
              <button onClick={() => setDropPct('5')} className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${dropPct === '5' ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#0f172a] text-slate-400 border border-slate-600 hover:border-slate-400'}`}>5% Non-critical</button>
            </div>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 2"
              value={dropPct}
              onChange={e => setDropPct(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-slate-400 mb-2">Wire Installation</label>
            <div className="flex gap-3">
              {(['single', 'bundled'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setInstallation(opt)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${installation === opt ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#0f172a] text-slate-300 border border-slate-600 hover:border-slate-400'}`}
                >
                  {opt === 'single' ? 'Single Wire in Free Air' : 'Bundled (Derate Ampacity)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {calcResult ? (
        <div className="space-y-4 mb-6">
          {/* Recommended — prominent at top */}
          <div className="bg-[#1e293b] border border-[#38bdf8]/40 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-1">Recommended Wire Gauge</p>
            <p className="text-5xl font-bold text-[#38bdf8] mb-1">
              AWG {calcResult.recommended?.awg ?? '--'}
            </p>
            {actualVoltsDrop !== null && hasInputs && (
              <p className="text-base text-slate-300 mt-2">
                <span className="font-semibold text-white">{actualVoltsDrop.toFixed(3)}V</span>
                <span className="text-slate-400 ml-1">drop ({((actualVoltsDrop / V) * 100).toFixed(2)}%)</span>
              </p>
            )}
            {calcResult.ampacityWarning && (
              <div className="mt-2 bg-amber-900/30 border border-amber-700/40 rounded-lg px-4 py-2.5 text-amber-300 text-sm">
                ⚠️ Ampacity requirement is larger than voltage drop requirement — using ampacity-driven size.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Voltage Drop Result */}
            <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Voltage Drop Method</p>
              <p className="text-lg font-bold text-white">Min CM: {calcResult.minCM.toFixed(0)}</p>
              {calcResult.vdropAWG ? (
                <>
                  <p className="text-sm text-slate-300 mt-1">→ AWG {calcResult.vdropAWG.awg}</p>
                  <p className="text-xs text-slate-500">
                    Actual drop: <span className="text-slate-300 font-semibold">{calcResult.vdropAWG.actualDrop.toFixed(3)}V</span>{' '}
                    ({calcResult.vdropAWG.dropPct.toFixed(2)}%)
                  </p>
                </>
              ) : (
                <p className="text-sm text-red-400 mt-1">Exceeds AWG 4 capacity — use larger wire</p>
              )}
            </div>

            {/* Ampacity Result */}
            <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Ampacity Check ({installation})</p>
              {calcResult.ampacityAWG ? (
                <>
                  <p className="text-lg font-bold text-white">AWG {calcResult.ampacityAWG.awg}</p>
                  <p className="text-xs text-slate-500">Rated for {I}A {installation === 'single' ? 'free air' : 'bundled'}</p>
                </>
              ) : (
                <p className="text-sm text-red-400 mt-1">Current exceeds AWG 4 ampacity — consult engineer</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-12 text-center text-slate-500 mb-6">
          Enter circuit parameters to calculate recommended wire gauge.
        </div>
      )}

      {/* AWG Reference Table */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">AWG Ampacity Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium py-2 pr-3">AWG</th>
                <th className="text-left text-slate-400 font-medium py-2 pr-3">Single (A)</th>
                <th className="text-left text-slate-400 font-medium py-2 pr-3">Bundled (A)</th>
                <th className="text-left text-slate-400 font-medium py-2">Ω/1000ft</th>
              </tr>
            </thead>
            <tbody>
              {AWG_TABLE.map(row => {
                const isHighlighted = calcResult?.recommended?.awg === row.awg
                return (
                  <tr
                    key={row.awg}
                    className={`border-b border-slate-800 ${isHighlighted ? 'bg-[#38bdf8]/10' : ''}`}
                  >
                    <td className={`py-2 pr-3 font-mono font-semibold ${isHighlighted ? 'text-[#38bdf8]' : 'text-white'}`}>{row.awg}</td>
                    <td className="py-2 pr-3 text-slate-300">{row.singleA}</td>
                    <td className="py-2 pr-3 text-slate-300">{row.bundledA}</td>
                    <td className="py-2 text-slate-400">{row.ohm}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Ampacity values based on MIL-W-22759/16 in accordance with FAA AC 43.13-1B. Bundled values assume 9+ wire bundle with no airflow. Always verify against applicable aircraft wiring diagrams and maintenance manual.
        </p>
      </div>
    </ToolLayout>
  )
}
