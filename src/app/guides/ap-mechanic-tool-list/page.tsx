import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'A&P Mechanic Tool List: What You Actually Need',
  description:
    'The complete hand-tool list A&P mechanics and AMTs actually carry: sockets, wrenches, safety wire pliers, torque wrenches, and more. Organized by job, with budget and premium picks for A&P school and your first job.',
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

type ToolOption = {
  label: string
  url: string
}

type Tool = {
  name: string
  note: string
  budget: ToolOption
  premium: ToolOption
}

type ToolGroup = {
  category: string
  intro: string
  tools: Tool[]
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
        budget: {
          label: 'Craftsman 3/8" drive set',
          url: 'https://www.amazon.com/Craftsman-Piece-Drive-Socket-Metric/dp/B09S2PFYVG',
        },
        premium: {
          label: 'GEARWRENCH 57-pc 3/8" 6-pt SAE/Metric',
          url: 'https://www.amazon.com/GEARWRENCH-Drive-Mechanics-Standard-Metric/dp/B000NICEVW',
        },
      },
      {
        name: '1/4-inch drive socket set',
        note: 'For small hardware, fairings, and instrument panels.',
        budget: {
          label: 'Craftsman 44-pc 1/4" 6-pt SAE/Metric',
          url: 'https://www.amazon.com/Craftsman-Piece-Drive-Socket-Metric/dp/B09S2PFYVG',
        },
        premium: {
          label: 'Craftsman 24-pc Nano SAE 1/4"',
          url: 'https://www.amazon.com/CRAFTSMAN-Socket-4-Inch-24-Piece-CMMT12009/dp/B07QL38G69',
        },
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
        budget: {
          label: 'Craftsman 52-pc combo SAE/Metric',
          url: 'https://www.amazon.com/CRAFTSMAN-WRENCH-SET-COMBINATION-METRIC/dp/B078NDYCSK',
        },
        premium: {
          label: 'GEARWRENCH 20-pc ratcheting combo',
          url: 'https://www.amazon.com/GEARWRENCH-35720-Ratcheting-Wrench-Set/dp/B07GSCZCPM',
        },
      },
      {
        name: 'Gear wrenches / ratcheting box-end wrenches',
        note: 'Speed up work in tight spots where a full swing is impossible.',
        budget: {
          label: 'Craftsman 20-pc ratcheting',
          url: 'https://www.amazon.com/CRAFTSMAN-Ratcheting-Combination-Wrench-CMMT87220/dp/B0DPGJVJZV',
        },
        premium: {
          label: 'GEARWRENCH 20-pc ratcheting',
          url: 'https://www.amazon.com/GEARWRENCH-35720-Ratcheting-Wrench-Set/dp/B07GSCZCPM',
        },
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
        budget: {
          label: 'Milbar 25W reversible 6"',
          url: 'https://www.amazon.com/Safety-Wire-Twisters-Automatic-Return/dp/B0CDN2W554',
        },
        premium: {
          label: 'Milbar 25W reversible (cushion throat)',
          url: 'https://www.amazon.com/Milbar-Safety-Wire-Twister-Pliers/dp/B0049C9EQ6',
        },
      },
      {
        name: 'Diagonal cutters (dykes)',
        note: 'For safety wire and cotter pins. A good pair lasts a career.',
        budget: {
          label: 'Craftsman 8" compound action',
          url: 'https://www.amazon.com/CRAFTSMAN-Diagonal-Cutting-Compound-CMHT81718/dp/B07RC8NGFX',
        },
        premium: {
          label: 'Knipex 10" high leverage',
          url: 'https://www.amazon.com/7401250SBA-10-Inch-Leverage-Diagonal-Cutters/dp/B000X4MPAQ',
        },
      },
      {
        name: 'Duck bill pliers',
        note: 'A daily aviation tool for safety wire, cotter pins, and reaching into tight spots. Flat, tapered jaws grip without marring.',
        budget: {
          label: 'Williams 8" duck bill pliers',
          url: 'https://www.amazon.com/Williams-PL-149C-8-Inch-Duck-Bill-Pliers/dp/B005VN3MD8',
        },
        premium: {
          label: 'SK Tools 8" duckbill, serrated jaws',
          url: 'https://www.amazon.com/SK-Tools-USA-Duckbill-Serrated/dp/B000RN00NC',
        },
      },
      {
        name: 'Needle-nose pliers',
        note: 'Gripping, reaching, and general mechanical work.',
        budget: {
          label: 'Craftsman 8" long nose',
          url: 'https://www.amazon.com/CRAFTSMAN-CMHT81645-Long-Nose-Pliers/dp/B08PFK8YWQ',
        },
        premium: {
          label: 'Knipex 8" long nose with cutter',
          url: 'https://www.amazon.com/KNIPEX-Tools-Multi-Component-2612200-Multi-Colour/dp/B000X4MOVG',
        },
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
        budget: {
          label: 'Craftsman 3/8" drive torque wrench',
          url: 'https://www.amazon.com/CRAFTSMAN-Torque-Wrench-8-Inch-CMMT99433/dp/B07VZZDFL9',
        },
        premium: {
          label: 'TEKTON 1/2" drive 40-300 ft-lb',
          url: 'https://www.amazon.com/TEKTON-90-Tooth-Dual-Direction-Micrometer-TRQ52403/dp/B0FYHC3J73',
        },
      },
      {
        name: 'Torque screwdriver',
        note: 'For screws and small fasteners where over-torqueing is a real risk.',
        budget: {
          label: 'Craftsman 29-pc torque screwdriver set',
          url: 'https://www.amazon.com/CRAFTSMAN-Screwdriver-Phillips-Screwdriving-CMHT68130/dp/B0CH3Z16GW',
        },
        premium: {
          label: 'Wera Kraftform 7442 adjustable',
          url: 'https://www.amazon.com/Wera-Adjustable-Torque-Screwdriver-3-0-6-0/dp/B000ZEHO3C',
        },
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
        budget: {
          label: 'Craftsman 8-pc bi-material',
          url: 'https://www.amazon.com/CRAFTSMAN-SCREWDRIVER-BI-MATERIAL-8PC-CMHT65075N/dp/B0B39PHCVZ',
        },
        premium: {
          label: 'Wera Kraftform 6-pc Lasertip',
          url: 'https://www.amazon.com/Wera-Kraftform-Screwdriver-Lasertip-6-Pieces/dp/B0001NQQCM',
        },
      },
      {
        name: 'Nut drivers / hex drivers',
        note: 'For fasteners a screwdriver just does not fit.',
        budget: {
          label: 'Craftsman 7-pc SAE/MM nut driver',
          url: 'https://www.amazon.com/CRAFTSMAN-Driver-Magnetic-Comfort-CMHT65146/dp/B0GQJX98SL',
        },
        premium: {
          label: 'Klein 7-pc magnetic nut driver',
          url: 'https://www.amazon.com/Klein-Tools-Driver-7-Piece-Chrome-Plate/dp/B0BM2ZZYVQ',
        },
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
        budget: {
          label: 'Neiko 6" digital caliper',
          url: 'https://www.amazon.com/NEIKO-Digital-Caliper-Electronic-Measuring/dp/B0CN3T1372',
        },
        premium: {
          label: 'Starrett 6" digital caliper',
          url: 'https://www.amazon.com/Starrett-Digital-Calipers-Metric-Stainless/dp/B009PSJ4W8',
        },
      },
      {
        name: 'Feeler gauges',
        note: 'For setting and checking gaps and clearances.',
        budget: {
          label: '16-blade stainless feeler gauge',
          url: 'https://www.amazon.com/Feeler-Gauges-Stainless-Standard-Thickness/dp/B0CF9C1W4V',
        },
        premium: {
          label: '16-blade stainless, dual-marked',
          url: 'https://www.amazon.com/Feeler-Gauges-Stainless-Straight-Automotive/dp/B0GDR68D11',
        },
      },
      {
        name: 'Flashlight / inspection light',
        note: 'Half of aircraft maintenance is looking carefully at what you cannot see well.',
        budget: {
          label: 'Energizer LED pen light',
          url: 'https://www.amazon.com/Energizer-Flashlight-Inspection-Batteries-Included/dp/B0FM2YNN4G',
        },
        premium: {
          label: 'Streamlight Knucklehead',
          url: 'https://www.amazon.com/Streamlight-90761-Knucklehead-120-Volt-Charger/dp/B0089UZBBG',
        },
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
          AMTs actually carry, organized by job. Each tool comes with a budget pick and a premium
          pick, so whether you are building your first kit for A&amp;P school or upgrading for a new
          job, you can choose what fits.
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
                <div key={tool.name} className="bg-[#1e293b] border border-slate-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{tool.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{tool.note}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        <a
                          href={link(tool.budget.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2.5 hover:border-[#38bdf8] transition-colors group"
                        >
                          <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wide">Budget</div>
                            <div className="text-sm text-slate-200">{tool.budget.label}</div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-[#38bdf8] shrink-0" />
                        </a>
                        <a
                          href={link(tool.premium.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2.5 hover:border-[#38bdf8] transition-colors group"
                        >
                          <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wide">Premium</div>
                            <div className="text-sm text-slate-200">{tool.premium.label}</div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-[#38bdf8] shrink-0" />
                        </a>
                      </div>
                    </div>
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
