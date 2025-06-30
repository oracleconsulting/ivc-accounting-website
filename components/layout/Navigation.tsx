'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import Button from '@/components/ivc/shared/Button'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/ivc', label: 'Home' },
    { href: '/ivc/about', label: 'About' },
    { href: '/ivc/services', label: 'Services' },
    { href: '/ivc/team', label: 'Team' },
    { href: '/ivc/contact', label: 'Contact' },
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'glass-morphism shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/ivc" className="flex-shrink-0">
              <Image
                src="/images/ivc-logo.png"
                alt="IVC Accounting"
                width={140}
                height={56}
                priority
                className="h-12 md:h-14 w-auto"
              />
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-orange-400 transition-colors px-3 py-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <Button variant="primary" href="/ivc/contact">
              Book a No-BS Call
            </Button>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-morphism">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-base font-medium hover:text-orange-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 px-3">
              <Button variant="primary" href="/ivc/contact" fullWidth>
                Book a No-BS Call
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 