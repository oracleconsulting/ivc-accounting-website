import { Metadata } from 'next'
import { Check, X, Shield } from 'lucide-react'
import Link from 'next/link'

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

function PricingCard({ tier, featured }: { tier: PricingTier; featured?: boolean }) {
  return (
    <div className={`relative group ${featured ? 'scale-105' : ''}`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#ff6b35] text-[#f5f1e8] px-4 py-1 font-black uppercase text-sm">
          MOST POPULAR
        </div>
      )}
      
      {/* Offset Border */}
      <div className={`absolute -top-2 -left-2 w-full h-full border-2 ${featured ? 'border-[#ff6b35]' : 'border-[#4a90e2]'} group-hover:translate-x-1 group-hover:translate-y-1 transition-transform`} />
      
      <div className="relative bg-white border-2 border-[#1a2b4a] p-8 h-full flex flex-col">
        <div className="mb-6">
          <h3 className="text-2xl font-black uppercase text-[#1a2b4a] mb-2">
            {tier.name}
          </h3>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-black text-[#1a2b4a]">£{tier.price}</span>
            <span className="text-lg text-[#1a2b4a]/70">/month</span>
          </div>
          <p className="text-[#1a2b4a]/80">{tier.description}</p>
        </div>

        <div className="space-y-4 mb-8 flex-1">
          <div>
            <h4 className="font-bold uppercase text-[#1a2b4a] mb-3">INCLUDED:</h4>
            <ul className="space-y-2">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1a2b4a]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {tier.notIncluded.length > 0 && (
            <div>
              <h4 className="font-bold uppercase text-[#1a2b4a]/60 mb-3">NOT INCLUDED:</h4>
              <ul className="space-y-2">
                {tier.notIncluded.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 opacity-50">
                    <X className="w-5 h-5 text-[#1a2b4a]/40 flex-shrink-0 mt-0.5" />
                    <span className="text-[#1a2b4a]/60">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Link href={tier.ctaLink}>
          <button className={`w-full font-black uppercase px-6 py-4 text-lg transition-all hover:translate-x-1 ${
            featured 
              ? 'bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8]' 
              : 'border-2 border-[#1a2b4a] text-[#1a2b4a] hover:bg-[#1a2b4a] hover:text-[#f5f1e8]'
          }`}>
            {tier.cta}
          </button>
        </Link>
      </div>
    </div>
  )
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
        "OraleAI Roadmap Tracker (worth £150 a month)"
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
        "OracleaI Virtual Board room (Worth £250 a month)"
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

  return (
    <>
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