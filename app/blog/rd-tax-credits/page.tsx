'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BreadcrumbStructuredData } from '@/components/seo/StructuredData'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useEffect } from 'react'

export default function RDTaxCreditsGuide() {
  const { trackDoc, trackBooking } = useAnalytics()

  useEffect(() => {
    // Track page view
    trackDoc('rd_tax_credits_guide_view')
  }, [trackDoc])

  const handleAssessmentClick = () => {
    trackBooking('rd_tax_credits_guide')
  }

  const handleAuthorClick = () => {
    trackDoc('rd_tax_credits_author_profile')
  }

  const breadcrumbs = [
    { name: 'Home', url: 'https://ivcaccounting.co.uk' },
    { name: 'Blog', url: 'https://ivcaccounting.co.uk/blog' },
    { name: 'R&D Tax Credits Guide', url: 'https://ivcaccounting.co.uk/blog/rd-tax-credits' }
  ]

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'R&D Tax Credits for UK Tech Companies: The Complete Guide',
    description: 'Everything UK tech companies need to know about R&D tax credits in 2025. Learn what qualifies, how to claim, and common mistakes to avoid.',
    image: 'https://ivcaccounting.co.uk/images/rd-tax-credits-guide.jpg',
    datePublished: '2025-01-07T09:00:00.000Z',
    dateModified: '2025-01-07T09:00:00.000Z',
    author: {
      '@type': 'Person',
      name: 'James Howard',
      url: 'https://ivcaccounting.co.uk/team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'IVC Accounting',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ivcaccounting.co.uk/images/ivc-logo.png'
      }
    }
  }

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] bg-[#1a2b4a] pt-20 flex items-center justify-center">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 40px,
            #ff6b35 40px,
            #ff6b35 41px
          )`
        }} />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase mb-6">
            <span className="text-[#f5f1e8]">R&D TAX CREDITS FOR</span>{' '}
            <span className="text-[#ff6b35]">UK TECH</span>
          </h1>
          <p className="text-xl text-[#f5f1e8]/80 max-w-2xl mx-auto">
            Your complete guide to claiming in 2025. No jargon, just straight talk about getting what you deserve.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-[#f5f1e8]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Article Meta */}
            <div className="mb-12 pb-8 border-b-2 border-[#1a2b4a]/10">
              <div className="flex items-center justify-between text-sm text-[#1a2b4a]/60">
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/james-howard.jpg"
                    alt="James Howard"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-bold">James Howard</p>
                    <p>January 7, 2025</p>
                  </div>
                </div>
                <div>
                  <p>15 minute read</p>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <h2>The Truth About R&D Tax Credits in 2025</h2>
              <p>
                Let's cut through the noise. R&D tax credits are a game-changer for UK tech companies, 
                but they're also a minefield of misinformation and missed opportunities. After helping 
                clients claim over £10M in credits, here's what you actually need to know.
              </p>

              <h3>What Actually Qualifies as R&D?</h3>
              <p>
                Forget the buzzwords. If you're solving technical problems in a new way, you probably qualify. 
                Here's what counts:
              </p>
              <ul>
                <li>Creating new software architectures or algorithms</li>
                <li>Integrating systems in novel ways</li>
                <li>Developing new tools or frameworks</li>
                <li>Significant improvements to existing tech</li>
                <li>Failed projects (yes, really)</li>
              </ul>

              <div className="bg-[#1a2b4a] text-[#f5f1e8] p-8 my-8">
                <h4 className="text-[#ff6b35] font-black uppercase mb-4">REAL EXAMPLE</h4>
                <p>
                  A client thought they didn't qualify because "we just build websites." Turns out their 
                  custom CMS and unique deployment pipeline qualified for a £125,000 claim. Don't assume 
                  you're "not innovative enough."
                </p>
              </div>

              <h3>The Numbers That Matter</h3>
              <p>
                For SMEs (under 500 staff and either under €100M turnover or €86M balance sheet):
              </p>
              <ul>
                <li>Up to 33p back for every £1 spent on qualifying R&D</li>
                <li>Claims can go back two accounting periods</li>
                <li>Average claim in tech sector: £65,000</li>
                <li>No minimum claim amount</li>
              </ul>

              <div className="bg-[#ff6b35] text-[#f5f1e8] p-8 my-8">
                <h4 className="font-black uppercase mb-4">WARNING</h4>
                <p>
                  HMRC is cracking down on dodgy claims. Random "R&D specialists" promising the moon? 
                  Run. Fast. The penalties for incorrect claims can be brutal.
                </p>
              </div>

              <h3>What You Can Actually Claim For</h3>
              <p>Eligible costs include:</p>
              <ul>
                <li>Staff costs (including employers' NIC and pension)</li>
                <li>Subcontractor costs (65% of payment)</li>
                <li>Software licenses used directly in R&D</li>
                <li>Consumable items (power, materials, etc.)</li>
                <li>Cloud computing costs</li>
              </ul>

              <h3>Common Tech Industry Mistakes</h3>
              <p>Don't fall for these traps:</p>
              <ul>
                <li>Thinking routine debugging counts (it doesn't)</li>
                <li>Not documenting contemporaneously</li>
                <li>Missing qualifying indirect activities</li>
                <li>Underclaiming on failed projects</li>
                <li>Overclaiming on routine development</li>
              </ul>

              <h3>How to Make a Bulletproof Claim</h3>
              <ol>
                <li>
                  <strong>Document Everything</strong>
                  <p>
                    Keep technical documentation, meeting notes, and project plans. HMRC loves a paper trail.
                  </p>
                </li>
                <li>
                  <strong>Track Time Properly</strong>
                  <p>
                    Use project management tools to track R&D vs non-R&D time. Estimates won't cut it anymore.
                  </p>
                </li>
                <li>
                  <strong>Get Technical Input</strong>
                  <p>
                    Your tech leads should help identify qualifying work. They know where the real innovation happens.
                  </p>
                </li>
                <li>
                  <strong>Be Conservative</strong>
                  <p>
                    Better to claim £50k with rock-solid evidence than £100k with guesswork.
                  </p>
                </li>
              </ol>

              <div className="bg-[#1a2b4a] text-[#f5f1e8] p-8 my-8">
                <h4 className="text-[#ff6b35] font-black uppercase mb-4">FIGHT TIP</h4>
                <p>
                  HMRC's scrutiny of software R&D claims increased 300% in 2024. The days of 
                  checkbox exercises are over. But legitimate claims with proper documentation? 
                  Still sailing through.
                </p>
              </div>

              <h3>The Process: What Actually Happens</h3>
              <ol>
                <li>Technical review of your projects (2-3 days)</li>
                <li>Cost analysis and calculation (1-2 days)</li>
                <li>Report writing and submission (1 week)</li>
                <li>HMRC processing (8-12 weeks typically)</li>
                <li>Payment (within 2 weeks of approval)</li>
              </ol>

              <h3>What's Changed in 2025</h3>
              <ul>
                <li>Increased focus on software development methodology</li>
                <li>Stricter requirements for technical narratives</li>
                <li>More emphasis on contemporaneous documentation</li>
                <li>Additional scrutiny of cloud computing costs</li>
                <li>New requirements for subcontractor agreements</li>
              </ul>

              <div className="bg-[#ff6b35]/10 border-l-4 border-[#ff6b35] p-6 my-8">
                <h4 className="font-black uppercase mb-2">LATEST UPDATE</h4>
                <p>
                  As of January 2025, HMRC requires more detailed breakdowns of software development 
                  activities. Generic descriptions like "innovative coding" won't cut it anymore.
                </p>
              </div>

              <h3>Next Steps</h3>
              <p>
                If you're doing anything technically challenging in software development, you probably 
                qualify for R&D tax credits. But the days of DIY claims are over. You need a fighter 
                who knows both tech and tax.
              </p>

              <div className="bg-[#1a2b4a] text-[#f5f1e8] p-8 my-8">
                <h4 className="text-[#ff6b35] font-black uppercase mb-4">READY TO CLAIM?</h4>
                <p className="mb-6">
                  Book a free 30-minute fight assessment. We'll tell you honestly if you qualify 
                  and what size claim you might expect.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-block bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase px-6 py-3"
                  onClick={handleAssessmentClick}
                >
                  BOOK YOUR ASSESSMENT →
                </Link>
              </div>
            </article>

            {/* Author Bio */}
            <div className="mt-16 pt-8 border-t-2 border-[#1a2b4a]/10">
              <div className="flex items-start gap-6">
                <Image
                  src="/images/james-howard.jpg"
                  alt="James Howard"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <div>
                  <h4 className="text-xl font-black text-[#1a2b4a] mb-2">About James Howard</h4>
                  <p className="text-[#1a2b4a]/80 mb-4">
                    15+ years in UK accounting, specializing in tech companies and R&D claims. 
                    Former PE-backed firm director who chose to fight for business owners instead 
                    of just filing their returns.
                  </p>
                  <Link 
                    href="/about" 
                    className="text-[#ff6b35] font-bold hover:text-[#e55a2b]"
                    onClick={handleAuthorClick}
                  >
                    Read More About James →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 