import { Metadata } from 'next'
import WeightBalanceTool from './WeightBalanceTool'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Weight & Balance Moment Calculator',
  description: 'Calculate weight, moment, and CG location for aircraft weight and balance calculations. Add multiple items with weight and arm station.',
}

export default function Page() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Weight & Balance Moment Calculator',
        url: 'https://www.amttoolbox.com/tools/weight-balance-calculator',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description: 'Calculate weight, moment, and CG location for aircraft weight and balance calculations. Add multiple items with weight and arm station.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <WeightBalanceTool />
    </>
  )
}
