'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Import components one by one to isolate the issue
const Navigation = dynamic(() => import('@/components/layout/Navigation'), {
  ssr: false,
  loading: () => <div className="h-20 bg-gray-200">Loading Navigation...</div>
})

const Footer = dynamic(() => import('@/components/layout/Footer'), {
  ssr: false,
  loading: () => <div className="h-40 bg-gray-200">Loading Footer...</div>
})

export default function TestHydration() {
  const [mounted, setMounted] = useState(false)
  const [showNavigation, setShowNavigation] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <div>
      <h1 className="text-2xl font-bold p-8">Hydration Test Page</h1>
      
      <div className="p-8 space-y-4">
        <div>
          <button 
            onClick={() => setShowNavigation(!showNavigation)}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          >
            Toggle Navigation (Currently: {showNavigation ? 'ON' : 'OFF'})
          </button>
          
          <button 
            onClick={() => setShowFooter(!showFooter)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Toggle Footer (Currently: {showFooter ? 'ON' : 'OFF'})
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Mounted: {mounted ? 'YES' : 'NO'}
        </div>
      </div>
      {showNavigation && <Navigation />}
      <div className="min-h-[400px] p-8 bg-gray-100">
        <p>Main content area</p>
      </div>
      {showFooter && <Footer />}
    </div>
  )
} 