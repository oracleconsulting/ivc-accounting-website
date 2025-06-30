import { Metadata } from 'next'
import { Shield, Target, TrendingUp, Check } from 'lucide-react'
import Button from '@/components/ivc/shared/Button'
import { BreadcrumbSchema, ServiceSchema } from '@/components/ivc/seo/StructuredData'

export const metadata: Metadata = {
  title: 'Services - Essential Compliance, Strategic Advisory & Growth',
  description: 'IVC Accounting services: From rock-solid compliance to PE negotiations and growth strategy. Personal service from someone who\'s been in your shoes.',
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
      name: 'Essential Compliance',
      tagline: 'The Foundations Done Right',
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
          description: 'Submitted early, optimized properly, with no nasty surprises.'
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
      color: 'blue'
    },
    {
      id: 'advisory',
      icon: Target,
      name: 'Strategic Advisory',
      tagline: 'Been There, Done That, Got Your Back',
      description: 'Real advice for real challenges. PE negotiations, tax planning, and business strategy from someone who\'s survived the pressure.',
      longDescription: `This is where experience matters. When PE firms circle, when big decisions loom, when you need more than textbook answers - you need someone who's lived it.
      
      I've been through 3 PE acquisitions. I know their playbook, their pressure tactics, their sweet spots. More importantly, I know how to protect YOUR interests.
      
      This isn't theoretical advice from someone who's only read about it. This is battle-tested strategy from someone who's been in the trenches.`,
      features: [
        {
          title: 'PE Deal Navigation',
          description: 'From first approach to final exit - protecting your interests at every step.'
        },
        {
          title: 'Tax Optimization',
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
          description: 'Strategic input from someone who\'s actually built and sold businesses.'
        },
        {
          title: 'Deal Structuring',
          description: 'Making sure the terms work for YOU, not just them.'
        }
      ],
      color: 'purple'
    },
    {
      id: 'growth',
      icon: TrendingUp,
      name: 'Business Growth',
      tagline: 'Building Something Real',
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
          description: 'Track what matters, ignore what doesn\'t. Real-time visibility.'
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
      color: 'orange'
    }
  ]

  const colorClasses = {
    blue: {
      gradient: 'from-blue-500/20 to-blue-600/20',
      border: 'border-blue-500/30',
      icon: 'text-blue-400',
      bullet: 'bg-blue-400'
    },
    purple: {
      gradient: 'from-purple-500/20 to-purple-600/20',
      border: 'border-purple-500/30',
      icon: 'text-purple-400',
      bullet: 'bg-purple-400'
    },
    orange: {
      gradient: 'from-orange-500/20 to-orange-600/20',
      border: 'border-orange-500/30',
      icon: 'text-orange-400',
      bullet: 'bg-orange-400'
    }
  }

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Three Ways We <span className="text-orange-500">Fight For You</span>
          </h1>
          <p className="text-xl text-gray-300">
            From essential compliance to strategic growth - always personal, always fighting for your success
          </p>
        </div>
      </section>

      {/* Services Detail */}
      {services.map((service, index) => {
        const Icon = service.icon
        const colors = colorClasses[service.color as keyof typeof colorClasses]
        
        return (
          <section 
            key={service.id}
            id={service.id}
            className={`py-20 px-4 ${index % 2 === 1 ? 'bg-gray-900/50' : ''}`}
          >
            <ServiceSchema service={service} />
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br ${colors.gradient} ${colors.border} border mb-6`}>
                    <Icon size={32} className={colors.icon} />
                  </div>
                  
                  <h2 className="text-4xl font-bold mb-3">{service.name}</h2>
                  <p className="text-xl text-orange-400 font-semibold mb-6">{service.tagline}</p>
                  
                  <div className="prose prose-lg text-gray-300 whitespace-pre-line">
                    {service.longDescription}
                  </div>
                </div>
                
                <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <h3 className="text-2xl font-semibold mb-6">What's Included:</h3>
                  <div className="space-y-4">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <div className={`w-2 h-2 ${colors.bullet} rounded-full mt-2 mr-4 flex-shrink-0`}></div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                          <p className="text-gray-400">{feature.description}</p>
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
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Transparent <span className="text-orange-500">Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            No hidden fees. No surprise bills. Just honest pricing for exceptional service.
          </p>
          
          <div className="bg-gray-800 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-4">How We Price</h3>
            <div className="text-left space-y-4 text-gray-300 max-w-2xl mx-auto">
              <p>
                <strong className="text-white">Fixed Monthly Fees:</strong> Most clients prefer predictable 
                monthly fees. We'll agree on a package that covers everything you need.
              </p>
              <p>
                <strong className="text-white">Project-Based:</strong> For one-off projects like PE deals 
                or exit planning, we quote a fixed fee upfront.
              </p>
              <p>
                <strong className="text-white">Value-Based:</strong> For growth projects, we can align our 
                fees with your success. We win when you win.
              </p>
            </div>
          </div>
          
          <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-6 inline-block">
            <p className="text-lg font-semibold mb-2">🎯 Remember: Quality Costs More Than Quantity</p>
            <p className="text-gray-300">
              We're not the cheapest. But we are the best value for businesses that want more than just filing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience the <span className="text-orange-500">Difference</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's discuss your needs and how we can help. No sales pitch, just straight talk about your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="large" href="/ivc/contact">
              Book Your No-BS Call
            </Button>
            <Button variant="secondary" size="large" href="/ivc/about">
              Learn More About Us
            </Button>
          </div>
        </div>
      </section>
    </>
  )
} 