'use client'

import Button from '../shared/Button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated background */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse top-10 left-10" />
        <div className="absolute w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse bottom-10 right-10 animation-delay-2000" />
        <div className="absolute w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animation-delay-4000" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main tagline with dynamic text effect */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
          <span className="block text-white text-reveal">Other Accountants</span>
          <span className="block text-orange-500 neon-orange text-reveal animation-delay-200">File</span>
          <span className="block text-white text-reveal animation-delay-400">
            We <span className="text-transparent bg-clip-text gradient-bg">Fight</span>
          </span>
        </h1>
        
        {/* Subheading with better contrast */}
        <p className="text-xl sm:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed high-contrast">
          We don&apos;t hide behind jargon or drown you in reports. We protect your business and help you build something real.
        </p>
        
        {/* Quality commitment badge */}
        <div className="inline-flex items-center gap-2 mb-12 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
          <span className="text-orange-500 font-semibold">⚡ Quality Over Quantity</span>
          <span className="text-white">•</span>
          <span className="text-white font-medium">50 Client Limit</span>
        </div>
        
        {/* CTA buttons with enhanced styling */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button 
              size="large" 
              className="btn-glow pulse-cta bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 text-lg"
            >
              Book a No-BS Call
            </Button>
          </Link>
          <Link href="/about">
            <Button 
              variant="secondary" 
              size="large"
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-8 py-4 text-lg card-hover"
            >
              Learn More
            </Button>
          </Link>
        </div>
        
        {/* Trust indicators with animation */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center float-animation">
            <div className="text-4xl font-bold text-orange-500 neon-orange">15+</div>
            <div className="text-sm text-gray-300 mt-1">Years Fighting</div>
          </div>
          <div className="text-center float-animation animation-delay-1000">
            <div className="text-4xl font-bold text-orange-500 neon-orange">1</div>
            <div className="text-sm text-gray-300 mt-1">PE Exit (By Choice)</div>
          </div>
          <div className="text-center float-animation animation-delay-2000">
            <div className="text-4xl font-bold text-orange-500 neon-orange">50</div>
            <div className="text-sm text-gray-300 mt-1">Client Limit</div>
          </div>
          <div className="text-center float-animation animation-delay-3000">
            <div className="text-4xl font-bold text-orange-500 neon-orange">100%</div>
            <div className="text-sm text-gray-300 mt-1">Personal Service</div>
          </div>
        </div>
      </div>
    </section>
  )
} 