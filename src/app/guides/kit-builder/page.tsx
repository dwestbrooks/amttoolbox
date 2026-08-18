'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calculator, CheckCircle2, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react'

const amazonTag = 'amttoolbox-20'

function link(url: string) {
  if (url.includes('amazon.com')) {
    return `${url}?tag=${amazonTag}`
  }
  return url
}

/**
 * The A&P starter kit, as a priority-ordered list of line items.
 *
 * Each item has a priority tier (1 = buy first, 5 = nice to have), an estimated
 * budget-tier cost range (planning estimate only, NOT a live price), and a link
 * to the verified budget pick from the tool list guide.
 *
 * The priority ordering reflects what an A&P actually needs on day one: lockwire,
 * sockets, wrenches, and torque come before specialty and measurement tools.
 */
type KitItem = {
  id: string
  name: string
  note: string
  priority: 1 | 2 | 3 | 4 | 5
  /** Planning-estimate low and high of the budget-tier pick, in USD. */
  low: number
  high: number
  url: string
}

const kit: KitItem[] = [
  {
    id: 'lockwire',
    name: 'Safety wire pliers',
    note: 'The non-negotiable aviation tool. Learn the double-twist method.',
    priority: 1,
    low: 30,
    high: 60,
    url: 'https://www.amazon.com/dp/B0CDN2W554',
  },
  {
    id: 'sockets-38',
    name: '3/8" drive socket set',
    note: 'The backbone of aircraft work. Deep and shallow, SAE and metric.',
    priority: 1,
    low: 50,
    high: 80,
    url: 'https://www.amazon.com/Craftsman-Piece-Drive-Socket-Metric/dp/B09S2PFYVG',
  },
  {
    id: 'wrenches',
    name: 'Combination wrench set',
    note: 'Covers most general aviation fasteners.',
    priority: 1,
    low: 60,
    high: 100,
    url: 'https://www.amazon.com/CRAFTSMAN-WRENCH-SET-COMBINATION-METRIC/dp/B078NDYCSK',
  },
  {
    id: 'screwdrivers',
    name: 'Flat-head and Phillips screwdriver set',
    note: 'Precision-ground tips prevent cam-out.',
    priority: 1,
    low: 15,
    high: 30,
    url: 'https://www.amazon.com/CRAFTSMAN-SCREWDRIVER-BI-MATERIAL-8PC-CMHT65075N/dp/B0B39PHCVZ',
  },
  {
    id: 'light',
    name: 'Flashlight / inspection light',
    note: 'Half of the job is seeing clearly.',
    priority: 1,
    low: 15,
    high: 25,
    url: 'https://www.amazon.com/Energizer-Flashlight-Inspection-Batteries-Included/dp/B0FM2YNN4G',
  },
  {
    id: 'torque-ftlb',
    name: 'Torque wrench (foot-pounds)',
    note: 'Never guess, always torque.',
    priority: 1,
    low: 40,
    high: 80,
    url: 'https://www.amazon.com/CRAFTSMAN-Torque-Wrench-8-Inch-CMMT99433/dp/B07VZZDFL9',
  },
  {
    id: 'sockets-14',
    name: '1/4" drive socket set',
    note: 'For small hardware, fairings, and panels.',
    priority: 2,
    low: 30,
    high: 50,
    url: 'https://www.amazon.com/Craftsman-Piece-Drive-Socket-Metric/dp/B09S2PFYVG',
  },
  {
    id: 'needlenose',
    name: 'Needle-nose pliers',
    note: 'Gripping and reaching in tight spots.',
    priority: 2,
    low: 12,
    high: 20,
    url: 'https://www.amazon.com/CRAFTSMAN-CMHT81645-Long-Nose-Pliers/dp/B08PFK8YWQ',
  },
  {
    id: 'diagonal',
    name: 'Diagonal cutters (dykes)',
    note: 'For safety wire and cotter pins.',
    priority: 2,
    low: 15,
    high: 25,
    url: 'https://www.amazon.com/CRAFTSMAN-Diagonal-Cutting-Compound-CMHT81718/dp/B07RC8NGFX',
  },
  {
    id: 'duckbill',
    name: 'Duck bill pliers',
    note: 'A daily aviation tool for lockwire and cotter pins.',
    priority: 2,
    low: 15,
    high: 25,
    url: 'https://www.amazon.com/Williams-PL-149C-8-Inch-Duck-Bill-Pliers/dp/B005VN3MD8',
  },
  {
    id: 'wrench-ratchet',
    name: 'Gear / ratcheting box-end wrenches',
    note: 'Speed up work where a full swing is impossible.',
    priority: 3,
    low: 40,
    high: 70,
    url: 'https://www.amazon.com/CRAFTSMAN-Ratcheting-Combination-Wrench-CMMT87220/dp/B0DPGJVJZV',
  },
  {
    id: 'torque-screw',
    name: 'Torque screwdriver',
    note: 'For small fasteners where over-torqueing is a real risk.',
    priority: 3,
    low: 30,
    high: 50,
    url: 'https://www.amazon.com/CRAFTSMAN-Screwdriver-Phillips-Screwdriving-CMHT68130/dp/B0CH3Z16GW',
  },
  {
    id: 'nutdriver',
    name: 'Nut drivers / hex drivers',
    note: 'For fasteners a screwdriver does not fit.',
    priority: 3,
    low: 20,
    high: 35,
    url: 'https://www.amazon.com/CRAFTSMAN-Driver-Magnetic-Comfort-CMHT65146/dp/B0GQJX98SL',
  },
  {
    id: 'caliper',
    name: 'Digital caliper',
    note: 'For measuring wear and clearances to spec.',
    priority: 3,
    low: 15,
    high: 30,
    url: 'https://www.amazon.com/NEIKO-Digital-Caliper-Electronic-Measuring/dp/B0CN3T1372',
  },
  {
    id: 'feeler',
    name: 'Feeler gauges',
    note: 'For setting and checking gaps and clearances.',
    priority: 3,
    low: 10,
    high: 20,
    url: 'https://www.amazon.com/Feeler-Gauges-Stainless-Standard-Thickness/dp/B0CF9C1W4V',
  },
  {
    id: 'torque-inlb',
    name: 'Inch-pound torque wrench',
    note: 'Dedicated low range so you do not snap small fasteners.',
    priority: 4,
    low: 35,
    high: 60,
    url: 'https://www.amazon.com/dp/B07M68FY3X',
  },
  {
    id: 'deburr',
    name: 'Deburring tool',
    note: 'Cleans drilled holes in aluminum before they become stress cracks.',
    priority: 4,
    low: 10,
    high: 20,
    url: 'https://www.amazon.com/dp/B01L2XR4P2',
  },
  {
    id: 'mic-01',
    name: 'Micrometer, 0-1"',
    note: 'For wear limits and tolerances on engine and landing gear parts.',
    priority: 4,
    low: 40,
    high: 80,
    url: 'https://www.amazon.com/dp/B00B5HES1O',
  },
  {
    id: 'headlamp',
    name: 'LED headlamp',
    note: 'Hands-free light for cowling and fuselage work.',
    priority: 4,
    low: 15,
    high: 30,
    url: 'https://www.amazon.com/dp/B08D66HCXW',
  },
  {
    id: 'dial',
    name: 'Dial indicator with magnetic base',
    note: 'For run-out and gear-play checks.',
    priority: 4,
    low: 40,
    high: 70,
    url: 'https://www.amazon.com/dp/B08DFKCWX4',
  },
  {
    id: 'clecos',
    name: 'Cleco pliers and a set of Clecos',
    note: 'For any sheet metal and airframe work.',
    priority: 5,
    low: 40,
    high: 70,
    url: 'https://www.amazon.com/dp/B06VV91F43',
  },
  {
    id: 'mic-12',
    name: 'Micrometer, 1-2"',
    note: 'For larger engine and landing gear components.',
    priority: 5,
    low: 40,
    high: 80,
    url: 'https://www.amazon.com/dp/B00B5HESQ4',
  },
  {
    id: 'dmm',
    name: 'Digital multimeter',
    note: 'Baseline tool for troubleshooting electrical faults.',
    priority: 5,
    low: 45,
    high: 60,
    url: 'https://www.amazon.com/dp/B00HE6MIJY',
  },
  {
    id: 'stripper',
    name: 'Precision wire strippers',
    note: 'Mil-spec aircraft wire without nicking the conductor.',
    priority: 5,
    low: 15,
    high: 30,
    url: 'https://www.amazon.com/dp/B00BC39YFQ',
  },
  {
    id: 'crimper',
    name: 'Crimping tool',
    note: 'Ratcheting crimper for aviation-grade terminals.',
    priority: 5,
    low: 25,
    high: 45,
    url: 'https://www.amazon.com/dp/B0873Y19T7',
  },
]

const priorityLabel: Record<number, string> = {
  1: 'Buy first',
  2: 'First upgrade',
  3: 'Core kit',
  4: 'Specialty',
  5: 'Nice to have',
}

const budgets = [
  { label: '$500', value: 500 },
  { label: '$1,000', value: 1000 },
  { label: '$2,000', value: 2000 },
  { label: '$5,000', value: 5000 },
]

export default function KitBuilder() {
  const [budget, setBudget] = useState(1000)

  // Build a priority-buy list: take highest-priority items first, using the low
  // (budget-tier) cost estimate, and stop when the next item would exceed budget.
  const { list, total, remaining } = useMemo(() => {
    const sorted = [...kit].sort((a, b) => a.priority - b.priority)
    const picked: KitItem[] = []
    let spent = 0
    for (const item of sorted) {
      const cost = item.low
      if (spent + cost <= budget) {
        picked.push(item)
        spent += cost
      } else {
        break
      }
    }
    return { list: picked, total: spent, remaining: budget - spent }
  }, [budget])

  // Items that fall just outside this budget, as a "stretch goal" suggestion.
  const stretch = useMemo(() => {
    const sorted = [...kit].sort((a, b) => a.priority - b.priority)
    return sorted.find((item) => !list.some((p) => p.id === item.id) && item.priority <= 3)
  }, [list])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/guides" className="inline-flex items-center gap-1.5 text-sm text-[#38bdf8] hover:text-sky-300 mb-4">
          <ArrowRight className="w-4 h-4 rotate-180" />
          All gear guides
        </Link>
        <div className="inline-flex items-center gap-2 bg-[#38bdf8]/10 text-[#38bdf8] text-sm font-medium px-3 py-1.5 rounded-full mb-4 border border-[#38bdf8]/20">
          <Calculator className="w-4 h-4" />
          Kit Builder
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Build Your First A&amp;P Tool Kit on a Budget
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Pick your starting budget and get a priority buy list. The tools are ordered the way the
          job actually works: lockwire, sockets, and torque first, specialty and measurement gear
          as your budget allows. Every item links to a real, current product.
        </p>
      </div>

      <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 mb-8">
        <h2 className="text-white font-semibold mb-3">Your starting budget</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {budgets.map((b) => (
            <button
              key={b.value}
              onClick={() => setBudget(b.value)}
              className={`rounded-lg border px-4 py-3 text-center transition-colors ${
                budget === b.value
                  ? 'border-[#38bdf8] bg-[#38bdf8]/10 text-white'
                  : 'border-slate-700 bg-[#0f172a] text-slate-300 hover:border-slate-500'
              }`}
            >
              <span className="block text-lg font-bold">{b.label}</span>
              <span className="text-xs text-slate-500">budget</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Cost ranges are planning estimates for the budget-tier pick, not live prices. Use the
          &quot;Check price&quot; links for the current price.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Estimated total</div>
          <div className="text-2xl font-bold text-white">${total}</div>
        </div>
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Budget</div>
          <div className="text-2xl font-bold text-white">${budget}</div>
        </div>
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Room to grow</div>
          <div className="text-2xl font-bold text-white">${remaining}</div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-white mb-4">Your priority buy list</h2>
      <div className="space-y-3 mb-6">
        {list.map((item) => (
          <div key={item.id} className="bg-[#1e293b] border border-slate-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-white font-medium">{item.name}</h3>
                  <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
                    {priorityLabel[item.priority]}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">{item.note}</p>
                <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
                  <span className="text-sm text-slate-500">est. ${item.low}&ndash;${item.high}</span>
                  <a
                    href={link(item.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-[#38bdf8] hover:text-sky-300 font-medium"
                  >
                    Check current price
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stretch && (
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-white mb-1">
                Close to the next priority item: {stretch.name}
              </div>
              <p className="text-sm text-slate-400">
                Add about <span className="text-white font-medium">${stretch.low}</span> more to
                include it in your kit.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#38bdf8]" />
          How this works
        </h2>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>The list is built in priority order: the tools you need on day one come first.</li>
          <li>Costs are planning estimates for the budget-tier pick, so the totals are honest ballparks, not live prices.</li>
          <li>Every item links to a verified, in-production product. Some links are affiliate links; if you buy through them, AMT Toolbox may earn a commission at no cost to you.</li>
          <li>Full detail and premium alternatives are in the{' '}
            <Link href="/guides/ap-mechanic-tool-list" className="text-[#38bdf8] hover:text-sky-300">
              A&P mechanic tool list
            </Link>
            .</li>
        </ul>
      </div>
    </div>
  )
}
