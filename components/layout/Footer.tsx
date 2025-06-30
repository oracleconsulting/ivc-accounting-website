import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = {
    services: [
      { label: 'Essential Compliance', href: '/ivc/services#compliance' },
      { label: 'Strategic Advisory', href: '/ivc/services#advisory' },
      { label: 'Business Growth', href: '/ivc/services#growth' },
    ],
    company: [
      { label: 'About', href: '/ivc/about' },
      { label: 'Team', href: '/ivc/team' },
      { label: 'Contact', href: '/ivc/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/ivc/privacy' },
      { label: 'Terms of Service', href: '/ivc/terms' },
      { label: 'Cookie Policy', href: '/ivc/cookies' },
    ]
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <div className="mb-4">
              <Image
                src="/images/ivc-logo.png"
                alt="IVC Accounting"
                width={120}
                height={48}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Other Accountants File. We Fight.
            </p>
            <p className="text-sm text-gray-500">
              Quality over quantity. 50 client limit.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <p>
                <a
                  href="mailto:james@ivcaccounting.co.uk"
                  className="hover:text-orange-400 transition-colors"
                >
                  james@ivcaccounting.co.uk
                </a>
              </p>
              <p>Direct line available to clients</p>
              <div className="pt-4">
                <Link
                  href="https://calendly.com/james-ivc/consultation"
                  className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <span className="mr-2">📅</span>
                  Book a Call
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} IVC Accounting Ltd. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
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