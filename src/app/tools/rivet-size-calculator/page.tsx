import { Metadata } from 'next'
import RivetSizeTool from './RivetSizeTool'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Rivet Size Calculator',
  description: 'Calculate recommended rivet diameter, edge distance, pitch, and grip length for aircraft sheet metal repairs.',
}

export default function Page() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Rivet Size Calculator',
        url: 'https://www.amttoolbox.com/tools/rivet-size-calculator',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description: 'Calculate recommended rivet diameter, edge distance, pitch, and grip length for aircraft sheet metal repairs.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <RivetSizeTool />
    </>
  )
}
