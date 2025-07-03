'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a2b4a] text-[#f5f1e8] p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          We use cookies to enhance your experience and analyze our site usage. 
          By clicking "Accept", you consent to our use of cookies.
        </p>
        <button
          onClick={acceptCookies}
          className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] px-6 py-2 rounded-none font-bold text-sm uppercase tracking-wider transition-colors"
        >
          Accept Cookies
        </button>
      </div>
    </div>
  )
} 