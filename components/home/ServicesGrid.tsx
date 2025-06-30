// components/home/ServicesGrid.tsx
'use client'

import { Shield, Target, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ServicesGrid() {
  const services = [
    {
      icon: Shield,
      title: 'ESSENTIAL COMPLIANCE',
      subtitle: 'FOUNDATION',
      description: 'Rock-solid bookkeeping, VAT, payroll, and year-end accounts. The basics done right, every time.',
      features: [
        'Monthly bookkeeping',
        'VAT returns',
        'Payroll management',
        'Year-end accounts',
        'Company secretarial'
      ],
      color: 'bg-[#4a90e2]'
    },
    {
      icon: Target,
      title: 'STRATEGIC ADVISORY',
      subtitle: 'STRATEGY',
      description: "Real advice for real challenges. PE negotiations, tax planning, and business strategy from someone who's been there.",
      features: [
        'PE deal navigation',
        'Tax optimization',
        'Cash flow planning',
        'Exit strategies',
        'Board reporting'
      ],
      color: 'bg-[#ff6b35]'
    },
    {
      icon: TrendingUp,
      title: 'BUSINESS GROWTH',
      subtitle: 'GROWTH',
      description: 'Beyond the numbers. We help you build systems, find opportunities, and grow sustainably.',
      features: [
        'Growth strategy',
        'Financial modeling',
        'KPI dashboards',
        'Funding support',
        'Operational efficiency'
      ],
      color: 'bg-[#1a2b4a]'
    }
  ];

  return (
    <section className="py-24 bg-[#f5f1e8] relative overflow-hidden" id="services">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 geometric-pattern opacity-30" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-[#1a2b4a] mb-6">
            THREE WAYS WE <span className="text-[#ff6b35]">FIGHT FOR YOU</span>
          </h2>
          <p className="text-xl text-[#1a2b4a]/80 max-w-3xl mx-auto">
            From essential compliance to strategic growth, we're your complete financial 
            partner. Not just an accountant - your business advocate.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-[#1a2b4a] transform translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
              <div className="relative bg-white border-2 border-[#1a2b4a] p-8 h-full transition-all duration-300">
                <div className={`inline-flex p-4 ${service.color} text-white mb-6`}>
                  <service.icon className="w-8 h-8" />
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-bold text-[#ff6b35] tracking-wider mb-1">{service.subtitle}</p>
                  <h3 className="text-2xl font-black uppercase text-[#1a2b4a]">{service.title}</h3>
                </div>
                
                <p className="text-[#1a2b4a]/70 mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-[#1a2b4a]">
                      <div className="w-1.5 h-1.5 bg-[#ff6b35] mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/services" 
                  className="inline-flex items-center font-bold uppercase text-[#ff6b35] hover:text-[#e55a2b] transition-colors group/link"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="bg-[#1a2b4a] text-[#f5f1e8] p-8 text-center max-w-2xl relative">
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#ff6b35]" />
            <div className="relative z-10">
              <p className="text-2xl font-black uppercase mb-2">
                REMEMBER: <span className="text-[#ff6b35]">50 CLIENT LIMIT</span>
              </p>
              <p className="text-lg">
                Every client gets the attention they deserve
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}