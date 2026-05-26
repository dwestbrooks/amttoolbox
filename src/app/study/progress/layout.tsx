import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Study Progress',
  description: 'Track your A&P exam practice progress across General, Airframe, and Powerplant questions.',
  robots: { index: false },
}

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
