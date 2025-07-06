import { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/shared/Button'

export const metadata: Metadata = {
  title: 'Accountant in Essex | IVC Accounting | Chartered Accountants Essex',
  description: 'Looking for an accountant in Essex? IVC Accounting provides personal chartered accountancy services across Essex. Direct access to James Howard. Fixed fees from £500/month.',
  keywords: 'accountant essex, essex accountant, chartered accountant essex, business accountant essex, personal accountant essex',
  alternates: {
    canonical: 'https://ivcaccounting.co.uk/services/accountant-essex'
  }
}

export default function AccountantEssex() {
  const locationSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Chartered Accountancy",
    "provider": {
      "@id": "https://ivcaccounting.co.uk/#organization"
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Essex",
      "containsPlace": [
        {
          "@type": "City",
          "name": "Halstead"
        },
        {
          "@type": "City",
          "name": "Braintree"
        },
        {
          "@type": "City",
          "name": "Colchester"
        },
        {
          "@type": "City",
          "name": "Chelmsford"
        }
      ]
    },
    "description": "Personal chartered accountancy services across Essex",
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
            CHARTERED ACCOUNTANT IN ESSEX
          </h1>
          <p className="text-xl text-[#f5f1e8]/80 mb-8">
            Personal accountancy services for Essex businesses who want more than just compliance
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#f5f1e8]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-black uppercase text-[#1a2b4a] mb-6">
              Why Essex Businesses Choose IVC
            </h2>
            
            <p className="text-lg mb-6">
              Based in Essex, we understand the unique challenges facing local businesses. 
              From London commuters to rural enterprises, we provide personal accountancy 
              services that go beyond just filing your returns.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 border-2 border-[#ff6b35]">
                <h3 className="font-bold text-xl mb-3 text-[#1a2b4a]">Essex Expertise</h3>
                <p>We know Essex. We understand local business rates, Essex grants, and the 
                specific opportunities available to businesses across the county.</p>
              </div>
              
              <div className="bg-white p-6 border-2 border-[#ff6b35]">
                <h3 className="font-bold text-xl mb-3 text-[#1a2b4a]">Personal Service</h3>
                <p>No call centers. No junior staff. When you work with IVC, you work directly 
                with James Howard, your personal chartered accountant.</p>
              </div>
            </div>

            <h3 className="text-2xl font-black uppercase text-[#1a2b4a] mb-6">
              Accountancy Services for Essex Businesses
            </h3>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-[#ff6b35] mr-3">✓</span>
                <span>Annual accounts and tax returns for Essex limited companies</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ff6b35] mr-3">✓</span>
                <span>VAT returns for Essex businesses</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ff6b35] mr-3">✓</span>
                <span>Payroll services for Essex employers</span>
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
                Serving All of Essex
              </h3>
              <p className="mb-4">
                From Halstead to Chelmsford, Braintree to Colchester, and everywhere in between. 
                We serve Essex businesses with personal, professional accountancy services.
              </p>
              <p className="font-bold">
                In-person meetings across Essex or secure video consultations available.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-black uppercase text-[#1a2b4a] mb-6">
              Fixed-Fee Accountancy for Essex Businesses
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
              Frequently Asked Questions - Accountants in Essex
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-xl mb-2">Do you cover all of Essex?</h3>
                <p>Yes, we serve businesses across the entire county of Essex, from the London 
                border to the coast, including all major towns and rural areas.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-xl mb-2">Do you offer in-person meetings?</h3>
                <p>We offer both in-person meetings across Essex and secure video consultations. 
                Many of our Essex clients prefer the flexibility of meeting at their business 
                premises or via video call.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-xl mb-2">How quickly can you take on new Essex clients?</h3>
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
            Join Essex businesses who've discovered there's a better way
          </p>
          <Button href="/contact" variant="primary">
            GET STARTED TODAY
          </Button>
        </div>
      </section>
    </>
  )
} 