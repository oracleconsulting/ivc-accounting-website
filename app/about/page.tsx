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
      
      {/* Hero Section with dynamic background */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 hero-gradient opacity-60" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">This Is</span>{' '}
            <span className="text-orange-500 neon-orange">Our Fight</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 leading-relaxed high-contrast">
            After 15 years in accounting and one transformative PE exit, 
            I realized business owners needed something different.
          </p>
        </div>
      </section>

      {/* James's Story Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse top-20 left-20" />
          <div className="absolute w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse bottom-20 right-20 animation-delay-2000" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                The Journey That Led to{' '}
                <span className="text-orange-500 neon-orange">IVC</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-100 leading-relaxed">
                <p>
                  I&apos;m James Howard. For over 15 years, I&apos;ve worked in the trenches of UK accounting, 
                  from small practices to being part of a firm that went through a PE acquisition.
                </p>
                
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 glass-morphism card-hover">
                  <h3 className="text-2xl font-bold text-orange-500 mb-4">The PE Exit That Changed Everything</h3>
                  <p className="mb-4">
                    When private equity acquired the firm I was part of, I had a front-row seat to what happens 
                    when profit becomes the only metric that matters. Client relationships became &ldquo;revenue streams.&rdquo; 
                    Personal service became &ldquo;inefficiency.&rdquo; Quality became &ldquo;good enough.&rdquo;
                  </p>
                  <p>
                    I made the choice to exit. Not because it was easy, but because it was right. 
                    I knew our clients deserved better than becoming line items in a portfolio. 
                    That exit wasn&apos;t just about leaving - it was about holding onto the values 
                    that make accounting a profession, not just a business.
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
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500" />
              <Image
                src="/images/james-howard.jpg"
                alt="James Howard, Founder of IVC Accounting"
                width={600}
                height={700}
                className="rounded-3xl shadow-2xl relative z-10 border-gradient"
              />
              <div className="absolute -bottom-8 -right-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8 rounded-2xl shadow-xl card-hover max-w-sm">
                <p className="text-lg font-semibold mb-2">Founded IVC in 2021</p>
                <p className="text-sm opacity-90">
                  &ldquo;I chose to build something where relationships matter more than revenue, 
                  where fighting for clients beats filing for numbers.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section with dynamic cards */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Values Are Our{' '}
              <span className="text-orange-500 neon-orange">Weapons</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              These aren&apos;t just words on a wall. They&apos;re the principles we fight with every day.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Quality Over Quantity",
                description: "50 clients maximum. That's it. When you call, you get me. When you need advice, you get someone who knows your business inside out.",
                highlight: "50 Client Limit"
              },
              {
                icon: Target,
                title: "Straight Talk",
                description: "No jargon. No hiding behind complexity. If something's wrong, we tell you. If there's an opportunity, we show you how to grab it.",
                highlight: "No BS Policy"
              },
              {
                icon: Users,
                title: "Personal Service",
                description: "You're not a number in a database. You're a business owner with dreams, challenges, and a family depending on you. We never forget that.",
                highlight: "Direct Access"
              },
              {
                icon: TrendingUp,
                title: "Proactive Protection",
                description: "We don't wait for problems to find you. We hunt them down first. Tax planning, compliance, growth strategy - we're always thinking ahead.",
                highlight: "Always Fighting"
              },
              {
                icon: Award,
                title: "Experience That Matters",
                description: "15+ years in the trenches. PE exits. HMRC battles. Growth scaling. We've been there, and we use that experience to protect you.",
                highlight: "Battle-Tested"
              },
              {
                icon: Briefcase,
                title: "Growth Partnership",
                description: "We're not just here to file your returns. We're here to help you build something meaningful, sustainable, and valuable.",
                highlight: "Beyond Compliance"
              }
            ].map((value, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500" />
                <div className="relative bg-gray-800 rounded-2xl p-8 h-full card-hover glass-morphism">
                  <value.icon className="w-12 h-12 text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-300 mb-4">{value.description}</p>
                  <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold">
                    {value.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-white">The Path to</span>{' '}
            <span className="text-orange-500 neon-orange">Fighting for You</span>
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-500 to-purple-500 rounded-full" />
            
            {/* Timeline items */}
            <div className="space-y-16">
              {[
                {
                  year: "2009",
                  title: "Started in Accounting",
                  description: "Began my journey in a small practice, learning that behind every number is a person with a dream."
                },
                {
                  year: "2015",
                  title: "Senior Leadership",
                  description: "Moved into senior roles, seeing firsthand how larger firms lose touch with what matters."
                },
                {
                  year: "2020",
                  title: "The PE Experience",
                  description: "Experienced a private equity acquisition. Chose to exit when values clashed with profit margins."
                },
                {
                  year: "2021",
                  title: "Founded IVC Accounting",
                  description: "Built a firm based on fighting for clients, not just filing for them. Limited to 50 clients by choice."
                },
                {
                  year: "Today",
                  title: "Fighting for You",
                  description: "Every day, we prove that accounting can be personal, proactive, and powerful."
                }
              ].map((item, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-gray-800 rounded-2xl p-6 card-hover glass-morphism">
                      <span className="text-orange-500 font-bold text-xl">{item.year}</span>
                      <h3 className="text-2xl font-bold text-white mt-2 mb-3">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-500 rounded-full border-4 border-black shadow-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the select group of business owners who have an accountant that actually fights for them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="large" className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg btn-glow">
                Book Your No-BS Call
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="secondary" size="large" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-4 text-lg">
                See How We Fight
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
} 