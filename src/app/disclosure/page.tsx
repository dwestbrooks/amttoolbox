import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description:
    'How AMT Toolbox earns from product recommendations in its gear guides, and what that means for you as a reader.',
  alternates: {
    canonical: '/disclosure',
  },
}

export default function DisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-white mb-8">Affiliate Disclosure</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-slate-300 leading-relaxed mb-5">
          AMT Toolbox keeps its calculators, study tools, and reference tables free for every
          aviation maintenance professional and student. To help cover the cost of running this
          site, our gear guides include product recommendations that may use affiliate links.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-3">How it works</h2>
        <p className="text-slate-300 leading-relaxed mb-5">
          When you click an affiliate link (such as an Amazon Associates link) and make a purchase,
          AMT Toolbox may earn a small commission from the retailer. This comes at <strong className="text-white">no
          additional cost to you</strong>. The price you pay is exactly the same whether or not you
          use our link.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-3">Does this affect our recommendations?</h2>
        <p className="text-slate-300 leading-relaxed mb-5">
          No. We recommend the tools and equipment we would choose ourselves, based on how the job
          actually works and what the field actually uses. Our picks are not for sale, and we do
          not accept payment in exchange for a favorable placement. We aim to recommend genuinely
          good tools at honest prices, and we note trade-offs on every pick.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-3">Transparency</h2>
        <p className="text-slate-300 leading-relaxed mb-5">
          Affiliate links on our guides are labeled as such. We also note next to each product link
          that AMT Toolbox may earn a commission. We believe in being upfront about how the site
          is funded while keeping our free tools free and our recommendations honest.
        </p>

        <div className="border-t border-slate-700 pt-6 mt-8">
          <p className="text-sm text-slate-500">
            AMT Toolbox is a participant in the Amazon Services LLC Associates Program, an affiliate
            advertising program designed to provide a means for sites to earn advertising fees by
            advertising and linking to Amazon.com. As an Amazon Associate, AMT Toolbox earns from
            qualifying purchases.
          </p>
        </div>
      </div>
    </div>
  )
}
