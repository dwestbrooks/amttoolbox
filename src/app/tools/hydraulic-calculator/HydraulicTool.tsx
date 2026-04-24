'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'
import { ChevronDown, ChevronUp } from 'lucide-react'

type Mode = 'pressure' | 'force' | 'area'
type Units = 'imperial' | 'metric'

const PSI_TO_KPA = 6.89476
const LBF_TO_N = 4.44822
const IN2_TO_CM2 = 6.4516

const PRESSURE_SYSTEMS = [
  { system: 'Light GA aircraft (Cessna, Piper)', pressure: '1,000–1,500 PSI' },
  { system: 'Transport category commercial', pressure: '3,000 PSI' },
  { system: 'Military / modern commercial (787, A380)', pressure: '5,000 PSI' },
  { system: 'Ground support equipment', pressure: '1,500–3,000 PSI' },
]

const COMMON_EXAMPLES = [
  { label: 'Landing gear actuator', pressure: 3000, area: 4.5, force: 13500 },
  { label: 'Brake caliper piston', pressure: 1500, area: 0.785, force: 1178 },
  { label: 'Nose wheel steering', pressure: 1500, area: 2.0, force: 3000 },
]

export default function HydraulicTool() {
  const [mode, setMode] = useState<Mode>('pressure')
  const [units, setUnits] = useState<Units>('imperial')
  const [inputA, setInputA] = useState('')
  const [inputB, setInputB] = useState('')
  const [showExamples, setShowExamples] = useState(false)
  const [boreDiameter, setBoreDiameter] = useState('')

  const pUnit = units === 'imperial' ? 'PSI' : 'kPa'
  const fUnit = units === 'imperial' ? 'lbf' : 'N'
  const aUnit = units === 'imperial' ? 'in²' : 'cm²'

  function getLabels(): { labelA: string; labelB: string; labelResult: string } {
    if (mode === 'pressure') return { labelA: `Force (${fUnit})`, labelB: `Area (${aUnit})`, labelResult: `Pressure (${pUnit})` }
    if (mode === 'force') return { labelA: `Pressure (${pUnit})`, labelB: `Area (${aUnit})`, labelResult: `Force (${fUnit})` }
    return { labelA: `Force (${fUnit})`, labelB: `Pressure (${pUnit})`, labelResult: `Area (${aUnit})` }
  }

  function calculate(): number | null {
    const a = parseFloat(inputA)
    const b = parseFloat(inputB)
    if (isNaN(a) || isNaN(b) || b === 0) return null
    if (mode === 'pressure') return a / b  // P = F / A
    if (mode === 'force') return a * b     // F = P × A
    return a / b                            // A = F / P
  }

  const result = calculate()
  const { labelA, labelB, labelResult } = getLabels()

  function formatResult(val: number | null): string {
    if (val === null) return '--'
    return val.toFixed(2)
  }

  // Piston area from bore diameter
  const boreNum = parseFloat(boreDiameter)
  const computedArea = !isNaN(boreNum) && boreNum > 0 ? Math.PI * Math.pow(boreNum / 2, 2) : null

  function applyBoreArea() {
    if (computedArea === null) return
    const areaStr = computedArea.toFixed(4)
    if (mode === 'pressure' || mode === 'force') {
      setInputB(areaStr)
    } else {
      setInputA(areaStr)
    }
  }

  // Step-by-step formula
  const aNum = parseFloat(inputA)
  const bNum = parseFloat(inputB)
  const showFormula = result !== null && !isNaN(aNum) && !isNaN(bNum)

  function getFormulaLines(): string[] {
    if (!showFormula) return []
    if (mode === 'pressure') {
      return [
        `P = F / A`,
        `P = ${aNum} / ${bNum}`,
        `P = ${result!.toFixed(2)} ${pUnit}`,
      ]
    }
    if (mode === 'force') {
      return [
        `F = P × A`,
        `F = ${aNum} × ${bNum}`,
        `F = ${result!.toFixed(2)} ${fUnit}`,
      ]
    }
    return [
      `A = F / P`,
      `A = ${aNum} / ${bNum}`,
      `A = ${result!.toFixed(4)} ${aUnit}`,
    ]
  }

  function loadExample(ex: typeof COMMON_EXAMPLES[0]) {
    if (mode === 'pressure') {
      setInputA(String(ex.force))
      setInputB(String(ex.area))
    } else if (mode === 'force') {
      setInputA(String(ex.pressure))
      setInputB(String(ex.area))
    } else {
      setInputA(String(ex.force))
      setInputB(String(ex.pressure))
    }
  }

  return (
    <ToolLayout
      title="Hydraulic Pressure / Force / Area Calculator"
      description="Calculate hydraulic pressure, force, or area using Pascal's Law. Essential reference for aircraft hydraulic system troubleshooting."
      relatedTools={[
        { name: 'Torque Unit Converter', href: '/tools/torque-unit-converter', description: 'Convert between in-lb, ft-lb, N·m, and more.' },
      ]}
    >
      {/* Mode + Units */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-2">Solve For</p>
            <div className="flex gap-2">
              {(['pressure', 'force', 'area'] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setInputA(''); setInputB('') }}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    mode === m ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#0f172a] text-slate-300 border border-slate-600 hover:border-slate-400'
                  }`}
                >
                  {m}
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
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
            <label className="block text-sm text-slate-400 mb-1">{labelA}</label>
            <input
              type="number"
              step="any"
              placeholder="Enter value"
              value={inputA}
              onChange={e => setInputA(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">{labelB}</label>
            <input
              type="number"
              step="any"
              placeholder="Enter value"
              value={inputB}
              onChange={e => setInputB(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
            />
          </div>
        </div>

        {/* Bore diameter helper */}
        <div className="mt-4 bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3">
          <p className="text-xs text-slate-400 mb-2 font-medium">Calculate from diameter</p>
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs text-slate-500 mb-1">Piston/Cylinder Bore Diameter (in)</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 3.0"
                value={boreDiameter}
                onChange={e => setBoreDiameter(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors text-sm"
              />
            </div>
            <button
              onClick={applyBoreArea}
              disabled={computedArea === null}
              className="px-3 py-2 bg-[#38bdf8]/10 border border-[#38bdf8]/30 hover:bg-[#38bdf8]/20 text-[#38bdf8] rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              → Use Area
            </button>
          </div>
          {computedArea !== null && (
            <p className="text-xs text-[#38bdf8] mt-1.5">Ø {boreNum}&quot; bore = {computedArea.toFixed(4)} in²</p>
          )}
        </div>

        {/* Result */}
        <div className="mt-6 bg-[#0f172a] rounded-lg p-4 border border-[#38bdf8]/30">
          <p className="text-sm text-slate-400 mb-1">{labelResult}</p>
          <p className="text-4xl font-bold text-[#38bdf8]">
            {formatResult(result)} <span className="text-xl text-slate-400">{labelResult.match(/\(([^)]+)\)/)?.[1]}</span>
          </p>
          {result !== null && units === 'imperial' && mode === 'pressure' && (
            <p className="text-xs text-slate-500 mt-2">= {(result * PSI_TO_KPA).toFixed(2)} kPa</p>
          )}
          {result !== null && units === 'imperial' && mode === 'force' && (
            <p className="text-xs text-slate-500 mt-2">= {(result * LBF_TO_N).toFixed(2)} N</p>
          )}
          {result !== null && units === 'imperial' && mode === 'area' && (
            <p className="text-xs text-slate-500 mt-2">= {(result * IN2_TO_CM2).toFixed(2)} cm²</p>
          )}
          {/* Step-by-step formula */}
          {showFormula && (
            <div className="mt-3 pt-3 border-t border-slate-700 font-mono text-xs text-slate-400 bg-slate-800 rounded px-3 py-2 space-y-0.5">
              {getFormulaLines().map((line, i) => (
                <p key={i} className={i === getFormulaLines().length - 1 ? 'text-[#38bdf8]' : ''}>{line}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Pascal&apos;s Law Diagram</h3>
        <div className="flex justify-center">
          <svg viewBox="0 0 320 160" className="w-full max-w-sm" aria-label="Hydraulic cylinder diagram">
            <rect x="60" y="60" width="200" height="80" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            <rect x="140" y="62" width="10" height="76" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />
            <rect x="62" y="62" width="76" height="76" fill="#1e40af" fillOpacity="0.3" />
            <line x1="145" y1="20" x2="145" y2="58" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowBlue)" />
            <text x="155" y="38" fill="#38bdf8" fontSize="13" fontWeight="bold">F</text>
            <text x="138" y="107" fill="#94a3b8" fontSize="11" textAnchor="middle">A</text>
            <line x1="90" y1="100" x2="70" y2="100" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrowBlueSmall)" />
            <line x1="90" y1="90" x2="70" y2="78" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrowBlueSmall)" />
            <line x1="90" y1="110" x2="70" y2="122" stroke="#60a5fa" strokeWidth="1.5" markerEnd="url(#arrowBlueSmall)" />
            <text x="90" y="100" fill="#93c5fd" fontSize="11" fontWeight="bold">P</text>
            <text x="160" y="155" fill="#64748b" fontSize="10" textAnchor="middle">
              {result !== null
                ? `${mode === 'pressure' ? `P = ${result.toFixed(2)} ${pUnit}` : mode === 'force' ? `F = ${result.toFixed(2)} ${fUnit}` : `A = ${result.toFixed(4)} ${aUnit}`}`
                : 'Enter values to calculate'}
            </text>
            <defs>
              <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#38bdf8" />
              </marker>
              <marker id="arrowBlueSmall" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#60a5fa" />
              </marker>
            </defs>
          </svg>
        </div>
        <p className="text-center text-xs text-slate-500 mt-2">P = F / A &nbsp;·&nbsp; F = P × A &nbsp;·&nbsp; A = F / P</p>

        {/* Common Examples collapsible */}
        <div className="mt-4 border-t border-slate-700 pt-4">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            {showExamples ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Common Examples
          </button>
          {showExamples && (
            <div className="mt-3 space-y-2">
              {COMMON_EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => loadExample(ex)}
                  className="w-full text-left bg-[#0f172a] border border-slate-700 hover:border-[#38bdf8]/50 rounded-lg px-4 py-3 transition-colors group"
                >
                  <p className="text-sm font-medium text-slate-300 group-hover:text-white">{ex.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">
                    {ex.pressure.toLocaleString()} PSI × {ex.area} in² = {ex.force.toLocaleString()} lbf
                  </p>
                </button>
              ))}
              <p className="text-xs text-slate-500 mt-1">Click a row to fill calculator inputs</p>
            </div>
          )}
        </div>
      </div>

      {/* System Pressure Reference */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">System Pressure Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium py-2 pr-4">System</th>
                <th className="text-left text-slate-400 font-medium py-2">Typical Pressure</th>
              </tr>
            </thead>
            <tbody>
              {PRESSURE_SYSTEMS.map((row, i) => (
                <tr key={i} className="border-b border-slate-800">
                  <td className="py-2.5 pr-4 text-slate-300">{row.system}</td>
                  <td className="py-2.5 font-mono text-[#38bdf8]">{row.pressure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  )
}
