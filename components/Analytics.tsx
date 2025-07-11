'use client'

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function Analytics() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]){window.dataLayer.push(args);}
    gtag('js', new Date());
    gtag('config', 'G-RNTGN1QG93', {
      page_path: window.location.pathname,
      cookie_flags: 'SameSite=None;Secure'
    });
  }, [])

  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js?id=G-RNTGN1QG93"
      strategy="afterInteractive"
    />
  )
} 