import { Metadata } from 'next'
import TorqueConverterTool from './TorqueConverterTool'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Torque Unit Converter',
  description: 'Convert between in-lb, ft-lb, N·m, and kgf·cm. Includes AN bolt torque reference table for A&P mechanics.',
}

export default function Page() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Torque Unit Converter',
        url: 'https://www.amttoolbox.com/tools/torque-unit-converter',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description: 'Convert between in-lb, ft-lb, N·m, and kgf·cm. Includes AN bolt torque reference table for A&P mechanics.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <TorqueConverterTool />
    </>
  )
}
