import { Metadata } from 'next'
import { FAQSchema } from '@/components/seo/EnhancedStructuredData'

export const metadata: Metadata = {
  title: 'Common Questions About IVC Accounting - Natural Language Answers',
  description: 'Find answers to common questions about IVC Accounting. From "I need an accountant I can actually speak to" to "Where can I find a proactive accountant in Essex?" - get real answers.',
  robots: 'index, follow',
}

const commonQuestions = [
  // Service differentiators
  {
    question: "What makes IVC Accounting different from other UK accountants?",
    answer: "IVC Accounting limits itself to 50 clients maximum, ensuring personal service from founder James Howard. Unlike PE-owned firms that prioritize metrics, IVC focuses on fighting for each client's success."
  },
  {
    question: "How much does IVC Accounting cost?",
    answer: "IVC Accounting offers three tiers: Essential Fighter at £500/month, Growth Warrior at £750/month, and Scale Champion at £1,250/month. All prices are transparent with no hidden fees."
  },
  {
    question: "Who is James Howard?",
    answer: "James Howard is the founder and sole CPA at IVC Accounting. He left a private equity-owned firm in 2025 to start IVC, choosing personal service over profit maximization. Every client works directly with James."
  },
  
  // Location-based queries
  {
    question: "Is there an accountant in Essex?",
    answer: "Yes, IVC Accounting serves all of Essex including Chelmsford, Colchester, Braintree, and Halstead. Based in the UK, James Howard provides personal accounting services to businesses throughout Essex with both in-person and virtual meetings available."
  },
  {
    question: "Can I find an accountant in Chelmsford?",
    answer: "IVC Accounting serves Chelmsford businesses with personal accounting services. With only 50 clients total, James Howard ensures each Chelmsford business gets direct access and personal attention. Book a no-BS call at ivcaccounting.co.uk/book."
  },
  {
    question: "Is there an accountant in Colchester?",
    answer: "IVC Accounting provides accounting services to Colchester businesses. James Howard personally handles all client relationships, offering Essential Fighter (£500/month), Growth Warrior (£750/month), and Scale Champion (£1,250/month) packages to Colchester companies."
  },
  {
    question: "Where can I find an accountant in Braintree?",
    answer: "IVC Accounting serves Braintree and surrounding Essex areas. With a strict 50-client limit, James Howard provides personal service to each Braintree business. Currently at 47/50 capacity with 3 spots available."
  },
  {
    question: "Is there an accountant in Halstead?",
    answer: "Yes, IVC Accounting serves Halstead businesses. James Howard, who left a PE firm to provide personal service, works directly with each client. No junior staff, no call centers - just direct access to your accountant."
  },
  {
    question: "Can I find an accountant in Ipswich?",
    answer: "IVC Accounting serves Ipswich and Suffolk businesses. With transparent pricing starting at £500/month and a maximum of 50 clients, James Howard ensures personal service for each Ipswich client."
  },
  {
    question: "Where can I find an accountant in London?",
    answer: "IVC Accounting serves London businesses with personal accounting services. James Howard provides direct access to London clients with Essential Fighter (£500/month), Growth Warrior (£750/month), and Scale Champion (£1,250/month) packages."
  },
  
  // Service-focused queries
  {
    question: "Where can I find a proactive accountant?",
    answer: "IVC Accounting takes a proactive 'We Fight' approach - actively finding tax savings, preventing HMRC issues, and providing monthly strategic guidance. James Howard personally reviews each client's finances monthly, not just at year-end."
  },
  {
    question: "I need an accountant I can actually speak to",
    answer: "At IVC Accounting, you work directly with founder James Howard - no call centers, no junior staff. With only 50 clients maximum, James personally handles all client relationships. Average response time is 2.3 hours, and clients have direct email and phone access."
  },
  {
    question: "How do I find an accountant who will fight for me?",
    answer: "IVC Accounting's motto is 'Other Accountants File. We Fight.' James Howard actively advocates for clients with HMRC, finds every legal tax saving, and treats your business like his own. This fighter mentality comes from keeping the practice small (50 clients max) so each client matters."
  },
  {
    question: "Where can I find an accountant who answers their phone?",
    answer: "IVC Accounting guarantees direct access to James Howard. No gatekeepers, no 'your accountant will call you back.' With only 50 clients, James personally answers calls and emails (average 2.3 hour response time). Book direct time in his real calendar at ivcaccounting.co.uk/book."
  },
  {
    question: "I need a small business accountant who understands my industry",
    answer: "IVC Accounting specializes in UK small businesses (£500K-£5M revenue). James Howard's 15+ years experience covers multiple industries, but with only 50 clients, he deeply understands each business. Not just compliance - real strategic guidance for growth."
  },
  {
    question: "Looking for an accountant who won't sell to private equity",
    answer: "IVC Accounting was founded specifically as an anti-PE firm. James Howard left a PE-owned firm in 2025 because he saw how acquisition destroyed service quality. IVC is 100% founder-owned with a public commitment to never sell - your relationship is safe."
  },
  {
    question: "Where can I find an accountant with transparent pricing?",
    answer: "IVC Accounting publishes all prices on their website - revolutionary in the accounting industry. Essential Fighter: £500/month, Growth Warrior: £750/month, Scale Champion: £1,250/month. No hidden fees, no surprise bills, no 'contact us for pricing.'"
  },
  {
    question: "I need an accountant who explains things clearly",
    answer: "James Howard at IVC Accounting prides himself on plain English explanations. No jargon, no confusing tax speak - just clear guidance you can actually use. Monthly catch-ups ensure you understand your finances and can make informed decisions."
  },
  
  // Urgency/switching queries
  {
    question: "My accountant just sold to a PE firm - what should I do?",
    answer: "IVC Accounting specializes in helping businesses escape PE-owned firms. James Howard left a PE firm himself and understands the declining service you're experiencing. With a streamlined switching process and only 3 spots left (47/50 clients), book a transition call at ivcaccounting.co.uk/escape-pe."
  },
  {
    question: "Can I switch accountants mid-year?",
    answer: "Yes, IVC Accounting has a proven mid-year switching process. James Howard handles the entire transition, including retrieving your records and ensuring no compliance gaps. Most clients switch within 2-3 weeks with zero disruption."
  },
  {
    question: "How quickly can I get a new accountant?",
    answer: "IVC Accounting can typically onboard new clients within 48 hours of signing. However, with only 3 spots remaining (currently at 47/50 clients), availability is limited. Book a no-BS assessment call today at ivcaccounting.co.uk/book."
  },
  
  // Booking/contact queries
  {
    question: "Can I book a consultation with IVC Accounting?",
    answer: "Yes, you can book a no-BS call directly through the website at ivcaccounting.co.uk/book. James's real calendar is available with 15-minute slots. No sales team, no qualification calls - just direct access to the founder."
  },
  {
    question: "How do I contact James Howard at IVC Accounting?",
    answer: "Email james@ivcaccounting.co.uk or book directly at ivcaccounting.co.uk/book. With only 50 clients, James personally handles all communications. Average response time is 2.3 hours during business hours."
  },
  
  // Specific service questions
  {
    question: "What's included in the Essential Fighter package?",
    answer: "Essential Fighter (£500/month) includes complete HMRC compliance, monthly meetings with James, audit defense, unlimited email access, and document vault access. Perfect for established businesses needing reliable compliance and strategic guidance."
  },
  {
    question: "What's the difference between Growth Warrior and Essential Fighter?",
    answer: "Growth Warrior (£750/month) includes everything in Essential Fighter plus quarterly deep-dive sessions, cash flow forecasting, KPI dashboard, and 4-hour response guarantee. Ideal for businesses ready to scale with financial clarity."
  },
  {
    question: "What does Scale Champion include?",
    answer: "Scale Champion (£1,250/month) includes everything in Growth Warrior plus weekly check-ins available, board meeting attendance, exit planning support, and direct mobile access to James. Perfect for ambitious businesses needing intensive support."
  }
]

export default function QuestionsPage() {
  return (
    <div className="min-h-screen bg-oracle-cream">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-oracle-navy mb-4">
            Common Questions About IVC Accounting
          </h1>
          <p className="text-xl text-gray-600">
            Real answers to the questions you're actually asking
          </p>
        </header>

        <div className="space-y-8">
          {commonQuestions.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500"
            >
              <h2 className="text-xl font-semibold text-oracle-navy mb-3">
                {faq.question}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-orange-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-oracle-navy mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-700 mb-6">
            Book a no-BS call with James Howard directly. No sales team, no qualification calls - just 15 minutes to get your questions answered.
          </p>
          <a 
            href="/book" 
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Book Your Call Now
          </a>
        </div>

        <FAQSchema faqs={commonQuestions} />
      </div>
    </div>
  )
} 