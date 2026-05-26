'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

interface Segment {
  text: string
  label: string
  color: string
}

interface DecodeResult {
  segments: Segment[]
  description: string
  details: { property: string; value: string }[]
  tip?: string
  error?: string
}

// Material codes for solid rivets
const RIVET_MATERIALS: Record<string, { alloy: string; strength: string; color: string }> = {
  AD: { alloy: '2117-T3', strength: '26,000 psi shear', color: 'Most common; soft, easy to drive. Default choice for skin repairs.' },
  D:  { alloy: '2017-T3', strength: '34,000 psi shear', color: 'Must be driven within 1 hour of quench or refrigerated.' },
  DD: { alloy: '2024-T3', strength: '41,000 psi shear', color: 'Hardest aluminum rivet; must be kept iced (ice box rivets).' },
  A:  { alloy: '1100',    strength: '~9,500 psi shear', color: 'Soft, pure aluminum. Used in non-structural applications.' },
  B:  { alloy: '5056',    strength: '28,000 psi shear', color: 'Used with magnesium structures to prevent galvanic corrosion.' },
}

// MS21042 / MS21043 nut thread dash codes (partial list)
const NUT_THREADS: Record<number, string> = {
  3: '#10-32',
  4: '1/4-28',
  5: '5/16-24',
  6: '3/8-24',
  7: '7/16-20',
  8: '1/2-20',
  10: '5/8-18',
}

// MS35206 / MS35207 screw dash codes → thread size
const SCREW_THREADS: Record<number, string> = {
  1: '#0-80',
  2: '#1-72',
  3: '#2-56',
  4: '#3-48',
  5: '#4-40',
  6: '#6-32',
  7: '#8-32',
  8: '#10-24',
  9: '#10-32',
  10: '1/4-20',
  11: '1/4-28',
}

function decodeMS(raw: string): DecodeResult {
  if (!raw) return { segments: [], description: '', details: [], error: 'Enter an MS part number above.' }

  const input = raw.toUpperCase().trim().replace(/\s+/g, '')

  // ---- MS20470 / MS20426 Solid Rivets ----
  const rivetMatch = input.match(/^MS(20470|20426)([A-Z]{1,2})(\d+)-(\d+)$/)
  if (rivetMatch) {
    const pn = rivetMatch[1]
    const matCode = rivetMatch[2]
    const dCode = parseInt(rivetMatch[3])
    const lCode = parseInt(rivetMatch[4])
    const headType = pn === '20470' ? 'Universal (Round) Head' : '100° Countersunk Head'
    const diameter = `${dCode}/32" (${(dCode / 32).toFixed(4)}")`
    const length = `${lCode}/16" (${(lCode / 16).toFixed(4)}")`
    const mat = RIVET_MATERIALS[matCode]

    const segments: Segment[] = [
      { text: 'MS', label: 'Military Standard', color: 'bg-blue-900/60 text-blue-200 border border-blue-700/50' },
      { text: pn, label: pn === '20470' ? 'Universal Head Rivet' : 'Countersunk Rivet', color: 'bg-sky-900/60 text-sky-200 border border-sky-700/50' },
      { text: matCode, label: 'Material Code', color: 'bg-violet-900/60 text-violet-200 border border-violet-700/50' },
      { text: rivetMatch[3], label: 'Diameter (32nds inch)', color: 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/50' },
      { text: `-${lCode}`, label: 'Length (16ths inch)', color: 'bg-orange-900/60 text-orange-200 border border-orange-700/50' },
    ]

    const details: DecodeResult['details'] = [
      { property: 'Head Style', value: headType },
      { property: 'Material Code', value: matCode },
      { property: 'Alloy', value: mat ? mat.alloy : 'Unknown material code' },
      { property: 'Shear Strength', value: mat ? mat.strength : '--' },
      { property: 'Nominal Diameter', value: diameter },
      { property: 'Grip Length', value: length },
    ]

    return {
      segments,
      description: `MS${pn} ${headType} aluminum rivet.`,
      details,
      tip: mat ? mat.color : undefined,
    }
  }

  // ---- MS21042 / MS21043 Self-Locking Nuts ----
  const nutMatch = input.match(/^MS(21042|21043)-(\d+)$/)
  if (nutMatch) {
    const pn = nutMatch[1]
    const dashNum = parseInt(nutMatch[2])
    const nutType = pn === '21042' ? 'Self-Locking Nut (Thin, All-Metal)' : 'Self-Locking Nut (Standard, All-Metal)'
    const thread = NUT_THREADS[dashNum] || `Unknown (dash ${dashNum})`

    const segments: Segment[] = [
      { text: 'MS', label: 'Military Standard', color: 'bg-blue-900/60 text-blue-200 border border-blue-700/50' },
      { text: pn, label: nutType, color: 'bg-sky-900/60 text-sky-200 border border-sky-700/50' },
      { text: `-${dashNum}`, label: 'Thread Size Code', color: 'bg-violet-900/60 text-violet-200 border border-violet-700/50' },
    ]

    return {
      segments,
      description: `${nutType}. All-metal prevailing torque design. Rated for high-temperature applications where nylon-insert nuts are prohibited.`,
      details: [
        { property: 'Type', value: nutType },
        { property: 'Thread Size', value: thread },
        { property: 'Locking Method', value: 'All-metal deformed thread (no nylon insert)' },
        { property: 'Temp Rating', value: pn === '21042' ? 'Up to 450°F (232°C)' : 'Up to 450°F (232°C)' },
      ],
      tip: 'All-metal self-locking nuts may be reused provided locking torque is still within spec. Replace if prevailing torque drops below minimum.',
    }
  }

  // ---- MS24665 Cotter Pins ----
  const cotterMatch = input.match(/^MS24665-(\d+)$/)
  if (cotterMatch) {
    const dashNum = parseInt(cotterMatch[1])
    // Approximate size mapping (partial, common sizes)
    const COTTER_SIZES: Record<number, { dia: string; len: string }> = {
      132: { dia: '1/32"', len: '1/2"' },
      156: { dia: '1/16"', len: '5/8"' },
      208: { dia: '1/16"', len: '1"' },
      283: { dia: '3/32"', len: '1"' },
      354: { dia: '1/8"', len: '1"' },
      428: { dia: '1/8"', len: '1-1/2"' },
    }
    const sizeInfo = COTTER_SIZES[dashNum]

    const segments: Segment[] = [
      { text: 'MS', label: 'Military Standard', color: 'bg-blue-900/60 text-blue-200 border border-blue-700/50' },
      { text: '24665', label: 'Cotter Pin', color: 'bg-sky-900/60 text-sky-200 border border-sky-700/50' },
      { text: `-${dashNum}`, label: 'Size Code', color: 'bg-violet-900/60 text-violet-200 border border-violet-700/50' },
    ]

    return {
      segments,
      description: 'MS24665 Cotter Pin — used for safetying castellated nuts (AN310) on aircraft hardware.',
      details: [
        { property: 'Type', value: 'Cotter Pin (Safety Pin)' },
        { property: 'Dash Number', value: String(dashNum) },
        ...(sizeInfo ? [
          { property: 'Diameter', value: sizeInfo.dia },
          { property: 'Length', value: sizeInfo.len },
        ] : [{ property: 'Size', value: `Refer to MS24665 dash ${dashNum} table` }]),
        { property: 'Material', value: 'Low-carbon steel or corrosion-resistant steel' },
      ],
      tip: 'Install cotter pin through castle nut slot and bolt hole. Bend one leg over bolt end, other leg flat against nut. Never reuse cotter pins.',
    }
  }

  // ---- MS35206 / MS35207 Machine Screws ----
  const screwMatch = input.match(/^MS(35206|35207)-(\d+)(\d{3})$/)
  // Try alternate format: MS35206-7XX
  const screwMatch2 = input.match(/^MS(35206|35207)-(\d{1,2})(\d{2,3})$/)
  const sm = screwMatch || screwMatch2
  if (sm) {
    const pn = sm[1]
    const threadCode = parseInt(sm[2])
    const lengthCode = parseInt(sm[3])
    const headStyle = pn === '35206' ? 'Phillips Pan Head' : 'Phillips Flat Head (100°)'
    const thread = SCREW_THREADS[threadCode] || `Thread code ${threadCode}`
    const lengthIn = (lengthCode / 100).toFixed(2)

    const segments: Segment[] = [
      { text: 'MS', label: 'Military Standard', color: 'bg-blue-900/60 text-blue-200 border border-blue-700/50' },
      { text: pn, label: headStyle, color: 'bg-sky-900/60 text-sky-200 border border-sky-700/50' },
      { text: `-${sm[2]}`, label: 'Thread Size Code', color: 'bg-violet-900/60 text-violet-200 border border-violet-700/50' },
      { text: sm[3], label: 'Length (hundredths inch)', color: 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/50' },
    ]

    return {
      segments,
      description: `${headStyle} machine screw. Stainless steel or cadmium-plated steel.`,
      details: [
        { property: 'Head Style', value: headStyle },
        { property: 'Drive', value: 'Phillips (No. 2)' },
        { property: 'Thread', value: thread },
        { property: 'Length', value: `${lengthIn}" (${lengthCode}/100)` },
        { property: 'Material', value: 'CRES or cadmium-plated alloy steel' },
      ],
      tip: 'MS35206/35207 screws are commonly used with MS35333 flat washers and MS21042/MS21043 self-locking nuts in non-structural airframe applications.',
    }
  }

  // ---- MS35333 / MS35335 Washers ----
  const washerMatch = input.match(/^MS(35333|35335)-(\d+)$/)
  if (washerMatch) {
    const pn = washerMatch[1]
    const dashNum = parseInt(washerMatch[2])
    const washerType = pn === '35333' ? 'Flat Washer' : 'Lock Washer (Split)'

    const segments: Segment[] = [
      { text: 'MS', label: 'Military Standard', color: 'bg-blue-900/60 text-blue-200 border border-blue-700/50' },
      { text: pn, label: washerType, color: 'bg-sky-900/60 text-sky-200 border border-sky-700/50' },
      { text: `-${dashNum}`, label: 'Size Code', color: 'bg-violet-900/60 text-violet-200 border border-violet-700/50' },
    ]

    return {
      segments,
      description: `${washerType}. Used in standard airframe fastening applications.`,
      details: [
        { property: 'Type', value: washerType },
        { property: 'Dash Number', value: String(dashNum) },
        { property: 'Material', value: 'Low-carbon steel, cadmium-plated' },
        { property: 'Use', value: pn === '35333' ? 'Load distribution, surface protection' : 'Vibration-resistant fastening (limited aircraft use)' },
      ],
      tip: pn === '35335'
        ? 'Split lock washers are rarely approved in aircraft applications — verify via SRM or manufacturer approval before use.'
        : 'MS35333 flat washers are used to distribute clamp load and protect soft surfaces.',
    }
  }

  // ---- MS51957 Tinnerman Nuts ----
  const tinnermanMatch = input.match(/^MS51957-(\d+)$/)
  if (tinnermanMatch) {
    const dashNum = parseInt(tinnermanMatch[1])

    const segments: Segment[] = [
      { text: 'MS', label: 'Military Standard', color: 'bg-blue-900/60 text-blue-200 border border-blue-700/50' },
      { text: '51957', label: 'Tinnerman / Speed Nut', color: 'bg-sky-900/60 text-sky-200 border border-sky-700/50' },
      { text: `-${dashNum}`, label: 'Size / Configuration Code', color: 'bg-violet-900/60 text-violet-200 border border-violet-700/50' },
    ]

    return {
      segments,
      description: 'MS51957 Tinnerman nut (speed nut / clip nut). Stamped sheet-metal spring nut for rapid installation, typically used in interior panels and non-structural access covers.',
      details: [
        { property: 'Type', value: 'Tinnerman / Speed Nut (clip nut)' },
        { property: 'Dash Number', value: String(dashNum) },
        { property: 'Material', value: 'Spring steel, cadmium plated or passivated' },
        { property: 'Installation', value: 'Clips onto channel, stud, or bracket — no wrench needed' },
        { property: 'Application', value: 'Interior panels, fairings, access doors, non-structural covers' },
      ],
      tip: 'Tinnerman nuts are NOT approved for structural primary fastening. Confirm serviceability limits in the aircraft\'s SRM.',
    }
  }

  // No match
  return {
    segments: [],
    description: '',
    details: [],
    error: `"${raw}" does not match a recognized MS part family. Supported: MS20470, MS20426, MS21042, MS21043, MS24665, MS35206, MS35207, MS35333, MS35335, MS51957.`,
  }
}

const EXAMPLES = [
  'MS20470AD4-6',
  'MS20426DD5-8',
  'MS21042-4',
  'MS21043-6',
  'MS24665-283',
  'MS35206-7100',
  'MS35333-10',
  'MS51957-25',
]

export default function MSHardwareTool() {
  const [input, setInput] = useState('')
  const decoded = decodeMS(input)

  return (
    <ToolLayout
      title="MS Hardware Decoder"
      description="Decode MS (Military Standard) aircraft hardware part numbers. Supports solid rivets, self-locking nuts, cotter pins, machine screws, washers, and tinnerman nuts."
      relatedTools={[
        { name: 'AN Hardware Decoder', href: '/tools/an-hardware-decoder', description: 'Decode AN bolts, nuts, washers, and cotter pins.' },
        { name: 'Rivet Size Calculator', href: '/tools/rivet-size-calculator', description: 'Calculate rivet diameter, edge distance, and grip length.' },
      ]}
    >
      {/* Input */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
        <label className="block text-sm text-slate-400 mb-2">MS Part Number</label>
        <input
          type="text"
          placeholder="e.g. MS20470AD4-6"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors font-mono text-lg tracking-widest uppercase"
          spellCheck={false}
          autoCapitalize="characters"
        />
        <p className="text-xs text-slate-500 mt-2">Type or paste a part number. It decodes live as you type.</p>

        {/* Quick examples */}
        <div className="mt-4">
          <p className="text-xs text-slate-500 mb-2">Quick examples:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map(ex => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                className="px-3 py-1.5 bg-[#0f172a] border border-slate-700 hover:border-[#38bdf8]/50 rounded-md text-xs font-mono text-slate-300 hover:text-white transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Decode result */}
      {decoded.error && input ? (
        <div className="bg-red-950/40 border border-red-700/40 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-300">{decoded.error}</p>
        </div>
      ) : decoded.segments.length > 0 && (
        <>
          {/* Segment breakdown */}
          <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Part Number Breakdown</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {decoded.segments.map((seg, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className={`font-mono font-bold text-lg px-3 py-1.5 rounded-lg border ${seg.color}`}>
                    {seg.text}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 text-center max-w-[90px]">{seg.label}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-300 text-sm">{decoded.description}</p>
          </div>

          {/* Details table */}
          <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Decoded Properties</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {decoded.details.map((row, i) => (
                    <tr key={i} className="border-b border-slate-800 last:border-b-0">
                      <td className="py-2.5 pr-4 text-slate-400 font-medium w-40">{row.property}</td>
                      <td className="py-2.5 text-[#38bdf8] font-mono">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {decoded.tip && (
              <div className="mt-4 bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3">
                <p className="text-xs text-slate-400"><span className="text-[#38bdf8] font-medium">Note: </span>{decoded.tip}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Supported families reference */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Supported MS Part Families</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium py-2 pr-4">Part Family</th>
                <th className="text-left text-slate-400 font-medium py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['MS20470', 'Universal (round) head solid rivet'],
                ['MS20426', '100° countersunk head solid rivet'],
                ['MS21042', 'Self-locking nut, thin, all-metal'],
                ['MS21043', 'Self-locking nut, standard, all-metal'],
                ['MS24665', 'Cotter pin (safety pin)'],
                ['MS35206', 'Phillips pan head machine screw'],
                ['MS35207', 'Phillips flat head machine screw'],
                ['MS35333', 'Flat washer'],
                ['MS35335', 'Lock washer (split)'],
                ['MS51957', 'Tinnerman / speed nut'],
              ].map(([pn, desc], i) => (
                <tr key={i} className="border-b border-slate-800 last:border-b-0">
                  <td className="py-2.5 pr-4 font-mono text-[#38bdf8]">{pn}</td>
                  <td className="py-2.5 text-slate-300">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  )
}
