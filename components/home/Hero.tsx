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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Hero Background Image */}
      <Image
        src="/images/optimized/hero-1920.webp"
        alt="James Howard - IVC Accounting Halstead Essex"
        fill
        priority
        quality={85}
        sizes="(max-width: 640px) 640px, (max-width: 1200px) 1200px, 1920px"
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="object-cover opacity-90"
      />
      
      {/* Geometric Background Pattern Overlay */}
      <div className="absolute inset-0 bg-[#1a2b4a]/80">
        {/* Abstract Mountain Shapes */}
        <div className="absolute bottom-0 left-0 w-full h-[70%]">
          <svg viewBox="0 0 1440 800" className="w-full h-full">
            <polygon points="0,800 480,400 720,300 960,450 1440,200 1440,800" fill="#ff6b35" opacity="0.1" />
            <polygon points="0,800 360,500 600,400 840,550 1200,350 1440,450 1440,800" fill="#4a90e2" opacity="0.1" />
            <polygon points="0,800 240,600 480,500 720,650 1080,450 1440,600 1440,800" fill="#f5f1e8" opacity="0.05" />
          </svg>
        </div>
        
        {/* Floating Data Points */}
        <div className="absolute top-20 right-20 opacity-20" style={parallaxStyle}>
          <div className="grid grid-cols-8 gap-1">
            {[...Array(32)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 ${i % 3 === 0 ? 'bg-[#ff6b35]' : 'bg-[#4a90e2]'} ${i % 5 === 0 ? 'animate-pulse' : ''}`}
              />
            ))}
          </div>
        </div>
        
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(to right, #f5f1e8 1px, transparent 1px), linear-gradient(to bottom, #f5f1e8 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-6xl mx-auto">
          {/* Badge */}
          <div className="mb-8 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-[#f5f1e8] rounded-none font-bold text-sm uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              QUALITY OVER QUANTITY • 50 CLIENT LIMIT
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="mb-8 animate-fade-in-up">
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-[#f5f1e8] mb-4">
              CHARTERED ACCOUNTANTS
            </span>
            <span className="block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tight text-[#ff6b35] mb-4">
              IN HALSTEAD, ESSEX
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-[#f5f1e8]">
              OTHER ACCOUNTANTS <span className="text-[#4a90e2]">FILE.</span>
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-[#ff6b35]">
              WE <span className="text-[#4a90e2]">FIGHT.</span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#f5f1e8]/80 mb-6 max-w-3xl mx-auto animate-fade-in font-light">
            We don&apos;t hide behind jargon or drown you in reports. 
            We protect your business and help you build something real.
          </p>
          
          <p className="text-lg text-[#f5f1e8]/60 mb-12 max-w-3xl mx-auto animate-fade-in">
            Proudly serving Halstead, Braintree, Colchester, Chelmsford & all of Essex
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in">
            <Link href="/contact">
              <Button 
                size="large" 
                className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] px-8 py-4 rounded-none font-bold text-lg uppercase tracking-wide transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2 group"
              >
                Book a No-BS Call
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                variant="secondary" 
                size="large"
                className="border-2 border-[#f5f1e8] text-[#f5f1e8] hover:bg-[#f5f1e8] hover:text-[#1a2b4a] px-8 py-4 rounded-none font-bold text-lg uppercase tracking-wide transition-all duration-300"
              >
                Learn More
              </Button>
            </Link>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up delay-300">
            {[
              { value: '15+', label: 'YEARS FIGHTING', icon: Award },
              { value: '1', label: 'PE EXIT (BY CHOICE)', icon: Briefcase },
              { value: '50', label: 'CLIENT LIMIT', icon: Users },
              { value: '100%', label: 'PERSONAL SERVICE', icon: Heart }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-[#ff6b35] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="relative bg-[#f5f1e8]/5 backdrop-blur-sm border border-[#f5f1e8]/20 p-6 hover:border-[#ff6b35]/50 transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-[#ff6b35] mx-auto mb-2" />
                  <div className="text-3xl font-black text-[#ff6b35] mb-1">{stat.value}</div>
                  <div className="text-xs font-bold text-[#f5f1e8]/60 uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
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