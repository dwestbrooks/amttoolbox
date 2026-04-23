import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.amttoolbox.com'),
  title: {
    default: 'AMT Toolbox',
    template: '%s | AMT Toolbox',
  },
  description: 'Free tools and reference resources for Aircraft Maintenance Technicians and A&P students.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.amttoolbox.com',
    siteName: 'AMT Toolbox',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" style={{ background: '#0f172a' }}>
      <body className={`${inter.className} bg-[#0f172a] text-white min-h-screen flex flex-col`}>
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
