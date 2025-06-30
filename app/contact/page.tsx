import { Metadata } from 'next'
import { Phone, Mail, Calendar, MapPin, Clock } from 'lucide-react'
import Button from '@/components/ivc/shared/Button'
import ContactForm from '@/components/ivc/shared/ContactForm'
import { BreadcrumbSchema } from '@/components/ivc/seo/StructuredData'

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
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Let's Have a <span className="text-orange-500">Real Conversation</span>
          </h1>
          <p className="text-xl text-gray-300">
            No gatekeepers, no runaround. Direct access to someone who actually gives a damn.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Contact Methods */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
              
              <div className="space-y-8">
                {/* Book a Call */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-start">
                    <Calendar className="w-8 h-8 text-orange-400 mt-1 mr-4" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">Book a No-BS Call</h3>
                      <p className="text-gray-400 mb-4">
                        30 minutes with me. No sales pitch, just honest advice about your business.
                      </p>
                      <Button 
                        variant="primary" 
                        href="https://calendly.com/james-ivc/consultation"
                        className="inline-flex items-center"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Your Call
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-start">
                    <Mail className="w-8 h-8 text-purple-400 mt-1 mr-4" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">Email Me Directly</h3>
                      <p className="text-gray-400 mb-2">
                        I read and respond to every email personally.
                      </p>
                      <a 
                        href="mailto:james@ivcaccounting.co.uk"
                        className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                      >
                        james@ivcaccounting.co.uk
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-start">
                    <Phone className="w-8 h-8 text-blue-400 mt-1 mr-4" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">Call Direct</h3>
                      <p className="text-gray-400 mb-2">
                        Available to clients. Get my direct line after our first call.
                      </p>
                      <p className="text-sm text-gray-500">
                        (Book a call first - I'll share my number then)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-6">
                  <div className="flex items-start">
                    <Clock className="w-8 h-8 text-orange-400 mt-1 mr-4" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">Response Times</h3>
                      <ul className="text-gray-300 space-y-1">
                        <li>• Emails: Within 24 hours</li>
                        <li>• Urgent client matters: Same day</li>
                        <li>• PE negotiations: Available 24/7</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Why Contact Us */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">
            What Happens <span className="text-orange-500">Next</span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold text-orange-500 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">We Talk</h3>
              <p className="text-gray-400">
                Real conversation about your business, your challenges, and what you need.
              </p>
            </div>
            
            <div>
              <div className="text-5xl font-bold text-purple-500 mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">We Plan</h3>
              <p className="text-gray-400">
                If we're a fit, we'll create a clear plan for how we can help you win.
              </p>
            </div>
            
            <div>
              <div className="text-5xl font-bold text-blue-500 mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">We Fight</h3>
              <p className="text-gray-400">
                You get an accountant who actually fights for your success, not just files paperwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Remember: Only <span className="text-orange-500">50 Clients</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            We're selective because we care. If you want an accountant who takes your success personally, let's talk.
          </p>
          <Button variant="primary" size="large" href="https://calendly.com/james-ivc/consultation">
            Book Your No-BS Call Now
          </Button>
        </div>
      </section>
    </>
  )
} 