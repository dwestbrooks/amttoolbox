import { Metadata } from 'next'
import HydraulicTool from './HydraulicTool'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Hydraulic Pressure / Force / Area Calculator',
  description: "Calculate hydraulic pressure, force, or area using Pascal's Law. Essential reference for aircraft hydraulic system troubleshooting.",
}

export default function Page() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Hydraulic Pressure / Force / Area Calculator',
        url: 'https://www.amttoolbox.com/tools/hydraulic-calculator',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description: "Calculate hydraulic pressure, force, or area using Pascal's Law. Essential reference for aircraft hydraulic system troubleshooting.",
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <HydraulicTool />
    </>
  )
}
