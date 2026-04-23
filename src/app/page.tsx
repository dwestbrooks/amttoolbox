import Link from 'next/link'
import { Calculator, GraduationCap, ArrowRight, Wrench, Ruler, Settings } from 'lucide-react'

const featuredTools = [
  {
    name: 'Torque Extension Calculator',
    description: 'Calculate the correct torque wrench setting when using an extension tool.',
    href: '/tools/torque-extension-calculator',
    category: 'Calculations',
  },
  {
    name: 'Bend Allowance Calculator',
    description: 'Calculate bend allowance, setback, and flat blank length for sheet metal work.',
    href: '/tools/bend-allowance-calculator',
    category: 'Calculations',
  },
  {
    name: 'Torque Unit Converter',
    description: 'Convert between in-lb, ft-lb, N·m, and kgf·cm with AN bolt reference table.',
    href: '/tools/torque-unit-converter',
    category: 'Converters',
  },
  {
    name: 'AN Hardware Decoder',
    description: 'Decode AN and MS aircraft hardware part numbers instantly.',
    href: '/tools/an-hardware-decoder',
    category: 'Hardware',
  },
]

const categories = [
  { name: 'Calculations', description: 'Torque, bend allowance, and engineering calculations', icon: Calculator, count: 2 },
  { name: 'Hardware Reference', description: 'AN/MS part number decoders and specifications', icon: Settings, count: 1 },
  { name: 'Study Tools', description: 'A&P exam prep and knowledge checks', icon: GraduationCap, count: 0, soon: true },
  { name: 'Converters', description: 'Unit conversions: torque, dimensions, and more', icon: Ruler, count: 2 },
]

export default function Home() {
  return (
    <div className="bg-[#0f172a] min-h-screen">
      {/* Hero */}
      <section className="border-b border-slate-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#38bdf8]/10 text-[#38bdf8] text-sm font-medium px-3 py-1.5 rounded-full mb-6 border border-[#38bdf8]/20">
            <Wrench className="w-4 h-4" />
            Free • No Login • No Ads
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Free Tools for A&amp;P Students &amp;<br />
            <span className="text-[#38bdf8]">Aircraft Maintenance Technicians</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Professional-grade calculators and reference tools. Free, fast, no login required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 bg-[#38bdf8] text-[#0f172a] font-semibold px-8 py-3 rounded-lg hover:bg-sky-300 transition-colors"
            >
              Browse All Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/study"
              className="inline-flex items-center gap-2 border border-slate-600 text-slate-300 font-semibold px-8 py-3 rounded-lg hover:border-slate-400 hover:text-white transition-colors"
            >
              A&amp;P Exam Prep
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Tool Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <div key={cat.name} className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 hover:border-[#38bdf8]/40 transition-colors">
                  <Icon className="w-8 h-8 text-[#38bdf8] mb-3" />
                  <h3 className="font-semibold text-white mb-1">{cat.name}</h3>
                  <p className="text-sm text-slate-400 mb-3">{cat.description}</p>
                  {cat.soon ? (
                    <span className="text-xs bg-amber-900/40 text-amber-400 px-2 py-1 rounded-full border border-amber-700/30">Coming Soon</span>
                  ) : (
                    <span className="text-xs text-slate-500">{cat.count} tool{cat.count !== 1 ? 's' : ''}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Featured Tools</h2>
          <p className="text-slate-400 text-center mb-8">The most-used tools on the site</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 hover:border-[#38bdf8]/50 hover:bg-slate-800/80 transition-all group"
              >
                <span className="text-xs text-[#38bdf8] font-medium uppercase tracking-wider">{tool.category}</span>
                <h3 className="text-white font-semibold mt-2 mb-2 group-hover:text-[#38bdf8] transition-colors">{tool.name}</h3>
                <p className="text-sm text-slate-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Why AMT Toolbox?</h2>
          <p className="text-slate-400 leading-relaxed">
            AMT Toolbox was built because aviation maintenance technicians deserve better tools.
            Whether you&apos;re prepping for your A&amp;P written exam or need a quick torque calculation
            on the hangar floor, these tools are here for you — free, accurate, and always available.
            No subscriptions, no ads, no account required.
          </p>
        </div>
      </section>
    </div>
  )
}
