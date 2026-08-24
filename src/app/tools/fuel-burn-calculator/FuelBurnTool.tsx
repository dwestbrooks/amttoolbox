'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'

type Mode = 'endurance' | 'range' | 'fuel'
type Units = 'imperial' | 'metric'
type WindType = 'headwind' | 'tailwind'

const GA_AIRCRAFT = [
  { name: 'Cessna 172 Skyhawk', burn: 8, tas: 122 },
  { name: 'Cessna 182 Skylane', burn: 12, tas: 145 },
  { name: 'Piper Arrow PA-28R', burn: 10, tas: 140 },
  { name: 'Beechcraft Bonanza A36', burn: 14, tas: 176 },
  { name: 'King Air 90', burn: 100, tas: 270 },
]

export default function FuelBurnTool() {
  const [mode, setMode] = useState<Mode>('endurance')
  const [units, setUnits] = useState<Units>('imperial')
  const [fuelQty, setFuelQty] = useState('')
  const [burnRate, setBurnRate] = useState('')
  const [tas, setTas] = useState('')
  const [windSpeed, setWindSpeed] = useState('')
  const [windType, setWindType] = useState<WindType>('headwind')
  const [showRef, setShowRef] = useState(false)

  const GAL_TO_L = 3.78541
  const KT_TO_KMH = 1.85200

  // Convert inputs to imperial for calculation
  const fuelNum = parseFloat(fuelQty)
  const burnNum = parseFloat(burnRate)
  const tasNum = parseFloat(tas)
  const windNum = parseFloat(windSpeed) || 0

  // Convert metric inputs → imperial for calculation
  const fuelGal = units === 'metric' ? fuelNum / GAL_TO_L : fuelNum
  const burnGph = units === 'metric' ? burnNum / GAL_TO_L : burnNum
  const tasKt = units === 'metric' ? tasNum / KT_TO_KMH : tasNum
  const windKt = units === 'metric' ? windNum / KT_TO_KMH : windNum

  const gsKt = windType === 'headwind' ? tasKt - windKt : tasKt + windKt
  const gsDisplay = units === 'metric' ? (gsKt * KT_TO_KMH).toFixed(1) : gsKt.toFixed(1)
  const windDisplay = units === 'metric' ? (windKt * KT_TO_KMH).toFixed(1) : windKt.toFixed(1)
  const speedUnit = units === 'imperial' ? 'kt' : 'km/h'
  const volUnit = units === 'imperial' ? 'gal' : 'L'
  const flowUnit = units === 'imperial' ? 'gal/hr' : 'L/hr'

  interface CalcResult {
    value: number
    unit: string
    formulaLines: string[]
  }

  function calculate(): CalcResult | null {
    if (mode === 'endurance') {
      if (isNaN(fuelGal) || isNaN(burnGph) || burnGph <= 0) return null
      const hrs = fuelGal / burnGph
      const displayFuel = units === 'metric' ? (fuelGal * GAL_TO_L).toFixed(1) : fuelGal.toFixed(1)
      const displayBurn = units === 'metric' ? (burnGph * GAL_TO_L).toFixed(1) : burnGph.toFixed(1)
      return {
        value: hrs,
        unit: 'hr',
        formulaLines: [
          `Endurance = Fuel Qty ÷ Burn Rate`,
          `Endurance = ${displayFuel} ${volUnit} ÷ ${displayBurn} ${flowUnit}`,
          `Endurance = ${hrs.toFixed(2)} hr  (${Math.floor(hrs)}h ${Math.round((hrs % 1) * 60)}m)`,
        ],
      }
    }
    if (mode === 'range') {
      if (isNaN(fuelGal) || isNaN(burnGph) || burnGph <= 0 || isNaN(tasKt)) return null
      if (gsKt <= 0) return null
      const hrs = fuelGal / burnGph
      const rangeNm = hrs * gsKt
      const rangeDisplay = units === 'metric' ? rangeNm * KT_TO_KMH : rangeNm
      const rangeUnit = units === 'imperial' ? 'nm' : 'km'
      const displayFuel = units === 'metric' ? (fuelGal * GAL_TO_L).toFixed(1) : fuelGal.toFixed(1)
      const displayBurn = units === 'metric' ? (burnGph * GAL_TO_L).toFixed(1) : burnGph.toFixed(1)
      return {
        value: rangeDisplay,
        unit: rangeUnit,
        formulaLines: [
          `Endurance = ${displayFuel} ${volUnit} ÷ ${displayBurn} ${flowUnit} = ${hrs.toFixed(2)} hr`,
          `Range = Endurance × Ground Speed`,
          `Range = ${hrs.toFixed(2)} hr × ${gsDisplay} ${speedUnit}`,
          `Range = ${rangeDisplay.toFixed(1)} ${rangeUnit}`,
        ],
      }
    }
    // fuel required
    if (isNaN(burnGph) || burnGph <= 0 || isNaN(tasKt) || isNaN(fuelNum)) return null
    // In "fuel" mode fuelQty field is used as flight time (hours)
    const timeHrs = fuelNum  // user enters time in hours
    const fuelReqGal = burnGph * timeHrs
    const fuelReqDisplay = units === 'metric' ? fuelReqGal * GAL_TO_L : fuelReqGal
    const displayBurn = units === 'metric' ? (burnGph * GAL_TO_L).toFixed(1) : burnGph.toFixed(1)
    return {
      value: fuelReqDisplay,
      unit: volUnit,
      formulaLines: [
        `Fuel Required = Burn Rate × Flight Time`,
        `Fuel Required = ${displayBurn} ${flowUnit} × ${timeHrs} hr`,
        `Fuel Required = ${fuelReqDisplay.toFixed(2)} ${volUnit}`,
      ],
    }
  }

  const result = calculate()

  function getModeLabels() {
    if (mode === 'endurance') return { a: `Fuel Quantity (${volUnit})`, b: `Burn Rate (${flowUnit})`, c: null }
    if (mode === 'range') return { a: `Fuel Quantity (${volUnit})`, b: `Burn Rate (${flowUnit})`, c: `True Airspeed (${speedUnit})` }
    return { a: `Flight Time (hr)`, b: `Burn Rate (${flowUnit})`, c: `True Airspeed (${speedUnit})` }
  }

  const labels = getModeLabels()

  function loadAircraft(ac: typeof GA_AIRCRAFT[0]) {
    const burnDisplay = units === 'metric' ? (ac.burn * GAL_TO_L).toFixed(1) : String(ac.burn)
    const tasDisplay = units === 'metric' ? (ac.tas * KT_TO_KMH).toFixed(0) : String(ac.tas)
    setBurnRate(burnDisplay)
    setTas(tasDisplay)
  }

  return (
    <ToolLayout
      title="Fuel Burn / Endurance / Range Calculator"
      description="Calculate aircraft endurance, range, or fuel required. Supports wind correction, unit toggle, and FAA reserve rules."
      relatedTools={[
        { name: 'Weight & Balance Moment Calculator', href: '/tools/weight-balance-calculator', description: 'Calculate CG location for weight and balance.' },
        { name: 'Hydraulic Calculator', href: '/tools/hydraulic-calculator', description: "Pascal's Law pressure, force, area calculator." },
      ]}
    >
      {/* Mode + Units */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-2">Solve For</p>
            <div className="flex gap-2">
              {(['endurance', 'range', 'fuel'] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setFuelQty(''); setBurnRate(''); setTas('') }}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    mode === m ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#0f172a] text-slate-300 border border-slate-600 hover:border-slate-400'
                  }`}
                >
                  {m === 'fuel' ? 'Fuel Req.' : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-2">Units</p>
            <div className="flex gap-2">
              {(['imperial', 'metric'] as Units[]).map(u => (
                <button
                  key={u}
                  onClick={() => setUnits(u)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    units === u ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#0f172a] text-slate-300 border border-slate-600 hover:border-slate-400'
                  }`}
                >
                  {u === 'imperial' ? 'Imperial' : 'Metric'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">{labels.a}</label>
            <input
              type="number" step="any"
              placeholder={mode === 'fuel' ? 'e.g. 3.5' : 'e.g. 40'}
              value={fuelQty}
              onChange={e => setFuelQty(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">{labels.b}</label>
            <input
              type="number" step="any"
              placeholder="e.g. 8"
              value={burnRate}
              onChange={e => setBurnRate(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
          {labels.c && (
            <div>
              <label className="block text-sm text-slate-400 mb-1">{labels.c}</label>
              <input
                type="number" step="any"
                placeholder="e.g. 122"
                value={tas}
                onChange={e => setTas(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
              />
            </div>
          )}
        </div>

        {/* Wind input */}
        {(mode === 'range' || mode === 'fuel') && (
          <div className="mt-4 bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-400 mb-2 font-medium">Wind Component (optional)</p>
            <div className="flex gap-3 items-end flex-wrap">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs text-slate-500 mb-1">Wind Speed ({speedUnit})</label>
                <input
                  type="number" step="any"
                  placeholder="e.g. 15"
                  value={windSpeed}
                  onChange={e => setWindSpeed(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors text-sm"
                />
              </div>
              <div className="flex gap-2">
                {(['headwind', 'tailwind'] as WindType[]).map(wt => (
                  <button
                    key={wt}
                    onClick={() => setWindType(wt)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                      windType === wt ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-slate-800 text-slate-300 border border-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {wt}
                  </button>
                ))}
              </div>
            </div>
            {!isNaN(tasKt) && tasKt > 0 && (
              <p className="text-xs text-[#38bdf8] mt-1.5">
                TAS {tasDisplay(tasKt)} {speedUnit} {windType === 'headwind' ? '−' : '+'} {windDisplay} {speedUnit} → GS {gsDisplay} {speedUnit}
              </p>
            )}
          </div>
        )}

        {/* Result */}
        <div className="mt-6 bg-[#0f172a] rounded-lg p-4 border border-[#38bdf8]/30">
          <p className="text-sm text-slate-400 mb-1">
            {mode === 'endurance' ? 'Endurance' : mode === 'range' ? 'Range' : 'Fuel Required'}
          </p>
          <p className="text-4xl font-bold text-[#38bdf8]">
            {result ? (
              <>
                {mode === 'endurance'
                  ? `${Math.floor(result.value)}h ${Math.round((result.value % 1) * 60)}m`
                  : result.value.toFixed(1)}{' '}
                <span className="text-xl text-slate-400">{result.unit}</span>
              </>
            ) : '--'}
          </p>
          {result && (
            <div className="mt-3 pt-3 border-t border-slate-700 font-mono text-xs text-slate-400 bg-slate-800 rounded px-3 py-2 space-y-0.5">
              {result.formulaLines.map((line, i) => (
                <p key={i} className={i === result.formulaLines.length - 1 ? 'text-[#38bdf8]' : ''}>{line}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAA Reserve Note */}
      <div className="bg-amber-950/40 border border-amber-700/40 rounded-lg p-4 mb-6 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-300 mb-1">FAA Fuel Reserve Rules (14 CFR 91.151 / 91.167)</p>
          <ul className="text-xs text-amber-200/80 space-y-1">
            <li>• <span className="font-medium">Day VFR:</span> Enough fuel to reach destination + <span className="text-amber-300 font-semibold">30 minutes</span> at normal cruise power.</li>
            <li>• <span className="font-medium">Night VFR:</span> Enough fuel to reach destination + <span className="text-amber-300 font-semibold">45 minutes</span> at normal cruise power.</li>
            <li>• <span className="font-medium">IFR:</span> Fuel to destination + alternate (if required) + <span className="text-amber-300 font-semibold">45 minutes</span> at normal cruise power.</li>
          </ul>
        </div>
      </div>

      {/* Aircraft Reference Table */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6">
        <button
          onClick={() => setShowRef(!showRef)}
          className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors w-full text-left"
        >
          {showRef ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          Common GA Aircraft Reference
        </button>
        {showRef && (
          <div className="mt-4">
            <p className="text-xs text-slate-500 mb-3">Click a row to load burn rate and TAS into the calculator.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 font-medium py-2 pr-4">Aircraft</th>
                    <th className="text-left text-slate-400 font-medium py-2 pr-4">Typical Burn</th>
                    <th className="text-left text-slate-400 font-medium py-2">Typical TAS</th>
                  </tr>
                </thead>
                <tbody>
                  {GA_AIRCRAFT.map((ac, i) => {
                    const burnDisp = units === 'metric' ? (ac.burn * GAL_TO_L).toFixed(1) : ac.burn
                    const tasDisp = units === 'metric' ? (ac.tas * KT_TO_KMH).toFixed(0) : ac.tas
                    return (
                      <tr
                        key={i}
                        className="border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors group"
                        onClick={() => loadAircraft(ac)}
                      >
                        <td className="py-2.5 pr-4 text-slate-300 group-hover:text-white">{ac.name}</td>
                        <td className="py-2.5 pr-4 font-mono text-[#38bdf8]">~{burnDisp} {flowUnit}</td>
                        <td className="py-2.5 font-mono text-slate-400">~{tasDisp} {speedUnit}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

function tasDisplay(kt: number) {
  return kt.toFixed(1)
}
