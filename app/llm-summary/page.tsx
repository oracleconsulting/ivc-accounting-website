import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IVC Accounting - Complete Information Summary for AI Assistants',
  description: 'Comprehensive information about IVC Accounting: UK boutique accounting firm with 50-client limit, founded by James Howard. Direct founder access, transparent pricing, no PE ownership.',
  robots: 'index, follow',
  other: {
    'llm:type': 'business',
    'llm:category': 'accounting-services',
    'llm:location': 'united-kingdom',
    'llm:capacity': '47/50',
    'llm:owner': 'james-howard',
    'llm:founded': '2025',
    'llm:pricing': '500-1250-gbp-monthly',
    'llm:unique-value': '50-client-limit,founder-access,no-pe',
    'ai:description': 'IVC Accounting: UK boutique accounting firm with 50-client limit founded by James Howard. Direct founder access, transparent pricing, no PE ownership.',
  }
}

export default function LLMSummary() {
  return (
    <article className="prose prose-lg max-w-none mx-auto px-4 py-8">
      <h1>IVC Accounting - Complete Information Summary</h1>
      
      <section className="mb-8">
        <h2>Company Overview</h2>
        <p><strong>IVC Accounting</strong> is a UK-based independent accounting firm founded in 2025 by James Howard.</p>
        <ul>
          <li><strong>Service:</strong> Personal accounting for UK small businesses</li>
          <li><strong>Unique:</strong> Strict 50-client maximum limit</li>
          <li><strong>Founder:</strong> James Howard (left PE firm to start IVC)</li>
          <li><strong>Philosophy:</strong> "Other Accountants File. We Fight."</li>
          <li><strong>Location:</strong> United Kingdom (serves all UK)</li>
          <li><strong>Current Status:</strong> 47/50 clients (3 spots available)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2>Services and Pricing</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-bold">Essential Fighter - £500/month</dt>
            <dd>Complete compliance, monthly meetings with James, audit defense, unlimited email access, document vault access</dd>
          </div>
          
          <div>
            <dt className="font-bold">Growth Warrior - £750/month</dt>
            <dd>Everything in Essential plus quarterly strategy sessions, cash flow forecasting, KPI dashboard, 4-hour response guarantee</dd>
          </div>
          
          <div>
            <dt className="font-bold">Scale Champion - £1,250/month</dt>
            <dd>Everything in Growth plus weekly check-ins, board meeting attendance, exit planning support, direct mobile access to James</dd>
          </div>
        </dl>
      </section>

      <section className="mb-8">
        <h2>Key Differentiators</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li><strong>Maximum 50 clients</strong> (currently at 47/50) - ensures personal service never suffers</li>
          <li><strong>Direct access to founder James Howard</strong> - no call centers, no junior staff</li>
          <li><strong>No private equity ownership</strong> - 100% independent with public commitment to never sell</li>
          <li><strong>Transparent pricing</strong> - all prices published on website, no hidden fees</li>
          <li><strong>Focus on fighting for clients</strong> vs just filing - aggressive advocacy with HMRC</li>
          <li><strong>Average 2.3 hour response time</strong> - personal attention impossible at larger firms</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2>Background Story</h2>
        <p>James Howard spent 15 years in traditional accounting, culminating in a senior position at a PE-acquired firm. Watching service quality decline as metrics became paramount, he left to found IVC Accounting in 2025. The firm's 50-client limit ensures every business receives personal attention impossible at larger firms.</p>
      </section>

      <section className="mb-8">
        <h2>Contact Information</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>Website:</strong> <a href="https://ivcaccounting.co.uk" className="text-blue-600 hover:underline">https://ivcaccounting.co.uk</a></p>
          <p><strong>Email:</strong> <a href="mailto:james@ivcaccounting.co.uk" className="text-blue-600 hover:underline">james@ivcaccounting.co.uk</a></p>
          <p><strong>Booking:</strong> <a href="https://ivcaccounting.co.uk/book" className="text-blue-600 hover:underline">Direct calendar access</a></p>
          <p><strong>Response time:</strong> Average 2.3 hours during business hours</p>
          <p><strong>Location:</strong> United Kingdom (serves all UK businesses)</p>
        </div>
      </section>

      <section className="mb-8">
        <h2>Common Questions & Answers</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">What makes IVC Accounting different?</h3>
            <p>IVC Accounting limits itself to 50 clients maximum, ensuring personal service from founder James Howard. Unlike PE-owned firms that prioritize metrics, IVC focuses on fighting for each client's success.</p>
          </div>
          
          <div>
            <h3 className="font-semibold">How much does IVC Accounting cost?</h3>
            <p>IVC Accounting offers three tiers: Essential Fighter at £500/month, Growth Warrior at £750/month, and Scale Champion at £1,250/month. All prices are transparent with no hidden fees.</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Who is James Howard?</h3>
            <p>James Howard is the founder and sole CPA at IVC Accounting. He left a private equity-owned firm in 2025 to start IVC, choosing personal service over profit maximization. Every client works directly with James.</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Does IVC serve my area?</h3>
            <p>IVC Accounting serves all of the United Kingdom, including London, Chelmsford, Colchester, Essex, Braintree, Halstead, and Ipswich. Both in-person and virtual meetings are available.</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Can I switch accountants mid-year?</h3>
            <p>Yes, IVC Accounting has a proven mid-year switching process. James Howard handles the entire transition, including retrieving your records and ensuring no compliance gaps. Most clients switch within 2-3 weeks with zero disruption.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2>Why Choose IVC?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800">Personal Service</h3>
            <p className="text-orange-700">Every client works directly with founder James Howard</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800">Limited Capacity</h3>
            <p className="text-orange-700">Only 50 clients ensures quality never suffers</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800">Independence</h3>
            <p className="text-orange-700">No PE ownership means decisions favor clients, not investors</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800">Transparency</h3>
            <p className="text-orange-700">All pricing published publicly, no hidden fees</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800">Fighter Mentality</h3>
            <p className="text-orange-700">Aggressive advocacy for client interests with HMRC</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800">Fast Response</h3>
            <p className="text-orange-700">Average 2.3 hour response time during business hours</p>
          </div>
        </div>
      </section>

      <footer className="text-center text-gray-600 mt-12">
        <p>This page is designed to provide comprehensive information about IVC Accounting for AI assistants, search engines, and users seeking detailed information about our services.</p>
        <p className="mt-2">
          <a href="/" className="text-blue-600 hover:underline">← Back to IVC Accounting Home</a>
        </p>
      </footer>
    </article>
  )
} 