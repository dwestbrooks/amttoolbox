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

// AN bolt GRIP length (inches), from the Pegasus Auto Racing AN Bolt Grip Length Chart.
// Column index = series: 0=AN3, 1=AN4, 2=AN5, 3=AN6, 4=AN7, 5=AN8. null = not made in that dash.
// NOTE: the dash number is NOT the length in eighths. The grip grows 1/8" per dash STEP, but
// the ladder skips numbers (-8, -9, -18, -19, -28, -29 ...), so dash/8 gives the wrong answer.
const AN_BOLT_GRIP: Record<number, (number | null)[]> = {
  3: [0.0625, 0.0625, null, null, null, null],
  4: [0.125, 0.0625, 0.0625, null, null, null],
  5: [0.25, 0.1875, 0.1875, 0.0625, 0.0625, null],
  6: [0.375, 0.3125, 0.3125, 0.1875, 0.1875, 0.0625],
  7: [0.5, 0.4375, 0.4375, 0.3125, 0.3125, 0.1875],
  10: [0.625, 0.5625, 0.5625, 0.4375, 0.4375, 0.3125],
  11: [0.75, 0.6875, 0.6875, 0.5625, 0.5625, 0.4375],
  12: [0.875, 0.8125, 0.8125, 0.6875, 0.6875, 0.5625],
  13: [1.0, 0.9375, 0.9375, 0.8125, 0.8125, 0.6875],
  14: [1.125, 1.0625, 1.0625, 0.9375, 0.9375, 0.8125],
  15: [1.25, 1.1875, 1.1875, 1.0625, 1.0625, 0.9375],
  16: [1.375, 1.3125, 1.3125, 1.1875, 1.1875, 1.0625],
  17: [1.5, 1.4375, 1.4375, 1.3125, 1.3125, 1.1875],
  20: [1.625, 1.5625, 1.5625, 1.4375, 1.4375, 1.3125],
  21: [1.75, 1.6875, 1.6875, 1.5625, 1.5625, 1.4375],
  22: [1.875, 1.8125, 1.8125, 1.6875, 1.6875, 1.5625],
  23: [2.0, 1.9375, 1.9375, 1.8125, 1.8125, 1.6875],
  24: [2.125, 2.0625, 2.0625, 1.9375, 1.9375, 1.8125],
  25: [2.25, 2.1875, 2.1875, 2.0625, 2.0625, 1.9375],
  26: [2.375, 2.3125, 2.3125, 2.1875, 2.1875, 2.0625],
  27: [2.5, 2.4375, 2.4375, 2.3125, 2.3125, 2.1875],
  30: [2.625, 2.5625, 2.5625, 2.4375, 2.4375, 2.3125],
  31: [2.75, 2.6875, 2.6875, 2.5625, 2.5625, 2.4375],
  32: [2.875, 2.8125, 2.8125, 2.6875, 2.6875, 2.5625],
  33: [3.0, 2.9375, 2.9375, 2.8125, 2.8125, 2.6875],
  34: [3.125, 3.0625, 3.0625, 2.9375, 2.9375, 2.8125],
  35: [3.25, 3.1875, 3.1875, 3.0625, 3.0625, 2.9375],
  36: [3.375, 3.3125, 3.3125, 3.1875, 3.1875, 3.0625],
  37: [3.5, 3.4375, 3.4375, 3.3125, 3.3125, 3.1875],
  40: [3.625, 3.5625, 3.5625, 3.4375, 3.4375, 3.3125],
  41: [3.75, 3.6875, 3.6875, 3.5625, 3.5625, 3.4375],
  42: [3.875, 3.8125, 3.8125, 3.6875, 3.6875, 3.5625],
  43: [4.0, 3.9375, 3.9375, 3.8125, 3.8125, 3.6875],
  44: [4.125, 4.0625, 4.0625, 3.9375, 3.9375, 3.8125],
  45: [4.25, 4.1875, 4.1875, 4.0625, 4.0625, 3.9375],
  46: [4.375, 4.3125, 4.3125, 4.1875, 4.1875, 4.0625],
  47: [4.5, 4.4375, 4.4375, 4.3125, 4.3125, 4.1875],
}

// Nominal thread length per series (Pegasus chart header). Total bolt length = grip + thread length.
const AN_THREAD_LEN: Record<number, number> = { 3: 0.406, 4: 0.469, 5: 0.531, 6: 0.641, 7: 0.656, 8: 0.680 }

const AN_SERIES_INDEX: Record<number, number> = { 3: 0, 4: 1, 5: 2, 6: 3, 7: 4, 8: 5 }

/** Inches -> nearest-1/32 fraction string, e.g. 1.15625 -> '1 5/32"'. */
function toFraction32(inches: number): string {
  const n = Math.round(inches * 32)
  let num = n
  let den = 32
  while (num % 2 === 0 && den % 2 === 0) { num /= 2; den /= 2 }
  const whole = Math.floor(num / den)
  const rem = num % den
  if (rem === 0) return `${whole}"`
  if (whole === 0) return `${rem}/${den}"`
  return `${whole} ${rem}/${den}"`
}

const AN_NUT_TYPES: Record<number, { type: string; description: string; tip: string }> = {
  310: { type: 'Castle Nut', description: 'Hex castle nut (castellated) for use with cotter pin safety. Standard AN bolt and stud applications.', tip: 'Used with AN380 cotter pins for safety wiring on critical fasteners.' },
  315: { type: 'Plain Hex Nut (Right Hand)', description: 'Standard plain hex nut, right-hand thread. Used where self-locking is not required.', tip: 'Always safety with cotter pin or wire when used in vibration-prone areas.' },
  316: { type: 'Plain Hex Nut (Left Hand)', description: 'Standard plain hex nut with left-hand thread. Used on rotating shafts to prevent loosening.', tip: 'Left-hand thread nuts tighten in the direction of shaft rotation.' },
  320: { type: 'Wing Nut', description: 'Wing nut for hand-tightening applications. Not for structural or critical applications.', tip: 'Wing nuts should never be used on critical flight hardware.' },
  362: { type: 'Self-Locking Hex Nut (Thin)', description: 'Thin self-locking nut with all-metal prevailing torque feature. For temperatures up to 250°F.', tip: 'AN362 is the thin version of the self-locking nut. Do not reuse after torque removal.' },
  363: { type: 'Self-Locking Hex Nut (All-Metal, High-Temp)', description: 'All-metal prevailing torque self-locking nut rated for high-temperature applications up to 450°F. No fiber or nylon insert.', tip: 'Use AN363 when temperatures exceed 250°F. All-metal construction maintains locking torque at elevated temperatures.' },
  364: { type: 'Self-Locking Hex Nut', description: 'Standard self-locking hex nut with fiber insert. Not for use above 250°F or at high RPM.', tip: 'Fiber insert is destroyed at high temperatures. Use AN363 or MS21042 for high-temp applications.' },
  365: { type: 'Self-Locking Hex Nut (Standard, Nylon Insert)', description: 'Standard self-locking hex nut with nylon/fiber insert. Rated to 250°F maximum — NOT for high-temperature applications.', tip: 'AN365 uses a nylon insert and is limited to 250°F. For elevated temperatures, use AN363 (all-metal) instead.' },
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

    // Grip is looked up from the chart, NOT computed as dash/8. The dash ladder skips
    // numbers, so dash/8 overstates length (e.g. AN4-11 is 1-5/32" long, not 1-3/8").
    // Only AN3-AN8 have published grip charts; larger series are not tabulated here.
    const seriesIdx = AN_SERIES_INDEX[diamCode]
    let gripIn: number | null = null
    let totalIn: number | null = null
    let lengthKnown = false
    if (lengthCode !== null && seriesIdx !== undefined) {
      const row = AN_BOLT_GRIP[lengthCode]
      const g = row ? row[seriesIdx] : null
      if (g !== null && g !== undefined) {
        gripIn = g
        totalIn = g + AN_THREAD_LEN[diamCode]
        lengthKnown = true
      }
    }

    const gripFraction = gripIn !== null ? toFraction32(gripIn) : null
    const totalFraction = totalIn !== null ? toFraction32(totalIn) : null

    const segments: Segment[] = [
      { text: 'AN', label: 'Series', color: 'bg-blue-900/60 text-blue-200 border border-blue-700/50' },
      { text: boltMatch[1], label: 'Diameter Code', color: 'bg-sky-900/60 text-sky-200 border border-sky-700/50' },
    ]
    if (boltMatch[2]) {
      segments.push({ text: boltMatch[2], label: 'Dash Number (length step)', color: 'bg-violet-900/60 text-violet-200 border border-violet-700/50' })
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

    if (lengthCode !== null) {
      details.push({ property: 'Dash Number', value: lengthCode.toString() })
      if (lengthKnown && gripIn !== null && totalIn !== null) {
        details.push({ property: 'Grip Length', value: `${gripFraction} (${gripIn.toFixed(4)}")` })
        details.push({ property: 'Total Length', value: `${totalFraction} (${totalIn.toFixed(4)}")` })
      } else {
        details.push({
          property: 'Grip / Length',
          value: seriesIdx === undefined
            ? 'Not tabulated here - consult the AN bolt grip chart for this series'
            : `Dash ${lengthCode} is not a standard ${'AN' + diamCode} size - consult the AN bolt grip chart`,
        })
      }
    }
    details.push({ property: 'Drilled Head', value: noHoleFlag ? 'No (smooth head)' : 'Yes (for safety wire)' })

    const lenDesc = lengthKnown && gripIn !== null && totalIn !== null
      ? `, grip ${gripFraction}, ${totalFraction} long`
      : ''
    const desc = `AN${diamCode} hex head bolt${boltInfo ? `, ${boltInfo.diameter} diameter, ${boltInfo.threads} thread` : ''}${lenDesc}${noHoleFlag ? ', no drilled head' : ', drilled head for safety wire'}.`

    return {
      segments,
      description: desc,
      details,
      tip: 'AN bolt lengths are NOT the dash number in eighths - the dash ladder skips numbers, so use the published AN bolt grip chart. Grip is the unthreaded shank length; total length = grip + the series thread length.',
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
  { code: 'AN363', type: 'Self-Locking Nut (All-Metal)', notes: 'All-metal. High-temp up to 450°F.' },
  { code: 'AN364', type: 'Self-Locking Nut', notes: 'Fiber insert. Max 250°F. Do not reuse.' },
  { code: 'AN365', type: 'Self-Locking Nut (Nylon Insert)', notes: 'Nylon/fiber insert. Max 250°F. NOT for high-temp.' },
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
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg placeholder-slate-400 focus:outline-none focus:border-[#38bdf8] transition-colors font-mono"
          autoCapitalize="characters"
          spellCheck={false}
        />
        <p className="text-xs text-slate-400 mt-2">Case-insensitive. Try: AN4-10A, AN310-428, AN380-2-2, AN960-416</p>
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
                    <p className="text-xs text-slate-400 mt-1 max-w-[100px] leading-tight">{seg.label}</p>
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
        <p className="text-xs text-slate-400 mb-4">Quick reference for AN series part number prefixes</p>
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
