import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import OutboundLinkTracker from '@/components/analytics/OutboundLinkTracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.amttoolbox.com'),
  title: {
    default: 'Free A&P Mechanic Calculators & Tools | AMT Toolbox',
    template: '%s | AMT Toolbox',
  },
  description: 'Free tools and reference resources for Aircraft Maintenance Technicians and A&P students.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.amttoolbox.com',
    siteName: 'AMT Toolbox',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AMT Toolbox — Free A&P Mechanic Calculators & Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" style={{ background: '#0f172a' }}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-96B8NQ63BP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-96B8NQ63BP');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'AMT Toolbox',
              url: 'https://www.amttoolbox.com',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Web',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              description: 'Free tools and reference resources for Aircraft Maintenance Technicians and A&P students.',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.amttoolbox.com' },
                { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://www.amttoolbox.com/tools' },
                { '@type': 'ListItem', position: 3, name: 'Study', item: 'https://www.amttoolbox.com/study' },
                { '@type': 'ListItem', position: 4, name: 'Reference', item: 'https://www.amttoolbox.com/reference' },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-[#0f172a] text-white min-h-screen flex flex-col`}>
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <OutboundLinkTracker />
      </body>
    </html>
  )
}
