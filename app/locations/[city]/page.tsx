import { Metadata } from 'next'
import { LocalBusinessSchema } from '@/components/seo/EnhancedStructuredData'

// Define the cities we serve
const cities = [
  { slug: 'london', name: 'London', region: 'Greater London' },
  { slug: 'chelmsford', name: 'Chelmsford', region: 'Essex' },
  { slug: 'colchester', name: 'Colchester', region: 'Essex' },
  { slug: 'essex', name: 'Essex', region: 'Essex County' },
  { slug: 'braintree', name: 'Braintree', region: 'Essex' },
  { slug: 'halstead', name: 'Halstead', region: 'Essex' },
  { slug: 'ipswich', name: 'Ipswich', region: 'Suffolk' }
]

export async function generateStaticParams() {
  return cities.map((city) => ({
    city: city.slug,
  }))
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = cities.find(c => c.slug === params.city)
  
  if (!city) {
    return {
      title: 'Accountant Near You - IVC Accounting',
      description: 'Personal accounting services from James Howard. 50-client limit ensures quality service.',
    }
  }

  return {
    title: `Accountant in ${city.name} - Personal Service from James Howard | IVC Accounting`,
    description: `Serving ${city.name} businesses with only 50 clients total. Direct access to James Howard, transparent pricing from £500/month. Book your no-BS call today.`,
    keywords: [`accountant ${city.name}`, `accounting services ${city.name}`, `business accountant ${city.name}`, `tax advisor ${city.name}`],
  }
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = cities.find(c => c.slug === params.city)
  
  if (!city) {
    return (
      <div className="min-h-screen bg-oracle-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-oracle-navy mb-4">Location Not Found</h1>
          <p className="text-gray-600 mb-6">We serve all of the UK. Contact us to see if we can help your business.</p>
          <a href="/contact" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600">
            Contact IVC
          </a>
        </div>
      </div>
    )
  }

  const cityContent = {
    london: {
      title: `Accountant in London - Personal Service Guaranteed`,
      subtitle: `Serving London businesses with only 50 clients total`,
      description: `London businesses deserve better than faceless accounting firms. IVC Accounting provides personal service from founder James Howard, with direct access and transparent pricing.`,
      highlights: [
        'Direct access to James Howard - no junior staff',
        'Transparent pricing from £500/month',
        'Average 2.3 hour response time',
        'Currently 47/50 clients (3 spots available)',
        'Both in-person and virtual meetings available'
      ]
    },
    chelmsford: {
      title: `Accountant in Chelmsford - Personal Service from James Howard`,
      subtitle: `Serving Chelmsford businesses with only 50 clients total`,
      description: `Chelmsford businesses choose IVC Accounting for personal service that's impossible at larger firms. James Howard personally handles every client relationship.`,
      highlights: [
        'Personal service from James Howard',
        'Only 50 clients maximum',
        'Transparent pricing on website',
        'No call centers or junior staff',
        'Local Essex knowledge and experience'
      ]
    },
    colchester: {
      title: `Accountant in Colchester - Direct Access to Your CPA`,
      subtitle: `Colchester's choice for personal accounting services`,
      description: `Colchester businesses get direct access to James Howard at IVC Accounting. No gatekeepers, no waiting - just personal service from your accountant.`,
      highlights: [
        'Direct access to James Howard',
        'Essential Fighter from £500/month',
        'Growth Warrior from £750/month',
        'Scale Champion from £1,250/month',
        'Proven mid-year switching process'
      ]
    },
    essex: {
      title: `Accountant in Essex - County-Wide Personal Service`,
      subtitle: `Serving all of Essex with only 50 clients total`,
      description: `Essex businesses choose IVC Accounting for personal service that's impossible at larger firms. James Howard serves the entire county with direct access and transparent pricing.`,
      highlights: [
        'Serves all of Essex county',
        'Personal service from James Howard',
        '50-client maximum limit',
        'Transparent pricing from £500/month',
        'Local Essex knowledge and connections'
      ]
    },
    braintree: {
      title: `Accountant in Braintree - Personal Service Guaranteed`,
      subtitle: `Braintree businesses choose IVC for direct access`,
      description: `Braintree businesses get personal service from James Howard at IVC Accounting. With only 50 clients total, each Braintree business receives individual attention.`,
      highlights: [
        'Personal service from James Howard',
        'Only 50 clients maximum',
        'Currently 47/50 capacity',
        '3 spots available',
        'Local Essex knowledge'
      ]
    },
    halstead: {
      title: `Accountant in Halstead - Direct Access to James Howard`,
      subtitle: `Halstead's choice for personal accounting`,
      description: `Halstead businesses choose IVC Accounting for personal service that's impossible at larger firms. James Howard left a PE firm to provide this level of personal attention.`,
      highlights: [
        'Direct access to James Howard',
        'No junior staff or call centers',
        'Personal service guarantee',
        'Transparent pricing',
        'Local Essex knowledge'
      ]
    },
    ipswich: {
      title: `Accountant in Ipswich - Personal Service from IVC`,
      subtitle: `Serving Ipswich and Suffolk businesses`,
      description: `Ipswich businesses choose IVC Accounting for personal service and transparent pricing. James Howard serves Suffolk with the same personal attention he provides to all clients.`,
      highlights: [
        'Serves Ipswich and Suffolk',
        'Personal service from James Howard',
        'Transparent pricing from £500/month',
        '50-client maximum limit',
        'Both in-person and virtual meetings'
      ]
    }
  }

  const content = cityContent[city.slug as keyof typeof cityContent]

  return (
    <div className="min-h-screen bg-oracle-cream">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-oracle-navy mb-4">
            {content.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {content.subtitle}
          </p>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {content.description}
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-oracle-navy mb-4">
              Why Choose IVC in {city.name}?
            </h2>
            <ul className="space-y-3">
              {content.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-700">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-orange-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-oracle-navy mb-4">
              Our Services
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-oracle-navy">Essential Fighter - £500/month</h3>
                <p className="text-gray-700 text-sm">Complete compliance and strategic advisory</p>
              </div>
              <div>
                <h3 className="font-semibold text-oracle-navy">Growth Warrior - £750/month</h3>
                <p className="text-gray-700 text-sm">Enhanced strategic support and forecasting</p>
              </div>
              <div>
                <h3 className="font-semibold text-oracle-navy">Scale Champion - £1,250/month</h3>
                <p className="text-gray-700 text-sm">Comprehensive business support and board attendance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
          <h2 className="text-2xl font-bold text-oracle-navy mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-700 mb-6">
            Book a no-BS call with James Howard. No sales team, no qualification calls - just 15 minutes to see if IVC is right for your {city.name} business.
          </p>
          <a 
            href="/book" 
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Book Your Call Now
          </a>
        </div>

        <div className="text-center text-gray-600">
          <p>
            <a href="/" className="text-blue-600 hover:underline">← Back to IVC Accounting Home</a>
          </p>
        </div>

        <LocalBusinessSchema />
      </div>
    </div>
  )
} 