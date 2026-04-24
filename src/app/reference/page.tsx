import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reference Tables — AMT Toolbox',
  description: 'Aviation maintenance reference tables: abbreviations, bend radius charts, and quick-reference guides for A&P mechanics.',
}

const references = [
  {
    name: 'Aviation Maintenance Abbreviations & Acronyms',
    description: 'Searchable A-Z reference of 130+ aviation maintenance abbreviations and acronyms. AD, MEL, SB, CDL, STC, MRO, NDT, and more.',
    href: '/reference/aviation-abbreviations',
  },
  {
    name: 'Minimum Bend Radius Reference Table',
    description: 'Minimum bend radius by material, temper, and thickness per AC 43.13-1B. 2024-T3, 6061-T6, 7075-T6, 4130 steel, and titanium.',
    href: '/reference/minimum-bend-radius',
  },
]

export default function ReferencePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-7 h-7 text-[#38bdf8]" />
          <h1 className="text-3xl font-bold text-white">Reference Tables</h1>
        </div>
        <p className="text-slate-400">Quick-reference charts and lookup tables for aviation maintenance professionals.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {references.map(ref => (
          <div
            key={ref.href}
            className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 flex flex-col hover:border-[#38bdf8]/40 transition-colors"
          >
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3 w-fit bg-sky-900/40 text-sky-300 border border-sky-700/30">
              Reference
            </span>
            <h2 className="text-white font-semibold mb-2">{ref.name}</h2>
            <p className="text-sm text-slate-400 flex-1 mb-4">{ref.description}</p>
            <Link
              href={ref.href}
              className="inline-flex items-center justify-center bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              View Reference
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
