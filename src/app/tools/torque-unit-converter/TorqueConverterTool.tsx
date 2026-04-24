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
function toFtLb(inLb: number) { return inLb / 12 }

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
  const [activeUnit, setActiveUnit] = useState<string>('in-lb')
  const [findValue, setFindValue] = useState('')
  const [lubricated, setLubricated] = useState(false)

  const handleChange = (changedUnit: string, raw: string) => {
    setActiveUnit(changedUnit)
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
  const lubFactor = lubricated ? 0.80 : 1.0

  // Find My Bolt: convert findValue to in-lb using activeUnit
  const findNum = parseFloat(findValue)
  const findInLb: number | null = (!isNaN(findNum) && findValue !== '') ? findNum * TO_INLB[activeUnit] : null

  const matchingBolt = findInLb !== null
    ? anBoltTorque.find(row =>
        findInLb >= row.minInLb * lubFactor && findInLb <= row.maxInLb * lubFactor
      )
    : null

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

        {/* Find My Bolt */}
        <div className="mt-6 pt-5 border-t border-slate-700">
          <p className="text-sm font-semibold text-white mb-2">Find My Bolt</p>
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs text-slate-400 mb-1">
                Torque value (in <span className="text-[#38bdf8]">{activeUnit}</span> — edit any field above to change unit)
              </label>
              <input
                type="number"
                step="any"
                placeholder="Enter torque to identify bolt range"
                value={findValue}
                onChange={e => setFindValue(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors text-sm"
              />
            </div>
          </div>
          {findValue !== '' && findInLb !== null && (
            <p className="mt-2 text-sm">
              {matchingBolt
                ? <span className="text-[#38bdf8] font-semibold">
                    Matching: {matchingBolt.size} ({(matchingBolt.minInLb * lubFactor).toFixed(0)}–{(matchingBolt.maxInLb * lubFactor).toFixed(0)} in-lb{lubricated ? ' lubricated' : ''})
                  </span>
                : <span className="text-slate-400">No bolt range matched for {findNum.toFixed(2)} {activeUnit} ({findInLb.toFixed(1)} in-lb)</span>
              }
            </p>
          )}
        </div>
      </div>

      {/* AN Bolt Torque Table */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">AN Bolt Torque Reference</h2>
            <p className="text-xs text-slate-500">Cadmium-plated steel AN bolts, dry conditions</p>
          </div>
          <button
            onClick={() => setLubricated(!lubricated)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              lubricated
                ? 'bg-[#38bdf8] text-[#0f172a] border-[#38bdf8]'
                : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-slate-400'
            }`}
          >
            {lubricated ? '✓ Lubricated Values' : 'Show Lubricated Values'}
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th className="pb-2 pr-4">Bolt</th>
                <th className="pb-2 pr-4">Diameter</th>
                <th className="pb-2 pr-4">Torque (in-lb)</th>
                <th className="pb-2 pr-4">Torque (ft-lb)</th>
                <th className="pb-2">Torque (N·m)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {anBoltTorque.map(row => {
                const minVal = Math.round(row.minInLb * lubFactor * 10) / 10
                const maxVal = Math.round(row.maxInLb * lubFactor * 10) / 10
                const isMatch = findInLb !== null &&
                  findInLb >= row.minInLb * lubFactor &&
                  findInLb <= row.maxInLb * lubFactor
                return (
                  <tr
                    key={row.size}
                    className={`transition-colors ${isMatch ? 'bg-[#38bdf8]/10 ring-1 ring-[#38bdf8]/40' : 'hover:bg-slate-800/50'}`}
                  >
                    <td className="py-2.5 pr-4 font-medium text-white">{row.size}</td>
                    <td className="py-2.5 pr-4 text-slate-400">{row.diameter}</td>
                    <td className="py-2.5 pr-4 text-slate-300">{minVal}–{maxVal}</td>
                    <td className="py-2.5 pr-4 text-slate-400">{toFtLb(minVal).toFixed(1)}–{toFtLb(maxVal).toFixed(1)}</td>
                    <td className="py-2.5 text-slate-400">{toNm(minVal).toFixed(1)}–{toNm(maxVal).toFixed(1)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {lubricated && (
          <div className="mt-4 bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-400">
            <span className="text-slate-300 font-medium">Lubricated fasteners:</span> Reduce torque by 20% from listed dry values. Example: AN4 dry = 50–70 in-lb; lubricated = 40–56 in-lb.
          </div>
        )}

        <p className="text-xs text-amber-400/70 mt-4">
          ⚠ Always consult the applicable aircraft maintenance manual for structure-specific torque requirements.
        </p>
      </div>
    </ToolLayout>
  )
}
