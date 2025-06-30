import { Metadata } from 'next'
import Image from 'next/image'
import { Award, Briefcase, TrendingUp, Shield } from 'lucide-react'
import Button from '@/components/ivc/shared/Button'
import { BreadcrumbSchema } from '@/components/ivc/seo/StructuredData'

export const metadata: Metadata = {
  title: 'Meet James Howard - Founder of IVC Accounting',
  description: 'Meet James Howard, FCCA. 15+ years experience, survived 3 PE acquisitions, and now fights for business owners instead of just filing paperwork.',
}

export default function TeamPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://ivcaccounting.co.uk/ivc' },
    { name: 'Team', url: 'https://ivcaccounting.co.uk/ivc/team' }
  ]

  const credentials = [
    {
      icon: Award,
      title: 'FCCA Qualified',
      description: 'Fellow of the Association of Chartered Certified Accountants'
    },
    {
      icon: Briefcase,
      title: '15+ Years Experience',
      description: 'From Big 4 to PE-backed businesses to founding IVC'
    },
    {
      icon: TrendingUp,
      title: '3 PE Exits',
      description: 'Survived and thrived through multiple acquisitions'
    },
    {
      icon: Shield,
      title: '50 Client Limit',
      description: 'Personal service guarantee - you always deal with me'
    }
  ]

  const timeline = [
    {
      year: '2007-2012',
      title: 'Big 4 Foundation',
      description: 'Started at a Big 4 firm. Learned the fundamentals, saw how the machine works.',
      highlight: 'Qualified as FCCA'
    },
    {
      year: '2012-2015',
      title: 'First PE Experience',
      description: 'CFO at a PE-backed manufacturing business. First acquisition, first real pressure.',
      highlight: 'Led successful exit'
    },
    {
      year: '2015-2018',
      title: 'Second PE Rodeo',
      description: 'Finance Director at tech startup. Another PE deal, more lessons learned.',
      highlight: 'Doubled EBITDA'
    },
    {
      year: '2018-2021',
      title: 'Third Time\'s the Charm',
      description: 'CFO at services business. Third PE exit. Realized I was on the wrong side.',
      highlight: 'Protected founder interests'
    },
    {
      year: '2021-Present',
      title: 'Founded IVC',
      description: 'Built IVC to be the accountant I wish I\'d had. Fighting for owners, not filing.',
      highlight: '50 client limit'
    }
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Meet the <span className="text-orange-500">Fighter</span> in Your Corner
          </h1>
          <p className="text-xl text-gray-300">
            Not just an accountant. Your business advocate with battle scars to prove it.
          </p>
        </div>
      </section>

      {/* James Profile */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="relative">
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 z-10"></div>
                <Image
                  src="/images/james-howard.jpg"
                  alt="James Howard - Founder of IVC Accounting"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold mb-2">James Howard</h2>
              <p className="text-xl text-orange-400 font-semibold mb-6">Founder & Your Personal CFO</p>
              
              <div className="space-y-4 text-lg text-gray-300 mb-8">
                <p>
                  I'm not your typical accountant. I don't hide behind a desk, pushing papers and 
                  avoiding difficult conversations. I've been in the arena - as a CFO, as a founder, 
                  as someone who's faced the pressure of PE ownership.
                </p>
                
                <p>
                  After my third PE exit, I had a choice: join another corporate machine or build 
                  something different. I chose different.
                </p>
                
                <p>
                  IVC exists because business owners deserve better than being treated like account 
                  numbers. You deserve someone who understands the pressure, who's been through the 
                  fire, and who'll fight for your interests like they're my own.
                </p>
                
                <p className="font-semibold text-white">
                  Because with only 50 clients, they are.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {credentials.map((cred, index) => {
                  const Icon = cred.icon
                  return (
                    <div key={index} className="bg-gray-800 rounded-lg p-4">
                      <Icon className="w-6 h-6 text-orange-400 mb-2" />
                      <h4 className="font-semibold text-sm mb-1">{cred.title}</h4>
                      <p className="text-xs text-gray-400">{cred.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            The Journey to <span className="text-orange-500">IVC</span>
          </h2>
          
          <div className="space-y-12">
            {timeline.map((period, index) => (
              <div key={index} className="flex gap-8">
                <div className="flex-shrink-0 w-32 text-right">
                  <span className="text-orange-400 font-semibold">{period.year}</span>
                </div>
                <div className="relative flex-1">
                  <div className="absolute -left-4 top-2 w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div className="border-l-2 border-gray-700 pl-8 pb-8">
                    <h3 className="text-2xl font-semibold mb-2">{period.title}</h3>
                    <p className="text-gray-300 mb-2">{period.description}</p>
                    <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full">
                      {period.highlight}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why This <span className="text-orange-500">Matters</span> to You
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">I've Been in Your Shoes</h3>
              <p className="text-gray-300">
                Cash flow crises, PE pressure, growth challenges - I've faced them all. 
                Not in theory, but in reality. That experience is now yours.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">I Know Their Playbook</h3>
              <p className="text-gray-300">
                PE firms, HMRC, banks - I know how they think because I've been on their 
                side. Now I use that knowledge to protect you.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">I Take It Personally</h3>
              <p className="text-gray-300">
                With 50 clients max, your success is my success. When you win, I win. 
                When you're under pressure, I feel it too.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">I'm Always Available</h3>
              <p className="text-gray-300">
                PE doesn't wait for office hours. Neither do I. When you need me, 
                I'm there - evenings, weekends, whenever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Want an Accountant Who <span className="text-orange-500">Gets It</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's talk about your business, your challenges, and how I can help you win.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="large" href="/ivc/contact">
              Book a No-BS Call
            </Button>
            <Button variant="secondary" size="large" href="/ivc/services">
              See How I Can Help
            </Button>
          </div>
        </div>
      </section>
    </>
  )
} 