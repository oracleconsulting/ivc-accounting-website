// components/layout/Navigation.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const clientCount = 42 // This would come from your database

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
    <nav className="fixed w-full bg-[#1a2b4a] border-b-2 border-[#ff6b35] z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black uppercase text-[#f5f1e8]">
              IVC <span className="text-[#ff6b35]">ACCOUNTING</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-bold uppercase text-[#f5f1e8] hover:text-[#ff6b35] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Client Counter */}
            <div className="bg-[#ff6b35] text-[#f5f1e8] px-3 py-1 font-bold">
              {clientCount}/50 CLIENTS
            </div>
            
            {/* IVC Outreach Link */}
            <a
              href="http://localhost:3001/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#4a90e2] hover:bg-[#3a7bc8] text-white px-4 py-2 font-bold uppercase transition-colors"
            >
              CLIENT LOGIN
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-[#f5f1e8]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-[#1a2b4a] border-t border-[#ff6b35]/20 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 px-4 font-bold uppercase text-[#f5f1e8] hover:text-[#ff6b35] hover:bg-[#ff6b35]/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="mt-4 px-4 py-3 bg-[#ff6b35]/20 text-[#f5f1e8] font-bold">
              {clientCount}/50 CLIENTS
            </div>
            
            <a
              href="http://localhost:3001/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 mx-4 text-center bg-[#4a90e2] hover:bg-[#3a7bc8] text-white px-4 py-2 font-bold uppercase transition-colors"
            >
              CLIENT LOGIN
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}