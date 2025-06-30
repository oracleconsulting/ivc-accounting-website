// app/about/page.tsx
import { Metadata } from 'next'
import Image from 'next/image'
import { TrendingUp, Users, Target, Award, Heart, Briefcase } from 'lucide-react'
import Button from '@/components/shared/Button'
import Link from 'next/link'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  title: 'About IVC Accounting - Our Story & Values',
  description: 'Learn about IVC Accounting\'s journey, James Howard\'s 15+ years of experience, and why we choose to fight for business owners rather than just file paperwork.',
}

export default function AboutPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://ivcaccounting.co.uk/ivc' },
    { name: 'About', url: 'https://ivcaccounting.co.uk/ivc/about' }
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#1a2b4a] pt-20">
        {/* Geometric Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              #ff6b35 40px,
              #ff6b35 41px
            )`
          }} />
          <div className="absolute bottom-0 left-0 w-full h-[50%]">
            <svg viewBox="0 0 1440 400" className="w-full h-full">
              <polygon points="0,400 360,200 720,100 1080,250 1440,150 1440,400" fill="#f5f1e8" opacity="0.05" />
            </svg>
          </div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase mb-6">
            <span className="text-[#f5f1e8]">THIS IS</span>{' '}
            <span className="text-[#ff6b35]">OUR FIGHT</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#f5f1e8]/80 leading-relaxed">
            After 15 years in accounting and one transformative PE exit, 
            I realized business owners needed something different.
          </p>
        </div>
      </section>

      {/* James's Story Section */}
      <section className="py-24 bg-[#f5f1e8] relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black uppercase text-[#1a2b4a]">
                THE JOURNEY THAT LED TO
                <span className="block text-[#ff6b35]">IVC</span>
              </h2>
              
              <div className="space-y-6 text-lg text-[#1a2b4a] leading-relaxed">
                <p>
                  I&apos;m James Howard. For over 15 years, I&apos;ve worked in the trenches of UK accounting, 
                  from small practices to being part of a firm that went through a PE acquisition.
                </p>
                
                <div className="bg-[#ff6b35] p-8">
                  <h3 className="text-2xl font-black uppercase text-[#f5f1e8] mb-4">THE PE EXIT THAT CHANGED EVERYTHING</h3>
                  <p className="text-[#f5f1e8]">
                    When private equity acquired the firm I was part of, I had a front-row seat to what happens 
                    when profit becomes the only metric that matters. Client relationships became &ldquo;revenue streams.&rdquo; 
                    Personal service became &ldquo;inefficiency.&rdquo; Quality became &ldquo;good enough.&rdquo;
                  </p>
                  <p className="text-[#f5f1e8] mt-4">
                    I made the choice to exit. Not because it was easy, but because it was right. 
                    I knew our clients deserved better than becoming line items in a portfolio.
                  </p>
                </div>
                
                <p>
                  That experience taught me something vital: The moment you lose sight of the people 
                  behind the numbers, you&apos;ve lost what makes this work meaningful. It&apos;s why I founded 
                  IVC with a different philosophy.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#ff6b35]" />
              <div className="relative bg-white p-2">
                <Image
                  src="/images/james-howard.jpg"
                  alt="James Howard, Founder of IVC Accounting"
                  width={600}
                  height={700}
                  className="w-full"
                />
                <div className="absolute -bottom-8 -right-8 bg-[#4a90e2] text-[#f5f1e8] p-8 max-w-sm">
                  <p className="text-3xl font-black uppercase">2024</p>
                  <p className="text-lg font-bold uppercase">Founded IVC</p>
                  <p className="text-sm mt-1">
                    &ldquo;I chose to build something where relationships matter more than revenue.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-[#1a2b4a] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase text-[#f5f1e8] mb-6">
              OUR VALUES ARE OUR
              <span className="block text-[#ff6b35]">WEAPONS</span>
            </h2>
            <p className="text-xl text-[#f5f1e8]/80 max-w-3xl mx-auto">
              These aren&apos;t just words on a wall. They&apos;re the principles we fight with every day.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "QUALITY OVER QUANTITY",
                description: "50 clients maximum. That's it. When you call, you get me. When you need advice, you get someone who knows your business inside out.",
                highlight: "50 CLIENT LIMIT"
              },
              {
                icon: Target,
                title: "STRAIGHT TALK",
                description: "No jargon. No hiding behind complexity. If something's wrong, we tell you. If there's an opportunity, we show you how to grab it.",
                highlight: "NO BS POLICY"
              },
              {
                icon: Users,
                title: "PERSONAL SERVICE",
                description: "You're not a number in a database. You're a business owner with dreams, challenges, and a family depending on you. We never forget that.",
                highlight: "DIRECT ACCESS"
              },
              {
                icon: TrendingUp,
                title: "PROACTIVE PROTECTION",
                description: "We don't wait for problems to find you. We hunt them down first. Tax planning, compliance, growth strategy - we're always thinking ahead.",
                highlight: "ALWAYS FIGHTING"
              },
              {
                icon: Award,
                title: "EXPERIENCE THAT MATTERS",
                description: "15+ years in the trenches. PE exits. HMRC battles. Growth scaling. We've been there, and we use that experience to protect you.",
                highlight: "BATTLE-TESTED"
              },
              {
                icon: Briefcase,
                title: "GROWTH PARTNERSHIP",
                description: "We're not just here to file your returns. We're here to help you build something meaningful, sustainable, and valuable.",
                highlight: "BEYOND COMPLIANCE"
              }
            ].map((value, index) => (
              <div key={index} className="group relative">
                <div className="absolute -top-2 -left-2 w-full h-full bg-[#ff6b35] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative bg-[#f5f1e8]/10 backdrop-blur-sm border border-[#f5f1e8]/20 p-8 h-full">
                  <value.icon className="w-12 h-12 text-[#ff6b35] mb-4" />
                  <h3 className="text-xl font-black uppercase text-[#f5f1e8] mb-3">{value.title}</h3>
                  <p className="text-[#f5f1e8]/80 mb-4">{value.description}</p>
                  <span className="inline-block px-4 py-2 bg-[#ff6b35] text-[#f5f1e8] text-sm font-bold uppercase">
                    {value.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-[#f5f1e8] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-center mb-16">
            <span className="text-[#1a2b4a]">THE PATH TO</span>{' '}
            <span className="text-[#ff6b35]">FIGHTING FOR YOU</span>
          </h2>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#ff6b35]" />
            
            {/* Timeline items */}
            <div className="space-y-12">
              {[
                {
                  year: "2010",
                  title: "STARTED IN ACCOUNTING",
                  description: "Began my journey in a small practice, learning that behind every number is a person with a dream."
                },
                {
                  year: "2014",
                  title: "SENIOR LEADERSHIP",
                  description: "Moved into senior roles, seeing firsthand how larger firms lose touch with what matters."
                },
                {
                  year: "2023-2024",
                  title: "THE PE EXPERIENCE",
                  description: "Experienced a private equity acquisition. Chose to exit when values clashed with profit margins."
                },
                {
                  year: "2024",
                  title: "FOUNDED IVC ACCOUNTING",
                  description: "Built a firm based on fighting for clients, not just filing for them. Limited to 50 clients by choice."
                },
                {
                  year: "TODAY",
                  title: "FIGHTING FOR YOU",
                  description: "Every day, we prove that accounting can be personal, proactive, and powerful."
                }
              ].map((item, index) => (
                <div key={index} className="relative flex items-start ml-16">
                  <div className="absolute -left-[3.25rem] w-4 h-4 bg-[#ff6b35] rounded-full border-4 border-[#f5f1e8]" />
                  <div className="bg-white border-2 border-[#1a2b4a] p-6">
                    <span className="text-[#ff6b35] font-black text-lg">{item.year}</span>
                    <h3 className="text-xl font-black text-[#1a2b4a] mt-2 mb-3">{item.title}</h3>
                    <p className="text-[#1a2b4a]/80">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#ff6b35] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              #1a2b4a 40px,
              #1a2b4a 41px
            )`
          }} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-[#f5f1e8] mb-6">
            READY TO EXPERIENCE THE DIFFERENCE?
          </h2>
          <p className="text-xl text-[#f5f1e8]/90 mb-8 max-w-2xl mx-auto">
            Join the select group of business owners who have an accountant that actually fights for them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="large" className="bg-[#1a2b4a] text-[#f5f1e8] hover:bg-[#0f1829] font-black uppercase px-8 py-4 text-lg">
                BOOK YOUR NO-BS CALL
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="secondary" size="large" className="bg-transparent border-2 border-[#f5f1e8] text-[#f5f1e8] hover:bg-[#f5f1e8] hover:text-[#ff6b35] font-black uppercase px-8 py-4 text-lg">
                SEE HOW WE FIGHT
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}