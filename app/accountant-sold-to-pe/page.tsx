import { Metadata } from 'next'
import { LocalBusinessSchema } from '@/components/seo/EnhancedStructuredData'

export const metadata: Metadata = {
  title: 'My Accountant Just Sold to Private Equity - What Now? | IVC Accounting',
  description: 'Your accountant sold to PE and service is declining? IVC Accounting specializes in helping businesses escape PE-owned firms. James Howard left a PE firm himself - he understands. Book your transition call.',
  keywords: ['accountant sold to private equity', 'escape PE firm', 'switch accountants', 'declining service', 'independent accountant'],
}

export default function AccountantSoldToPEPage() {
  return (
    <div className="min-h-screen bg-oracle-cream">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-oracle-navy mb-4">
            My Accountant Just Sold to Private Equity - What Now?
          </h1>
          <p className="text-xl text-gray-600">
            You're not alone. We help businesses escape PE-owned firms every day.
          </p>
        </header>

        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            What You're Experiencing Right Now
          </h2>
          <ul className="space-y-2 text-red-700">
            <li>• Your calls aren't being returned as quickly</li>
            <li>• You're dealing with junior staff instead of your accountant</li>
            <li>• Fees are increasing while service quality declines</li>
            <li>• Your accountant seems stressed and overworked</li>
            <li>• The personal touch is disappearing</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-oracle-navy mb-4">
              Why This Happens
            </h2>
            <p className="text-gray-700 mb-4">
              When private equity buys an accounting firm, everything changes:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Profit becomes the primary focus</li>
              <li>• Client loads increase dramatically</li>
              <li>• Senior staff leave or become managers</li>
              <li>• Service quality suffers for efficiency</li>
              <li>• Your relationship becomes transactional</li>
            </ul>
          </div>

          <div className="bg-orange-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-oracle-navy mb-4">
              James Howard's Story
            </h2>
            <p className="text-gray-700 mb-4">
              James Howard lived this exact scenario. He was a senior accountant at a PE-owned firm and watched service quality decline as metrics became paramount.
            </p>
            <p className="text-gray-700">
              In 2021, he left to found IVC Accounting with a simple promise: <strong>never sell to private equity</strong>.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-oracle-navy mb-6 text-center">
            The IVC Difference
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">50</span>
              </div>
              <h3 className="font-semibold text-oracle-navy mb-2">Maximum 50 Clients</h3>
              <p className="text-gray-600 text-sm">Quality never suffers because we limit our capacity</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="font-semibold text-oracle-navy mb-2">Direct Access to James</h3>
              <p className="text-gray-600 text-sm">No junior staff, no call centers, no gatekeepers</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">∞</span>
              </div>
              <h3 className="font-semibold text-oracle-navy mb-2">Never Selling</h3>
              <p className="text-gray-600 text-sm">Public commitment to remain 100% founder-owned</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-oracle-navy mb-6">
            Our Proven Transition Process
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">1</div>
              <div>
                <h3 className="font-semibold text-oracle-navy">Free Assessment Call</h3>
                <p className="text-gray-700">15-minute no-BS call to see if IVC is right for your business</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">2</div>
              <div>
                <h3 className="font-semibold text-oracle-navy">Seamless Handover</h3>
                <p className="text-gray-700">James handles retrieving your records and ensuring no compliance gaps</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">3</div>
              <div>
                <h3 className="font-semibold text-oracle-navy">Zero Disruption</h3>
                <p className="text-gray-700">Most clients switch within 2-3 weeks with no interruption to their business</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-500 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Escape?
          </h2>
          <p className="text-xl mb-6">
            With only 3 spots remaining (47/50 clients), availability is limited.
          </p>
          <a 
            href="/book" 
            className="inline-block bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Book Your Transition Call Now
          </a>
          <p className="text-sm mt-4 opacity-90">
            No sales team. No qualification calls. Just direct access to James Howard.
          </p>
        </div>

        <LocalBusinessSchema />
      </div>
    </div>
  )
} 