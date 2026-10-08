import Link from 'next/link'
import { JsonLd } from './JsonLd'

/**
 * Author byline for the gear guides. The guides are the only pages on this site that
 * make recommendations rather than compute, and they are the ones with affiliate links —
 * so they are the pages that need a named author behind them (and an Article schema
 * naming that author) rather than an anonymous "AMT Toolbox".
 *
 * The bio is deliberately narrow: it claims subject-matter familiarity, not a
 * certification. Nothing here may be upgraded to a credential claim without one.
 */
export default function GuideByline({
  title,
  description,
  publishedDate,
  path,
}: {
  title: string
  description: string
  publishedDate: string
  /** Path of the guide, e.g. /guides/ap-mechanic-tool-list */
  path: string
}) {
  return (
    <div className="mt-12 border-t border-slate-700 pt-6">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          datePublished: publishedDate,
          dateModified: publishedDate,
          author: {
            '@type': 'Person',
            name: 'David Westbrooks',
            url: 'https://www.amttoolbox.com/about',
          },
          publisher: {
            '@type': 'Organization',
            name: 'AMT Toolbox',
            url: 'https://www.amttoolbox.com',
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://www.amttoolbox.com${path}`,
          },
        }}
      />
      <p className="text-sm text-slate-500">
        <span className="text-slate-400 font-medium">Written by David Westbrooks.</span>{' '}
        I research aircraft maintenance tooling and equipment, and I check every price and specification
        on this page against the manufacturer&apos;s or retailer&apos;s own listing at the time of writing.{' '}
        <Link href="/about" className="text-[#38bdf8] hover:text-sky-300">
          More about AMT Toolbox
        </Link>
        .
      </p>
    </div>
  )
}
