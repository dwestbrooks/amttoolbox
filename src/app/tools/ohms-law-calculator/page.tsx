import { Metadata } from 'next'
import OhmsLawTool from './OhmsLawTool'

export const metadata: Metadata = {
  title: "Ohm's Law / Circuit Calculator",
  description: "Calculate voltage, current, resistance, or power using Ohm's Law. Includes power wheel SVG, aircraft circuit reference, and wire heating note.",
}

export default function Page() {
  return <OhmsLawTool />
}
