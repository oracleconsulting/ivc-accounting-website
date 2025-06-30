import { Shield, TrendingUp, Target, Check } from 'lucide-react'
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
      gradient: 'from-orange-500 to-red-500'
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
      gradient: 'from-purple-500 to-pink-500'
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
      gradient: 'from-blue-500 to-cyan-500'
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
                className="group relative"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-500`} />
                
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300 h-full hover:transform hover:scale-105">
                  {/* Icon with gradient background */}
                  <div className={`inline-flex p-4 rounded-xl mb-6 bg-gradient-to-br ${service.gradient} bg-opacity-20`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-gray-300">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href="/services"
                    className={`inline-flex items-center font-semibold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
                  >
                    Learn more
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 text-center max-w-2xl animate-pulse-subtle">
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