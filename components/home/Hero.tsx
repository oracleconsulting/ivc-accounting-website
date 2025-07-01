// components/home/Hero.tsx
'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [clientCount, setClientCount] = useState(42); // This would come from your database
  
  return (
    <section className="relative min-h-[80vh] bg-[#1a2b4a] flex items-center justify-center overflow-hidden pt-20">
      {/* Geometric Pattern Background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 40px,
          #ff6b35 40px,
          #ff6b35 41px
        )`
      }} />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black uppercase mb-6">
          <span className="text-[#f5f1e8]">OTHER ACCOUNTANTS FILE.</span>
          <span className="block text-[#ff6b35] mt-2">WE FIGHT.</span>
        </h1>
        
        {/* Client Counter */}
        <div className="mt-8 mb-12">
          <div className="relative inline-block group">
            <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#ff6b35] group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
            <div className="relative bg-[#1a2b4a] border-2 border-[#ff6b35] p-6">
              <div className="flex items-center gap-4">
                <div className="text-[#f5f1e8]">
                  <div className="text-5xl font-black">{clientCount}/50</div>
                  <div className="text-sm uppercase tracking-wider">Clients</div>
                </div>
                <div className="w-48 bg-[#1a2b4a] h-4 border border-[#f5f1e8]/20">
                  <div 
                    className="h-full bg-[#ff6b35]" 
                    style={{ width: `${(clientCount/50)*100}%` }}
                  />
                </div>
              </div>
              <p className="text-[#ff6b35] font-bold mt-2">
                {50 - clientCount} SPOTS LEFT
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-xl md:text-2xl text-[#f5f1e8]/80 mb-8 leading-relaxed">
          50 clients. No investors. Just James Howard,<br />
          your personal CPA who actually gives a damn.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <button className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase px-8 py-4 text-lg transition-all hover:translate-x-1">
              BOOK A NO-BS CALL →
            </button>
          </Link>
          <Link href="/pricing">
            <button className="border-2 border-[#f5f1e8] text-[#f5f1e8] hover:bg-[#f5f1e8] hover:text-[#1a2b4a] font-black uppercase px-8 py-4 text-lg transition-all">
              SEE IF WE&apos;RE FULL
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}