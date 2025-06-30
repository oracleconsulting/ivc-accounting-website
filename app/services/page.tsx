// app/services/page.tsx
import { Metadata } from 'next'
import { Shield, Target, TrendingUp } from 'lucide-react'
import Button from '@/components/shared/Button'
import Link from 'next/link'
import { BreadcrumbSchema, ServiceSchema } from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  title: 'Services - Essential Compliance, Strategic Advisory & Growth',
  description: "IVC Accounting services: From rock-solid compliance to PE negotiations and growth strategy. Personal service from someone who's been in your shoes.",
}

export default function ServicesPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://ivcaccounting.co.uk/ivc' },
    { name: 'Services', url: 'https://ivcaccounting.co.uk/ivc/services' }
  ]

  const services = [
    {
      id: 'compliance',
      icon: Shield,
      name: 'ESSENTIAL COMPLIANCE',
      tagline: 'THE FOUNDATIONS DONE RIGHT',
      description: 'Rock-solid bookkeeping, VAT, payroll, and year-end accounts. No surprises, no excuses, just reliable execution you can count on.',
      longDescription: `Every business needs the basics done perfectly. That's non-negotiable. 
      
      But "basic" doesn't mean "basic service." When HMRC comes calling, when you need clarity on your numbers, when payroll has to be perfect - you need someone who takes it personally.
      
      We handle your compliance like it's our own business. Because when you're limited to 50 clients, every single one matters.`,
      features: [
        {
          title: 'Monthly Bookkeeping',
          description: 'Clean, accurate, and always on time. Xero or QuickBooks - your choice.'
        },
        {
          title: 'VAT Returns',
          description: 'Submitted early, optimised properly, with no nasty surprises.'
        },
        {
          title: 'Payroll Management',
          description: 'RTI submissions, pensions, benefits - all handled seamlessly.'
        },
        {
          title: 'Year-End Accounts',
          description: 'Full statutory accounts prepared to the highest standards.'
        },
        {
          title: 'Company Secretarial',
          description: 'Annual returns, share transfers, board minutes - sorted.'
        },
        {
          title: 'Tax Returns',
          description: 'Personal and corporate tax returns filed strategically.'
        }
      ],
      color: '#4a90e2'
    },
    {
      id: 'advisory',
      icon: Target,
      name: 'STRATEGIC ADVISORY',
      tagline: 'BEEN THERE, DONE THAT, GOT YOUR BACK',
      description: "Real advice for real challenges. PE negotiations, tax planning, and business strategy from someone who's survived the pressure.",
      longDescription: `This is where experience matters. When PE firms circle, when big decisions loom, when you need more than textbook answers - you need someone who's lived it.
      
      I've been through 3 PE acquisitions. I know their playbook, their pressure tactics, their sweet spots. More importantly, I know how to protect YOUR interests.
      
      This isn't theoretical advice from someone who's only read about it. This is battle-tested strategy from someone who's been in the trenches.`,
      features: [
        {
          title: 'PE Deal Navigation',
          description: 'From first approach to final exit - protecting your interests at every step.'
        },
        {
          title: 'Tax Optimisation',
          description: 'Legal, ethical, and aggressive tax planning that actually works.'
        },
        {
          title: 'Cash Flow Planning',
          description: 'Real-world cash management, not spreadsheet fantasies.'
        },
        {
          title: 'Exit Strategy',
          description: 'Building value today for the exit you want tomorrow.'
        },
        {
          title: 'Board Advisory',
          description: "Strategic input from someone who's actually built and sold businesses."
        },
        {
          title: 'Deal Structuring',
          description: 'Making sure the terms work for YOU, not just them.'
        }
      ],
      color: '#ff6b35'
    },
    {
      id: 'growth',
      icon: TrendingUp,
      name: 'BUSINESS GROWTH',
      tagline: 'BUILDING SOMETHING REAL',
      description: 'Beyond the numbers. We help you build systems, find opportunities, and grow sustainably without losing what makes you special.',
      longDescription: `Growth isn't just about bigger numbers. It's about building something sustainable, something real, something that doesn't break when you push it.
      
      We've seen too many businesses grow themselves to death. More revenue, more stress, more problems, less profit. That's not growth - that's just getting bigger.
      
      Real growth means better systems, smarter decisions, and keeping what made you successful in the first place. With only 50 clients, we can actually help you build it.`,
      features: [
        {
          title: 'Growth Strategy',
          description: 'Sustainable growth plans based on real experience, not MBA theory.'
        },
        {
          title: 'Financial Modeling',
          description: 'Models that actually reflect reality and help you make decisions.'
        },
        {
          title: 'KPI Dashboards',
          description: "Track what matters, ignore what doesn't. Real-time visibility."
        },
        {
          title: 'Funding Support',
          description: 'From bank loans to investor pitches - we speak their language.'
        },
        {
          title: 'Systems & Processes',
          description: 'Building the machine that runs without you being everywhere.'
        },
        {
          title: 'Margin Improvement',
          description: 'Finding the profit hiding in your business.'
        }
      ],
      color: '#1a2b4a'
    }
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-[#1a2b4a] pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(to right, #f5f1e8 1px, transparent 1px), linear-gradient(to bottom, #f5f1e8 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black uppercase mb-6">
            THREE WAYS WE <span className="text-[#ff6b35]">FIGHT FOR YOU</span>
          </h1>
          <p className="text-xl text-[#f5f1e8]/80">
            From essential compliance to strategic growth - always personal, always fighting for your success
          </p>
        </div>
      </section>

      {/* Services Detail */}
      {services.map((service, index) => {
        const Icon = service.icon
        
        return (
          <section 
            key={service.id}
            id={service.id}
            className={`py-20 px-4 ${index % 2 === 0 ? 'bg-[#f5f1e8]' : 'bg-white'}`}
          >
            <ServiceSchema service={service} />
            <div className="container mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="inline-flex p-4 bg-[#1a2b4a] mb-6">
                    <Icon size={32} className="text-[#f5f1e8]" />
                  </div>
                  
                  <h2 className="text-4xl font-black uppercase text-[#1a2b4a] mb-3">{service.name}</h2>
                  <p className="text-xl font-bold text-[#ff6b35] mb-6">{service.tagline}</p>
                  
                  <div className="prose prose-lg text-[#1a2b4a] whitespace-pre-line">
                    {service.longDescription}
                  </div>
                </div>
                
                <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <h3 className="text-2xl font-black uppercase text-[#1a2b4a] mb-6">WHAT&apos;S INCLUDED:</h3>
                  <div className="space-y-4">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <div className={`w-2 h-2 bg-[${service.color}] mt-2 mr-4 flex-shrink-0`} style={{backgroundColor: service.color}}></div>
                        <div>
                          <h4 className="font-bold text-[#1a2b4a] mb-1">{feature.title}</h4>
                          <p className="text-[#1a2b4a]/80">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-[#1a2b4a]">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-black uppercase text-[#f5f1e8] mb-6">
            TRANSPARENT <span className="text-[#ff6b35]">PRICING</span>
          </h2>
          <p className="text-xl text-[#f5f1e8]/80 mb-12 max-w-3xl mx-auto">
            No hidden fees. No surprise bills. Just honest pricing for exceptional service.
          </p>
          
          <div className="bg-[#f5f1e8] p-8 mb-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-black uppercase text-[#1a2b4a] mb-4">HOW WE PRICE</h3>
            <div className="text-left space-y-4 text-[#1a2b4a] max-w-2xl mx-auto">
              <p>
                <strong className="font-bold">FIXED MONTHLY FEES:</strong> Most clients prefer predictable 
                monthly fees. We&apos;ll agree on a package that covers everything you need.
              </p>
              <p>
                <strong className="font-bold">PROJECT-BASED:</strong> For one-off projects like PE deals 
                or exit planning, we quote a fixed fee upfront.
              </p>
              <p>
                <strong className="font-bold">VALUE-BASED:</strong> For growth projects, we can align our 
                fees with your success. We win when you win.
              </p>
            </div>
          </div>
          
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#ff6b35]" />
            <div className="relative bg-[#ff6b35] p-6">
              <p className="text-lg font-black uppercase text-[#f5f1e8] mb-2">🎯 REMEMBER: QUALITY COSTS MORE THAN QUANTITY</p>
              <p className="text-[#f5f1e8]">
                We&apos;re not the cheapest. But we are the best value for businesses that want more than just filing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#ff6b35] text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-black uppercase text-[#f5f1e8] mb-6">
            READY TO EXPERIENCE THE DIFFERENCE?
          </h2>
          <p className="text-xl text-[#f5f1e8]/90 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your needs and how we can help. No sales pitch, just straight talk about your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="large" className="bg-[#1a2b4a] text-[#f5f1e8] hover:bg-[#0f1829] font-black uppercase px-8 py-4 text-lg">
                BOOK YOUR NO-BS CALL
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="secondary" size="large" className="bg-transparent border-2 border-[#f5f1e8] text-[#f5f1e8] hover:bg-[#f5f1e8] hover:text-[#ff6b35] font-black uppercase px-8 py-4 text-lg">
                LEARN MORE ABOUT US
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}