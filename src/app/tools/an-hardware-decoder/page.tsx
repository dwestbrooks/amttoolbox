import { Metadata } from 'next'
import ANHardwareDecoderTool from './ANHardwareDecoderTool'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'AN Hardware Decoder',
  description: 'Decode AN and MS aircraft hardware part numbers. Understand bolt sizes, nut types, and washer specifications instantly.',
}

export default function Page() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'AN Hardware Decoder',
        url: 'https://www.amttoolbox.com/tools/an-hardware-decoder',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description: 'Decode AN and MS aircraft hardware part numbers. Understand bolt sizes, nut types, and washer specifications instantly.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <ANHardwareDecoderTool />
    </>
  )
}
