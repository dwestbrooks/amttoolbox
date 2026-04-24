'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

interface WBItem {
  id: number
  name: string
  weight: string
  arm: string
}

let nextId = 4

const defaultItems: WBItem[] = [
  { id: 1, name: 'Empty Aircraft Weight', weight: '1800', arm: '38.5' },
  { id: 2, name: 'Pilot', weight: '170', arm: '37.0' },
  { id: 3, name: 'Fuel (full)', weight: '228', arm: '48.0' },
]

export default function WeightBalanceTool() {
  const [items, setItems] = useState<WBItem[]>(defaultItems)
  const [fwdLimit, setFwdLimit] = useState('')
  const [aftLimit, setAftLimit] = useState('')
  const [showKg, setShowKg] = useState(false)

  function updateItem(id: number, field: keyof WBItem, value: string) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  function addItem() {
    setItems(prev => [...prev, { id: nextId++, name: '', weight: '', arm: '' }])
  }

  function removeItem(id: number) {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  function resetToDefaults() {
    setItems(defaultItems.map(d => ({ ...d })))
    nextId = 4
  }

  function clearAll() {
    setItems([])
    nextId = 1
  }

  const rows = items.map(item => {
    const w = parseFloat(item.weight)
    const a = parseFloat(item.arm)
    const moment = !isNaN(w) && !isNaN(a) ? w * a : null
    return { ...item, wNum: isNaN(w) ? null : w, aNum: isNaN(a) ? null : a, moment }
  })

  const totalWeight = rows.reduce((sum, r) => sum + (r.wNum ?? 0), 0)
  const totalMoment = rows.reduce((sum, r) => sum + (r.moment ?? 0), 0)
  const cg = totalWeight > 0 ? totalMoment / totalWeight : null

  const fwdNum = parseFloat(fwdLimit)
  const aftNum = parseFloat(aftLimit)
  const hasCGLimits = !isNaN(fwdNum) && !isNaN(aftNum) && cg !== null
  const cgInLimits = hasCGLimits && cg! >= fwdNum && cg! <= aftNum

  // SVG CG gauge
  function renderCGGauge() {
    if (!hasCGLimits || cg === null) return null

    const svgW = 400
    const barX1 = 40
    const barX2 = 360
    const barRange = barX2 - barX1

    const fwd = Math.min(fwdNum, aftNum)
    const aft = Math.max(fwdNum, aftNum)
    const totalRange = aft - fwd
    // Expand slightly so limits aren't at very edge
    const displayMin = fwd - totalRange * 0.2
    const displayMax = aft + totalRange * 0.2
    const displayRange = displayMax - displayMin

    function toX(val: number) {
      return barX1 + ((val - displayMin) / displayRange) * barRange
    }

    const fwdX = toX(fwd)
    const aftX = toX(aft)
    const cgX = Math.max(barX1, Math.min(barX2, toX(cg)))
    const markerColor = cgInLimits ? '#22c55e' : '#ef4444'

    return (
      <div className="mt-4">
        <p className={`text-sm font-semibold mb-2 ${cgInLimits ? 'text-green-400' : 'text-red-400'}`}>
          CG: {cg.toFixed(2)}&quot; — {cgInLimits ? 'IN LIMITS ✓' : 'OUT OF LIMITS ✗'}
        </p>
        <svg viewBox={`0 0 ${svgW} 70`} className="w-full max-w-xl">
          {/* Background bar */}
          <rect x={barX1} y="25" width={barRange} height="14" rx="3" fill="#334155" />
          {/* Green (in-limits) zone */}
          <rect x={fwdX} y="25" width={Math.max(0, aftX - fwdX)} height="14" rx="2" fill="#166534" fillOpacity="0.7" />
          {/* Fwd limit marker */}
          <line x1={fwdX} y1="20" x2={fwdX} y2="43" stroke="#64748b" strokeWidth="2" />
          <text x={fwdX} y="16" textAnchor="middle" fill="#94a3b8" fontSize="9">{fwd}&quot;</text>
          <text x={fwdX} y="56" textAnchor="middle" fill="#64748b" fontSize="8">FWD</text>
          {/* Aft limit marker */}
          <line x1={aftX} y1="20" x2={aftX} y2="43" stroke="#64748b" strokeWidth="2" />
          <text x={aftX} y="16" textAnchor="middle" fill="#94a3b8" fontSize="9">{aft}&quot;</text>
          <text x={aftX} y="56" textAnchor="middle" fill="#64748b" fontSize="8">AFT</text>
          {/* CG marker (triangle) */}
          <polygon
            points={`${cgX},20 ${cgX - 6},38 ${cgX + 6},38`}
            fill={markerColor}
          />
          <text x={cgX} y="14" textAnchor="middle" fill={markerColor} fontSize="9" fontWeight="bold">{cg.toFixed(2)}&quot;</text>
          <text x={cgX} y="56" textAnchor="middle" fill={markerColor} fontSize="8" fontWeight="bold">CG</text>
        </svg>
      </div>
    )
  }

  const LBS_TO_KG = 0.453592

  function displayWeight(lbs: number | null): string {
    if (lbs === null) return '--'
    if (showKg) return `${(lbs * LBS_TO_KG).toFixed(1)} kg`
    return `${lbs.toFixed(1)} lbs`
  }

  function displayWeightBoth(lbs: number): string {
    return `${lbs.toFixed(1)} lbs (${(lbs * LBS_TO_KG).toFixed(1)} kg)`
  }

  return (
    <ToolLayout
      title="Weight & Balance Moment Calculator"
      description="Calculate weight, moment, and CG location for aircraft weight and balance calculations. Add multiple items with weight and arm station."
      relatedTools={[
        { name: 'Rivet Size Calculator', href: '/tools/rivet-size-calculator', description: 'Calculate rivet diameter and spacing.' },
        { name: 'Hydraulic Calculator', href: '/tools/hydraulic-calculator', description: "Pascal's Law: pressure, force, area." },
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
        {/* CG Limits */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">CG Limits (optional)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Forward CG Limit (inches from datum)</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 35.0"
                value={fwdLimit}
                onChange={e => setFwdLimit(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Aft CG Limit (inches from datum)</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 47.5"
                value={aftLimit}
                onChange={e => setAftLimit(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
              />
            </div>
          </div>
          {hasCGLimits && renderCGGauge()}
        </div>

        {/* Table */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-white font-semibold">Weight &amp; Balance Items</h2>
            <div className="flex items-center gap-2 flex-wrap no-print">
              {/* Units toggle */}
              <div className="flex items-center gap-2 mr-2">
                <span className={`text-xs font-medium ${!showKg ? 'text-white' : 'text-slate-500'}`}>lbs</span>
                <button
                  onClick={() => setShowKg(!showKg)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${showKg ? 'bg-[#38bdf8]' : 'bg-slate-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showKg ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
                <span className={`text-xs font-medium ${showKg ? 'text-white' : 'text-slate-500'}`}>kg</span>
              </div>
              <button
                onClick={resetToDefaults}
                className="px-3 py-1.5 bg-[#0f172a] border border-slate-600 hover:border-slate-400 text-slate-300 rounded-lg text-xs transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={clearAll}
                className="px-3 py-1.5 bg-[#0f172a] border border-slate-600 hover:border-red-500/50 text-slate-300 hover:text-red-400 rounded-lg text-xs transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#0f172a] border border-slate-600 hover:border-[#38bdf8] text-slate-300 rounded-lg text-sm transition-colors"
              >
                🖨️ Print / Export
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="hidden sm:grid grid-cols-[1fr_130px_120px_120px_40px] gap-3 text-xs text-slate-500 uppercase tracking-wider mb-2 px-1">
            <span>Item Name</span>
            <span>Weight ({showKg ? 'kg' : 'lbs'})</span>
            <span>Arm (in)</span>
            <span>Moment (in-lbs)</span>
            <span></span>
          </div>

          <div className="space-y-2">
            {rows.map(row => (
              <div key={row.id} className="grid grid-cols-1 sm:grid-cols-[1fr_130px_120px_120px_40px] gap-2 sm:gap-3 items-center">
                <input
                  type="text"
                  placeholder="Item name"
                  value={row.name}
                  onChange={e => updateItem(row.id, 'name', e.target.value)}
                  className="bg-[#0f172a] border border-slate-600 rounded px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
                />
                <input
                  type="number"
                  step="any"
                  placeholder={showKg ? 'kg' : 'lbs'}
                  value={row.weight}
                  onChange={e => updateItem(row.id, 'weight', e.target.value)}
                  className="bg-[#0f172a] border border-slate-600 rounded px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="inches"
                  value={row.arm}
                  onChange={e => updateItem(row.id, 'arm', e.target.value)}
                  className="bg-[#0f172a] border border-slate-600 rounded px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
                />
                <div className="bg-[#0f172a] border border-slate-700 rounded px-3 py-2 text-sm text-slate-300 font-mono">
                  {row.moment !== null ? row.moment.toFixed(1) : '--'}
                </div>
                <button
                  onClick={() => removeItem(row.id)}
                  className="no-print text-slate-600 hover:text-red-400 transition-colors text-lg flex items-center justify-center"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addItem}
            className="no-print mt-4 px-4 py-2 bg-[#0f172a] border border-slate-600 hover:border-[#38bdf8] text-slate-300 rounded-lg text-sm transition-colors"
          >
            + Add Item
          </button>

          {/* Totals */}
          <div className="mt-6 border-t border-slate-700 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0f172a] rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Total Weight</p>
              <p className="text-xl font-bold text-white">{displayWeight(totalWeight)}</p>
              {showKg && <p className="text-xs text-slate-500">{displayWeightBoth(totalWeight)}</p>}
            </div>
            <div className="bg-[#0f172a] rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-1">Total Moment</p>
              <p className="text-xl font-bold text-white">{totalMoment.toFixed(1)} <span className="text-sm text-slate-400">in-lbs</span></p>
            </div>
            <div className="bg-[#0f172a] rounded-lg p-3 border border-[#38bdf8]/30">
              <p className="text-xs text-slate-500 mb-1">CG Location</p>
              <p className="text-3xl font-bold text-[#38bdf8]">
                {cg !== null ? cg.toFixed(2) : '--'}
              </p>
              <p className="text-xs text-slate-400">inches from datum</p>
              {hasCGLimits && cg !== null && (
                <p className={`text-xs font-semibold mt-1 ${cgInLimits ? 'text-green-400' : 'text-red-400'}`}>
                  {cgInLimits ? '✓ Within CG limits' : '✗ Outside CG limits'}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 text-sm text-slate-400">
          <p className="font-medium text-white mb-1">How to use</p>
          <p>Enter each weight item with its arm station (distance from datum in inches). The moment is calculated automatically (Weight × Arm). The CG is Total Moment ÷ Total Weight. Compare the CG result against your aircraft&apos;s POH weight &amp; balance envelope.</p>
        </div>
      </div>
    </ToolLayout>
  )
}
