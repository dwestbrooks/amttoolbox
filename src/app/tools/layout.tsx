import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'A&P Mechanic Calculators & Reference Tools',
  description: 'Free aviation maintenance calculators: bend allowance, torque extension, rivet size, hydraulic pressure, weight & balance, Ohm\'s law, wire gauge, and more for A&P technicians.',
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
