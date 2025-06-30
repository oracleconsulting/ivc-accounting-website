'use client'

import Link from 'next/link'
import ContactForm from './ContactForm'

export default function ContactSection() {
  return (
    <section className="py-24 bg-black relative overflow-hidden" id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left column - Contact info */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Ready to <span className="text-orange-500">Fight</span> Instead of File?
              </h2>
              
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Let&apos;s have a real conversation. No sales pitch, no jargon, just 
                straight talk about your business and how we can help protect and grow it.
              </p>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <span className="text-2xl mr-3">📞</span>
                    Direct Line
                  </h3>
                  <p className="text-gray-400 mb-2">Call James directly - no gatekeepers</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <span className="text-2xl mr-3">📧</span>
                    james@ivcaccounting.co.uk
                  </h3>
                  <p className="text-gray-400 mb-2">I read and respond to every email personally</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <span className="text-2xl mr-3">📅</span>
                    Book a No-BS Call
                  </h3>
                  <p className="text-gray-400 mb-4">30 minutes, no obligation, real advice</p>
                </div>
              </div>
              
              <Link 
                href="https://calendly.com/james-ivc/consultation" 
                className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span className="mr-2">📅</span>
                Schedule Your Call Now
              </Link>
            </div>
            
            {/* Right column - Contact form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 