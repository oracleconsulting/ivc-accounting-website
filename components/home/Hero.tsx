'use client'

import { useEffect, useRef } from 'react'
import Button from '@/components/ivc/shared/Button'
import TrustIndicators from './TrustIndicators'
import FloatingElements from './FloatingElements'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto hero-content">
        <div className="mb-6">
          <span className="inline-block px-6 py-3 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-400 font-semibold">
            🎯 Quality Over Quantity - 50 Client Limit
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6">
          <span className="block text-white">Other Accountants</span>
          <span className="block text-orange-500 text-shadow-glow">File</span>
        </h1>
        
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8">
          <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500 bg-clip-text text-transparent">
            We Fight
          </span>
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          We don't hide behind jargon or drown you in reports. 
          We protect your business and help you build something real.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button variant="primary" size="large" href="/ivc/contact">
            Book a No-BS Call
          </Button>
          <Button variant="secondary" size="large" href="/ivc/about">
            Learn More
          </Button>
        </div>
        
        <TrustIndicators />
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full relative">
          <div className="w-1 h-3 bg-white rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-bounce"></div>
        </div>
      </div>
    </section>
  )
} 