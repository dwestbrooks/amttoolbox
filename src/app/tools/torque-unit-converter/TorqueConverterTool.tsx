'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

const TO_INLB: Record<string, number> = {
  'in-lb': 1,
  'ft-lb': 12,
  'N·m': 8.8507,
  'kgf·cm': 0.8681,
}

const anBoltTorque = [
  { size: 'AN3', diameter: '3/16"', minInLb: 20, maxInLb: 25 },
  { size: 'AN4', diameter: '1/4"', minInLb: 50, maxInLb: 70 },
  { size: 'AN5', diameter: '5/16"', minInLb: 100, maxInLb: 140 },
  { size: 'AN6', diameter: '3/8"', minInLb: 160, maxInLb: 190 },
  { size: 'AN7', diameter: '7/16"', minInLb: 450, maxInLb: 500 },
  { size: 'AN8', diameter: '1/2"', minInLb: 480, maxInLb: 690 },
  { size: 'AN10', diameter: '5/8"', minInLb: 960, maxInLb: 1380 },
  { size: 'AN12', diameter: '3/4"', minInLb: 1100, maxInLb: 1900 },
]

function toNm(inLb: number) { return inLb / 8.8507 }

const relatedTools = [
  { name: 'Torque Extension Calculator', href: '/tools/torque-extension-calculator', description: 'Calculate correct wrench setting with extension' },
  { name: 'AN Hardware Decoder', href: '/tools/an-hardware-decoder', description: 'Decode AN bolt and hardware part numbers' },
]

export default function TorqueConverterTool() {
  const [values, setValues] = useState<Record<string, string>>({
    'in-lb': '',
    'ft-lb': '',
    'N·m': '',
    'kgf·cm': '',
  })

  const handleChange = (changedUnit: string, raw: string) => {
    const num = parseFloat(raw)
    if (raw === '' || raw === '-') {
      setValues({ 'in-lb': '', 'ft-lb': '', 'N·m': '', 'kgf·cm': '' })
      return
    }
    if (isNaN(num)) return

    const inLb = num * TO_INLB[changedUnit]
    const next: Record<string, string> = {}
    for (const u of Object.keys(TO_INLB)) {
      if (u === changedUnit) {
        next[u] = raw
      } else {
        next[u] = (inLb / TO_INLB[u]).toFixed(4)
      }
    }
    setValues(next)
  }

  const units = ['in-lb', 'ft-lb', 'N·m', 'kgf·cm']

  return (
    <ToolLayout
      title="Torque Unit Converter"
      description="Multi-directional torque unit converter. Edit any field to update all others simultaneously."
      relatedTools={relatedTools}
    >
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {units.map(unit => (
            <div key={unit}>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">{unit}</label>
              <input
                type="number"
                step="any"
                value={values[unit]}
                onChange={e => handleChange(unit, e.target.value)}
                placeholder="0.0000"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg placeholder-slate-600 focus:outline-none focus:border-[#38bdf8] transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* AN Bolt Torque Table */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-1">AN Bolt Torque Reference</h2>
        <p className="text-xs text-slate-500 mb-4">Cadmium-plated steel AN bolts, dry conditions</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th className="pb-2 pr-4">Bolt</th>
                <th className="pb-2 pr-4">Diameter</th>
                <th className="pb-2 pr-4">Torque (in-lb)</th>
                <th className="pb-2">Torque (N·m)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {anBoltTorque.map(row => (
                <tr key={row.size} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 pr-4 font-medium text-white">{row.size}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{row.diameter}</td>
                  <td className="py-2.5 pr-4 text-slate-300">{row.minInLb}–{row.maxInLb}</td>
                  <td className="py-2.5 text-slate-400">{toNm(row.minInLb).toFixed(1)}–{toNm(row.maxInLb).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-amber-400/70 mt-4">
          ⚠ Always consult the applicable aircraft maintenance manual for structure-specific torque requirements.
        </p>
      </div>
    </ToolLayout>
  )
}
