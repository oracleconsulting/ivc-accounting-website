// components/home/ContactSection.tsx
'use client'

import { Phone, Mail, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/shared/Button';

export default function ContactSection() {
  return (
    <section className="py-24 bg-[#f5f1e8] relative overflow-hidden" id="contact">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-0 w-full h-[60%]">
          <svg viewBox="0 0 1440 600" className="w-full h-full">
            <polygon points="720,600 1080,200 1440,0 1440,600" fill="#ff6b35" opacity="0.05" />
            <polygon points="360,600 720,300 1080,400 1440,200 1440,600" fill="#4a90e2" opacity="0.05" />
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-[#1a2b4a] mb-8">
              READY TO <span className="text-[#ff6b35]">FIGHT</span> INSTEAD OF FILE?
            </h2>
            
            <p className="text-xl text-[#1a2b4a]/80 mb-12">
              Let&apos;s have a real conversation. No sales pitch, no jargon, just 
              straight talk about your business and how we can help protect and grow it.
            </p>
            
            <div className="space-y-6">
              {[
                { 
                  icon: Phone, 
                  title: 'DIRECT LINE', 
                  desc: 'Call James directly - no gatekeepers',
                  color: 'bg-[#ff6b35]'
                },
                { 
                  icon: Mail, 
                  title: 'JAMES@IVCACCOUNTING.CO.UK', 
                  desc: 'I read and respond to every email personally',
                  color: 'bg-[#4a90e2]'
                },
                { 
                  icon: Calendar, 
                  title: 'BOOK A NO-BS CALL', 
                  desc: '30 minutes, no obligation, real advice',
                  color: 'bg-[#1a2b4a]'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className={`${item.color} p-3 text-white`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase text-[#1a2b4a] mb-1">{item.title}</h3>
                    <p className="text-[#1a2b4a]/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="https://calendly.com/james-ivc/consultation">
              <Button 
                size="large"
                className="mt-8 bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] px-8 py-4 font-black uppercase tracking-wide transition-all duration-300 transform hover:scale-105 flex items-center gap-2 group btn-corporate"
              >
                <Calendar className="w-5 h-5" />
                SCHEDULE YOUR CALL NOW
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#1a2b4a]" />
            <div className="relative bg-white border-2 border-[#1a2b4a] p-8 lg:p-12">
              <h3 className="text-2xl font-black uppercase text-[#1a2b4a] mb-6">QUICK CONNECT</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-[#ff6b35] pl-6">
                  <h4 className="text-xl font-bold uppercase text-[#1a2b4a] mb-2 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-[#ff6b35]" />
                    DIRECT LINE TO JAMES
                  </h4>
                  <p className="text-[#1a2b4a]/80 mb-2">
                    No gatekeepers, no junior staff. When you call, you get me directly.
                  </p>
                  <p className="text-sm text-[#1a2b4a]/60">
                    Available to clients Mon-Fri 8am-6pm
                  </p>
                </div>
                
                <div className="border-l-4 border-[#4a90e2] pl-6">
                  <h4 className="text-xl font-bold uppercase text-[#1a2b4a] mb-2 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-[#4a90e2]" />
                    EMAIL ME DIRECTLY
                  </h4>
                  <a href="mailto:james@ivcaccounting.co.uk" className="text-[#4a90e2] hover:text-[#3a7bc8] font-bold text-lg transition-colors">
                    james@ivcaccounting.co.uk
                  </a>
                  <p className="text-[#1a2b4a]/60 mt-2 text-sm">
                    I personally read and respond within 24 hours
                  </p>
                </div>
                
                <div className="border-l-4 border-[#1a2b4a] pl-6">
                  <h4 className="text-xl font-bold uppercase text-[#1a2b4a] mb-2 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-[#1a2b4a]" />
                    BOOK YOUR STRATEGY CALL
                  </h4>
                  <p className="text-[#1a2b4a]/80 mb-4">
                    30 minutes of straight talk about your business. No sales pitch, just honest advice.
                  </p>
                  <Link href="https://calendly.com/james-ivc/consultation">
                    <button className="w-full bg-[#1a2b4a] hover:bg-[#0f1829] text-[#f5f1e8] px-6 py-3 font-bold uppercase tracking-wide transition-all duration-300 transform hover:scale-105">
                      SCHEDULE NOW →
                    </button>
                  </Link>
                </div>
              </div>
              
              <div className="mt-8 bg-[#f5f1e8] p-6 text-center">
                <Clock className="w-8 h-8 text-[#ff6b35] mx-auto mb-2" />
                <p className="text-sm text-[#1a2b4a]">
                  <span className="font-bold uppercase text-[#ff6b35]">Response Times:</span><br />
                  Emails: Within 24 hours<br />
                  Urgent matters: Same day<br />
                  PE negotiations: Available 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}