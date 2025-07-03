// components/layout/Navigation.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [clientCount, setClientCount] = useState(42) // Default value
  
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

  const navItems = [
    { href: '/', label: 'HOME' },
    { href: '/about', label: 'ABOUT' },
    { href: '/services', label: 'SERVICES' },
    { href: '/pricing', label: 'PRICING' },
    { href: '/resources', label: 'RESOURCES' },
    { href: '/tools', label: 'TOOLS' },
    { href: '/contact', label: 'CONTACT' }
  ]

  return (
    <nav className="fixed w-full bg-oracle-navy border-b-2 border-oracle-orange z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black uppercase text-oracle-cream">
              IVC <span className="text-oracle-orange">ACCOUNTING</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-bold uppercase text-oracle-cream hover:text-oracle-orange transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Client Counter */}
            <div className="bg-oracle-orange text-oracle-cream px-3 py-1 font-bold">
              {clientCount}/50 CLIENTS
            </div>
            
            {/* IVC Outreach Link */}
            <a
              href="http://localhost:3001/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-oracle-blue hover:bg-oracle-blue/80 text-oracle-cream px-4 py-2 font-bold uppercase transition-colors"
            >
              CLIENT LOGIN
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-oracle-cream"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-oracle-navy border-t border-oracle-orange/20 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 px-4 font-bold uppercase text-oracle-cream hover:text-oracle-orange hover:bg-oracle-orange/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="mt-4 px-4 py-3 bg-oracle-orange/20 text-oracle-cream font-bold">
              {clientCount}/50 CLIENTS
            </div>
            
            <a
              href="http://localhost:3001/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 mx-4 text-center bg-oracle-blue hover:bg-oracle-blue/80 text-oracle-cream px-4 py-2 font-bold uppercase transition-colors"
            >
              CLIENT LOGIN
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}