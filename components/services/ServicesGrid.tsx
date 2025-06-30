// components/home/ServicesGrid.tsx
'use client'

import { Shield, Target, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
      color: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/30'
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
      color: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/30'
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
      color: 'from-orange-500 to-red-500',
      shadowColor: 'shadow-orange-500/30'
    }
  ];

  return (
    <section className="py-24 bg-gray-900/30 relative overflow-hidden" id="services">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Three Ways We <span className="text-orange-500">Fight For You</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From essential compliance to strategic growth, we&apos;re your complete financial 
            partner. Not just an accountant - your business advocate.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
              <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 h-full hover:border-gray-700 transition-all duration-300 hover:-translate-y-2">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${service.color} mb-6`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/services" 
                  className="group/btn inline-flex items-center text-orange-500 hover:text-orange-400 font-semibold transition-colors"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm border border-orange-500/30 rounded-3xl p-8 text-center max-w-2xl animate-pulse-subtle">
            <p className="text-2xl font-bold mb-2">
              🎯 Remember: <span className="text-orange-500">50 Client Limit</span>
            </p>
            <p className="text-gray-300 text-lg">
              Every client gets the attention they deserve
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}