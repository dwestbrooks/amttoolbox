import { Metadata } from 'next'
import BendAllowanceTool from './BendAllowanceTool'

export const metadata: Metadata = {
  title: 'Sheet Metal Bend Allowance Calculator',
  description: 'Calculate bend allowance, setback, and flat blank length for aircraft sheet metal work. Supports 2024-T3, 6061-T6, 4130 steel, and titanium.',
}

export default function Page() {
  return <BendAllowanceTool />
}
