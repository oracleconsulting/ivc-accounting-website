// components/home/ContactSection.tsx
'use client'

import { Phone, Mail, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/shared/Button';

export default function ContactSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden" id="contact">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to <span className="text-orange-500">Fight</span> Instead of File?
            </h2>
            
            <p className="text-xl text-gray-300 mb-12">
              Let&apos;s have a real conversation. No sales pitch, no jargon, just 
              straight talk about your business and how we can help protect and grow it.
            </p>
            
            <div className="space-y-6">
              {[
                { 
                  icon: Phone, 
                  title: 'Direct Line', 
                  desc: 'Call James directly - no gatekeepers',
                  color: 'from-orange-500 to-red-500'
                },
                { 
                  icon: Mail, 
                  title: 'james@ivcaccounting.co.uk', 
                  desc: 'I read and respond to every email personally',
                  color: 'from-purple-500 to-pink-500'
                },
                { 
                  icon: Calendar, 
                  title: 'Book a No-BS Call', 
                  desc: '30 minutes, no obligation, real advice',
                  color: 'from-blue-500 to-cyan-500'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className={`bg-gradient-to-br ${item.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="https://calendly.com/james-ivc/consultation">
              <Button 
                size="large"
                className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30 flex items-center gap-2 group"
              >
                <Calendar className="w-5 h-5" />
                Schedule Your Call Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8 lg:p-12">
            <h3 className="text-2xl font-bold mb-6">Quick Connect</h3>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-2xl p-6 border border-orange-500/30">
                <h4 className="text-xl font-semibold mb-3 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-orange-500" />
                  Direct Line to James
                </h4>
                <p className="text-gray-300 mb-4">
                  No gatekeepers, no junior staff. When you call, you get me directly.
                </p>
                <p className="text-sm text-gray-400">
                  Available to clients Mon-Fri 8am-6pm
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/30">
                <h4 className="text-xl font-semibold mb-3 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-purple-500" />
                  Email Me Directly
                </h4>
                <a href="mailto:james@ivcaccounting.co.uk" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors text-lg">
                  james@ivcaccounting.co.uk
                </a>
                <p className="text-gray-400 mt-2 text-sm">
                  I personally read and respond within 24 hours
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/30">
                <h4 className="text-xl font-semibold mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  Book Your Strategy Call
                </h4>
                <p className="text-gray-300 mb-4">
                  30 minutes of straight talk about your business. No sales pitch, just honest advice.
                </p>
                <Link href="https://calendly.com/james-ivc/consultation">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30">
                    Schedule Now →
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="mt-8 text-center p-6 bg-black/30 rounded-2xl">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400">
                <span className="text-orange-500 font-semibold">Response Times:</span><br />
                Emails: Within 24 hours<br />
                Urgent matters: Same day<br />
                PE negotiations: Available 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}