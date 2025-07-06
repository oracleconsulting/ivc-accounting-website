'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useEffect } from 'react'

export default function LondonAccountantPage() {
  const { trackDoc, trackBooking } = useAnalytics()

  useEffect(() => {
    // Track page view
    trackDoc('london_accountant_page_view')
  }, [trackDoc])

  const handleServiceClick = (service: string) => {
    trackDoc(`london_service_${service}`)
  }

  const handleBookingClick = () => {
    trackBooking('london_page')
  }

  const breadcrumbs = [
    { name: 'Home', url: 'https://ivcaccounting.co.uk' },
    { name: 'London Accountant', url: 'https://ivcaccounting.co.uk/london-accountant' }
  ]

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: 'IVC Accounting London',
    description: 'Premium accounting services in London with a focus on tech companies and ambitious businesses.',
    url: 'https://ivcaccounting.co.uk/london-accountant',
    telephone: '+44-20-XXXX-XXXX',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 City Road',
      addressLocality: 'London',
      postalCode: 'EC1V 2NX',
      addressCountry: 'GB'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.5074,
      longitude: -0.1278
    },
    areaServed: {
      '@type': 'City',
      name: 'London'
    },
    priceRange: '£££',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00'
      }
    ]
  }

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] bg-[#1a2b4a] pt-20 flex items-center justify-center">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 40px,
            #ff6b35 40px,
            #ff6b35 41px
          )`
        }} />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase mb-6">
            <span className="text-[#f5f1e8]">LONDON&apos;S</span>{' '}
            <span className="text-[#ff6b35]">FIGHTING ACCOUNTANT</span>
          </h1>
          <p className="text-xl text-[#f5f1e8]/80 max-w-2xl mx-auto">
            Not just another City accountant. We fight for London&apos;s tech companies and ambitious businesses.
          </p>
        </div>
      </section>

      {/* Why London Section */}
      <section className="py-16 bg-[#f5f1e8]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black uppercase text-[#1a2b4a] mb-8">
              WHY LONDON BUSINESSES <span className="text-[#ff6b35]">CHOOSE US</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#ff6b35]" />
                <div className="relative bg-white border-2 border-[#1a2b4a] p-6">
                  <h3 className="text-xl font-black uppercase text-[#1a2b4a] mb-4">
                    TECH EXPERTISE
                  </h3>
                  <ul className="space-y-3 text-[#1a2b4a]/80">
                    <li>• Deep understanding of London&apos;s tech ecosystem</li>
                    <li>• R&D tax credit specialists</li>
                    <li>• Experience with VC funding rounds</li>
                    <li>• Tech-focused growth strategies</li>
                    <li>• Cloud accounting integration</li>
                  </ul>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#4a90e2]" />
                <div className="relative bg-white border-2 border-[#1a2b4a] p-6">
                  <h3 className="text-xl font-black uppercase text-[#1a2b4a] mb-4">
                    LONDON ADVANTAGE
                  </h3>
                  <ul className="space-y-3 text-[#1a2b4a]/80">
                    <li>• Central London location</li>
                    <li>• Face-to-face meetings when needed</li>
                    <li>• Local business network</li>
                    <li>• London-specific tax knowledge</li>
                    <li>• Quick response to urgent matters</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black uppercase text-[#1a2b4a] mb-8">
              SERVICES FOR <span className="text-[#ff6b35]">LONDON BUSINESSES</span>
            </h2>
            
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#ff6b35]" />
                <div className="relative bg-[#1a2b4a] p-6">
                  <h3 className="text-xl font-black uppercase text-[#f5f1e8] mb-4">
                    TECH STARTUP ACCOUNTING
                  </h3>
                  <p className="text-[#f5f1e8]/80 mb-4">
                    From Silicon Roundabout to Canary Wharf, we help London&apos;s tech startups scale 
                    with confidence. Full compliance, strategic advice, and funding support.
                  </p>
                  <Link 
                    href="/services" 
                    className="text-[#ff6b35] font-bold hover:text-[#e55a2b]"
                    onClick={() => handleServiceClick('tech_startup')}
                  >
                    Learn More →
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#4a90e2]" />
                <div className="relative bg-[#1a2b4a] p-6">
                  <h3 className="text-xl font-black uppercase text-[#f5f1e8] mb-4">
                    R&D TAX CREDITS
                  </h3>
                  <p className="text-[#f5f1e8]/80 mb-4">
                    London is the UK&apos;s innovation hub. We&apos;ve helped tech companies claim millions 
                    in R&D tax credits. Don&apos;t leave money on the table.
                  </p>
                  <Link 
                    href="/blog/rd-tax-credits" 
                    className="text-[#ff6b35] font-bold hover:text-[#e55a2b]"
                    onClick={() => handleServiceClick('rd_tax_credits')}
                  >
                    Learn More →
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#ff6b35]" />
                <div className="relative bg-[#1a2b4a] p-6">
                  <h3 className="text-xl font-black uppercase text-[#f5f1e8] mb-4">
                    GROWTH ADVISORY
                  </h3>
                  <p className="text-[#f5f1e8]/80 mb-4">
                    Strategic financial advice for ambitious London businesses. From funding rounds 
                    to exit planning, we&apos;re your growth partner.
                  </p>
                  <Link 
                    href="/services" 
                    className="text-[#ff6b35] font-bold hover:text-[#e55a2b]"
                    onClick={() => handleServiceClick('growth_advisory')}
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-[#f5f1e8]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black uppercase text-[#1a2b4a] mb-8">
              CENTRAL LONDON <span className="text-[#ff6b35]">LOCATION</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="bg-white border-2 border-[#1a2b4a] p-6">
                  <h3 className="text-xl font-black uppercase text-[#1a2b4a] mb-4">
                    FIND US
                  </h3>
                  <p className="text-[#1a2b4a]/80 mb-4">
                    123 City Road<br />
                    London<br />
                    EC1V 2NX
                  </p>
                  <p className="text-[#1a2b4a]/80 mb-4">
                    <strong>Phone:</strong> +44-20-XXXX-XXXX<br />
                    <strong>Email:</strong> james@ivcaccounting.co.uk
                  </p>
                  <p className="text-[#1a2b4a]/80">
                    <strong>Hours:</strong><br />
                    Monday - Friday: 8am - 6pm<br />
                    Urgent matters: 24/7 for clients
                  </p>
                </div>
              </div>
              
              <div>
                <div className="bg-white border-2 border-[#1a2b4a] p-6">
                  <h3 className="text-xl font-black uppercase text-[#1a2b4a] mb-4">
                    TRANSPORT LINKS
                  </h3>
                  <ul className="space-y-3 text-[#1a2b4a]/80">
                    <li>• Old Street Station (5 min walk)</li>
                    <li>• Moorgate Station (10 min walk)</li>
                    <li>• Liverpool Street (15 min walk)</li>
                    <li>• Multiple bus routes</li>
                    <li>• Secure bike storage available</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#ff6b35]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black uppercase text-[#f5f1e8] mb-6">
            READY TO FIGHT FOR YOUR LONDON BUSINESS?
          </h2>
          <p className="text-xl text-[#f5f1e8]/90 mb-8 max-w-2xl mx-auto">
            Book a no-BS call. We&apos;ll tell you honestly if we can help and what that looks like.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-[#1a2b4a] hover:bg-[#0f1829] text-[#f5f1e8] font-black uppercase px-8 py-4"
            onClick={handleBookingClick}
          >
            BOOK YOUR CALL NOW →
          </Link>
        </div>
      </section>
    </>
  )
} 