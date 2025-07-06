import { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/shared/Button'

export const metadata: Metadata = {
  title: 'Accountant in Halstead, Essex | IVC Accounting | Personal Service',
  description: 'Looking for an accountant in Halstead? IVC Accounting provides personal chartered accountancy services with direct access to James Howard. Only 50 clients. Fixed fees from £500.',
  keywords: 'accountant halstead, halstead accountant, chartered accountant halstead essex, personal accountant halstead',
  alternates: {
    canonical: 'https://ivcaccounting.co.uk/services/accountant-halstead'
  }
}

export default function AccountantHalstead() {
  const locationSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Chartered Accountancy",
    "provider": {
      "@id": "https://ivcaccounting.co.uk/#organization"
    },
    "areaServed": {
      "@type": "City",
      "name": "Halstead",
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": "Essex"
      }
    },
    "description": "Personal chartered accountancy services in Halstead, Essex",
    "offers": {
      "@type": "Offer",
      "price": "500",
      "priceCurrency": "GBP"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />
      
      <section className="hero-section bg-[#1a2b4a] py-20 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-[#f5f1e8] mb-6">
            CHARTERED ACCOUNTANT IN HALSTEAD, ESSEX
          </h1>
          <p className="text-xl text-[#f5f1e8]/80 mb-8">
            Personal accountancy services for Halstead businesses who want more than just compliance
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#f5f1e8]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-black uppercase text-[#1a2b4a] mb-6">
              Why Halstead Businesses Choose IVC
            </h2>
            
            <p className="text-lg mb-6">
              Based in Essex, we understand the unique challenges facing Halstead businesses. 
              From High Street retailers to rural enterprises, we provide personal accountancy 
              services that go beyond just filing your returns.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 border-2 border-[#ff6b35]">
                <h3 className="font-bold text-xl mb-3 text-[#1a2b4a]">Local Knowledge</h3>
                <p>We know Halstead. We understand Essex business rates, local grants, and the 
                specific opportunities available to businesses in CO9.</p>
              </div>
              
              <div className="bg-white p-6 border-2 border-[#ff6b35]">
                <h3 className="font-bold text-xl mb-3 text-[#1a2b4a]">Personal Service</h3>
                <p>No call centers. No junior staff. When you work with IVC, you work directly 
                with James Howard, your personal chartered accountant.</p>
              </div>
            </div>

            <h3 className="text-2xl font-black uppercase text-[#1a2b4a] mb-6">
              Accountancy Services for Halstead Businesses
            </h3>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-[#ff6b35] mr-3">✓</span>
                <span>Annual accounts and tax returns for Halstead limited companies</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ff6b35] mr-3">✓</span>
                <span>VAT returns for Essex businesses</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ff6b35] mr-3">✓</span>
                <span>Payroll services for Halstead employers</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ff6b35] mr-3">✓</span>
                <span>R&D tax credits for innovative Essex companies</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ff6b35] mr-3">✓</span>
                <span>Management accounts and cash flow forecasting</span>
              </li>
            </ul>

            <div className="bg-[#1a2b4a] p-8 text-[#f5f1e8]">
              <h3 className="text-2xl font-black uppercase mb-4">
                Serving All of Halstead & Surrounding Areas
              </h3>
              <p className="mb-4">
                Whether you're based in Halstead town center, The Causeway, or the surrounding 
                villages like Greenstead Green, Gosfield, or Sible Hedingham, we're here to help.
              </p>
              <p className="font-bold">
                In-person meetings in Halstead or secure video consultations available.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-black uppercase text-[#1a2b4a] mb-6">
              Fixed-Fee Accountancy for Halstead Businesses
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 border-2 border-[#f5f1e8]">
                <h3 className="font-bold text-xl mb-2">Essential Fighter</h3>
                <p className="text-3xl font-black text-[#ff6b35] mb-2">£500</p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
              <div className="text-center p-6 border-2 border-[#ff6b35] transform scale-105">
                <h3 className="font-bold text-xl mb-2">Growth Warrior</h3>
                <p className="text-3xl font-black text-[#ff6b35] mb-2">£750</p>
                <p className="text-sm text-gray-600">per month</p>
                <p className="text-xs mt-2 text-[#ff6b35]">MOST POPULAR</p>
              </div>
              <div className="text-center p-6 border-2 border-[#f5f1e8]">
                <h3 className="font-bold text-xl mb-2">Scale Champion</h3>
                <p className="text-3xl font-black text-[#ff6b35] mb-2">£1,250</p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
            </div>

            <div className="bg-[#ff6b35] p-8 text-[#f5f1e8] text-center">
              <p className="text-2xl font-black mb-4">ONLY 3 SPACES REMAINING</p>
              <p className="mb-6">We limit ourselves to 50 clients to ensure personal service</p>
              <Button 
                href="/contact" 
                variant="secondary"
                className="bg-[#f5f1e8] text-[#1a2b4a] hover:bg-white"
              >
                BOOK A NO-BS CALL
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f5f1e8]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-black uppercase text-[#1a2b4a] mb-6">
              Frequently Asked Questions - Accountants in Halstead
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-xl mb-2">Do you have an office in Halstead?</h3>
                <p>We offer both in-person meetings in Halstead and secure video consultations. 
                Many of our Halstead clients prefer the flexibility of meeting at their business 
                premises or via video call.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-xl mb-2">What areas of Halstead do you cover?</h3>
                <p>We serve all of Halstead and surrounding areas including Gosfield, Sible Hedingham, 
                Greenstead Green, Earls Colne, and the wider CO9 postcode area.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-xl mb-2">How quickly can you take on new Halstead clients?</h3>
                <p>We can typically onboard new clients within 48 hours. However, we only have 3 
                spaces remaining in our 50-client limit.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1a2b4a]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black uppercase text-[#f5f1e8] mb-4">
            Ready for an Accountant Who Actually Cares?
          </h2>
          <p className="text-xl text-[#f5f1e8]/80 mb-8">
            Join Halstead businesses who've discovered there's a better way
          </p>
          <Button href="/contact" variant="primary">
            GET STARTED TODAY
          </Button>
        </div>
      </section>
    </>
  )
} 