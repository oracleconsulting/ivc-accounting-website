// components/layout/Navigation.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import Button from '@/components/shared/Button'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check initial scroll position after mount
    setIsScrolled(window.scrollY > 20)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const mainNavLinks = [
    { href: '/', label: 'HOME' },
    { href: '/about', label: 'ABOUT' },
    { href: '/services', label: 'SERVICES' },
    { href: '/team', label: 'TEAM' },
    { href: '/contact', label: 'CONTACT' },
  ]

  const resourceNavLinks = [
    { href: '/blog', label: 'BLOG' },
    { href: '/resources', label: 'RESOURCES' },
    { href: '/tools', label: 'TOOLS' },
  ]

  // Use mounted state to ensure consistent rendering
  const navClassName = `fixed w-full z-50 nav-transition ${
    mounted && isScrolled ? 'bg-[#1a2b4a] shadow-corporate' : 'bg-transparent'
  }`

  return (
    <nav className={navClassName}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="bg-[#ff6b35] px-4 py-2">
                <span className="text-2xl font-black text-[#f5f1e8]">IVC</span>
              </div>
              <span className="ml-3 text-xl font-bold text-[#f5f1e8] hidden sm:block">ACCOUNTING</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#f5f1e8] hover:text-[#ff6b35] transition-colors font-bold text-sm tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-4 w-px bg-[#f5f1e8]/20" />
              {resourceNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#f5f1e8] hover:text-[#ff6b35] transition-colors font-bold text-sm tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Desktop CTA */}
          <div className="hidden md:block flex-shrink-0">
            <Button 
              variant="primary" 
              href="/contact" 
              className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] px-6 py-3 font-bold uppercase tracking-wide transition-all duration-300 btn-corporate"
            >
              BOOK A NO-BS CALL
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#f5f1e8] hover:text-[#ff6b35] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1a2b4a] border-t border-[#ff6b35]/20">
          <div className="px-4 py-4 space-y-3">
            {[...mainNavLinks, ...resourceNavLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-[#f5f1e8] hover:text-[#ff6b35] hover:bg-[#f5f1e8]/5 font-bold uppercase tracking-wide transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Button 
                variant="primary" 
                href="/contact" 
                fullWidth
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-bold uppercase tracking-wide"
              >
                BOOK A NO-BS CALL
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}