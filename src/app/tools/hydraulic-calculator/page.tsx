import { Metadata } from 'next'
import HydraulicTool from './HydraulicTool'

export const metadata: Metadata = {
  title: 'Hydraulic Pressure / Force / Area Calculator',
  description: "Calculate hydraulic pressure, force, or area using Pascal's Law. Essential reference for aircraft hydraulic system troubleshooting.",
}

export default function Page() {
  return <HydraulicTool />
}
