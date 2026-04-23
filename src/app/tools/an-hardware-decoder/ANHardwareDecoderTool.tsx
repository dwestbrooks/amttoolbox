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

const AN_BOLT_DIAMETERS: Record<number, { diameter: string; threads: string }> = {
  3: { diameter: '3/16"', threads: '10-32' },
  4: { diameter: '1/4"', threads: '1/4-28' },
  5: { diameter: '5/16"', threads: '5/16-24' },
  6: { diameter: '3/8"', threads: '3/8-24' },
  7: { diameter: '7/16"', threads: '7/16-20' },
  8: { diameter: '1/2"', threads: '1/2-20' },
  9: { diameter: '9/16"', threads: '9/16-18' },
  10: { diameter: '5/8"', threads: '5/8-18' },
  12: { diameter: '3/4"', threads: '3/4-16' },
  14: { diameter: '7/8"', threads: '7/8-14' },
  16: { diameter: '1"', threads: '1-14' },
  20: { diameter: '1-1/4"', threads: '1-1/4-12' },
}

const AN_NUT_TYPES: Record<number, { type: string; description: string; tip: string }> = {
  310: { type: 'Castle Nut', description: 'Hex castle nut (castellated) for use with cotter pin safety. Standard AN bolt and stud applications.', tip: 'Used with AN380 cotter pins for safety wiring on critical fasteners.' },
  315: { type: 'Plain Hex Nut (Right Hand)', description: 'Standard plain hex nut, right-hand thread. Used where self-locking is not required.', tip: 'Always safety with cotter pin or wire when used in vibration-prone areas.' },
  316: { type: 'Plain Hex Nut (Left Hand)', description: 'Standard plain hex nut with left-hand thread. Used on rotating shafts to prevent loosening.', tip: 'Left-hand thread nuts tighten in the direction of shaft rotation.' },
  320: { type: 'Wing Nut', description: 'Wing nut for hand-tightening applications. Not for structural or critical applications.', tip: 'Wing nuts should never be used on critical flight hardware.' },
  362: { type: 'Self-Locking Hex Nut (Thin)', description: 'Thin self-locking nut with all-metal prevailing torque feature. For temperatures up to 250°F.', tip: 'AN362 is the thin version of the self-locking nut. Do not reuse after torque removal.' },
  364: { type: 'Self-Locking Hex Nut', description: 'Standard self-locking hex nut with fiber insert. Not for use above 250°F or at high RPM.', tip: 'Fiber insert is destroyed at high temperatures. Use AN363 or MS21042 for high-temp applications.' },
  365: { type: 'Self-Locking Hex Nut (Standard)', description: 'All-metal prevailing torque self-locking nut. Preferred for elevated temperature applications.', tip: 'AN365 is the standard all-metal self-locking nut used throughout aviation maintenance.' },
  366: { type: 'Self-Locking Hex Nut (Light)', description: 'Light self-locking nut. Designed for lighter duty applications where weight is a concern.', tip: 'Verify load requirements before substituting AN366 for AN365.' },
}

const AN_WASHER_TYPES: Record<number, { type: string; description: string; tip: string }> = {
  960: { type: 'Flat Washer', description: 'Standard flat washer. Used to distribute load and protect the work surface from fastener damage.', tip: 'Always place the chamfered face (if present) toward the bolt head or nut.' },
  970: { type: 'Large Area Flat Washer', description: 'Large area flat washer for use in soft materials. Distributes load over a greater area.', tip: 'Use AN970 when bearing on wood, fiberglass, or other soft material where AN960 would embed.' },
}

function decodePartNumber(input: string): DecodeResult {
  const raw = input.toUpperCase().trim()

  if (!raw) {
    return { segments: [], description: '', details: [], error: 'Enter a part number above.' }
  }

  // --- AN BOLTS: AN3 through AN20 ---
  const boltMatch = raw.match(/^AN(3|4|5|6|7|8|9|10|12|14|16|20)(-\d+)?(A)?$/)
  if (boltMatch) {
    const diamCode = parseInt(boltMatch[1])
    const lengthCode = boltMatch[2] ? parseInt(boltMatch[2].replace('-', '')) : null
    const noHoleFlag = boltMatch[3] === 'A'
    const boltInfo = AN_BOLT_DIAMETERS[diamCode]

    const lengthInches = lengthCode !== null ? (lengthCode / 8).toFixed(4) : null
    const lengthFraction = lengthCode !== null ? `${lengthCode}/8"` : null

    const segments: Segment[] = [
      { text: 'AN', label: 'Series', color: 'bg-blue-900/60 text-blue-200 border border-blue-700/50' },
      { text: boltMatch[1], label: 'Diameter Code', color: 'bg-sky-900/60 text-sky-200 border border-sky-700/50' },
    ]
    if (boltMatch[2]) {
      segments.push({ text: boltMatch[2], label: 'Length (1/8" units)', color: 'bg-violet-900/60 text-violet-200 border border-violet-700/50' })
    }
    if (noHoleFlag) {
      segments.push({ text: 'A', label: 'No Drilled Head', color: 'bg-orange-900/60 text-orange-200 border border-orange-700/50' })
    }

    const details: { property: string; value: string }[] = [
      { property: 'Series', value: 'AN (Air Force-Navy) Bolt' },
      { property: 'Diameter Code', value: diamCode.toString() },
      { property: 'Diameter', value: boltInfo?.diameter ?? 'Unknown' },
      { property: 'Thread', value: boltInfo?.threads ?? 'Unknown' },
    ]

    if (lengthInches !== null) {
      details.push({ property: 'Length Code', value: lengthCode!.toString() })
      details.push({ property: 'Length', value: `${lengthFraction} (${parseFloat(lengthInches).toFixed(3)}")` })
    }
    details.push({ property: 'Drilled Head', value: noHoleFlag ? 'No (smooth head)' : 'Yes (for safety wire)' })

    const desc = `AN${diamCode} hex head bolt${boltInfo ? `, ${boltInfo.diameter} diameter, ${boltInfo.threads} thread` : ''}${lengthInches ? `, ${lengthFraction} long` : ''}${noHoleFlag ? ', no drilled head' : ', drilled head for safety wire'}.`

    return {
      segments,
      description: desc,
      details,
      tip: `AN bolts are specified by diameter code (dash number = size in 16ths of an inch for diameter, length in 1/8" increments). Always verify grip length matches the material stack thickness.`,
    }
  }

  // --- AN NUTS ---
  const nutMatch = raw.match(/^AN(310|315|316|320|362|364|365|366)(-\d+)?([DR])?$/)
  if (nutMatch) {
    const nutCode = parseInt(nutMatch[1])
    const sizeCode = nutMatch[2]
    const handCode = nutMatch[3]
    const nutInfo = AN_NUT_TYPES[nutCode]

    const segments: Segment[] = [
      { text: 'AN', label: 'Series', color: 'bg-blue-900/60 text-blue-200 border border-blue-700/50' },
      { text: nutMatch[1], label: 'Nut Type Code', color: 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/50' },
    ]
    if (sizeCode) {
      segments.push({ text: sizeCode, label: 'Size', color: 'bg-violet-900/60 text-violet-200 border border-violet-700/50' })
    }
    if (handCode) {
      segments.push({ text: handCode, label: handCode === 'R' ? 'Right Hand' : 'Left Hand', color: 'bg-orange-900/60 text-orange-200 border border-orange-700/50' })
    }

    const details: { property: string; value: string }[] = [
      { property: 'Series', value: 'AN (Air Force-Navy) Nut' },
      { property: 'Type Code', value: nutMatch[1] },
      { property: 'Type', value: nutInfo?.type ?? 'Unknown' },
    ]
    if (sizeCode) {
      details.push({ property: 'Size Code', value: sizeCode })
    }
    if (handCode) {
      details.push({ property: 'Thread Hand', value: handCode === 'R' ? 'Right-hand (standard)' : 'Left-hand' })
    }

    return {
      segments,
      description: nutInfo?.description ?? `AN${nutCode} nut.`,
      details,
      tip: nutInfo?.tip,
    }
  }

  // --- AN WASHERS ---
  const washerMatch = raw.match(/^AN(960|970)([A-Z]?\d+)?([LD])?$/)
  if (washerMatch) {
    const washerCode = parseInt(washerMatch[1])
    const sizeCode = washerMatch[2]
    const thicknessCode = washerMatch[3]
    const washerInfo = AN_WASHER_TYPES[washerCode]

    const segments: Segment[] = [
      { text: 'AN', label: 'Series', color: 'bg-blue-900/60 text-blue-200 border border-blue-700/50' },
      { text: washerMatch[1], label: 'Washer Type', color: 'bg-teal-900/60 text-teal-200 border border-teal-700/50' },
    ]
    if (sizeCode) {
      segments.push({ text: sizeCode, label: 'Size', color: 'bg-violet-900/60 text-violet-200 border border-violet-700/50' })
    }
    if (thicknessCode) {
      segments.push({ text: thicknessCode, label: thicknessCode === 'L' ? 'Light' : 'Detail', color: 'bg-orange-900/60 text-orange-200 border border-orange-700/50' })
    }

    const details: { property: string; value: string }[] = [
      { property: 'Series', value: 'AN (Air Force-Navy) Washer' },
      { property: 'Type', value: washerInfo?.type ?? 'Unknown' },
    ]
    if (sizeCode) {
      details.push({ property: 'Size Code', value: sizeCode })
    }
    if (thicknessCode) {
      details.push({ property: 'Thickness Variant', value: thicknessCode === 'L' ? 'Light' : thicknessCode })
    }

    return {
      segments,
      description: washerInfo?.description ?? `AN${washerCode} washer.`,
      details,
      tip: washerInfo?.tip,
    }
  }

  // --- AN COTTER PINS ---
  const cotterMatch = raw.match(/^AN380-(\d+)(-\d+)?$/)
  if (cotterMatch) {
    const diamCode = parseInt(cotterMatch[1])
    const lengthCode = cotterMatch[2] ? parseInt(cotterMatch[2].replace('-', '')) : null

    const diamInches = diamCode / 32
    const lengthInches = lengthCode !== null ? lengthCode / 4 : null

    const segments: Segment[] = [
      { text: 'AN', label: 'Series', color: 'bg-blue-900/60 text-blue-200 border border-blue-700/50' },
      { text: '380', label: 'Cotter Pin', color: 'bg-rose-900/60 text-rose-200 border border-rose-700/50' },
      { text: `-${cotterMatch[1]}`, label: 'Diameter (1/32" units)', color: 'bg-violet-900/60 text-violet-200 border border-violet-700/50' },
    ]
    if (cotterMatch[2]) {
      segments.push({ text: cotterMatch[2], label: 'Length (1/4" units)', color: 'bg-sky-900/60 text-sky-200 border border-sky-700/50' })
    }

    const details: { property: string; value: string }[] = [
      { property: 'Series', value: 'AN380 Cotter Pin' },
      { property: 'Diameter Code', value: cotterMatch[1] },
      { property: 'Diameter', value: `${cotterMatch[1]}/32" (${diamInches.toFixed(4)}")` },
    ]
    if (lengthInches !== null) {
      details.push({ property: 'Length Code', value: cotterMatch[2]!.replace('-', '') })
      details.push({ property: 'Length', value: `${lengthCode}/4" (${lengthInches.toFixed(4)}")` })
    }

    return {
      segments,
      description: `AN380 cotter pin, ${cotterMatch[1]}/32" diameter${lengthInches !== null ? `, ${lengthCode}/4" long` : ''}.`,
      details,
      tip: 'Always install a new cotter pin — never reuse. Bend one leg over the bolt end and the other along the shank. Trim excess to prevent snagging.',
    }
  }

  // Unknown
  return {
    segments: [{ text: raw, label: 'Unknown', color: 'bg-red-900/60 text-red-200 border border-red-700/50' }],
    description: '',
    details: [],
    error: `"${raw}" could not be decoded. Supported prefixes: AN3–AN20 (bolts), AN310–AN366 (nuts), AN960/AN970 (washers), AN380 (cotter pins).`,
  }
}

const AN_REFERENCE = [
  { code: 'AN3–AN20', type: 'Hex Head Bolt', notes: 'Diameter code = bolt dash size. Length in 1/8" increments.' },
  { code: 'AN310', type: 'Castle Nut', notes: 'For use with cotter pin (AN380). Castellated hex nut.' },
  { code: 'AN315', type: 'Plain Hex Nut (RH)', notes: 'Standard right-hand thread plain nut.' },
  { code: 'AN316', type: 'Plain Hex Nut (LH)', notes: 'Left-hand thread. Used on rotating shafts.' },
  { code: 'AN320', type: 'Wing Nut', notes: 'Hand-tightening only. Non-structural.' },
  { code: 'AN362', type: 'Self-Locking Nut (Thin)', notes: 'Thin all-metal prevailing torque nut.' },
  { code: 'AN364', type: 'Self-Locking Nut', notes: 'Fiber insert. Max 250°F. Do not reuse.' },
  { code: 'AN365', type: 'Self-Locking Nut', notes: 'Standard all-metal. Preferred for elevated temps.' },
  { code: 'AN366', type: 'Self-Locking Nut (Light)', notes: 'Lightweight variant. Verify load capacity.' },
  { code: 'AN380', type: 'Cotter Pin', notes: 'Diameter in 1/32", length in 1/4". Always use new.' },
  { code: 'AN960', type: 'Flat Washer', notes: 'Standard flat washer for bolt/nut applications.' },
  { code: 'AN970', type: 'Large Area Washer', notes: 'For soft materials. Greater load distribution.' },
]

export default function ANHardwareDecoderTool() {
  const [input, setInput] = useState('')
  const result = decodePartNumber(input)

  return (
    <ToolLayout
      title="AN Hardware Decoder"
      description="Enter an AN part number to decode its meaning — bolt size, nut type, washer spec, or cotter pin dimensions."
    >
      {/* Input */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-slate-400 mb-2">Part Number</label>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. AN4-10A, AN365-428, AN960-416"
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors font-mono"
          autoCapitalize="characters"
          spellCheck={false}
        />
        <p className="text-xs text-slate-500 mt-2">Case-insensitive. Try: AN4-10A, AN310-428, AN380-2-2, AN960-416</p>
      </div>

      {input && (
        <>
          {/* Segment display */}
          {result.segments.length > 0 && (
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 mb-6">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Decoded Segments</h2>
              <div className="flex flex-wrap gap-3 mb-4">
                {result.segments.map((seg, i) => (
                  <div key={i} className="text-center">
                    <div className={`px-4 py-2 rounded-lg font-mono font-bold text-lg ${seg.color}`}>
                      {seg.text}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 max-w-[100px] leading-tight">{seg.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {result.error && (
            <div className="bg-red-950/40 border border-red-700/50 rounded-xl p-4 mb-6">
              <p className="text-red-300 text-sm">{result.error}</p>
            </div>
          )}

          {/* Description */}
          {result.description && (
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 mb-6">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Plain English</h2>
              <p className="text-white text-base leading-relaxed">{result.description}</p>
            </div>
          )}

          {/* Details table */}
          {result.details.length > 0 && (
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 mb-6">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Decoded Properties</h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-800">
                  {result.details.map((d, i) => (
                    <tr key={i}>
                      <td className="py-2.5 pr-6 text-slate-400 w-40 font-medium">{d.property}</td>
                      <td className="py-2.5 text-white font-mono">{d.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tip */}
          {result.tip && (
            <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-5 mb-6">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Did You Know?</p>
              <p className="text-amber-200/80 text-sm leading-relaxed">{result.tip}</p>
            </div>
          )}
        </>
      )}

      {/* Reference table */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-1">Common AN Hardware Reference</h2>
        <p className="text-xs text-slate-500 mb-4">Quick reference for AN series part number prefixes</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th className="pb-2 pr-6">Code</th>
                <th className="pb-2 pr-6">Type</th>
                <th className="pb-2 hidden sm:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {AN_REFERENCE.map(row => (
                <tr
                  key={row.code}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (!row.code.includes('–')) setInput(row.code)
                  }}
                >
                  <td className="py-2.5 pr-6 font-mono font-medium text-[#38bdf8]">{row.code}</td>
                  <td className="py-2.5 pr-6 text-white">{row.type}</td>
                  <td className="py-2.5 text-slate-400 hidden sm:table-cell">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  )
}
