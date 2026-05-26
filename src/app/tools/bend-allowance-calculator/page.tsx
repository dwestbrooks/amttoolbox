import { Metadata } from 'next'
import BendAllowanceTool from './BendAllowanceTool'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Sheet Metal Bend Allowance Calculator',
  description: 'Calculate bend allowance, setback, and flat blank length for aircraft sheet metal work. Supports 2024-T3, 6061-T6, 4130 steel, and titanium.',
}

export default function Page() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Sheet Metal Bend Allowance Calculator',
        url: 'https://www.amttoolbox.com/tools/bend-allowance-calculator',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description: 'Calculate bend allowance, setback, and flat blank length for aircraft sheet metal work. Supports 2024-T3, 6061-T6, 4130 steel, and titanium.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <BendAllowanceTool />
    </>
  )
}
