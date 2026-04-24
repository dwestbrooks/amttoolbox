import { Metadata } from 'next'
import MinBendRadiusClient from './MinBendRadiusClient'

export const metadata: Metadata = {
  title: 'Minimum Bend Radius Reference Table',
  description: 'Minimum bend radius by material, temper, and thickness per AC 43.13-1B. 2024-T3, 6061-T6, 7075-T6, 4130 steel, and titanium.',
}

export default function Page() {
  return <MinBendRadiusClient />
}
