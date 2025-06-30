// components/home/Hero.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Zap, Award, Briefcase, Users, Heart, ArrowRight } from 'lucide-react';
import Button from '@/components/shared/Button';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxStyle = {
    transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/10 to-blue-500/10 animate-gradient-shift" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-float" style={parallaxStyle} />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-6xl mx-auto">
          {/* Badge */}
          <div className="mb-8 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/20 backdrop-blur-sm rounded-full border border-orange-500/30 text-orange-400 font-bold animate-pulse-subtle">
              <Zap className="w-4 h-4" />
              QUALITY OVER QUANTITY • 50 CLIENT LIMIT
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="mb-8 animate-fade-in-up">
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Other Accountants
            </span>
            <span className="block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black text-orange-500 mb-4 animate-glow">
              FILE
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold">
              We <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-500 animate-text-shimmer">FIGHT</span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fade-in">
            We don&apos;t hide behind jargon or drown you in reports. 
            We protect your business and help you build something real.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in">
            <Link href="/contact">
              <Button 
                size="large" 
                className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 flex items-center justify-center gap-2"
              >
                Book a No-BS Call
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                variant="secondary" 
                size="large"
                className="border-2 border-gray-600 hover:border-orange-500 hover:text-orange-500 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-sm"
              >
                Learn More
              </Button>
            </Link>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up delay-300">
            {[
              { value: '15+', label: 'Years Fighting', icon: Award },
              { value: '1', label: 'PE Exit (By Choice)', icon: Briefcase },
              { value: '50', label: 'Client Limit', icon: Users },
              { value: '100%', label: 'Personal Service', icon: Heart }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1">
                  <stat.icon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-orange-500 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-gray-400" />
      </div>
    </section>
  );
}