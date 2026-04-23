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

  const angleNum = parseFloat(angle)
  const radiusNum = parseFloat(radius)
  const thicknessNum = parseFloat(thickness)
  const kNum = parseFloat(kFactor)
  const leg1Num = parseFloat(leg1)
  const leg2Num = parseFloat(leg2)

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
            <label className="block text-sm font-medium text-slate-300 mb-1">Inside Bend Radius (in)</label>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Bend Allowance (BA)', value: BA.toFixed(4), unit: 'inches' },
                { label: 'Setback (SB)', value: SB.toFixed(4), unit: 'inches' },
                { label: 'Flat Blank Length', value: FL !== null ? FL.toFixed(4) : '—', unit: FL !== null ? 'inches' : 'Enter legs' },
              ].map(({ label, value, unit }) => (
                <div key={label} className="bg-[#0f172a] border border-slate-700 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className="text-2xl font-bold text-[#38bdf8]">{value}</p>
                  <p className="text-xs text-slate-500">{unit}</p>
                </div>
              ))}
            </div>

            {/* Step-by-step */}
            <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-400 space-y-1">
              <p className="text-slate-300 font-sans font-medium text-xs uppercase tracking-wider mb-2">Step-by-step</p>
              <p>BA = Angle × (π/180) × (R + K × T)</p>
              <p>BA = {angleNum} × (π/180) × ({radiusNum} + {kNum} × {thicknessNum})</p>
              <p className="text-[#38bdf8]">BA = {BA.toFixed(4)} in</p>
              <p className="mt-2">SB = tan(Angle/2) × (R + T)</p>
              <p>SB = tan({(angleNum / 2).toFixed(1)}°) × ({radiusNum} + {thicknessNum})</p>
              <p className="text-[#38bdf8]">SB = {SB.toFixed(4)} in</p>
              {FL !== null && (
                <>
                  <p className="mt-2">Flat Blank = L1 + L2 + BA - 2×SB</p>
                  <p>Flat Blank = {leg1Num} + {leg2Num} + {BA.toFixed(4)} - 2×{SB.toFixed(4)}</p>
                  <p className="text-[#38bdf8]">Flat Blank = {FL.toFixed(4)} in</p>
                </>
              )}
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
