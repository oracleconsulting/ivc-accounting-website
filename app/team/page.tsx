// app/team/page.tsx
import { Metadata } from 'next'
import Image from 'next/image'
import { Award, Briefcase, Shield, Target, Heart, Users, Calendar, GraduationCap, Building, Rocket } from 'lucide-react'
import Button from '@/components/shared/Button'
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Meet James Howard - Founder of IVC Accounting',
  description: 'Meet James Howard, the founder of IVC Accounting. 15+ years of experience, 1 PE exit, and a commitment to fighting for business owners.',
}

export default function TeamPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://ivcaccounting.co.uk/ivc' },
    { name: 'Team', url: 'https://ivcaccounting.co.uk/ivc/team' }
  ]

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbs} />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#1a2b4a] pt-20">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
            <div className="grid grid-cols-8 gap-2">
              {[...Array(64)].map((_, i) => (
                <div key={i} className={`w-2 h-2 ${i % 3 === 0 ? 'bg-[#ff6b35]' : 'bg-[#4a90e2]'}`} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase mb-6">
            <span className="text-[#f5f1e8]">MEET YOUR</span>{' '}
            <span className="text-[#ff6b35]">FIGHTER</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#f5f1e8]/80 leading-relaxed">
            One accountant. Fifty clients. Unlimited commitment.
          </p>
        </div>
      </section>

      {/* Main Profile Section */}
      <section className="py-24 bg-[#f5f1e8] relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Image Section */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#ff6b35]" />
              <div className="relative bg-white p-2">
                <Image
                  src="/images/james-howard.jpg"
                  alt="James Howard - Founder of IVC Accounting"
                  width={600}
                  height={700}
                  className="w-full"
                />
              </div>
              
              {/* Stats boxes */}
              <div className="absolute -top-8 -right-8 bg-[#ff6b35] text-[#f5f1e8] p-6">
                <p className="text-4xl font-black">15+</p>
                <p className="text-sm font-bold uppercase">Years Fighting</p>
              </div>
              
              <div className="absolute -bottom-8 -left-8 bg-[#4a90e2] text-[#f5f1e8] p-6">
                <p className="text-4xl font-black">50</p>
                <p className="text-sm font-bold uppercase">Client Limit</p>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-black uppercase text-[#1a2b4a] mb-4">
                  JAMES HOWARD
                </h2>
                <p className="text-2xl font-bold text-[#ff6b35] mb-2">
                  FOUNDER & YOUR DIRECT CONTACT
                </p>
                <p className="text-lg text-[#1a2b4a]/80 font-bold">
                  FCCA | FFA | 15+ YEARS EXPERIENCE | 1 PE EXIT
                </p>
              </div>
              
              <div className="space-y-6 text-lg text-[#1a2b4a] leading-relaxed">
                <p>
                  I&apos;m not your typical accountant. I don&apos;t hide behind a desk, push paper, 
                  or speak in riddles. I&apos;m here to fight for your business like it&apos;s my own - 
                  because after 15 years in this industry, I know that&apos;s what it takes.
                </p>
                
                <p>
                  My journey through the accounting world has been anything but conventional. 
                  From small practices to experiencing firsthand what happens when PE takes over, 
                  I&apos;ve seen it all. And that PE exit? It wasn&apos;t about the money - it was about 
                  maintaining the values that matter.
                </p>
                
                <div className="bg-[#1a2b4a] p-6">
                  <h3 className="text-xl font-black uppercase text-[#ff6b35] mb-3">WHY I LIMIT TO 50 CLIENTS</h3>
                  <p className="text-[#f5f1e8]">
                    Simple. Quality beats quantity every time. With 50 clients, I know every business 
                    inside out. I know your challenges, your goals, and what keeps you up at night. 
                    Try getting that from a firm with 5,000 clients.
                  </p>
                </div>
              </div>
              
              {/* Contact buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="large" className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase px-8 py-4">
                    BOOK A DIRECT CALL
                  </Button>
                </Link>
                <a href="mailto:james@ivcaccounting.co.uk">
                  <Button variant="secondary" size="large" className="border-2 border-[#1a2b4a] text-[#1a2b4a] hover:bg-[#1a2b4a] hover:text-[#f5f1e8] font-black uppercase px-8 py-4">
                    EMAIL ME DIRECTLY
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-24 bg-[#1a2b4a] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-center mb-16">
            <span className="text-[#f5f1e8]">THE EXPERIENCE THAT</span>{' '}
            <span className="text-[#ff6b35]">BACKS YOUR BUSINESS</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Calendar,
                year: "2009",
                title: "STARTED IN ACCOUNTING",
                description: "Began learning that numbers tell stories about people"
              },
              {
                icon: GraduationCap,
                year: "2014",
                title: "ACHIEVED FCCA & FFA",
                description: "Qualified to fight battles on multiple fronts"
              },
              {
                icon: Building,
                year: "2022",
                title: "PE EXIT EXPERIENCE",
                description: "Chose values over valuations when PE took over"
              },
              {
                icon: Rocket,
                year: "2025",
                title: "FOUNDED IVC",
                description: "Built a firm where fighting beats filing"
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute -top-2 -left-2 w-full h-full bg-[#ff6b35] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative bg-[#f5f1e8]/10 backdrop-blur-sm border border-[#f5f1e8]/20 p-6 h-full">
                  <item.icon className="w-10 h-10 text-[#ff6b35] mb-4" />
                  <p className="text-[#ff6b35] font-black mb-2">{item.year}</p>
                  <h3 className="text-lg font-black text-[#f5f1e8] mb-2">{item.title}</h3>
                  <p className="text-[#f5f1e8]/80 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Expertise */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-center mb-16">
            <span className="text-[#1a2b4a]">ARMED WITH</span>{' '}
            <span className="text-[#ff6b35]">BATTLE-TESTED SKILLS</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "PE DEFENSE",
                skills: ["Due diligence preparation", "Negotiation support", "Exit planning", "Valuation protection"],
                color: 'bg-[#ff6b35]'
              },
              {
                icon: Target,
                title: "TAX STRATEGY",
                skills: ["Advanced planning", "HMRC negotiations", "International structures", "R&D claims"],
                color: 'bg-[#4a90e2]'
              },
              {
                icon: Award,
                title: "BUSINESS GROWTH",
                skills: ["KPI dashboards", "Cash flow optimization", "Funding strategies", "M&A support"],
                color: 'bg-[#1a2b4a]'
              },
              {
                icon: Briefcase,
                title: "COMPLIANCE EXCELLENCE",
                skills: ["Year-end accounts", "VAT returns", "Payroll management", "Company secretarial"],
                color: 'bg-[#ff6b35]'
              },
              {
                icon: Heart,
                title: "PERSONAL SERVICE",
                skills: ["Direct access", "Same-day responses", "Plain English advice", "Proactive planning"],
                color: 'bg-[#4a90e2]'
              },
              {
                icon: Users,
                title: "INDUSTRY EXPERIENCE",
                skills: ["Tech & SaaS", "Professional services", "Manufacturing", "Retail & hospitality"],
                color: 'bg-[#1a2b4a]'
              }
            ].map((skill, index) => (
              <div key={index} className="relative group">
                <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#1a2b4a]" />
                <div className="relative bg-[#f5f1e8] p-8 h-full">
                  <div className={`inline-flex p-3 ${skill.color} mb-4`}>
                    <skill.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black uppercase text-[#1a2b4a] mb-4">{skill.title}</h3>
                  <ul className="space-y-2">
                    {skill.skills.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-[#ff6b35] mr-2 font-bold">→</span>
                        <span className="text-[#1a2b4a]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-24 bg-[#ff6b35] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              #1a2b4a 40px,
              #1a2b4a 41px
            )`
          }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2b4a]/20 to-transparent" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black uppercase text-[#f5f1e8] mb-6">
              MY PROMISE TO YOU
            </h2>
            <blockquote className="text-xl md:text-2xl text-[#f5f1e8] leading-relaxed mb-8">
              &ldquo;When you work with IVC, you&apos;re not getting an accountant. You&apos;re getting a 
              business partner who&apos;s been in the trenches, survived the battles, and knows exactly 
              how to protect and grow what you&apos;ve built. I don&apos;t just file your numbers - 
              I fight for your future.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full overflow-hidden">
                <Image
                  src="/images/james-howard.jpg"
                  alt="James Howard"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-lg font-black text-[#f5f1e8]">JAMES HOWARD</p>
                <p className="text-[#f5f1e8]/80">Founder, IVC Accounting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1a2b4a] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-[#f5f1e8] mb-6">
            READY TO WORK WITH SOMEONE WHO GETS IT?
          </h2>
          <p className="text-xl text-[#f5f1e8]/90 mb-8 max-w-2xl mx-auto">
            No gatekeepers. No junior staff. Just direct access to someone who&apos;s been where you are.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="large" className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase px-8 py-4 text-lg">
                BOOK A DIRECT CALL
              </Button>
            </Link>
            <a href="mailto:james@ivcaccounting.co.uk">
              <Button variant="secondary" size="large" className="bg-transparent border-2 border-[#f5f1e8] text-[#f5f1e8] hover:bg-[#f5f1e8] hover:text-[#1a2b4a] font-black uppercase px-8 py-4 text-lg">
                EMAIL: JAMES@IVCACCOUNTING.CO.UK
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}