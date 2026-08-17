import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Best Toolboxes for A&P Mechanics',
  description:
    'The toolboxes aircraft maintenance technicians actually use, organized by job: portable boxes for walking the line, carts for the hangar, and roll-aways for the bench. Verified current prices, honest picks, no fluff.',
  alternates: {
    canonical: '/guides/best-toolboxes-for-ap-mechanics',
  },
}

type Tier = 'budget' | 'mid' | 'premium'

type Product = {
  name: string
  model: string
  tier: Tier
  priceNote: string
  bestFor: string
  pros: string[]
  cons: string[]
  url: string
}

const products: Product[] = [
  {
    name: 'US General 30 in. 5-Drawer Mechanics Cart',
    model: 'Harbor Freight Item 64031',
    tier: 'budget',
    priceNote: 'About $290 at Harbor Freight',
    bestFor: 'Best budget cart that holds a full A&P hand-tool set',
    pros: [
      'Steel construction, rated for the shop',
      'Five drawers fit a full socket and wrench set with room to spare',
      'Wheels and a handle make it easy to move around the hangar',
      'Hard to beat for the price; buy it with a Harbor Freight coupon',
    ],
    cons: [
      'Not lockable as securely as a premium box',
      'Drawer slides are decent but not Snap-on grade',
    ],
    url: 'https://www.harborfreight.com/30-in-5-drawer-mechanics-cart-blue-64031.html',
  },
  {
    name: 'DeWalt TSTAK Mobile Storage Deep Box on Wheels',
    model: 'DWST17820',
    tier: 'mid',
    priceNote: 'About $120 at major retailers',
    bestFor: 'Best lightweight mobile box for walking the line',
    pros: [
      'Light enough to haul up stands and into tight spots',
      'Deep box swallows pliers, wrenches, and safety wire gear',
      'Stacks with the rest of the TSTAK system as you grow',
      'Metal latches and durable polymer that shrugs off hangar wear',
    ],
    cons: [
      'Not a hard lock, just latches',
      'Polymer box, so not for a massive roll-away load',
    ],
    url: 'https://www.amazon.com/DEWALT-DWST17820-Mobile-Storage-Wheels/dp/B01N1H4N5X',
  },
  {
    name: 'Milwaukee PACKOUT 22 in. Rolling Tool Box',
    model: '48-22-8426',
    tier: 'premium',
    priceNote: 'Check current price on Amazon',
    bestFor: 'Best premium modular mobile system',
    pros: [
      '250 lb capacity with impact-resistant polymer construction',
      '9 in. all-terrain wheels roll across ramps and ramp edges',
      'IP65 weather seal keeps tools dry on the line',
      'Locks into the whole PACKOUT stack as you build out',
    ],
    cons: [
      'Premium price',
      'Modular system can pull you in to buy more pieces',
    ],
    url: 'https://www.amazon.com/48-22-8426-Packout-Rolling-Tool-Box/dp/B076QLC84N',
  },
  {
    name: 'Kennedy Signature Machinists Chest',
    model: 'Kennedy 526B',
    tier: 'premium',
    priceNote: 'Dealer-priced; the classic A&P bench box',
    bestFor: 'Best classic bench box for a home or office hangar',
    pros: [
      'The heritage brand A&P mechanics have used for generations',
      'Solid steel with smooth drawers and a proper lock',
      'Holds precision and inspection tools on the bench',
    ],
    cons: [
      'Not a roll-around, it sits on a bench or cart',
      'Sells through industrial distributors, so price varies',
    ],
    url: 'https://www.amazon.com/Kennedy-Manufacturing-526B-8-Drawer-Machinists/dp/B004RI4Q6K',
  },
  {
    name: 'US General 56 in. Double Bank Roller Cabinet',
    model: 'Harbor Freight Item 64864',
    tier: 'premium',
    priceNote: 'About $850 at Harbor Freight',
    bestFor: 'Best hangar roll-away for a serious tool load',
    pros: [
      'Over 21,500 cu in of storage, enough for a full career toolkit',
      'Double-bank layout keeps airframe and powerplant tools separated',
      'Fraction of the cost of a Snap-on or Matco box of similar size',
    ],
    cons: [
      'Big and heavy, it stays in one spot',
      'Not truck-brand prestige if that matters to you',
    ],
    url: 'https://www.harborfreight.com/56-in-x-22-in-roll-cab-series-3-red-58714.html',
  },
]

const tierLabels: Record<Tier, { label: string; badge: string }> = {
  budget: { label: 'Budget', badge: 'bg-green-900/40 text-green-300 border border-green-700/30' },
  mid: { label: 'Mid-Range', badge: 'bg-sky-900/40 text-sky-300 border border-sky-700/30' },
  premium: { label: 'Premium', badge: 'bg-purple-900/40 text-purple-300 border border-purple-700/30' },
}

const amazonTag = 'amttoolbox-20'

function productUrl(url: string) {
  // Add the Amazon Associates tag only to Amazon links.
  if (url.includes('amazon.com')) {
    return `${url}?tag=${amazonTag}`
  }
  return url
}

function ProductCard({ product }: { product: Product }) {
  const tier = tierLabels[product.tier]
  return (
    <article className="bg-[#1e293b] border border-slate-700 rounded-xl p-6 hover:border-[#38bdf8]/40 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-lg text-white font-semibold">{product.name}</h3>
          <p className="text-sm text-slate-500">{product.model}</p>
        </div>
        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${tier.badge}`}>
          {tier.label}
        </span>
      </div>

      <p className="text-sm font-medium text-[#38bdf8] mb-4">{product.bestFor}</p>

      <div className="mb-4">
        <h4 className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-2">Good</h4>
        <ul className="space-y-1.5">
          {product.pros.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-5">
        <h4 className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-2">Trade-offs</h4>
        <ul className="space-y-1.5">
          {product.cons.map((c, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-400">
              <span className="text-slate-600 shrink-0 mt-0.5">•</span>
              {c}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-slate-500 mb-4">Price: {product.priceNote}</p>

      <a
        href={productUrl(product.url)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 w-full bg-[#38bdf8] text-[#0f172a] font-semibold px-4 py-2.5 rounded-lg hover:bg-sky-300 transition-colors"
      >
        Check the current price
        <ExternalLink className="w-4 h-4" />
      </a>
      <p className="text-xs text-slate-600 mt-3">
        Affiliate link: AMT Toolbox may earn a commission at no extra cost to you.
      </p>
    </article>
  )
}

export default function ToolboxesGuide() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What size toolbox does an A&P mechanic need?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For a working A&P, a 30-inch cart or a stackable mobile system covers the everyday load. If you carry both airframe and powerplant tool sets, step up to a 44-inch or larger roll-away. Students can start smaller and grow.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is a Kennedy toolbox worth it for aviation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Kennedy is the heritage bench-box brand A&P mechanics have trusted for decades. It is a great premium bench chest for precision and inspection tools. For heavy field work, a mobile steel cart is often the more practical daily driver.',
        },
      },
      {
        '@type': 'Question',
        name: 'Snap-on, Matco, or US General?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Truck brands like Snap-on and Matco offer top build quality but cost several times more. US General delivers comparable steel and drawer function for a fraction of the price. For most mechanics, a good Harbor Freight box plus better hand tools is the smarter spend.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need a toolbox for A&P school?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most A&P schools provide a tool list and expect you to bring your own hand tools. A portable cart or stackable box you can carry to class is ideal.',
        },
      },
    ],
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mb-8">
        <Link href="/guides" className="inline-flex items-center gap-1.5 text-sm text-[#38bdf8] hover:text-sky-300 mb-4">
          <ArrowRight className="w-4 h-4 rotate-180" />
          All gear guides
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Best Toolboxes for A&amp;P Mechanics
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Aircraft maintenance runs on mobility. Unlike an automotive tech parked at a stall, an
          A&amp;P walks the line, climbs stands, and works in tight spaces. The right toolbox matches
          that. Here are the boxes the field actually uses, organized by how you work.
        </p>
      </div>

      <nav className="bg-[#1e293b] border border-slate-700 rounded-xl p-5 mb-10">
        <h2 className="text-sm font-semibold text-white mb-3">In this guide</h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-300">
          <li><a href="#portable" className="hover:text-[#38bdf8] transition-colors">Mobile boxes for walking the line</a></li>
          <li><a href="#bench" className="hover:text-[#38bdf8] transition-colors">Bench boxes and hangar roll-aways</a></li>
          <li><a href="#how-to-choose" className="hover:text-[#38bdf8] transition-colors">How to choose your first toolbox</a></li>
          <li><a href="#faq" className="hover:text-[#38bdf8] transition-colors">Frequently asked questions</a></li>
        </ol>
      </nav>

      <section id="portable" className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Mobile boxes for walking the line</h2>
        <p className="text-slate-400 mb-6 leading-relaxed max-w-3xl">
          Most A&amp;P work is mobile: the aircraft comes to you, or you roll out to it. These are the
          boxes that move with you, from a budget cart to a premium modular system.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.filter(p => p.tier !== 'premium' || p.name.includes('Milwaukee')).map(p => (
            <ProductCard key={p.model} product={p} />
          ))}
        </div>
      </section>

      <section id="bench" className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Bench boxes and hangar roll-aways</h2>
        <p className="text-slate-400 mb-6 leading-relaxed max-w-3xl">
          When you have a dedicated bench or a hangar bay, a stationary box holds more and locks
          better. The Kennedy is the classic bench chest; the US General roll-away covers serious
          storage on a budget.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {products.filter(p => p.name.includes('Kennedy') || p.name.includes('56')).map(p => (
            <ProductCard key={p.model} product={p} />
          ))}
        </div>
      </section>

      <section id="how-to-choose" className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">How to choose your first toolbox</h2>
        <p className="text-slate-400 leading-relaxed mb-4">
          Ask yourself three questions before spending anything:
        </p>
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex gap-2">
            <span className="text-[#38bdf8] font-bold shrink-0">1.</span>
            <span><strong className="text-white">Where do you work?</strong> Walking an apron or climbing stands means portable wins. A hangar bay with a bench means a stationary box makes sense.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#38bdf8] font-bold shrink-0">2.</span>
            <span><strong className="text-white">How much do you own?</strong> A student starting out can get years of use from a good cart or stackable. A career mechanic with airframe and powerplant sets needs a roll-away.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#38bdf8] font-bold shrink-0">3.</span>
            <span><strong className="text-white">Does it need to lock?</strong> Shared shops and ramp security make a real lock worth the money.</span>
          </li>
        </ul>
        <p className="text-slate-400 leading-relaxed mt-4">
          Starting out? Get the US General cart or a DeWalt TSTAK stacker and upgrade as your tool
          load grows. Don&apos;t buy the premium box before you have the tools to fill it.
        </p>
      </section>

      <section id="faq" className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Frequently asked questions</h2>
        <div className="space-y-4">
          <details className="bg-[#1e293b] border border-slate-700 rounded-lg p-4">
            <summary className="text-white font-medium cursor-pointer">What size toolbox does an A&amp;P mechanic need?</summary>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              For a working A&amp;P, a 30-inch cart or a stackable mobile system covers the everyday
              load. If you carry both airframe and powerplant tool sets, step up to a 44-inch or
              larger roll-away. Students can start smaller and grow.
            </p>
          </details>
          <details className="bg-[#1e293b] border border-slate-700 rounded-lg p-4">
            <summary className="text-white font-medium cursor-pointer">Is a Kennedy toolbox worth it for aviation?</summary>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Kennedy is the heritage bench-box brand A&amp;P mechanics have trusted for decades. It&apos;s
              a great premium bench chest for precision and inspection tools. For heavy field work,
              a mobile steel cart is often the more practical daily driver.
            </p>
          </details>
          <details className="bg-[#1e293b] border border-slate-700 rounded-lg p-4">
            <summary className="text-white font-medium cursor-pointer">Snap-on, Matco, or US General?</summary>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Truck brands like Snap-on and Matco offer top build quality and a lifetime of support,
              but cost several times more. US General delivers comparable steel and drawer function
              for a fraction of the price. For most mechanics, a good Harbor Freight box plus better
              hand tools is the smarter spend.
            </p>
          </details>
          <details className="bg-[#1e293b] border border-slate-700 rounded-lg p-4">
            <summary className="text-white font-medium cursor-pointer">Do I need a toolbox for A&amp;P school?</summary>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Most A&amp;P schools provide a tool list and expect you to bring your own hand tools. A
              portable cart or stackable box you can carry to class is ideal. See our{' '}
              <Link href="/guides/ap-mechanic-tool-list" className="text-[#38bdf8] hover:text-sky-300">
                A&amp;P mechanic tool list
              </Link>{' '}
              for what to put in it.
            </p>
          </details>
        </div>
      </section>

      <div className="border-t border-slate-700 pt-6">
        <p className="text-sm text-slate-500">
          Prices checked at the time of writing and can change. Some links are affiliate links: if
          you buy through them, AMT Toolbox may earn a commission at no extra cost to you. We
          recommend the boxes we would use ourselves.
        </p>
      </div>
    </div>
  )
}
