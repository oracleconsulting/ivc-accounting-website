// components/home/Hero.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Zap, Award, Briefcase, Users, Heart, ArrowRight } from 'lucide-react';
import Button from '@/components/shared/Button';

// Blur placeholder for hero image
const blurDataURL = "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAMG/8QAIxAAAQIFAwUAAAAAAAAAAAAAAgEDAAQFERIGE2EiJTFRcf/EABUBAQEAAAAAAAAAAAAAAAAAAAQF/8QAGxEAAgIDAQAAAAAAAAAAAAAAAQIDBAAFEQb/2gAMAwEAAhEDEQA/AMXoVmTvMDUmhKXcbVGz5gTtEY3TxMsbrb5CaGnb204iBkWZdS+fcOr6WB41ZiekZPsegspIyqBwHP/Z";

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
    <section className="relative min-h-screen bg-[#1a2b4a]">
      {/* Fixed header spacer */}
      <div className="h-20"></div>
      
      {/* Orange banner - now with proper spacing */}
      <div className="bg-[#ff6b35] py-3 text-center relative z-50">
        <p className="text-[#f5f1e8] font-bold uppercase tracking-wider text-sm md:text-base">
          ✨ QUALITY OVER QUANTITY • 50 CLIENT LIMIT
        </p>
      </div>
      
      <div className="relative min-h-[calc(100vh-8rem)] flex items-center">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/optimized/hero-1920.webp"
            alt="James Howard, Chartered Accountant in Halstead Essex - Founder of IVC Accounting"
            fill
            priority
            quality={85}
            sizes="(max-width: 640px) 640px, (max-width: 1200px) 1200px, 1920px"
            placeholder="blur"
            blurDataURL={blurDataURL}
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a2b4a]/90 to-[#1a2b4a]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-5xl">
            {/* Small SEO text above main message */}
            <p className="text-[#ff6b35] uppercase tracking-wider text-sm md:text-base mb-4 font-bold">
              Chartered Accountants in Halstead, Essex
            </p>
            
            {/* Main brand message - LARGE AND PROMINENT */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase mb-8 leading-tight hero-title">
              <span className="text-[#f5f1e8] block">OTHER ACCOUNTANTS</span>
              <span className="text-[#4a90e2] block text-6xl md:text-7xl lg:text-8xl xl:text-9xl">FILE.</span>
              <span className="text-[#f5f1e8] block">WE</span>
              <span className="text-[#ff6b35] block text-6xl md:text-7xl lg:text-8xl xl:text-9xl">FIGHT.</span>
            </h1>
            
            {/* Supporting text */}
            <p className="text-xl md:text-2xl text-[#f5f1e8]/80 mb-8 max-w-3xl">
              We don&apos;t hide behind jargon or drown you in reports. We protect your business 
              and help you build something real.
            </p>
            
            {/* Location line for SEO */}
            <p className="text-base md:text-lg text-[#f5f1e8]/60 mb-12">
              Proudly serving Halstead, Braintree, Colchester, Chelmsford & all of Essex
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button 
                  size="large" 
                  className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] px-8 py-4 text-lg font-black uppercase transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2 group"
                >
                  Book a No-BS Call
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  variant="secondary" 
                  size="large"
                  className="border-2 border-[#f5f1e8] text-[#f5f1e8] hover:bg-[#f5f1e8] hover:text-[#1a2b4a] px-8 py-4 text-lg font-black uppercase transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-[#f5f1e8]/40" />
      </div>
    </section>
  );
}