import { Metadata } from 'next'
import { Check, X, Shield } from 'lucide-react'
import Link from 'next/link'
import { useAnalytics } from '@/hooks/useAnalytics'
import PricingCard from '@/components/pricing/PricingCard'

export const metadata: Metadata = {
  title: 'Transparent Pricing - No Hidden Fees | IVC Accounting',
  description: 'Clear, upfront pricing for accounting services. No surprises, no hidden fees. See exactly what you get with each tier.',
}

interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  notIncluded: string[]
  cta: string
  ctaLink: string
  featured?: boolean
}

export default function PricingPage() {
  const tiers: PricingTier[] = [
    {
      name: "ESSENTIAL FIGHTER",
      price: "500",
      description: "For established businesses ready to fight smarter",
      features: [
        "Everything HMRC requires",
        "Monthly catch-ups with James",
        "Audit defense included",
        "Unlimited email access",
        "Document vault access",
        "OraleAI Roadmap Tracker (worth £150 a month)",
        "Tax savings tracker",
        "Annual accounts & tax returns",
        "VAT returns (if applicable)",
        "Payroll for up to 5 employees"
      ],
      notIncluded: [
        "Quarterly strategy sessions",
        "Cash flow forecasting",
        "KPI dashboard"
      ],
      cta: "BOOK ASSESSMENT",
      ctaLink: "/contact?tier=essential"
    },
    {
      name: "STRATEGIC WARRIOR",
      price: "850",
      description: "For ambitious businesses ready to dominate",
      features: [
        "Everything in Essential Fighter",
        "Quarterly strategy sessions",
        "Cash flow forecasting",
        "KPI dashboard access",
        "Tax planning reviews",
        "OracleaI Virtual Board room (Worth £250 a month)",
        "Investment readiness support",
        "Benchmarking reports",
        "Priority response (4 hours)",
        "Payroll for up to 15 employees"
      ],
      notIncluded: [
        "Weekly check-ins",
        "Exit planning"
      ],
      cta: "START FIGHTING",
      ctaLink: "/contact?tier=strategic",
      featured: true
    },
    {
      name: "ULTIMATE CHAMPION",
      price: "1,500",
      description: "For leaders who refuse to lose",
      features: [
        "Everything in Strategic Warrior",
        "Weekly check-ins with James",
        "Exit planning support",
        "Board Structure Implementation & meeting attendance",
        "Investor pitch deck reviews",
        "M&A transaction support",
        "Custom financial modeling",
        "Instant response (1 hour)",
        "Unlimited payroll processing"
      ],
      notIncluded: [],
      cta: "CLAIM YOUR SPOT",
      ctaLink: "/contact?tier=ultimate"
    }
  ]

  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: tiers.map((tier, index) => ({
      '@type': 'Offer',
      position: index + 1,
      name: tier.name,
      price: tier.price,
      priceCurrency: 'GBP',
      priceValidUntil: '2026-12-31',
      itemOffered: {
        '@type': 'Service',
        name: `${tier.name} Accounting Package`,
        description: tier.description,
        offers: {
          '@type': 'Offer',
          price: tier.price,
          priceCurrency: 'GBP',
          priceValidUntil: '2026-12-31',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: tier.price,
            priceCurrency: 'GBP',
            valueAddedTaxIncluded: true
          }
        }
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[40vh] bg-[#1a2b4a] pt-20 flex items-center justify-center">
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 40px, #ff6b35 40px, #ff6b35 41px),
            radial-gradient(circle at 20% 50%, #ff6b35 0%, transparent 50%)
          `
        }} />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-black uppercase text-[#f5f1e8] mb-6">
            NO BS <span className="text-[#ff6b35]">PRICING</span>
          </h1>
          <p className="text-xl text-[#f5f1e8]/80 max-w-2xl mx-auto">
            Actual prices. On the website. Revolutionary, we know.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-24 bg-[#f5f1e8]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, index) => (
              <PricingCard key={tier.name} tier={tier} featured={index === 1} />
            ))}
          </div>
          
          {/* Price Lock Promise */}
          <div className="mt-16 text-center">
            <div className="relative inline-block group">
              <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#ff6b35] group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
              <div className="relative bg-white border-2 border-[#1a2b4a] p-8">
                <Shield className="w-12 h-12 text-[#ff6b35] mx-auto mb-4" />
                <h3 className="text-2xl font-black uppercase text-[#1a2b4a] mb-4">
                  PRICE LOCK PROMISE
                </h3>
                <p className="text-[#1a2b4a] max-w-2xl">
                  Your rate is locked for 2 years. No surprises, no annual increases, 
                  no &ldquo;market adjustments&rdquo;. The price you see is the price you pay.
                </p>
              </div>
            </div>
          </div>

          {/* What You WON'T Get */}
          <div className="mt-16 bg-[#1a2b4a] p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-black uppercase text-[#f5f1e8] mb-6 text-center">
              WHAT YOU <span className="text-[#ff6b35]">WON&apos;T</span> GET
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-[#f5f1e8]">
              <div>
                <h4 className="font-bold uppercase text-[#ff6b35] mb-2">NO JUNIOR STAFF</h4>
                <p>Your accounts won&apos;t be handled by someone 6 months out of uni. James personally reviews every client.</p>
              </div>
              <div>
                <h4 className="font-bold uppercase text-[#ff6b35] mb-2">NO SURPRISE BILLS</h4>
                <p>That 5-minute phone call? Free. Quick tax question? Free. We don&apos;t nickel and dime our fighters.</p>
              </div>
              <div>
                <h4 className="font-bold uppercase text-[#ff6b35] mb-2">NO CORPORATE BS</h4>
                <p>No jargon, no 40-page reports nobody reads, no &ldquo;circle back&rdquo; or &ldquo;synergies&rdquo;. Just straight talk.</p>
              </div>
              <div>
                <h4 className="font-bold uppercase text-[#ff6b35] mb-2">NO WAITING</h4>
                <p>You won&apos;t wait 3 weeks for a callback. Our response times are measured in hours, not weeks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 