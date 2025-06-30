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
      color: 'orange'
    },
    {
      icon: Target,
      title: 'Strategic Advisory',
      description: "Real advice for real challenges. PE negotiations, tax planning, and business strategy from someone who's been there.",
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
      color: 'blue'
    }
  ]

  return (
    <section className="py-24 bg-black relative overflow-hidden" id="services">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Three Ways We <span className="text-orange-500">Fight For You</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            From essential compliance to strategic growth, we&apos;re your complete financial 
            partner. Not just an accountant - your business advocate.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300"
              >
                {/* Icon with colored background */}
                <div className={`inline-flex p-4 rounded-xl mb-6 ${
                  service.color === 'orange' ? 'bg-orange-500/10' :
                  service.color === 'purple' ? 'bg-purple-500/10' :
                  'bg-blue-500/10'
                }`}>
                  <Icon size={32} className={
                    service.color === 'orange' ? 'text-orange-500' :
                    service.color === 'purple' ? 'text-purple-500' :
                    'text-blue-500'
                  } />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-gray-300">
                      <span className={`w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0 ${
                        service.color === 'orange' ? 'bg-orange-500' :
                        service.color === 'purple' ? 'bg-purple-500' :
                        'bg-blue-500'
                      }`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href="/services"
                  className={`inline-flex items-center font-semibold transition-colors ${
                    service.color === 'orange' ? 'text-orange-500 hover:text-orange-400' :
                    service.color === 'purple' ? 'text-purple-500 hover:text-purple-400' :
                    'text-blue-500 hover:text-blue-400'
                  }`}
                >
                  Learn more
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )
          })}
        </div>

        <div className="flex justify-center">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 text-center max-w-2xl">
            <p className="text-2xl font-bold text-white mb-2">
              🎯 Remember: <span className="text-orange-500">50 Client Limit</span>
            </p>
            <p className="text-gray-400 text-lg">
              Every client gets the attention they deserve
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 