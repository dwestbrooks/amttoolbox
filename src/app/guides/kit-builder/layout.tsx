import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'A&P Tool Kit Builder: Build Your First Kit on a Budget',
  description:
    'Input your budget and get a priority-ordered A&P tool buy list. Non-negotiables like safety wire pliers, sockets, and torque first; specialty gear as budget allows. Every pick links to a verified product.',
  alternates: {
    canonical: '/guides/kit-builder',
  },
}

export default function KitBuilderLayout({ children }: { children: React.ReactNode }) {
  return children
}
