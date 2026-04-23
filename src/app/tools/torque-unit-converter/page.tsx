import { Metadata } from 'next'
import TorqueConverterTool from './TorqueConverterTool'

export const metadata: Metadata = {
  title: 'Torque Unit Converter',
  description: 'Convert between in-lb, ft-lb, N·m, and kgf·cm. Includes AN bolt torque reference table for A&P mechanics.',
}

export default function Page() {
  return <TorqueConverterTool />
}
