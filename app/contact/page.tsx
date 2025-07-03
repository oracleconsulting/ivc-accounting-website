// app/contact/page.tsx
import { Metadata } from 'next'
import { Phone, Mail, Calendar, Clock } from 'lucide-react'
import Button from '@/components/shared/Button'
import Link from 'next/link'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  title: 'Contact IVC Accounting - Book a No-BS Call with James',
  description: 'Get in touch with IVC Accounting. Book a call directly with James Howard, email us, or send a message. Personal service, real advice.',
}

export default function ContactPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://ivcaccounting.co.uk/ivc' },
    { name: 'Contact', url: 'https://ivcaccounting.co.uk/ivc/contact' }
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-[#1a2b4a] pt-20">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-full h-[60%]">
            <svg viewBox="0 0 1440 400" className="w-full h-full">
              <polygon points="0,400 480,200 960,100 1440,300 1440,400" fill="#ff6b35" opacity="0.1" />
              <polygon points="0,400 720,250 1440,150 1440,400" fill="#4a90e2" opacity="0.05" />
            </svg>
          </div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black uppercase mb-6">
            <span className="text-[#f5f1e8]">LET&apos;S HAVE A</span>{' '}
            <span className="text-[#ff6b35]">REAL CONVERSATION</span>
          </h1>
          <p className="text-xl text-[#f5f1e8]/80">
            No gatekeepers, no runaround. Direct access to someone who actually gives a damn.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 px-4 bg-[#f5f1e8]">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Contact Methods */}
            <div>
              <h2 className="text-3xl font-black uppercase text-[#1a2b4a] mb-8">GET IN TOUCH</h2>
              
              <div className="space-y-8">
                {/* Book a Call */}
                <div className="relative">
                  <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#ff6b35]" />
                  <div className="relative bg-white p-6 border-2 border-[#1a2b4a]">
                    <div className="flex items-start">
                      <div className="bg-[#ff6b35] p-3 mr-4">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black uppercase text-[#1a2b4a] mb-2">BOOK A NO-BS CALL</h3>
                        <p className="text-[#1a2b4a]/80 mb-4">
                          30 minutes with me. No sales pitch, just honest advice about your business.
                        </p>
                        <Link href="https://calendly.com/james-ivc/consultation">
                          <Button 
                            variant="primary" 
                            className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white font-bold uppercase inline-flex items-center"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            SCHEDULE YOUR CALL
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="relative">
                  <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#4a90e2]" />
                  <div className="relative bg-white p-6 border-2 border-[#1a2b4a]">
                    <div className="flex items-start">
                      <div className="bg-[#4a90e2] p-3 mr-4">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black uppercase text-[#1a2b4a] mb-2">EMAIL ME DIRECTLY</h3>
                        <p className="text-[#1a2b4a]/80 mb-2">
                          I read and respond to every email personally.
                        </p>
                        <a 
                          href="mailto:james@ivcaccounting.co.uk"
                          className="text-[#4a90e2] hover:text-[#3a7bc8] font-bold text-lg transition-colors"
                        >
                          james@ivcaccounting.co.uk
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="relative">
                  <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#1a2b4a]" />
                  <div className="relative bg-white p-6 border-2 border-[#1a2b4a]">
                    <div className="flex items-start">
                      <div className="bg-[#1a2b4a] p-3 mr-4">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black uppercase text-[#1a2b4a] mb-2">CALL DIRECT</h3>
                        <p className="text-[#1a2b4a]/80 mb-2">
                          Available to clients. Get my direct line after our first call.
                        </p>
                        <p className="text-sm text-[#1a2b4a]/60">
                          (Book a call first - I&apos;ll share my number then)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-[#ff6b35] p-6">
                  <div className="flex items-start">
                    <Clock className="w-8 h-8 text-white mt-1 mr-4" />
                    <div className="flex-1">
                      <h3 className="text-xl font-black uppercase text-white mb-2">RESPONSE TIMES</h3>
                      <ul className="text-[#f5f1e8] space-y-1">
                        <li>• Emails: Within 24 hours</li>
                        <li>• Urgent client matters: Same day</li>
                        <li>• PE negotiations: Available 24/7</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Quick Connect */}
            <div>
              <h2 className="text-3xl font-black uppercase text-[#1a2b4a] mb-8">QUICK CONNECT</h2>
              
              <div className="bg-[#1a2b4a] p-8">
                <div className="space-y-6">
                  <div className="bg-[#f5f1e8] p-6">
                    <h3 className="font-black uppercase text-[#1a2b4a] mb-4">READY TO FIGHT INSTEAD OF FILE?</h3>
                    <p className="text-[#1a2b4a]/80 mb-6">
                      Join the select group of 50 business owners who have an accountant that actually fights for their success.
                    </p>
                    <Link href="https://calendly.com/james-ivc/consultation">
                      <Button className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white font-black uppercase">
                        BOOK YOUR STRATEGY CALL →
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="text-[#f5f1e8] text-center">
                    <p className="font-bold mb-2">PREFER TO EMAIL?</p>
                    <a href="mailto:james@ivcaccounting.co.uk" className="text-[#ff6b35] hover:text-[#f5f1e8] font-bold text-lg transition-colors">
                      james@ivcaccounting.co.uk
                    </a>
                  </div>
                  
                  <div className="border-t border-[#f5f1e8]/20 pt-6 text-center">
                    <p className="text-[#f5f1e8]/80 text-sm">
                      <span className="font-bold">OFFICE HOURS:</span><br />
                      Monday - Friday: 8am - 6pm<br />
                      Urgent matters: 24/7 for clients
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Contact Us */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-black uppercase text-[#1a2b4a] mb-12">
            WHAT HAPPENS <span className="text-[#ff6b35]">NEXT</span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-5xl font-black text-[#ff6b35] mb-4">1</div>
              <h3 className="text-xl font-black uppercase text-[#1a2b4a] mb-2">WE TALK</h3>
              <p className="text-[#1a2b4a]/80">
                Real conversation about your business, your challenges, and what you need.
              </p>
            </div>
            
            <div>
              <div className="text-5xl font-black text-[#4a90e2] mb-4">2</div>
              <h3 className="text-xl font-black uppercase text-[#1a2b4a] mb-2">WE PLAN</h3>
              <p className="text-[#1a2b4a]/80">
                If we&apos;re a fit, we&apos;ll create a clear plan for how we can help you win.
              </p>
            </div>
            
            <div>
              <div className="text-5xl font-black text-[#1a2b4a] mb-4">3</div>
              <h3 className="text-xl font-black uppercase text-[#1a2b4a] mb-2">WE FIGHT</h3>
              <p className="text-[#1a2b4a]/80">
                You get an accountant who actually fights for your success, not just files paperwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-[#ff6b35]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-black uppercase text-[#f5f1e8] mb-6">
            REMEMBER: ONLY <span className="text-[#1a2b4a]">50 CLIENTS</span>
          </h2>
          <p className="text-xl text-[#f5f1e8]/90 mb-8 max-w-2xl mx-auto">
            We&apos;re selective because we care. If you want an accountant who takes your success personally, let&apos;s talk.
          </p>
          <Link href="https://calendly.com/james-ivc/consultation">
            <Button size="large" className="bg-[#1a2b4a] hover:bg-[#0f1829] text-[#f5f1e8] font-black uppercase px-8 py-4 text-lg">
              BOOK YOUR NO-BS CALL NOW
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}