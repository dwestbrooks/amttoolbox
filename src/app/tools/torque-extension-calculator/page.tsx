import { Metadata } from 'next'
import TorqueExtensionTool from './TorqueExtensionTool'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Torque Wrench Extension Calculator',
  description: 'Calculate the correct torque wrench setting when using an extension. Essential tool for A&P mechanics and aviation maintenance technicians.',
}

export default function Page() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Torque Wrench Extension Calculator',
        url: 'https://www.amttoolbox.com/tools/torque-extension-calculator',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description: 'Calculate the correct torque wrench setting when using an extension. Essential tool for A&P mechanics and aviation maintenance technicians.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <TorqueExtensionTool />
    </>
  )
}
