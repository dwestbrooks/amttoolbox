'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'
import { HelpCircle } from 'lucide-react'

interface MaterialPreset {
  label: string
  k: number
  minRadiusMultiplier: number
}

const PRESETS: Record<string, MaterialPreset> = {
  custom: { label: 'Custom', k: 0.33, minRadiusMultiplier: 0 },
  '2024t3': { label: '2024-T3 Aluminum', k: 0.33, minRadiusMultiplier: 1.5 },
  '6061t6': { label: '6061-T6 Aluminum', k: 0.38, minRadiusMultiplier: 2 },
  '7075t6': { label: '7075-T6 Aluminum', k: 0.40, minRadiusMultiplier: 3.0 },
  'mildsteel': { label: 'Mild Steel (1020)', k: 0.38, minRadiusMultiplier: 1.5 },
  '4130steel': { label: '4130 Steel', k: 0.41, minRadiusMultiplier: 2.5 },
  'ti-gr2': { label: 'Titanium Grade 2', k: 0.45, minRadiusMultiplier: 3 },
}

const relatedTools = [
  { name: 'Decimal/Fraction Converter', href: '/tools/decimal-fraction-converter', description: 'Convert between fractional, decimal, and metric dimensions' },
]

export default function BendAllowanceTool() {
  const [preset, setPreset] = useState<string>('custom')
  const [angle, setAngle] = useState('')
  const [radius, setRadius] = useState('')
  const [thickness, setThickness] = useState('')
  const [kFactor, setKFactor] = useState('0.33')
  const [leg1, setLeg1] = useState('')
  const [leg2, setLeg2] = useState('')
  const [showKTooltip, setShowKTooltip] = useState(false)
  const [useOML, setUseOML] = useState(false)
  const [showMm, setShowMm] = useState(false)

  const angleNum = parseFloat(angle)
  const radiusInputNum = parseFloat(radius)
  const thicknessNum = parseFloat(thickness)
  const kNum = parseFloat(kFactor)
  const leg1Num = parseFloat(leg1)
  const leg2Num = parseFloat(leg2)

  // OML conversion: inside radius = OML radius - thickness
  const radiusNum = (useOML && !isNaN(radiusInputNum) && !isNaN(thicknessNum))
    ? radiusInputNum - thicknessNum
    : radiusInputNum

  const valid = !isNaN(angleNum) && !isNaN(radiusNum) && !isNaN(thicknessNum) && !isNaN(kNum)
    && angleNum > 0 && angleNum < 180 && radiusNum >= 0 && thicknessNum > 0 && kNum > 0

  const selectedPreset = PRESETS[preset]
  const minRadius = selectedPreset.minRadiusMultiplier > 0 ? selectedPreset.minRadiusMultiplier * thicknessNum : null
  const radiusTooSmall = valid && minRadius !== null && radiusNum < minRadius

  let BA: number | null = null
  let SB: number | null = null
  let FL: number | null = null

  if (valid) {
    const angleRad = angleNum * (Math.PI / 180)
    BA = angleRad * (radiusNum + kNum * thicknessNum)
    SB = Math.tan(angleRad / 2) * (radiusNum + thicknessNum)
    if (!isNaN(leg1Num) && !isNaN(leg2Num) && leg1Num > 0 && leg2Num > 0) {
      FL = leg1Num + leg2Num + BA - 2 * SB
    }
  }

  const handlePresetChange = (key: string) => {
    setPreset(key)
    if (key !== 'custom') {
      setKFactor(PRESETS[key].k.toString())
    }
  }

  const displayVal = (val: number): string => {
    if (showMm) return (val * 25.4).toFixed(4)
    return val.toFixed(4)
  }

  const unitLabel = showMm ? 'mm' : 'inches'

  return (
    <ToolLayout
      title="Bend Allowance Calculator"
      description="Calculate bend allowance, setback, and flat blank length for aircraft sheet metal fabrication."
      relatedTools={relatedTools}
    >
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 mb-6">
        {/* Material Preset */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">Material Preset</label>
          <select
            value={preset}
            onChange={e => handlePresetChange(e.target.value)}
            className="w-full sm:w-auto bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#38bdf8] transition-colors"
          >
            {Object.entries(PRESETS).map(([key, p]) => (
              <option key={key} value={key}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* OML Toggle */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
            <input
              type="checkbox"
              checked={useOML}
              onChange={e => setUseOML(e.target.checked)}
              className="w-4 h-4 rounded accent-[#38bdf8]"
            />
            <span className="text-sm text-slate-300">Use Outside Mold Line (OML) radius</span>
          </label>
          {useOML && (
            <div className="mt-2 text-xs text-slate-400 bg-slate-800 rounded-lg px-3 py-2">
              OML radius is measured to the outside surface. Inside radius = OML − thickness.
              {!isNaN(radiusInputNum) && !isNaN(thicknessNum) && thicknessNum > 0 && (
                <span className="text-[#38bdf8] ml-1">
                  (Inside radius = {radiusInputNum.toFixed(4)}&quot; − {thicknessNum.toFixed(4)}&quot; = {(radiusInputNum - thicknessNum).toFixed(4)}&quot;)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Bend Angle (°)</label>
            <input
              type="number" min="0" max="180" step="any" value={angle}
              onChange={e => setAngle(e.target.value)} placeholder="90"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {useOML ? 'OML Bend Radius (in)' : 'Inside Bend Radius (in)'}
            </label>
            <input
              type="number" min="0" step="any" value={radius}
              onChange={e => setRadius(e.target.value)} placeholder="0.125"
              className={`w-full bg-slate-800 border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-colors ${radiusTooSmall ? 'border-amber-500' : 'border-slate-600 focus:border-[#38bdf8]'}`}
            />
            {radiusTooSmall && minRadius !== null && (
              <p className="text-xs text-amber-400 mt-1">⚠ Below min bend radius ({minRadius.toFixed(4)}&quot; for {PRESETS[preset].label})</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Material Thickness (in)</label>
            <input
              type="number" min="0" step="any" value={thickness}
              onChange={e => setThickness(e.target.value)} placeholder="0.040"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="text-sm font-medium text-slate-300">K-Factor</label>
              <button
                onMouseEnter={() => setShowKTooltip(true)}
                onMouseLeave={() => setShowKTooltip(false)}
                className="text-slate-500 hover:text-slate-300 relative"
              >
                <HelpCircle className="w-4 h-4" />
                {showKTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 border border-slate-600 rounded-lg p-3 text-xs text-slate-300 z-10 shadow-xl">
                    K-factor represents the location of the neutral axis within the material. 0.33 is typical for soft materials bent to a tight radius; 0.5 for thicker materials or larger radii.
                  </div>
                )}
              </button>
            </div>
            <input
              type="number" min="0" max="1" step="0.01" value={kFactor}
              onChange={e => setKFactor(e.target.value)} placeholder="0.33"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Leg 1 Length (in) <span className="text-slate-500">optional</span>
            </label>
            <input
              type="number" min="0" step="any" value={leg1}
              onChange={e => setLeg1(e.target.value)} placeholder="2.000"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Leg 2 Length (in) <span className="text-slate-500">optional</span>
            </label>
            <input
              type="number" min="0" step="any" value={leg2}
              onChange={e => setLeg2(e.target.value)} placeholder="2.000"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
        </div>

        {/* Results */}
        {valid && BA !== null && SB !== null ? (
          <div className="space-y-4">
            {/* Metric toggle */}
            <div className="flex items-center justify-end gap-3">
              <span className="text-xs text-slate-400">Show in mm</span>
              <button
                onClick={() => setShowMm(!showMm)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${showMm ? 'bg-[#38bdf8]' : 'bg-slate-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showMm ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Bend Allowance (BA)', value: displayVal(BA), unit: unitLabel },
                { label: 'Setback (SB)', value: displayVal(SB), unit: unitLabel },
                { label: 'Flat Blank Length', value: FL !== null ? displayVal(FL) : '—', unit: FL !== null ? unitLabel : 'Enter legs' },
              ].map(({ label, value, unit: u }) => (
                <div key={label} className="bg-[#0f172a] border border-slate-700 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className="text-2xl font-bold text-[#38bdf8]">{value}</p>
                  <p className="text-xs text-slate-500">{u}</p>
                </div>
              ))}
            </div>

            {/* Step-by-step */}
            <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-400 space-y-1">
              <p className="text-slate-300 font-sans font-medium text-xs uppercase tracking-wider mb-2">Step-by-step</p>
              <p>BA = Angle × (π/180) × (R + K × T)</p>
              <p>BA = {angleNum} × (π/180) × ({radiusNum.toFixed(4)} + {kNum} × {thicknessNum})</p>
              <p className="text-[#38bdf8]">BA = {displayVal(BA)} {unitLabel}</p>
              <p className="mt-2">SB = tan(Angle/2) × (R + T)</p>
              <p>SB = tan({(angleNum / 2).toFixed(1)}°) × ({radiusNum.toFixed(4)} + {thicknessNum})</p>
              <p className="text-[#38bdf8]">SB = {displayVal(SB)} {unitLabel}</p>
              {FL !== null && (
                <>
                  <p className="mt-2">Flat Blank = L1 + L2 + BA - 2×SB</p>
                  <p>Flat Blank = {leg1Num} + {leg2Num} + {BA.toFixed(4)} - 2×{SB.toFixed(4)}</p>
                  <p className="text-[#38bdf8]">Flat Blank = {displayVal(FL)} {unitLabel}</p>
                </>
              )}
            </div>

            {/* Developed length visual note */}
            <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Flat Blank Layout</p>
              <pre className="font-mono text-xs text-slate-400 leading-relaxed whitespace-pre">{`|← L1 →|← BA →|← L2 →|\n        Total Flat Blank`}</pre>
            </div>
          </div>
        ) : (
          <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-6 text-center text-slate-500">
            Enter bend angle, radius, and thickness to calculate
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
