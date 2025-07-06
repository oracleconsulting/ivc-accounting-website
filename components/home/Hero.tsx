// components/home/Hero.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Zap, Award, Briefcase, Users, Heart, ArrowRight } from 'lucide-react';
import Button from '@/components/shared/Button';

// Blur placeholder for hero image
const blurDataURL = "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAMG/8QAIxAAAQIFAwUAAAAAAAAAAAAAAgEDAAQVERIGE2EiJTFRcf/EABUBAQEAAAAAAAAAAAAAAAAAAAQF/8QAGxEAAgIDAQAAAAAAAAAAAAAAAQIDBAAFEQb/2gAMAwEAAhEDEQA/AMXoVmTvMDUmhKXcbVGz5gTtEY3TxMsbrb5CaGnb204iBkWZdS+fcOr6WB41ZiekZPsegspIyqBwHP/Z";

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
    transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`,
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Background with parallax */}
      <div className="absolute inset-0" style={parallaxStyle}>
        <Image
          src="/images/james-howard.jpg"
          alt="James Howard - IVC Accounting"
          fill
          priority
          quality={85}
          className="object-cover opacity-30"
          placeholder="blur"
          blurDataURL={blurDataURL}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Fixed header spacer */}
        <div className="h-20"></div>
        
        {/* Quality banner - smaller, integrated style */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-2 px-4 text-center">
          <p className="text-white text-sm font-semibold tracking-wider">
            ✨ QUALITY OVER QUANTITY • 50 CLIENT LIMIT • 47/50 CAPACITY
          </p>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-5xl mx-auto text-center">
            {/* SEO text - subtle */}
            <p className="text-orange-500 text-sm uppercase tracking-wider mb-6 font-medium">
              Chartered Accountants in Halstead, Essex
            </p>
            
            {/* Main heading with shimmer effect */}
            <h1 className="mb-8">
              <span className="block text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2">
                OTHER ACCOUNTANTS
              </span>
              <span className="block text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4 animate-shimmer">
                FILE.
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2">
                WE
              </span>
              <span className="block text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent animate-shimmer">
                FIGHT.
              </span>
            </h1>

            {/* Supporting text */}
            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              We don&apos;t hide behind jargon or drown you in reports. We protect your business 
              and help you build something real.
            </p>

            {/* Location text - subtle */}
            <p className="text-gray-400 text-sm mb-12">
              Proudly serving Halstead, Braintree, Colchester, Chelmsford & all of Essex
            </p>

            {/* CTAs - your original button style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2 group"
                >
                  Book a No-BS Call
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  className="border-2 border-white/30 text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-sm"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                <span className="text-sm">15+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                <span className="text-sm">50 Client Limit</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-orange-500" />
                <span className="text-sm">1 PE Exit (By Choice)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/40" />
        </div>
      </div>
    </section>
  );
}