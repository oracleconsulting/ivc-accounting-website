import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { OrganizationStructuredData } from '@/components/seo/StructuredData'
import { LocalBusinessSchema } from '@/components/seo/EnhancedStructuredData'
import CookieConsent from '@/components/analytics/CookieConsent'
import GoogleTagManager, { GTMNoscript } from '@/components/analytics/GoogleTagManager'
import Script from 'next/script'
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
        <OrganizationStructuredData />
        <LocalBusinessSchema />
        <Navigation />
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