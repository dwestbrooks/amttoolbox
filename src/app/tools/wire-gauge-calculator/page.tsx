import { Metadata } from 'next'
import WireGaugeTool from './WireGaugeTool'

export const metadata: Metadata = {
  title: 'Aircraft Wire Gauge Calculator',
  description: 'Calculate minimum recommended AWG wire size for aircraft electrical circuits based on current, voltage, wire length, and allowable voltage drop.',
}

export default function Page() {
  return <WireGaugeTool />
}
