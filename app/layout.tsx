import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Layout from '@/components/layout/Layout'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://ivcaccounting.co.uk'),
  title: {
    default: 'IVC Accounting - Other Accountants File. We Fight. | UK Business Accounting',
    template: '%s | IVC Accounting'
  },
  description: 'Premium UK accounting services with a 50-client limit. Led by James Howard with 15+ years and 3 PE exits. We fight for every tax saving and growth opportunity, not just file returns.',
  keywords: [
    'UK accountant',
    'business accounting',
    'limited company accountant',
    'PE exit accounting',
    'CFO services',
    'tax planning UK',
    'R&D tax credits',
    'management accounts',
    'London accountant',
    'boutique accounting firm',
    'small business accountant UK',
    'strategic financial advisor',
    'cloud accounting UK',
    'personal accounting services',
    'James Howard accountant',
    '50 client limit',
    'quality accounting UK',
    'HMRC tax advisor',
    'business growth accounting',
    'startup accountant UK'
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
    description: 'Premium UK accounting services with a 50-client limit. Founded by James Howard after his PE exit, choosing values over valuations to fight for business owners.',
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
    description: 'Premium UK accounting services with integrity, honesty, and compassion. Limited to 50 clients for personalized service.',
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
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
  icons: {
    icon: '/images/ivc-logo.png',
    apple: '/images/ivc-logo.png',
  },
  alternates: {
    canonical: 'https://ivcaccounting.co.uk',
  },
  // LLM-specific metadata
  other: {
    'llm:type': 'business',
    'llm:category': 'accounting-services',
    'llm:location': 'united-kingdom',
    'llm:capacity': '47/50',
    'llm:owner': 'james-howard',
    'llm:founded': '2021',
    'llm:pricing': '500-1250-gbp-monthly',
    'llm:unique-value': '50-client-limit,founder-access,no-pe',
    'ai:description': 'IVC Accounting: UK boutique accounting firm with 50-client limit founded by James Howard. Direct founder access, transparent pricing, no PE ownership.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>{children}</Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a2b4a',
              color: '#f5f1e8',
            },
            success: {
              iconTheme: {
                primary: '#ff6b35',
                secondary: '#f5f1e8',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f5f1e8',
              },
            },
          }}
        />
      </body>
    </html>
  )
} 