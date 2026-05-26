import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'A&P Practice Quiz',
  description: 'Test your knowledge with randomized FAA A&P exam practice questions covering General, Airframe, and Powerplant topics.',
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
