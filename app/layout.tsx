import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { OrganizationSchema } from '@/components/seo/StructuredData'
import CookieConsent from '@/components/analytics/CookieConsent'
import GoogleTagManager, { GTMNoscript } from '@/components/analytics/GoogleTagManager'
import Script from 'next/script'
import "./globals.css"
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Import SocialProofTicker with client-side only rendering
const SocialProofTicker = dynamic(
  () => import('@/components/shared/SocialProofTicker'),
  { loading: () => null }
)

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
  variable: '--font-inter'
})

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
}

// Enhanced JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AccountingService',
  '@id': 'https://ivcaccounting.co.uk/#organization',
  name: 'IVC Accounting',
  alternateName: 'IVC Accounting Ltd',
  url: 'https://ivcaccounting.co.uk',
  logo: 'https://ivcaccounting.co.uk/images/ivc-logo.png',
  image: 'https://ivcaccounting.co.uk/images/og-image.jpg',
  description: 'Premium UK accounting services with a 50-client limit. Other accountants file, we fight for every tax saving and growth opportunity.',
  telephone: '+44-20-XXXX-XXXX', // Add your real number
  email: 'james@ivcaccounting.co.uk',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'London',
    addressRegion: 'Greater London',
    addressCountry: 'GB',
    postalCode: 'XXXX XXX' // Add if you have a physical address
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 51.5074,
    longitude: -0.1278
  },
  priceRange: '£££',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00'
    }
  ],
  founder: {
    '@type': 'Person',
    name: 'James Howard',
    jobTitle: 'Founder & CEO',
    description: '15+ years experience with 3 successful PE exits',
    image: 'https://ivcaccounting.co.uk/images/james-howard.jpg'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '47',
    reviewCount: '47'
  },
  areaServed: {
    '@type': 'Country',
    name: 'United Kingdom'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Accounting Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Essential Fighter',
          description: 'Complete compliance and tax services for established businesses'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Strategic Warrior',
          description: 'Strategic accounting and growth planning for ambitious businesses'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Ultimate Champion',
          description: 'Full CFO services and exit planning for scaling businesses'
        }
      }
    ]
  },
  slogan: 'Other Accountants File. We Fight.',
  sameAs: [
    'https://www.linkedin.com/company/ivc-accounting',
    'https://twitter.com/IVCAccounting',
    'https://www.facebook.com/IVCAccounting'
  ]
}

export default function IVCLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-RNTGN1QG93`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RNTGN1QG93', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure'
            });
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "s94ljl596i");
          `}
        </Script>

        {/* Crisp Chat */}
        <Script id="crisp-chat" strategy="afterInteractive">
          {`
            window.$crisp=[];
            window.CRISP_WEBSITE_ID="0a3a3039-81de-4e6d-80c3-e9ae95625d40";
            (function(){
              d=document;s=d.createElement("script");
              s.src="https://client.crisp.chat/l.js";
              s.async=1;d.getElementsByTagName("head")[0].appendChild(s);
            })();
            
            // Customize Crisp appearance
            window.CRISP_READY_TRIGGER = function() {
              $crisp.push(["config", "color:theme", ["#1a2b4a", "#ff6b35"]]);
              $crisp.push(["set", "message:text", ["Hey! James here. Got a quick accounting question? Fire away! 🔥"]]);
            };
          `}
        </Script>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ff6b35" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="author" content="James Howard, IVC Accounting" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta name="twitter:site" content="@IVCAccounting" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://client.crisp.chat" />
      </head>
      <body className={`${inter.className} bg-oracle-cream text-oracle-navy`}>
        {/* Main App */}
        <GoogleTagManager />
        <OrganizationSchema />
        <Navigation />
        <SocialProofTicker />
        <main>
          <GTMNoscript />
          {children}
        </main>
        
        {/* Sticky CTA Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-oracle-orange p-4 z-50 lg:hidden">
          <Link href="/contact" className="block text-center text-oracle-cream font-bold">
            Book Your Free Fight Assessment →
          </Link>
        </div>
        
        <Footer />
        <CookieConsent />
      </body>
    </html>
  )
}