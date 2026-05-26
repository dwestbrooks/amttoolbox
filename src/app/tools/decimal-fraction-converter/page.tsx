import { Metadata } from 'next'
import DecimalFractionTool from './DecimalFractionTool'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Decimal Fraction Converter & Drill Size Chart',
  description: 'Convert between fractional inches, decimal inches, and millimeters. Complete drill size reference table with wire gauge, letter, and fractional sizes.',
}

export default function Page() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Decimal Fraction Converter & Drill Size Chart',
        url: 'https://www.amttoolbox.com/tools/decimal-fraction-converter',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description: 'Convert between fractional inches, decimal inches, and millimeters. Complete drill size reference table with wire gauge, letter, and fractional sizes.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <DecimalFractionTool />
    </>
  )
}
