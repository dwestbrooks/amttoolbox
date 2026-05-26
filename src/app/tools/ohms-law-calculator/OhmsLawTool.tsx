'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'
import { AlertTriangle } from 'lucide-react'

type SolveFor = 'voltage' | 'current' | 'resistance' | 'power'

const AIRCRAFT_CIRCUITS = [
  { system: 'Standard GA bus (single-engine)', voltage: '14V DC', typical: 'Alternator + 12V battery' },
  { system: 'Standard GA bus (twin / turboprop)', voltage: '28V DC', typical: 'Alternator + 24V battery' },
  { system: 'Large transport AC bus', voltage: '115V AC 400 Hz', typical: '3-phase, IDG-driven' },
  { system: 'Emergency DC bus (transport)', voltage: '28V DC', typical: 'Battery/APU backup' },
  { system: 'Avionics bus (GA)', voltage: '14 or 28V DC', typical: 'Protected via avionics master' },
]

export default function OhmsLawTool() {
  const [solveFor, setSolveFor] = useState<SolveFor>('voltage')
  const [inputV, setInputV] = useState('')
  const [inputI, setInputI] = useState('')
  const [inputR, setInputR] = useState('')
  const [inputP, setInputP] = useState('')

  function parseNum(s: string): number { return parseFloat(s) }
  function valid(n: number) { return !isNaN(n) && isFinite(n) }

  interface Derived { V: number | null; I: number | null; R: number | null; P: number | null }

  function calculate(): Derived {
    const V = parseNum(inputV)
    const I = parseNum(inputI)
    const R = parseNum(inputR)
    const P = parseNum(inputP)

    const res: Derived = { V: null, I: null, R: null, P: null }

    if (solveFor === 'voltage') {
      if (valid(I) && valid(R)) { res.V = I * R; res.I = I; res.R = R; res.P = res.V * I }
      else if (valid(P) && valid(I) && I !== 0) { res.V = P / I; res.I = I; res.P = P; res.R = res.V / I }
      else if (valid(P) && valid(R) && R !== 0) { res.V = Math.sqrt(P * R); res.R = R; res.P = P; res.I = res.V / R }
    } else if (solveFor === 'current') {
      if (valid(V) && valid(R) && R !== 0) { res.I = V / R; res.V = V; res.R = R; res.P = V * res.I }
      else if (valid(P) && valid(V) && V !== 0) { res.I = P / V; res.V = V; res.P = P; res.R = V / res.I }
      else if (valid(P) && valid(R) && R !== 0) { res.I = Math.sqrt(P / R); res.R = R; res.P = P; res.V = res.I * R }
    } else if (solveFor === 'resistance') {
      if (valid(V) && valid(I) && I !== 0) { res.R = V / I; res.V = V; res.I = I; res.P = V * I }
      else if (valid(P) && valid(I) && I !== 0) { res.R = P / (I * I); res.I = I; res.P = P; res.V = res.R * I }
      else if (valid(P) && valid(V) && P !== 0) { res.R = V * V / P; res.V = V; res.P = P; res.I = V / res.R }
    } else {
      // power
      if (valid(V) && valid(I)) { res.P = V * I; res.V = V; res.I = I; res.R = V / I }
      else if (valid(V) && valid(R) && R !== 0) { res.P = V * V / R; res.V = V; res.R = R; res.I = V / R }
      else if (valid(I) && valid(R)) { res.P = I * I * R; res.I = I; res.R = R; res.V = I * R }
    }

    return res
  }

  const derived = calculate()

  function fmt(n: number | null, decimals = 4): string {
    if (n === null || !valid(n)) return '--'
    if (Math.abs(n) >= 1000) return n.toFixed(1)
    if (Math.abs(n) >= 10) return n.toFixed(2)
    return n.toFixed(decimals)
  }

  const inputsNeeded: Record<SolveFor, string> = {
    voltage: 'Enter any two of: I and R, P and I, or P and R',
    current: 'Enter any two of: V and R, P and V, or P and R',
    resistance: 'Enter any two of: V and I, P and I, or P and V',
    power: 'Enter any two of: V and I, V and R, or I and R',
  }

  const anyResult = derived.V !== null || derived.I !== null || derived.R !== null || derived.P !== null

  return (
    <ToolLayout
      title="Ohm's Law / Circuit Calculator"
      description="Calculate voltage, current, resistance, or power for aircraft electrical circuits. Includes power wheel reference and wire heating guidance."
      relatedTools={[
        { name: 'Aircraft Wire Gauge Calculator', href: '/tools/wire-gauge-calculator', description: 'Find minimum AWG for a circuit based on current and length.' },
      ]}
    >
      {/* Solve For */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-2">Solve For</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['voltage', 'current', 'resistance', 'power'] as SolveFor[]).map(s => (
              <button
                key={s}
                onClick={() => { setSolveFor(s); setInputV(''); setInputI(''); setInputR(''); setInputP('') }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  solveFor === s ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#0f172a] text-slate-300 border border-slate-600 hover:border-slate-400'
                }`}
              >
                {s === 'voltage' ? 'Voltage (V)' : s === 'current' ? 'Current (I)' : s === 'resistance' ? 'Resistance (R)' : 'Power (P)'}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">{inputsNeeded[solveFor]}</p>
        </div>

        {/* Inputs grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'V', label: 'Voltage (V)', unit: 'V', val: inputV, set: setInputV },
            { key: 'I', label: 'Current (I)', unit: 'A', val: inputI, set: setInputI },
            { key: 'R', label: 'Resistance (R)', unit: 'Ω', val: inputR, set: setInputR },
            { key: 'P', label: 'Power (P)', unit: 'W', val: inputP, set: setInputP },
          ].map(field => {
            const isSolving = (
              (solveFor === 'voltage' && field.key === 'V') ||
              (solveFor === 'current' && field.key === 'I') ||
              (solveFor === 'resistance' && field.key === 'R') ||
              (solveFor === 'power' && field.key === 'P')
            )
            return (
              <div key={field.key}>
                <label className={`block text-sm mb-1 ${isSolving ? 'text-[#38bdf8] font-semibold' : 'text-slate-400'}`}>
                  {field.label} {isSolving && '← solving'}
                </label>
                <input
                  type="number" step="any"
                  placeholder={isSolving ? 'calculated' : 'Enter value'}
                  disabled={isSolving}
                  value={field.val}
                  onChange={e => field.set(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors ${
                    isSolving
                      ? 'bg-[#38bdf8]/5 border-[#38bdf8]/20 text-[#38bdf8] cursor-not-allowed'
                      : 'bg-[#0f172a] border-slate-600'
                  }`}
                />
              </div>
            )
          })}
        </div>

        {/* Results */}
        <div className="mt-6 bg-[#0f172a] rounded-lg p-4 border border-[#38bdf8]/30">
          <p className="text-sm text-slate-400 mb-3 font-medium">Derived Values</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Voltage', sym: 'V', unit: 'V', val: derived.V },
              { label: 'Current', sym: 'I', unit: 'A', val: derived.I },
              { label: 'Resistance', sym: 'R', unit: 'Ω', val: derived.R },
              { label: 'Power', sym: 'P', unit: 'W', val: derived.P },
            ].map(item => (
              <div key={item.sym} className={`rounded-lg px-3 py-3 border ${
                item.val !== null && anyResult ? 'border-[#38bdf8]/30 bg-[#38bdf8]/5' : 'border-slate-700'
              }`}>
                <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                <p className={`text-2xl font-bold ${item.val !== null && anyResult ? 'text-[#38bdf8]' : 'text-slate-600'}`}>
                  {fmt(item.val)}
                </p>
                <p className="text-xs text-slate-500">{item.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Power Wheel SVG */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Power Wheel</h3>
        <div className="flex justify-center mb-4">
          <svg viewBox="0 0 280 280" className="w-full max-w-xs" aria-label="Ohm's Law Power Wheel">
            {/* Outer circle */}
            <circle cx="140" cy="140" r="128" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            {/* Center circle */}
            <circle cx="140" cy="140" r="44" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="140" y="134" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">V = IR</text>
            <text x="140" y="150" textAnchor="middle" fill="#94a3b8" fontSize="10">Ohm&apos;s Law</text>

            {/* Quadrant dividers */}
            <line x1="140" y1="12" x2="140" y2="268" stroke="#334155" strokeWidth="1" />
            <line x1="12" y1="140" x2="268" y2="140" stroke="#334155" strokeWidth="1" />

            {/* Top – Voltage */}
            <text x="140" y="56" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">V = IR</text>
            <text x="140" y="72" textAnchor="middle" fill="#64748b" fontSize="10">= P / I = √(PR)</text>

            {/* Right – Current */}
            <text x="212" y="136" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">I = V/R</text>
            <text x="212" y="150" textAnchor="middle" fill="#64748b" fontSize="10">= P/V = √(P/R)</text>

            {/* Bottom – Resistance */}
            <text x="140" y="210" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">R = V/I</text>
            <text x="140" y="225" textAnchor="middle" fill="#64748b" fontSize="10">= V²/P = P/I²</text>

            {/* Left – Power */}
            <text x="68" y="136" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">P = IV</text>
            <text x="68" y="150" textAnchor="middle" fill="#64748b" fontSize="10">= I²R = V²/R</text>
          </svg>
        </div>
        <p className="text-center text-xs text-slate-500">Each quadrant shows all formulas to solve for that variable</p>
      </div>

      {/* Wire Heating Note */}
      <div className="bg-amber-950/40 border border-amber-700/40 rounded-lg p-4 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-300 mb-1">Why Resistance Matters in Aircraft Wiring</p>
          <p className="text-xs text-amber-200/80">
            Excess resistance in aircraft wiring causes voltage drop and heat generation (P = I²R). Even a small resistance in a
            high-current circuit — like a starter motor or landing light circuit — can produce significant heat, leading to
            insulation degradation, chafing, or fire. Always verify wire gauge, connector condition, and termination quality
            when troubleshooting intermittent faults or overheating wires.
          </p>
        </div>
      </div>

      {/* Aircraft Circuit Reference */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Typical Aircraft Circuit Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium py-2 pr-4">System</th>
                <th className="text-left text-slate-400 font-medium py-2 pr-4">Bus Voltage</th>
                <th className="text-left text-slate-400 font-medium py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {AIRCRAFT_CIRCUITS.map((row, i) => (
                <tr key={i} className="border-b border-slate-800">
                  <td className="py-2.5 pr-4 text-slate-300">{row.system}</td>
                  <td className="py-2.5 pr-4 font-mono text-[#38bdf8]">{row.voltage}</td>
                  <td className="py-2.5 text-slate-500 text-xs">{row.typical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  )
}
