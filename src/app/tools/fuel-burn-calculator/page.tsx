import { Metadata } from 'next'
import FuelBurnTool from './FuelBurnTool'

export const metadata: Metadata = {
  alternates: {
    canonical: '/tools/fuel-burn-calculator',
  },
  title: 'Fuel Burn / Endurance / Range Calculator',
  description: 'Calculate aircraft endurance, range, or fuel required. Includes wind correction, unit conversion, and FAA reserve rule notes.',
}

export default function Page() {
  return <FuelBurnTool />
}
