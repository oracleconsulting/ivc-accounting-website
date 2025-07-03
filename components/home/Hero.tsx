// components/home/Hero.tsx
'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [clientCount, setClientCount] = useState(42); // Default value
  
  useEffect(() => {
    // Fetch client count from API
    const fetchClientCount = async () => {
      try {
        // Fetch from local API route, not external API
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setClientCount(data.current_clients);
        }
      } catch (error) {
        console.error('Failed to fetch client count:', error);
        // Keep default value if fetch fails
      }
    };
    
    fetchClientCount();
  }, []);
  
  return (
    <section className="relative min-h-[80vh] bg-oracle-navy flex items-center justify-center overflow-hidden pt-20">
      {/* Geometric Pattern Background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 40px,
          var(--oracle-orange) 40px,
          var(--oracle-orange) 41px
        )`
      }} />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black uppercase mb-6">
          <span className="text-oracle-cream">OTHER ACCOUNTANTS FILE.</span>
          <span className="block text-oracle-orange mt-2">WE FIGHT.</span>
        </h1>
        
        {/* Client Counter */}
        <div className="mt-8 mb-12">
          <div className="relative inline-block group">
            <div className="absolute -top-2 -left-2 w-full h-full border-2 border-oracle-orange group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
            <div className="relative bg-oracle-navy border-2 border-oracle-orange p-6">
              <div className="flex items-center gap-4">
                <div className="text-oracle-cream">
                  <div className="text-5xl font-black">{clientCount}/50</div>
                  <div className="text-sm uppercase tracking-wider">Clients</div>
                </div>
                <div className="w-48 bg-oracle-navy h-4 border border-oracle-cream/20">
                  <div 
                    className="h-full bg-oracle-orange" 
                    style={{ width: `${(clientCount/50)*100}%` }}
                  />
                </div>
              </div>
              <p className="text-oracle-orange font-bold mt-2">
                {50 - clientCount} SPOTS LEFT
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-xl md:text-2xl text-oracle-cream/80 mb-8 leading-relaxed">
          50 clients. No investors. Just James Howard,<br />
          your personal FCCA who actually gives a damn.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <button className="bg-oracle-orange hover:bg-oracle-orange/90 text-oracle-cream font-black uppercase px-8 py-4 text-lg transition-all hover:translate-x-1">
              BOOK A NO-BS CALL →
            </button>
          </Link>
          <Link href="/pricing">
            <button className="border-2 border-oracle-cream text-oracle-cream hover:bg-oracle-cream hover:text-oracle-navy font-black uppercase px-8 py-4 text-lg transition-all">
              SEE IF WE&apos;RE FULL
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}