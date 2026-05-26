import { Metadata } from 'next'
import WireGaugeTool from './WireGaugeTool'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Aircraft Wire Gauge Calculator',
  description: 'Calculate minimum recommended AWG wire size for aircraft electrical circuits based on current, voltage, wire length, and allowable voltage drop.',
}

export default function Page() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Aircraft Wire Gauge Calculator',
        url: 'https://www.amttoolbox.com/tools/wire-gauge-calculator',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description: 'Calculate minimum recommended AWG wire size for aircraft electrical circuits based on current, voltage, wire length, and allowable voltage drop.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <WireGaugeTool />
    </>
  )
}
