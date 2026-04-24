'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

const tools = [
  {
    name: 'Torque Extension Calculator',
    description: 'Calculate the correct torque wrench setting when using an extension. Uses TW = (T × L) / (L + E).',
    href: '/tools/torque-extension-calculator',
    category: 'Calculations',
  },
  {
    name: 'Bend Allowance Calculator',
    description: 'Calculate bend allowance, setback, and flat blank length for aircraft sheet metal work.',
    href: '/tools/bend-allowance-calculator',
    category: 'Calculations',
  },
  {
    name: 'Torque Unit Converter',
    description: 'Convert between in-lb, ft-lb, N·m, and kgf·cm. Includes AN bolt torque reference table.',
    href: '/tools/torque-unit-converter',
    category: 'Converters',
  },
  {
    name: 'Decimal / Fraction Converter',
    description: 'Convert between fractional inches, decimal inches, and millimeters. Complete drill size chart.',
    href: '/tools/decimal-fraction-converter',
    category: 'Converters',
  },
  {
    name: 'AN Hardware Decoder',
    description: 'Decode AN and MS aircraft hardware part numbers. Supports bolts, nuts, washers, and cotter pins.',
    href: '/tools/an-hardware-decoder',
    category: 'Hardware',
  },
  {
    name: 'Rivet Size Calculator',
    description: 'Calculate recommended rivet diameter, edge distance, pitch, and grip length for aircraft sheet metal repairs.',
    href: '/tools/rivet-size-calculator',
    category: 'Calculations',
  },
  {
    name: 'Hydraulic Pressure / Force / Area Calculator',
    description: "Calculate hydraulic pressure, force, or area using Pascal's Law. Essential for aircraft hydraulic system troubleshooting.",
    href: '/tools/hydraulic-calculator',
    category: 'Calculations',
  },
  {
    name: 'Aircraft Wire Gauge Calculator',
    description: 'Calculate minimum recommended AWG wire size for aircraft electrical circuits based on current, voltage, wire length, and voltage drop.',
    href: '/tools/wire-gauge-calculator',
    category: 'Calculations',
  },
  {
    name: 'Engine Compression Check Reference',
    description: 'Differential compression check interpretation guide for Continental and Lycoming aircraft engines.',
    href: '/tools/compression-check-reference',
    category: 'Reference',
  },
  {
    name: 'Weight & Balance Moment Calculator',
    description: 'Calculate weight, moment, and CG location for aircraft weight and balance calculations.',
    href: '/tools/weight-balance-calculator',
    category: 'Calculations',
  },
]

const categoryColors: Record<string, string> = {
  Calculations: 'bg-blue-900/40 text-blue-300 border border-blue-700/30',
  Converters: 'bg-purple-900/40 text-purple-300 border border-purple-700/30',
  Hardware: 'bg-green-900/40 text-green-300 border border-green-700/30',
  Reference: 'bg-sky-900/40 text-sky-300 border border-sky-700/30',
}

export default function ToolsPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(tools.map(t => t.category)))

  const filtered = tools.filter(tool => {
    const matchesQuery = !query ||
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = !activeCategory || tool.category === activeCategory
    return matchesQuery && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">All Tools</h1>
        <p className="text-slate-400">Free calculators and reference tools for A&amp;P mechanics and students.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tools..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-[#1e293b] border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !activeCategory ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#1e293b] text-slate-300 border border-slate-700 hover:border-slate-500'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat ? 'bg-[#38bdf8] text-[#0f172a]' : 'bg-[#1e293b] text-slate-300 border border-slate-700 hover:border-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(tool => (
          <div key={tool.href} className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 flex flex-col hover:border-[#38bdf8]/40 transition-colors">
            <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3 w-fit ${categoryColors[tool.category]}`}>
              {tool.category}
            </span>
            <h2 className="text-white font-semibold mb-2">{tool.name}</h2>
            <p className="text-sm text-slate-400 flex-1 mb-4">{tool.description}</p>
            <Link
              href={tool.href}
              className="inline-flex items-center justify-center bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              Open Tool
            </Link>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          No tools found matching your search.
        </div>
      )}
    </div>
  )
}
