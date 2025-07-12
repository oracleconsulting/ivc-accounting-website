// components/home/Hero.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Award, Users, Heart } from 'lucide-react';
import Button from '@/components/shared/Button';

const blurDataURL = "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAMG/8QAIxAAAQIFAwUAAAAAAAAAAAAAAgEDAAQVERIGE2EiJTFRcf/EABUBAQEAAAAAAAAAAAAAAAAAAAQF/8QAGxEAAgIDAQAAAAAAAAAAAAAAAQIDBAAFEQb/2gAMAwEAAhEDEQA/AMXoVmTvMDUmhKXcbVGz5gTtEY3TxMsbrb5CaGnb204iBkWZdS+fcOr6WB41ZiekZPsegspIyqBwHP/Z";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Only apply parallax after component is mounted
  const parallaxStyle = mounted ? {
    transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
  } : {};

  return (
    <section className="relative min-h-screen bg-[#1a2b4a] overflow-hidden">
      {/* Background texture/pattern - MORE VISIBLE */}
      <div className="absolute inset-0">
        {/* Grid pattern - very visible */}
        <div 
          className="absolute inset-0 opacity-40" 
          style={{
            backgroundImage: 'linear-gradient(to right, #f5f1e8 1px, transparent 1px), linear-gradient(to bottom, #f5f1e8 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} 
        />
        
        {/* Diagonal pattern overlay - more visible */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              #ff6b35 40px,
              #ff6b35 42px
            )`
          }} 
        />
        
        {/* Data visualization dots in corner - much more prominent */}
        <div className="absolute top-32 right-10 opacity-60">
          <div className="grid grid-cols-8 gap-3">
            {[...Array(64)].map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 ${i % 3 === 0 ? 'bg-[#ff6b35]' : 'bg-[#4a90e2]'} ${i % 5 === 0 ? 'opacity-100' : 'opacity-60'}`} 
              />
            ))}
          </div>
        </div>

        {/* Additional dots pattern on left - more visible */}
        <div className="absolute bottom-40 left-10 opacity-50 rotate-45">
          <div className="grid grid-cols-6 gap-2">
            {[...Array(36)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 ${i % 2 === 0 ? 'bg-[#4a90e2]' : 'bg-[#f5f1e8]'} ${i % 4 === 0 ? 'opacity-100' : 'opacity-70'}`} 
              />
            ))}
          </div>
        </div>
        
        {/* Extra dot pattern in top left */}
        <div className="absolute top-40 left-20 opacity-40">
          <div className="grid grid-cols-5 gap-4">
            {[...Array(25)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-[#ff6b35]' : 'bg-[#f5f1e8]'}`} 
              />
            ))}
          </div>
        </div>

        {/* Additional geometric accent - bottom right */}
        <div className="absolute bottom-20 right-20 opacity-50">
          <div className="flex gap-2">
            <div className="w-20 h-20 border-2 border-[#4a90e2]" />
            <div className="w-20 h-20 bg-[#ff6b35] opacity-30" />
          </div>
        </div>
      </div>

      {/* Mountain/data shapes - increased opacity */}
      <div className="absolute bottom-0 left-0 w-full h-[60%] opacity-20">
        <svg viewBox="0 0 1440 400" className="w-full h-full">
          <polygon points="0,400 480,200 960,100 1440,300 1440,400" fill="#ff6b35" />
          <polygon points="0,400 720,250 1440,150 1440,400" fill="#4a90e2" />
        </svg>
      </div>

      {/* Background image with parallax */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2b4a]/80 via-[#1a2b4a]/90 to-[#1a2b4a]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Fixed header spacer */}
        <div className="h-20"></div>
        
        {/* Orange quality banner - as a centered badge */}
        <div className="flex justify-center mt-4 mb-8">
          <div className="bg-[#ff6b35] py-2 px-6 inline-flex items-center gap-2">
            <span className="text-[#f5f1e8] font-bold uppercase tracking-wider text-sm">
              ✨ QUALITY OVER QUANTITY • 50 CLIENT LIMIT • 12/50 CAPACITY
            </span>
          </div>
        </div>

        {/* Main content - centered */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-5xl mx-auto">
            {/* Small SEO text */}
            <p className="text-[#ff6b35] uppercase tracking-wider text-sm font-bold mb-8">
              CHARTERED ACCOUNTANTS IN HALSTEAD, ESSEX
            </p>
            
            {/* Main heading - centered */}
            <h1 className="mb-8">
              <span className="block text-5xl md:text-6xl lg:text-7xl font-black uppercase text-[#f5f1e8] mb-4">
                OTHER ACCOUNTANTS
              </span>
              <span className="block text-6xl md:text-7xl lg:text-8xl font-black uppercase text-[#4a90e2] mb-6">
                FILE.
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl font-black uppercase text-[#f5f1e8] mb-4">
                WE
              </span>
              <span className="block text-6xl md:text-7xl lg:text-8xl font-black uppercase text-[#ff6b35]">
                FIGHT.
              </span>
            </h1>

            {/* Supporting text - centered */}
            <p className="text-xl md:text-2xl text-[#f5f1e8]/80 mb-6 max-w-3xl mx-auto">
              We don&apos;t hide behind jargon or drown you in reports. We protect your business 
              and help you build something real.
            </p>

            {/* Location text - subtle */}
            <p className="text-[#f5f1e8]/60 text-base mb-12">
              Proudly serving Halstead, Braintree, Colchester, Chelmsford & all of Essex
            </p>

            {/* CTAs - centered */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105">
                  BOOK A NO-BS CALL →
                </button>
              </Link>
              <Link href="/about">
                <button className="border-2 border-[#f5f1e8] text-[#f5f1e8] hover:bg-[#f5f1e8] hover:text-[#1a2b4a] font-black uppercase px-8 py-4 text-lg transition-all duration-300">
                  LEARN MORE
                </button>
              </Link>
            </div>

            {/* Trust indicators - centered */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-[#f5f1e8]/60">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ff6b35]" />
                <span className="text-sm uppercase">15+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ff6b35]" />
                <span className="text-sm uppercase">50 Client Limit</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#ff6b35]" />
                <span className="text-sm uppercase">1 PE Exit (By Choice)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-[#f5f1e8]/40" />
        </div>
      </div>
    </section>
  );
}