// components/home/ContactSection.tsx
'use client'

import { Phone, Mail, Calendar, Clock } from 'lucide-react';

export default function ContactSection() {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Direct Line',
      value: '01234 567890',
      description: 'I actually answer',
      action: 'tel:01234567890',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'james@ivcaccounting.co.uk',
      description: 'Response within 24h',
      action: 'mailto:james@ivcaccounting.co.uk',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Calendar,
      title: 'Book a Call',
      value: 'Schedule 30 mins',
      description: 'No sales pitch',
      action: '/contact',
      gradient: 'from-blue-500 to-cyan-500'
    }
  ]

  return (
    <section className="py-24 bg-black relative overflow-hidden" id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Let&apos;s <span className="text-orange-500">Fight Together</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              No forms, no gatekeepers, no BS. Just pick up the phone or send an email. 
              I&apos;ll respond personally within 24 hours.
            </p>
            
            {/* Response Times */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-8">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold text-white">Response Times</h3>
              </div>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>Urgent matters:</span>
                  <span className="font-semibold text-orange-500">Same day</span>
                </div>
                <div className="flex justify-between">
                  <span>General enquiries:</span>
                  <span className="font-semibold text-white">Within 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Initial consultations:</span>
                  <span className="font-semibold text-white">Within 48 hours</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-400">
              * Current capacity: <span className="text-orange-500 font-semibold">42/50 clients</span>
            </p>
          </div>
          
          {/* Right Column - Contact Cards */}
          <div className="space-y-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              
              return (
                <a
                  key={index}
                  href={method.action}
                  className="block group"
                >
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${method.gradient} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-500`} />
                    
                    <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 group-hover:transform group-hover:scale-105">
                      <div className="flex items-center">
                        <div className={`p-4 rounded-xl bg-gradient-to-br ${method.gradient} bg-opacity-20 mr-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">{method.title}</h3>
                          <p className="text-xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
                            {method.value}
                          </p>
                          <p className="text-sm text-gray-400">{method.description}</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors group-hover:translate-x-1 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
            
            {/* Additional CTA */}
            <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 text-center animate-pulse-subtle">
              <p className="text-2xl font-bold text-white mb-2">
                First Meeting Free
              </p>
              <p className="text-gray-400">
                No pitch, no pressure. Just a real conversation about your business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}