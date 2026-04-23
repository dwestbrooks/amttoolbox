import { Metadata } from 'next'
import TorqueExtensionTool from './TorqueExtensionTool'

export const metadata: Metadata = {
  title: 'Torque Wrench Extension Calculator',
  description: 'Calculate the correct torque wrench setting when using an extension. Essential tool for A&P mechanics and aviation maintenance technicians.',
}

export default function Page() {
  return <TorqueExtensionTool />
}
