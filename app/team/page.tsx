import { Metadata } from 'next'
import Image from 'next/image'
import { Award, Briefcase, Shield, Target, Heart, Users, Calendar, GraduationCap, Building, Rocket } from 'lucide-react'
import Button from '@/components/shared/Button'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
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
      <BreadcrumbSchema items={breadcrumbs} />
      
      {/* Hero Section with dynamic styling */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 hero-gradient opacity-60" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Meet Your</span>{' '}
            <span className="text-orange-500 neon-orange">Fighter</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 leading-relaxed high-contrast">
            One accountant. Fifty clients. Unlimited commitment.
          </p>
        </div>
      </section>

      {/* Main Profile Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse top-10 right-10" />
          <div className="absolute w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse bottom-10 left-10 animation-delay-2000" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Image Section */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-3xl blur-2xl animate-pulse" />
              <Image
                src="/images/james-howard.jpg"
                alt="James Howard - Founder of IVC Accounting"
                width={600}
                height={700}
                className="rounded-3xl shadow-2xl relative z-10 border-gradient"
              />
              
              {/* Floating stats */}
              <div className="absolute -top-6 -right-6 bg-orange-500 text-white p-6 rounded-2xl shadow-xl card-hover">
                <p className="text-4xl font-bold">15+</p>
                <p className="text-sm">Years Fighting</p>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-purple-600 text-white p-6 rounded-2xl shadow-xl card-hover">
                <p className="text-4xl font-bold">50</p>
                <p className="text-sm">Client Limit</p>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  James Howard
                </h2>
                <p className="text-2xl text-orange-500 font-semibold mb-2">
                  Founder & Your Direct Contact
                </p>
                <p className="text-lg text-gray-400">
                  FCCA | FFA | 15+ Years Experience | 1 PE Exit
                </p>
              </div>
              
              <div className="space-y-6 text-lg text-gray-100 leading-relaxed">
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
                
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 glass-morphism card-hover">
                  <h3 className="text-xl font-bold text-orange-500 mb-3">Why I Limit to 50 Clients</h3>
                  <p className="text-gray-100">
                    Simple. Quality beats quantity every time. With 50 clients, I know every business 
                    inside out. I know your challenges, your goals, and what keeps you up at night. 
                    Try getting that from a firm with 5,000 clients.
                  </p>
                </div>
              </div>
              
              {/* Contact buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="large" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 btn-glow pulse-cta">
                    Book a Direct Call
                  </Button>
                </Link>
                <a href="mailto:james@ivcaccounting.co.uk">
                  <Button variant="secondary" size="large" className="border-2 border-white/30 text-white hover:bg-white/10 font-bold px-8 py-4 card-hover">
                    Email Me Directly
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-white">The Experience That</span>{' '}
            <span className="text-orange-500 neon-orange">Backs Your Business</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Calendar,
                year: "2009",
                title: "Started in Accounting",
                description: "Began learning that numbers tell stories about people"
              },
              {
                icon: GraduationCap,
                year: "2014",
                title: "Achieved FCCA & FFA",
                description: "Qualified to fight battles on multiple fronts"
              },
              {
                icon: Building,
                year: "2020",
                title: "PE Exit Experience",
                description: "Chose values over valuations when PE took over"
              },
              {
                icon: Rocket,
                year: "2021",
                title: "Founded IVC",
                description: "Built a firm where fighting beats filing"
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500" />
                <div className="relative bg-gray-800 rounded-2xl p-6 h-full card-hover glass-morphism">
                  <item.icon className="w-10 h-10 text-orange-500 mb-4" />
                  <p className="text-orange-500 font-bold mb-2">{item.year}</p>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Expertise with dynamic cards */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-white">Armed With</span>{' '}
            <span className="text-orange-500 neon-orange">Battle-Tested Skills</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "PE Defense",
                skills: ["Due diligence preparation", "Negotiation support", "Exit planning", "Valuation protection"],
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Target,
                title: "Tax Strategy",
                skills: ["Advanced planning", "HMRC negotiations", "International structures", "R&D claims"],
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Award,
                title: "Business Growth",
                skills: ["KPI dashboards", "Cash flow optimization", "Funding strategies", "M&A support"],
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Briefcase,
                title: "Compliance Excellence",
                skills: ["Year-end accounts", "VAT returns", "Payroll management", "Company secretarial"],
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Heart,
                title: "Personal Service",
                skills: ["Direct access", "Same-day responses", "Plain English advice", "Proactive planning"],
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: Users,
                title: "Industry Experience",
                skills: ["Tech & SaaS", "Professional services", "Manufacturing", "Retail & hospitality"],
                color: "from-indigo-500 to-purple-500"
              }
            ].map((skill, index) => (
              <div key={index} className="group relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${skill.color} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500`} />
                <div className="relative bg-gray-800 rounded-2xl p-8 h-full card-hover glass-morphism">
                  <skill.icon className="w-12 h-12 text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">{skill.title}</h3>
                  <ul className="space-y-2">
                    {skill.skills.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-orange-500 mr-2">→</span>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Style Promise */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-3xl p-12 glass-morphism card-hover">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              My Promise to You
            </h2>
            <blockquote className="text-xl md:text-2xl text-gray-100 leading-relaxed mb-8">
              &ldquo;When you work with IVC, you&apos;re not getting an accountant. You&apos;re getting a 
              business partner who&apos;s been in the trenches, survived the battles, and knows exactly 
              how to protect and grow what you&apos;ve built. I don&apos;t just file your numbers - 
              I fight for your future.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <Image
                src="/images/james-howard.jpg"
                alt="James Howard"
                width={80}
                height={80}
                className="rounded-full border-2 border-orange-500"
              />
              <div className="text-left">
                <p className="text-lg font-semibold text-white">James Howard</p>
                <p className="text-gray-400">Founder, IVC Accounting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Work With Someone Who Gets It?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            No gatekeepers. No junior staff. Just direct access to someone who&apos;s been where you are.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="large" className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg btn-glow">
                Book a Direct Call
              </Button>
            </Link>
            <a href="mailto:james@ivcaccounting.co.uk">
              <Button variant="secondary" size="large" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-4 text-lg">
                Email: james@ivcaccounting.co.uk
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  )
} 