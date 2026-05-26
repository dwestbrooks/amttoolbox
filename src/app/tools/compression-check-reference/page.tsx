import { Metadata } from 'next'
import CompressionCheckTool from './CompressionCheckTool'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Engine Compression Check Reference',
  description: 'Differential compression check interpretation guide for Continental and Lycoming aircraft engines. Understand what your readings mean.',
}

export default function Page() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Engine Compression Check Reference',
        url: 'https://www.amttoolbox.com/tools/compression-check-reference',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description: 'Differential compression check interpretation guide for Continental and Lycoming aircraft engines. Understand what your readings mean.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <CompressionCheckTool />
    </>
  )
}
