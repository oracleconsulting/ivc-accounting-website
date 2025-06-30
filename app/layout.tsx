import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/ivc/layout/Navigation'
import Footer from '@/components/ivc/layout/Footer'
import { OrganizationSchema } from '@/components/ivc/seo/StructuredData'
import CookieConsent from '@/components/ivc/analytics/CookieConsent'
import GoogleTagManager, { GTMNoscript } from '@/components/ivc/analytics/GoogleTagManager'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://ivcaccounting.co.uk'),
  title: {
    default: 'IVC Accounting - Other Accountants File. We Fight.',
    template: '%s | IVC Accounting'
  },
  description: 'Personal UK accounting services with a 50-client limit. Founded by James Howard, who survived 3 PE acquisitions and knows what business owners really need.',
  keywords: [
    'UK accountant',
    'business accounting',
    'PE acquisition accounting',
    'small business accountant',
    'strategic financial advisor',
    'cloud accounting UK',
    'personal accounting services',
    'James Howard accountant',
    '50 client limit',
    'quality accounting UK'
  ],
  authors: [{ name: 'James Howard', url: 'https://ivcaccounting.co.uk/team' }],
  creator: 'IVC Accounting',
  publisher: 'IVC Accounting Ltd',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://ivcaccounting.co.uk',
    siteName: 'IVC Accounting',
    title: 'IVC Accounting - Other Accountants File. We Fight.',
    description: 'Personal UK accounting services with a 50-client limit.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'IVC Accounting - Quality Over Quantity',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IVC Accounting - Other Accountants File. We Fight.',
    description: 'Personal UK accounting services with a 50-client limit.',
    images: ['/images/twitter-card.jpg'],
    creator: '@ivcaccounting',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  icons: {
    icon: '/images/ivc-logo.png',
    apple: '/images/ivc-logo.png',
  },
}

export default function IVCLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <GoogleTagManager />
      <OrganizationSchema />
      <div className={`${inter.className} bg-gray-900 text-white`}>
        <Navigation />
        <main className="pt-20">
          <GTMNoscript />
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </>
  )
} 