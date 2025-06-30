import { Shield, TrendingUp, Target } from 'lucide-react'
import Link from 'next/link'

export default function ServicesGrid() {
  const services = [
    {
      icon: Shield,
      title: 'Essential Compliance',
      description: 'Rock-solid bookkeeping, VAT, payroll, and year-end accounts. The basics done right, every time.',
      features: [
        'Monthly bookkeeping',
        'VAT returns',
        'Payroll management',
        'Year-end accounts',
        'Company secretarial'
      ],
      color: 'blue'
    },
    {
      icon: Target,
      title: 'Strategic Advisory',
      description: 'Real advice for real challenges. PE negotiations, tax planning, and business strategy from someone who\'s been there.',
      features: [
        'PE deal navigation',
        'Tax optimization',
        'Cash flow planning',
        'Exit strategies',
        'Board reporting'
      ],
      color: 'purple'
    },
    {
      icon: TrendingUp,
      title: 'Business Growth',
      description: 'Beyond the numbers. We help you build systems, find opportunities, and grow sustainably.',
      features: [
        'Growth strategy',
        'Financial modeling',
        'KPI dashboards',
        'Funding support',
        'Operational efficiency'
      ],
      color: 'orange'
    }
  ]

  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30'
  }

  return (
    <section className="py-20 px-4 bg-gray-900/50" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Three Ways We <span className="text-orange-500">Fight For You</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From essential compliance to strategic growth, we're your complete financial partner. 
            Not just an accountant - your business advocate.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className={`relative bg-gradient-to-br ${colorClasses[service.color as keyof typeof colorClasses]} border rounded-xl p-8 hover:scale-105 transition-transform duration-300`}
              >
                <div className="mb-6">
                  <Icon size={48} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-300 mb-6">{service.description}</p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Link
                    href="/ivc/services"
                    className="text-white font-semibold hover:text-orange-400 transition-colors"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-orange-500/20 border border-orange-500/50 rounded-lg p-6">
            <p className="text-lg mb-2">🎯 Remember: <span className="font-bold">50 Client Limit</span></p>
            <p className="text-gray-300">Every client gets the attention they deserve</p>
          </div>
        </div>
      </div>
    </section>
  )
} 