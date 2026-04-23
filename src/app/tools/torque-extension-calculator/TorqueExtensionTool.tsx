'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

type Unit = 'in-lb' | 'ft-lb' | 'N·m'

function toInLb(value: number, unit: Unit): number {
  switch (unit) {
    case 'ft-lb': return value * 12
    case 'N·m': return value * 8.8507
    default: return value
  }
}

function fromInLb(value: number, unit: Unit): number {
  switch (unit) {
    case 'ft-lb': return value / 12
    case 'N·m': return value / 8.8507
    default: return value
  }
}

const relatedTools = [
  { name: 'Torque Unit Converter', href: '/tools/torque-unit-converter', description: 'Convert between in-lb, ft-lb, N·m, and kgf·cm' },
  { name: 'AN Hardware Decoder', href: '/tools/an-hardware-decoder', description: 'Decode AN bolt and hardware part numbers' },
]

export default function TorqueExtensionTool() {
  const [unit, setUnit] = useState<Unit>('in-lb')
  const [T, setT] = useState('')
  const [L, setL] = useState('')
  const [E, setE] = useState('')

  const tNum = parseFloat(T)
  const lNum = parseFloat(L)
  const eNum = parseFloat(E)

  const valid = !isNaN(tNum) && !isNaN(lNum) && !isNaN(eNum) && lNum > 0 && eNum >= 0 && tNum > 0
  const lPlusE = lNum + eNum

  let TW: number | null = null
  let TWDisplay = ''
  if (valid && lPlusE > 0) {
    const tInLb = toInLb(tNum, unit)
    const twInLb = (tInLb * lNum) / lPlusE
    TW = fromInLb(twInLb, unit)
    TWDisplay = TW.toFixed(2)
  }

  return (
    <ToolLayout
      title="Torque Extension Calculator"
      description="Calculate the correct torque wrench setting when using a rigid extension or crowfoot attachment."
      relatedTools={relatedTools}
    >
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 mb-6">
        {/* Unit selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">Unit System</label>
          <div className="flex gap-2">
            {(['in-lb', 'ft-lb', 'N·m'] as Unit[]).map(u => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  unit === u
                    ? 'bg-[#38bdf8] text-[#0f172a] border-[#38bdf8]'
                    : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-slate-400'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Desired Torque (T)', value: T, setter: setT, hint: 'At the fastener' },
            { label: 'Wrench Length (L)', value: L, setter: setL, hint: 'Handle center to drive center' },
            { label: 'Extension Length (E)', value: E, setter: setE, hint: 'Drive center to fastener center' },
          ].map(({ label, value, setter, hint }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={value}
                  onChange={e => setter(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                  {unit}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{hint}</p>
            </div>
          ))}
        </div>

        {/* Result */}
        {valid && TW !== null ? (
          <div className="bg-[#0f172a] border border-[#38bdf8]/30 rounded-lg p-6 mb-6">
            <p className="text-slate-400 text-sm mb-1">Set your torque wrench to:</p>
            <p className="text-4xl font-bold text-[#38bdf8]">
              {TWDisplay} <span className="text-2xl">{unit}</span>
            </p>
            <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-slate-400 space-y-1 font-mono">
              <p>TW = (T × L) / (L + E)</p>
              <p>TW = ({tNum} × {lNum}) / ({lNum} + {eNum})</p>
              <p>TW = {(tNum * lNum).toFixed(4)} / {lPlusE.toFixed(4)}</p>
              <p className="text-[#38bdf8]">TW = {TWDisplay} {unit}</p>
            </div>
          </div>
        ) : (
          <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-6 mb-6 text-center text-slate-500">
            Enter values above to calculate
          </div>
        )}

        {/* SVG Diagram */}
        <div className="mt-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Geometry Diagram</p>
          <svg viewBox="0 0 520 120" className="w-full max-w-lg" fill="none">
            <rect x="20" y="45" width="200" height="30" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
            <rect x="215" y="38" width="30" height="44" rx="3" fill="#334155" stroke="#64748b" strokeWidth="2"/>
            <rect x="245" y="52" width="140" height="16" rx="3" fill="#164e63" stroke="#38bdf8" strokeWidth="1.5"/>
            <circle cx="400" cy="60" r="12" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2"/>
            <text x="400" y="64" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">T</text>
            <line x1="20" y1="95" x2="245" y2="95" stroke="#94a3b8" strokeWidth="1"/>
            <line x1="20" y1="90" x2="20" y2="100" stroke="#94a3b8" strokeWidth="1"/>
            <line x1="245" y1="90" x2="245" y2="100" stroke="#94a3b8" strokeWidth="1"/>
            <text x="132" y="110" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">L (wrench)</text>
            <line x1="245" y1="20" x2="390" y2="20" stroke="#38bdf8" strokeWidth="1"/>
            <line x1="245" y1="15" x2="245" y2="25" stroke="#38bdf8" strokeWidth="1"/>
            <line x1="390" y1="15" x2="390" y2="25" stroke="#38bdf8" strokeWidth="1"/>
            <text x="317" y="13" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">E (extension)</text>
          </svg>
        </div>
      </div>

      {/* Formula explanation */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">How This Works</h2>
        <div className="space-y-3 text-sm text-slate-400">
          <p>When a rigid extension or crowfoot wrench is added to a torque wrench, the effective lever arm changes. Without adjusting the wrench setting, you will over-torque the fastener.</p>
          <p className="font-mono bg-slate-800 px-3 py-2 rounded text-slate-300">TW = (T × L) / (L + E)</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-slate-300">TW</strong> — Torque wrench setting (what you set the wrench to)</li>
            <li><strong className="text-slate-300">T</strong> — Desired torque at the fastener</li>
            <li><strong className="text-slate-300">L</strong> — Distance from center of handle grip to center of drive</li>
            <li><strong className="text-slate-300">E</strong> — Distance from center of drive to center of fastener</li>
          </ul>
          <p className="text-amber-300 text-xs">⚠ This formula only applies to extensions that are in-line with the wrench. For angle extensions, consult your maintenance manual.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
