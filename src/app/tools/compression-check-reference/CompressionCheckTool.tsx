'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

type Manufacturer = 'Continental' | 'Lycoming'
type TestCondition = 'warm' | 'cold'

interface CylinderRow {
  id: number
  num: string
  label: string
  reading: string
}

function getStatus(reading: number): { label: string; color: string; bg: string; border: string } {
  if (reading >= 75) return { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-900/30', border: 'border-emerald-700/40' }
  if (reading >= 70) return { label: 'Good', color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700/40' }
  if (reading >= 60) return { label: 'Marginal', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700/40' }
  if (reading >= 50) return { label: 'Poor', color: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-700/40' }
  return { label: 'Failed', color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700/40' }
}

let nextId = 4

export default function CompressionCheckTool() {
  const [manufacturer, setManufacturer] = useState<Manufacturer>('Continental')
  const [cylCount, setCylCount] = useState(4)
  const [rows, setRows] = useState<CylinderRow[]>([
    { id: 1, num: '1', label: '', reading: '' },
    { id: 2, num: '2', label: '', reading: '' },
    { id: 3, num: '3', label: '', reading: '' },
    { id: 4, num: '4', label: '', reading: '' },
  ])
  const [testCondition, setTestCondition] = useState<TestCondition>('warm')

  function updateRow(id: number, field: keyof CylinderRow, value: string) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  function addRow() {
    setRows(prev => [...prev, { id: nextId++, num: String(prev.length + 1), label: '', reading: '' }])
  }

  function removeRow(id: number) {
    setRows(prev => prev.filter(r => r.id !== id))
  }

  function handleCylCount(n: number) {
    setCylCount(n)
    const newRows: CylinderRow[] = Array.from({ length: n }, (_, i) => ({
      id: i + 1,
      num: String(i + 1),
      label: '',
      reading: rows[i]?.reading ?? '',
    }))
    nextId = n + 1
    setRows(newRows)
  }

  const parsedReadings = rows.map(r => ({ ...r, val: parseFloat(r.reading) })).filter(r => !isNaN(r.val))
  const allReadings = parsedReadings.map(r => r.val)
  const minReading = allReadings.length > 0 ? Math.min(...allReadings) : null
  const maxReading = allReadings.length > 0 ? Math.max(...allReadings) : null
  const spread = minReading !== null && maxReading !== null ? maxReading - minReading : null
  const spreadWarning = spread !== null && spread > 15

  function handlePrint() {
    window.print()
  }

  return (
    <ToolLayout
      title="Engine Compression Check Reference"
      description="Differential compression check interpretation guide for Continental and Lycoming aircraft engines. Understand what your readings mean."
      relatedTools={[
        { name: 'Aircraft Wire Gauge Calculator', href: '/tools/wire-gauge-calculator', description: 'Wire sizing for ignition system circuits.' },
      ]}
    >
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="print-area">
        {/* Disclaimer */}
        <div className="bg-amber-900/30 border border-amber-700/40 rounded-lg p-4 mb-6">
          <p className="text-amber-300 text-sm font-semibold mb-1">⚠️ Reference Guide Only</p>
          <p className="text-amber-200/80 text-sm">
            This is a reference guide only. All compression check findings must be documented, interpreted by a certificated A&amp;P mechanic, and addressed per the applicable engine manufacturer&apos;s maintenance manual and overhaul manual.
          </p>
        </div>

        {/* Engine Setup */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Engine Configuration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Engine Manufacturer</label>
              <div className="flex gap-2">
                {(['Continental', 'Lycoming'] as Manufacturer[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setManufacturer(m)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${manufacturer === m ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#0f172a] text-slate-300 border border-slate-600 hover:border-slate-400'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Number of Cylinders</label>
              <div className="flex gap-2">
                {[4, 6, 8].map(n => (
                  <button
                    key={n}
                    onClick={() => handleCylCount(n)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${cylCount === n ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#0f172a] text-slate-300 border border-slate-600 hover:border-slate-400'}`}
                  >
                    {n}-cyl
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Opposed-6 naming note */}
          {cylCount === 6 && (
            <div className="mt-4 bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-xs text-slate-400">
              For horizontally-opposed 6-cylinder engines, cylinders are typically numbered 1-3 on right bank, 4-6 on left bank (Continental IO-520/IO-550 convention). Use the Label field to annotate (e.g. &quot;1R&quot;, &quot;2L&quot;).
            </div>
          )}

          {/* Test conditions */}
          <div className="mt-4">
            <label className="block text-sm text-slate-400 mb-2">Test Conditions</label>
            <div className="flex gap-2">
              {([
                { val: 'warm' as TestCondition, label: 'Warm (normal ops temp)' },
                { val: 'cold' as TestCondition, label: 'Cold' },
              ]).map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setTestCondition(opt.val)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${testCondition === opt.val ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#0f172a] text-slate-300 border border-slate-600 hover:border-slate-400'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {testCondition === 'cold' && (
              <div className="mt-2 bg-amber-900/20 border border-amber-700/30 rounded-lg px-4 py-2.5 text-xs text-amber-300">
                Cold compression checks may read 5–10 points lower than warm checks. Warm is the standard for airworthiness determination per most manufacturer guidelines.
              </div>
            )}
          </div>
        </div>

        {/* Cylinder Readings */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Cylinder Readings (X / 80)</h2>
          <div className="space-y-3">
            {rows.map(row => {
              const val = parseFloat(row.reading)
              const status = !isNaN(val) ? getStatus(val) : null
              return (
                <div key={row.id} className="flex items-center gap-2 flex-wrap">
                  <div className="w-20">
                    <label className="block text-xs text-slate-500 mb-1">Cyl #</label>
                    <input
                      type="text"
                      value={row.num}
                      onChange={e => updateRow(row.id, 'num', e.target.value)}
                      className="w-full bg-[#0f172a] border border-slate-600 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                  {cylCount === 6 && (
                    <div className="w-20">
                      <label className="block text-xs text-slate-500 mb-1">Label</label>
                      <input
                        type="text"
                        value={row.label}
                        onChange={e => updateRow(row.id, 'label', e.target.value)}
                        placeholder="e.g. 1R"
                        className="w-full bg-[#0f172a] border border-slate-600 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Reading (0–80)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="80"
                        placeholder="e.g. 76"
                        value={row.reading}
                        onChange={e => updateRow(row.id, 'reading', e.target.value)}
                        className="w-32 bg-[#0f172a] border border-slate-600 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                      />
                      <span className="text-slate-500 text-sm">/ 80</span>
                      {status && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}>
                          {status.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeRow(row.id)}
                    className="no-print mt-4 text-slate-600 hover:text-red-400 transition-colors text-lg"
                    aria-label="Remove row"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
          <button
            onClick={addRow}
            className="no-print mt-4 px-4 py-2 bg-[#0f172a] border border-slate-600 hover:border-[#38bdf8] text-slate-300 rounded-lg text-sm transition-colors"
          >
            + Add Cylinder
          </button>
        </div>

        {/* Summary */}
        {allReadings.length > 0 && (
          <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Results Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-[#0f172a] rounded-lg p-3">
                <p className="text-xs text-slate-500">Lowest Reading</p>
                <p className="text-2xl font-bold text-white">{minReading}/80</p>
                {minReading !== null && <span className={`text-xs font-semibold ${getStatus(minReading).color}`}>{getStatus(minReading).label}</span>}
              </div>
              <div className="bg-[#0f172a] rounded-lg p-3">
                <p className="text-xs text-slate-500">Highest Reading</p>
                <p className="text-2xl font-bold text-white">{maxReading}/80</p>
                {maxReading !== null && <span className={`text-xs font-semibold ${getStatus(maxReading).color}`}>{getStatus(maxReading).label}</span>}
              </div>
              <div className={`rounded-lg p-3 ${spreadWarning ? 'bg-red-900/30 border border-red-700/30' : 'bg-[#0f172a]'}`}>
                <p className={`text-xs ${spreadWarning ? 'text-red-400' : 'text-slate-500'}`}>Spread (high − low)</p>
                <p className={`text-2xl font-bold ${spreadWarning ? 'text-red-400' : 'text-white'}`}>{spread ?? '--'} pts</p>
                {spreadWarning && <p className="text-xs text-red-400">⚠️ Spread &gt;15 — investigate</p>}
              </div>
            </div>

            {/* Prominent spread warning */}
            {spreadWarning && spread !== null && (
              <div className="mb-4 bg-amber-900/30 border border-amber-600/50 rounded-lg px-5 py-4">
                <p className="text-amber-300 font-semibold text-base mb-1">
                  ⚠ Cylinder spread exceeds 15 points (spread: {spread} points)
                </p>
                <p className="text-amber-200/80 text-sm">
                  This suggests uneven wear or a developing issue. Document findings and consult engine manufacturer&apos;s service limits.
                </p>
              </div>
            )}

            {/* Color Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {parsedReadings.map(r => {
                const s = getStatus(r.val)
                return (
                  <div key={r.id} className={`rounded-lg p-3 border ${s.bg} ${s.border}`}>
                    <p className="text-xs text-slate-400">
                      Cyl {r.num}{r.label ? ` (${r.label})` : ''}
                    </p>
                    <p className={`text-xl font-bold ${s.color}`}>{r.val}/80</p>
                    <p className={`text-xs font-semibold ${s.color}`}>{s.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Manufacturer Note */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
          <h3 className="text-white font-semibold mb-2">{manufacturer} Service Standard</h3>
          <p className="text-slate-300 text-sm">
            {manufacturer === 'Continental'
              ? 'Continental specifies minimum 60/80 for continued service. Investigate any cylinder below 75/80.'
              : 'Lycoming specifies minimum 60/80. However, readings below 70/80 warrant further investigation per Lycoming SI 1191.'}
          </p>
        </div>

        {/* Leakage Guide */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Leakage Location Guide</h3>
          <div className="space-y-3">
            {[
              { loc: 'Air leaking from exhaust pipe', cause: 'Exhaust valve not seating; burned or bent valve likely' },
              { loc: 'Air leaking from carburetor/intake', cause: 'Intake valve not seating; bent or burnt valve' },
              { loc: 'Air leaking from crankcase breather', cause: 'Worn piston rings or cylinder wall' },
              { loc: "Air leaking from adjacent cylinder's exhaust", cause: 'Cracked cylinder head or blown head gasket' },
              { loc: 'Whistling from oil filler cap', cause: 'Piston rings / cylinder wall wear' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 bg-[#0f172a] rounded-lg p-3">
                <span className="text-[#38bdf8] text-lg">→</span>
                <div>
                  <p className="text-sm font-medium text-white">{item.loc}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.cause}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interpretation Scale */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Interpretation Scale</h3>
          <div className="space-y-2">
            {[
              { range: '75–80/80', label: 'Excellent', action: 'No action required', color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-700/30' },
              { range: '70–74/80', label: 'Good', action: 'Monitor at next inspection', color: 'text-green-400', bg: 'bg-green-900/20 border-green-700/30' },
              { range: '60–69/80', label: 'Marginal', action: 'Investigate further; listen for leakage location', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700/30' },
              { range: '50–59/80', label: 'Poor', action: 'Immediate investigation required; likely airworthiness concern', color: 'text-orange-400', bg: 'bg-orange-900/20 border-orange-700/30' },
              { range: 'Below 50/80', label: 'Failed', action: 'Remove from service pending inspection', color: 'text-red-400', bg: 'bg-red-900/20 border-red-700/30' },
            ].map((item, i) => (
              <div key={i} className={`flex gap-4 items-start rounded-lg p-3 border ${item.bg}`}>
                <span className={`font-mono font-bold text-sm w-24 flex-shrink-0 ${item.color}`}>{item.range}</span>
                <span className={`font-semibold text-sm w-20 flex-shrink-0 ${item.color}`}>{item.label}</span>
                <span className="text-slate-400 text-sm">{item.action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Print button */}
        <div className="no-print flex justify-end">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-[#0f172a] border border-slate-600 hover:border-[#38bdf8] text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors"
          >
            🖨️ Print Summary
          </button>
        </div>
      </div>
    </ToolLayout>
  )
}
