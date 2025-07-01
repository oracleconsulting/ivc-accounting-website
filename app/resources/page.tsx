import { Metadata } from 'next'
import { Shield, AlertCircle, Calculator, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Fighter's Library - Real Business Resources | IVC Accounting",
  description: 'No-BS guides, calculators, and resources for UK business owners. Real advice that actually helps, not corporate fluff.',
}

interface Resource {
  title: string
  readTime: string
  potentialSavings?: string
  description: string
  link: string
  isComingSoon?: boolean
}

interface Category {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  resources: Resource[]
}

function CategorySection({ title, description, icon: Icon, resources }: Category) {
  return (
    <div className="mb-16">
      <div className="flex items-start gap-4 mb-8">
        <div className="bg-[#1a2b4a] p-4 flex-shrink-0">
          <Icon className="w-8 h-8 text-[#f5f1e8]" />
        </div>
        <div>
          <h3 className="text-3xl font-black uppercase text-[#1a2b4a] mb-2">
            {title}
          </h3>
          <p className="text-[#1a2b4a]/80">{description}</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, idx) => (
          resource.isComingSoon ? (
            <div key={idx} className="relative group h-full cursor-not-allowed">
              <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#4a90e2] opacity-50" />
              <div className="relative bg-white border-2 border-[#1a2b4a] p-6 h-full opacity-90">
                <div className="absolute -top-3 -right-3 bg-[#ff6b35] text-[#f5f1e8] text-xs font-bold px-3 py-1 uppercase">
                  Coming Soon
                </div>
                <h4 className="font-black uppercase text-[#1a2b4a] mb-2">
                  {resource.title}
                </h4>
                <p className="text-sm text-[#1a2b4a]/70 mb-3">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#4a90e2]">{resource.readTime} read</span>
                  {resource.potentialSavings && (
                    <span className="font-bold text-[#ff6b35]">{resource.potentialSavings}</span>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-[#1a2b4a]/20">
                  <div className="flex items-center gap-2 text-[#ff6b35]">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">In Development</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link href={resource.link} key={idx}>
              <div className="relative group h-full">
                <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#4a90e2] group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                <div className="relative bg-white border-2 border-[#1a2b4a] p-6 h-full hover:bg-[#f5f1e8] transition-colors">
                  <h4 className="font-black uppercase text-[#1a2b4a] mb-2">
                    {resource.title}
                  </h4>
                  <p className="text-sm text-[#1a2b4a]/70 mb-3">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#4a90e2]">{resource.readTime} read</span>
                    {resource.potentialSavings && (
                      <span className="font-bold text-[#ff6b35]">{resource.potentialSavings}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        ))}
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  const categories: Category[] = [
    {
      title: "SHIT HMRC PULLS",
      description: "And how to handle it",
      icon: Shield,
      resources: [
        {
          title: "The Dawn Raid Defense Guide",
          readTime: "8 min",
          potentialSavings: "£5,000+",
          description: "What to do when HMRC shows up unannounced",
          link: "/resources/hmrc-dawn-raid",
          isComingSoon: true
        },
        {
          title: "VAT Inspection Survival Kit",
          readTime: "12 min",
          potentialSavings: "£3,000+",
          description: "Your rights, their limits, and how to protect yourself",
          link: "/resources/vat-inspection",
          isComingSoon: true
        },
        {
          title: "IR35 Reality Check",
          readTime: "15 min",
          potentialSavings: "£12,000+",
          description: "Cut through the BS and understand your real risk",
          link: "/resources/ir35-guide",
          isComingSoon: true
        }
      ]
    },
    {
      title: "TAX SAVINGS PLAYBOOK",
      description: "Legal ways to keep more of your money",
      icon: Calculator,
      resources: [
        {
          title: "The £50k Tax Saving Checklist",
          readTime: "10 min",
          potentialSavings: "£8,000+",
          description: "37 legitimate deductions most accountants miss",
          link: "/resources/tax-savings-checklist",
          isComingSoon: true
        },
        {
          title: "Dividend vs Salary Calculator",
          readTime: "5 min",
          potentialSavings: "£4,000+",
          description: "Find your optimal pay structure in 2 minutes",
          link: "/tools#dividend-calculator",
          isComingSoon: true
        },
        {
          title: "R&D Tax Relief Demystified",
          readTime: "20 min",
          potentialSavings: "£25,000+",
          description: "You probably qualify and don't know it",
          link: "/resources/rd-tax-relief",
          isComingSoon: true
        }
      ]
    },
    {
      title: "BUSINESS GROWTH HACKS",
      description: "Proven tactics from the trenches",
      icon: TrendingUp,
      resources: [
        {
          title: "Cash Flow Crisis Toolkit",
          readTime: "15 min",
          description: "Turn around your cash flow in 30 days",
          link: "/resources/cash-flow-toolkit",
          isComingSoon: true
        },
        {
          title: "The 4-Hour Finance Week",
          readTime: "18 min",
          description: "Automate 80% of your financial admin",
          link: "/resources/4-hour-finance",
          isComingSoon: true
        },
        {
          title: "Pricing Psychology That Works",
          readTime: "12 min",
          description: "How to raise prices without losing clients",
          link: "/resources/pricing-psychology",
          isComingSoon: true
        }
      ]
    },
    {
      title: "PE & INVESTOR DEFENSE",
      description: "Don't get screwed in deals",
      icon: AlertCircle,
      resources: [
        {
          title: "PE Term Sheet Decoder",
          readTime: "25 min",
          description: "What they're really saying (and hiding)",
          link: "/resources/pe-term-sheet",
          isComingSoon: true
        },
        {
          title: "Due Diligence Prep Guide",
          readTime: "20 min",
          description: "Be ready before they knock",
          link: "/resources/due-diligence",
          isComingSoon: true
        },
        {
          title: "Exit Strategy Blueprint",
          readTime: "30 min",
          description: "Maximize value, minimize regret",
          link: "/resources/exit-strategy",
          isComingSoon: true
        }
      ]
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] bg-[#1a2b4a] pt-20">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            #4a90e2 40px,
            #4a90e2 41px
          )`
        }} />
        
        <div className="container mx-auto px-4 py-16 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black uppercase text-[#f5f1e8]">
            THE FIGHTER&apos;S <span className="text-[#ff6b35]">LIBRARY</span>
          </h1>
          <p className="text-xl text-[#f5f1e8]/80 mt-4 max-w-3xl mx-auto">
            Real advice that actually helps. No fluff, no jargon, just results.
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-24 bg-[#f5f1e8]">
        <div className="container mx-auto px-4">
          {/* Coming Soon Notice */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-[#ff6b35] text-[#f5f1e8] p-6 border-2 border-[#1a2b4a] relative">
              <div className="absolute -top-1 -left-1 w-full h-full border-2 border-[#1a2b4a]" />
              <div className="relative flex items-center gap-4">
                <Clock className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h3 className="font-black uppercase text-lg mb-1">Resources Coming Soon</h3>
                  <p className="text-[#f5f1e8]/90">
                    We&apos;re creating battle-tested guides based on real client challenges. 
                    Each resource is being carefully crafted to deliver actual value, not generic advice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {categories.map((category) => (
            <CategorySection key={category.title} {...category} />
          ))}
          
          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="relative inline-block group">
              <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#ff6b35] group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
              <div className="relative bg-[#1a2b4a] border-2 border-[#ff6b35] p-8">
                <h3 className="text-2xl font-black uppercase text-[#f5f1e8] mb-4">
                  RESOURCES IN DEVELOPMENT
                </h3>
                <p className="text-[#f5f1e8]/80 mb-6 max-w-xl">
                  We&apos;re building these resources based on real client needs. 
                  Want early access or have a specific request? Let us know.
                </p>
                <Link href="/contact">
                  <button className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase px-6 py-3 transition-all hover:translate-x-1">
                    REQUEST EARLY ACCESS →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 