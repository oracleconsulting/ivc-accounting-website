'use client'

import Button from '../shared/Button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
      {/* Animated background - subtle */}
      <div className="absolute inset-0 hero-gradient opacity-30" />
      
      {/* Animated particles - smaller and more subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse top-20 -left-20" />
        <div className="absolute w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse bottom-20 -right-20 animation-delay-2000" />
        <div className="absolute w-56 h-56 bg-blue-500/10 rounded-full blur-3xl animate-pulse top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animation-delay-4000" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main tagline with better spacing */}
          <h1 className="mb-12">
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4">
              Other Accountants
            </span>
            <span className="block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black text-orange-500 mb-4">
              File
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white">
              We <span className="text-orange-500">Fight</span>
            </span>
          </h1>
          
          {/* Subheading with proper spacing */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            We don&apos;t hide behind jargon or drown you in reports. We protect your business and help you build something real.
          </p>
          
          {/* Quality commitment badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-800">
              <span className="text-orange-500 font-bold text-lg">⚡ Quality Over Quantity</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300 font-medium">50 Client Limit</span>
            </div>
          </div>
          
          {/* CTA buttons with proper spacing */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/contact">
              <Button 
                size="large" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              >
                Book a No-BS Call
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                variant="secondary" 
                size="large"
                className="bg-transparent border-2 border-gray-700 text-white hover:bg-gray-900 hover:border-gray-600 font-semibold px-8 py-4 text-lg transition-all"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Trust indicators - better layout */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="text-3xl font-bold text-orange-500 mb-2">15+</div>
              <div className="text-sm text-gray-400">Years Fighting</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="text-3xl font-bold text-orange-500 mb-2">1</div>
              <div className="text-sm text-gray-400">PE Exit (By Choice)</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="text-3xl font-bold text-orange-500 mb-2">50</div>
              <div className="text-sm text-gray-400">Client Limit</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="text-3xl font-bold text-orange-500 mb-2">100%</div>
              <div className="text-sm text-gray-400">Personal Service</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 