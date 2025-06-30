import { Metadata } from 'next'
import Image from 'next/image'
import Button from '@/components/ivc/shared/Button'
import { BreadcrumbSchema } from '@/components/ivc/seo/StructuredData'

export const metadata: Metadata = {
  title: 'About IVC Accounting - James Howard\'s Story',
  description: 'Learn how surviving 3 PE acquisitions led James Howard to found IVC Accounting with a 50-client limit and personal service guarantee.',
}

export default function AboutPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://ivcaccounting.co.uk/ivc' },
    { name: 'About', url: 'https://ivcaccounting.co.uk/ivc/about' }
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            The Story Behind <span className="text-orange-500">IVC Accounting</span>
          </h1>
          <p className="text-xl text-gray-300">
            Why I left the corporate world to build something personal
          </p>
        </div>
      </section>

      {/* James's Photo Section */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 z-10"></div>
            <Image
              src="/images/james-howard.jpg"
              alt="James Howard - Founder of IVC Accounting"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        </div>
      </section>

      {/* James's Story */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">From Corporate Machine to Personal Champion</h2>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  I'm James Howard, and I've spent over 15 years in the accounting world. 
                  But it wasn't until I survived my third PE acquisition that I realized 
                  something was fundamentally broken in our industry.
                </p>
                
                <p>
                  Each acquisition taught me something new. The first showed me how unprepared 
                  most business owners are for the PE machine. The second revealed how little 
                  support they get from their "trusted advisors." The third? That's when I 
                  decided enough was enough.
                </p>
                
                <p>
                  I watched as firms grew bigger, promised more, and delivered less. Clients 
                  became account numbers. Partners became salespeople. And the actual work? 
                  Pushed down to juniors who'd never run a business or faced a PE partner 
                  across the negotiating table.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">My PE Journey</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="font-semibold text-lg">First Exit (2012)</h4>
                  <p className="text-gray-400 mt-1">
                    Learned how PE firms think and operate. Saw the pressure they put on founders.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-6">
                  <h4 className="font-semibold text-lg">Second Exit (2016)</h4>
                  <p className="text-gray-400 mt-1">
                    Discovered the tactics they use and how to protect founder interests.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-6">
                  <h4 className="font-semibold text-lg">Third Exit (2020)</h4>
                  <p className="text-gray-400 mt-1">
                    Decided to use this experience to help other business owners. Founded IVC.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why IVC is Different */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why IVC is <span className="text-orange-500">Different</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-orange-500 mb-4">50</div>
              <h3 className="text-2xl font-semibold mb-3">Client Limit</h3>
              <p className="text-gray-300">
                Not 500. Not 5,000. Just 50 businesses that get my full attention.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl font-bold text-purple-500 mb-4">1</div>
              <h3 className="text-2xl font-semibold mb-3">Point of Contact</h3>
              <p className="text-gray-300">
                You deal with me directly. No account managers, no juniors, no runaround.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-500 mb-4">24/7</div>
              <h3 className="text-2xl font-semibold mb-3">Real Support</h3>
              <p className="text-gray-300">
                When PE comes calling at 10pm, you need someone who answers. I do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Our <span className="text-orange-500">Values</span>
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-start">
              <span className="text-3xl mr-6">⚔️</span>
              <div>
                <h3 className="text-2xl font-semibold mb-2">We Fight, Not File</h3>
                <p className="text-gray-300">
                  Anyone can file paperwork. We fight for your interests, challenge unfair 
                  treatment, and push back when needed.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="text-3xl mr-6">🎯</span>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Quality Over Quantity</h3>
                <p className="text-gray-300">
                  50 clients means every single one matters. You're not a number, you're a 
                  partner in business growth.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="text-3xl mr-6">💬</span>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Straight Talk</h3>
                <p className="text-gray-300">
                  No jargon, no corporate speak, no BS. Just honest advice delivered clearly 
                  and actionably.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="text-3xl mr-6">🛡️</span>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Your Advocate</h3>
                <p className="text-gray-300">
                  When you face PE, HMRC, or any business challenge, we're in your corner 
                  with experience that matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready for an Accountant Who Actually <span className="text-orange-500">Gives a Damn</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's have a real conversation about your business and how we can help protect and grow it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="large" href="/ivc/contact">
              Book a No-BS Call
            </Button>
            <Button variant="secondary" size="large" href="/ivc/services">
              See Our Services
            </Button>
          </div>
        </div>
      </section>
    </>
  )
} 