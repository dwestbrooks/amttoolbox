import Link from 'next/link'
import type { Metadata } from 'next'
import { Wrench, ArrowRight, CheckCircle2, Calculator } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gear Guides for A&P Mechanics & AMTs',
  description:
    'Hands-on tool and equipment guides for Aircraft Maintenance Technicians and A&P mechanics. Real recommendations for toolboxes, hand tools, safety wire pliers, torque wrenches, and more, based on how the job actually works.',
  alternates: {
    canonical: '/guides',
  },
}

const guides = [
  {
    slug: 'best-toolboxes-for-ap-mechanics',
    title: 'Best Toolboxes for A&P Mechanics',
    tagline:
      'Portable, bench, and hangar boxes that fit the way aircraft maintenance actually works.',
    href: '/guides/best-toolboxes-for-ap-mechanics',
    category: 'Tool storage',
  },
  {
    slug: 'ap-mechanic-tool-list',
    title: 'A&P Mechanic Tool List: What You Actually Need',
    tagline:
      'The hand tools, pliers, and specialty gear A&P mechanics reach for daily, organized by what the job demands.',
    href: '/guides/ap-mechanic-tool-list',
    category: 'Hand tools',
  },
  {
    slug: 'snap-on-student-excellence-program',
    title: 'Snap-on Student Excellence Program (SEP) for A&P Students',
    tagline:
      'How A&P and AMT students can buy Snap-on tools at a discount, including the aviation-specific sets.',
    href: '/guides/snap-on-student-excellence-program',
    category: 'Student program',
  },
]

export default function GuidesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-[#38bdf8]/10 text-[#38bdf8] text-sm font-medium px-3 py-1.5 rounded-full mb-4 border border-[#38bdf8]/20">
          <Wrench className="w-4 h-4" />
          Gear Guides
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Tool Guides for A&amp;P Mechanics &amp; AMTs
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Aircraft maintenance runs on the right gear. These guides recommend tools that hold up in
          the field, organized around the way the job actually works, not marketing copy. Every pick
          is tied to a real product and a current price.
        </p>
      </div>

      <Link
        href="/guides/kit-builder"
        className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-[#1e293b] border border-[#38bdf8]/30 rounded-xl p-6 mb-6 hover:border-[#38bdf8]/60 transition-colors"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 shrink-0">
          <Calculator className="w-6 h-6 text-[#38bdf8]" />
        </div>
        <div className="flex-1">
          <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-2 w-fit bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
            Interactive tool
          </span>
          <h2 className="text-xl text-white font-semibold mb-1 group-hover:text-[#38bdf8] transition-colors">
            A&amp;P Tool Kit Builder
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Enter your starting budget and get a priority-ordered buy list, built around the tools
            you actually need first.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[#38bdf8] text-sm font-medium shrink-0">
          Try the builder
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {guides.map(g => (
          <Link
            key={g.slug}
            href={g.href}
            className="group bg-[#1e293b] border border-slate-700 rounded-xl p-6 flex flex-col hover:border-[#38bdf8]/40 transition-colors"
          >
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-4 w-fit bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
              {g.category}
            </span>
            <h2 className="text-xl text-white font-semibold mb-2 group-hover:text-[#38bdf8] transition-colors">
              {g.title}
            </h2>
            <p className="text-sm text-slate-400 flex-1 mb-4 leading-relaxed">{g.tagline}</p>
            <span className="inline-flex items-center gap-1.5 text-[#38bdf8] text-sm font-medium">
              Read the guide
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-[#1e293b]/50 border border-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-3">How we choose what to recommend</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-400">
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
            Picks are verified against live product pages at the time we publish.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
            We prefer tools the field actually uses, not the loudest marketing.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
            Prices are checked regularly; we link current listings, never a made-up number.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
            If you buy through a link, AMT Toolbox may earn a commission at no cost to you.
          </li>
        </ul>
      </div>
    </div>
  )
}
