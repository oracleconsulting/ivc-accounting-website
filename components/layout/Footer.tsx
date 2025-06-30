// components/layout/Footer.tsx
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = {
    services: [
      { label: 'Essential Compliance', href: '/services#compliance' },
      { label: 'Strategic Advisory', href: '/services#advisory' },
      { label: 'Business Growth', href: '/services#growth' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Team', href: '/team' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ]
  }

  return (
    <footer className="bg-[#1a2b4a] border-t-4 border-[#ff6b35]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <div className="mb-4">
              <div className="bg-[#ff6b35] px-4 py-2 inline-block">
                <span className="text-2xl font-black text-[#f5f1e8]">IVC</span>
              </div>
              <span className="ml-3 text-xl font-bold text-[#f5f1e8]">ACCOUNTING</span>
            </div>
            <p className="text-[#f5f1e8] font-bold uppercase mb-4">
              Other Accountants File. We Fight.
            </p>
            <p className="text-sm text-[#f5f1e8]/60">
              Quality over quantity. 50 client limit.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-black uppercase text-[#f5f1e8] mb-4">SERVICES</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#f5f1e8]/80 hover:text-[#ff6b35] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-black uppercase text-[#f5f1e8] mb-4">COMPANY</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#f5f1e8]/80 hover:text-[#ff6b35] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-black uppercase text-[#f5f1e8] mb-4">CONTACT</h4>
            <div className="space-y-2 text-[#f5f1e8]/80">
              <p>
                <a
                  href="mailto:james@ivcaccounting.co.uk"
                  className="hover:text-[#ff6b35] transition-colors"
                >
                  james@ivcaccounting.co.uk
                </a>
              </p>
              <p>Direct line available to clients</p>
              <div className="pt-4">
                <Link
                  href="https://calendly.com/james-ivc/consultation"
                  className="inline-flex items-center text-[#ff6b35] hover:text-[#f5f1e8] font-bold uppercase transition-colors"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a Call
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#f5f1e8]/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#f5f1e8]/60 text-sm mb-4 md:mb-0">
              © {currentYear} IVC Accounting Ltd. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#f5f1e8]/60 hover:text-[#f5f1e8] text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}