import { Metadata } from 'next'
import MinBendRadiusClient from './MinBendRadiusClient'

export const metadata: Metadata = {
  alternates: {
    canonical: '/reference/minimum-bend-radius',
  },
  title: 'Minimum Bend Radius Reference Table',
  description: 'Aluminum alloy minimum bend radii for 90-degree bends by temper and sheet thickness, per AC 43.13-1B Table 4-6. 2024-T3, 2024-T61, 5052, 6061, and 7075.',
}

export default function Page() {
  return <MinBendRadiusClient />
}
