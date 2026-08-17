import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'A&P Mechanic Tool List: What You Actually Need',
  description:
    'The complete hand-tool list A&P mechanics and AMTs actually carry: sockets, wrenches, safety wire pliers, torque wrenches, and more. Organized by job, with guidance for A&P school and your first job.',
  alternates: {
    canonical: '/guides/ap-mechanic-tool-list',
  },
}

const amazonTag = 'amttoolbox-20'

function link(url: string) {
  if (url.includes('amazon.com')) {
    return `${url}?tag=${amazonTag}`
  }
  return url
}

type ToolGroup = {
  category: string
  intro: string
  tools: { name: string; note: string; url: string }[]
}

const groups: ToolGroup[] = [
  {
    category: 'Sockets and drive sets',
    intro:
      'A quality 3/8-inch drive socket set is the backbone of aircraft work. Add 1/4-inch drive for tight spots and 1/2-inch for the bigger fasteners.',
    tools: [
      {
        name: '3/8-inch drive socket set, deep and shallow',
        note: 'Get both metric and SAE or an aviation-specific set that covers common hardware.',
        url: 'https://www.amazon.com/s?k=3%2F8+inch+drive+socket+set',
      },
      {
        name: '1/4-inch drive socket set',
        note: 'For small hardware, fairings, and instrument panels.',
        url: 'https://www.amazon.com/s?k=1%2F4+inch+drive+socket+set',
      },
    ],
  },
  {
    category: 'Wrenches',
    intro: 'Combination wrenches (open end and box end) cover most aircraft work.',
    tools: [
      {
        name: 'Combination wrench set, SAE and metric',
        note: 'A 3/8-inch to 3/4-inch range covers most general aviation fasteners.',
        url: 'https://www.amazon.com/s?k=combination+wrench+set',
      },
      {
        name: 'Gear wrenches / ratcheting box-end wrenches',
        note: 'Speed up work in tight spots where a full swing is impossible.',
        url: 'https://www.amazon.com/s?k=ratcheting+wrench+set',
      },
    ],
  },
  {
    category: 'Pliers and cutters',
    intro: 'Aviation runs on lockwire and precision gripping. These are the non-negotiables.',
    tools: [
      {
        name: 'Safety wire pliers (lockwire twisters)',
        note: 'The single most aviation-specific tool. Learn the double-twist lockwire method.',
        url: 'https://www.amazon.com/s?k=safety+wire+pliers',
      },
      {
        name: 'Diagonal cutters (dykes)',
        note: 'For safety wire and cotter pins. A good pair lasts a career.',
        url: 'https://www.amazon.com/s?k=diagonal+cutters',
      },
      {
        name: 'Needle-nose pliers and linesman pliers',
        note: 'Gripping, reaching, and general mechanical work.',
        url: 'https://www.amazon.com/s?k=needle+nose+pliers',
      },
    ],
  },
  {
    category: 'Torque tools',
    intro: 'Aircraft work lives on proper torque. Never guess, always torque.',
    tools: [
      {
        name: 'Torque wrench (inch-pounds and foot-pounds)',
        note: 'Many aircraft fasteners are specd in inch-pounds, so get both ranges or a quality digital one.',
        url: 'https://www.amazon.com/s?k=torque+wrench',
      },
      {
        name: 'Torque screwdriver',
        note: 'For screws and small fasteners where over-torqueing is a real risk.',
        url: 'https://www.amazon.com/s?k=torque+screwdriver',
      },
    ],
  },
  {
    category: 'Screwdrivers and small tools',
    intro: 'Quality screwdrivers that fit properly prevent stripped hardware and damaged panels.',
    tools: [
      {
        name: 'Flat-head and Phillips screwdriver set',
        note: 'Precision-ground tips fit properly and avoid cam-out.',
        url: 'https://www.amazon.com/s?k=screwdriver+set',
      },
      {
        name: 'Nut drivers / hex drivers',
        note: 'For fasteners a screwdriver just does not fit.',
        url: 'https://www.amazon.com/s?k=nut+driver+set',
      },
    ],
  },
  {
    category: 'Measuring and inspection',
    intro: 'Aircraft maintenance is precision work. These tools keep you honest.',
    tools: [
      {
        name: 'Dial or digital caliper',
        note: 'For measuring wear, thickness, and clearances to spec.',
        url: 'https://www.amazon.com/s?k=digital+caliper',
      },
      {
        name: 'Feeler gauges',
        note: 'For setting and checking gaps and clearances.',
        url: 'https://www.amazon.com/s?k=feeler+gauges',
      },
      {
        name: 'Flashlight / inspection light',
        note: 'Half of aircraft maintenance is looking carefully at what you cannot see well.',
        url: 'https://www.amazon.com/s?k=inspection+light+flashlight',
      },
    ],
  },
]

export default function ToolListGuide() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/guides" className="inline-flex items-center gap-1.5 text-sm text-[#38bdf8] hover:text-sky-300 mb-4">
          <ArrowRight className="w-4 h-4 rotate-180" />
          All gear guides
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          A&amp;P Mechanic Tool List: What You Actually Need
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Aircraft maintenance runs on good hand tools. This is the working list A&amp;P mechanics and
          AMTs actually carry, organized by job. Whether you are building your first kit for A&amp;P
          school or upgrading for a new job, this covers the essentials without the fluff.
        </p>
      </div>

      <nav className="bg-[#1e293b] border border-slate-700 rounded-xl p-5 mb-10">
        <h2 className="text-sm font-semibold text-white mb-3">What&apos;s on the list</h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-300">
          <li><a href="#sockets" className="hover:text-[#38bdf8] transition-colors">Sockets and drive sets</a></li>
          <li><a href="#wrenches" className="hover:text-[#38bdf8] transition-colors">Wrenches</a></li>
          <li><a href="#pliers" className="hover:text-[#38bdf8] transition-colors">Pliers and cutters</a></li>
          <li><a href="#torque" className="hover:text-[#38bdf8] transition-colors">Torque tools</a></li>
          <li><a href="#screwdrivers" className="hover:text-[#38bdf8] transition-colors">Screwdrivers and small tools</a></li>
          <li><a href="#inspection" className="hover:text-[#38bdf8] transition-colors">Measuring and inspection</a></li>
        </ol>
      </nav>

      <div className="space-y-12 mb-12">
        {groups.map((group, gi) => (
          <section key={group.category} id={['sockets', 'wrenches', 'pliers', 'torque', 'screwdrivers', 'inspection'][gi]}>
            <h2 className="text-2xl font-semibold text-white mb-2">{group.category}</h2>
            <p className="text-slate-400 leading-relaxed mb-4 max-w-3xl">{group.intro}</p>
            <div className="space-y-3">
              {group.tools.map(tool => (
                <div key={tool.name} className="bg-[#1e293b] border border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-white font-medium">{tool.name}</h3>
                      <a
                        href={link(tool.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-[#38bdf8] hover:text-sky-300 shrink-0"
                      >
                        View options
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{tool.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-semibold text-white mb-3">The one tool you should not skip</h2>
        <p className="text-slate-400 leading-relaxed">
          Safety wire pliers. Lockwiring fasteners is a daily, non-negotiable part of aircraft
          maintenance, and doing it by hand is slow and unreliable. A quality pair of safety wire
          pliers pays for itself the first week. If you only add one aviation-specific tool to a
          standard mechanic kit, make it this one.
        </p>
      </section>

      <section className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Where to keep it all</h2>
        <p className="text-slate-400 leading-relaxed">
          Your tools need a home that matches how you work. If you are walking the line, a portable
          cart or stackable mobile box is the practical choice. For a dedicated bench, a classic
          chest or roll-away works better. See our{' '}
          <Link href="/guides/best-toolboxes-for-ap-mechanics" className="text-[#38bdf8] hover:text-sky-300">
            best toolboxes for A&amp;P mechanics
          </Link>{' '}
          guide for the picks.
        </p>
      </section>

      <div className="border-t border-slate-700 pt-6">
        <p className="text-sm text-slate-500">
          Some links are affiliate links: if you buy through them, AMT Toolbox may earn a commission
          at no extra cost to you. We recommend the tools the field actually uses.
        </p>
      </div>
    </div>
  )
}
