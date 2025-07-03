// components/home/Hero.tsx
'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';

const Hero = () => {
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
    <section className="relative min-h-[80vh] bg-[#1a2b4a] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern opacity-10"></div>
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 400">
          <polygon points="0,400 480,200 960,100 1440,300 1440,400" 
                   fill="#ff6b35" opacity="0.1" />
          <polygon points="0,400 720,250 1440,150 1440,400" 
                   fill="#4a90e2" opacity="0.05" />
        </svg>
      </div>

      {/* Content */}
      <div className="container-xl mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-hero mb-6 text-[#f5f1e8]">
            CORPORATE STRENGTH
            <span className="block text-[#ff6b35]">FIGHTING SPIRIT</span>
          </h1>
          <p className="text-[#f5f1e8] text-xl mb-8 max-w-2xl">
            We're not just accountants. We're your strategic partners in growth, combining
            professional expertise with a rebellious drive to fight for your success.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">
              START YOUR JOURNEY
            </Link>
            <Link href="/services" className="btn-secondary">
              EXPLORE SERVICES
            </Link>
          </div>

          {/* Data Grid Decoration */}
          <div className="absolute bottom-8 right-8 hidden lg:grid grid-cols-8 gap-1">
            {[...Array(64)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 ${i % 3 === 0 ? 'bg-[#ff6b35]' : 'bg-[#4a90e2]'} opacity-20`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;