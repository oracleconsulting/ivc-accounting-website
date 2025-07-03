import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
import { useAnalytics } from '@/hooks/useAnalytics'

export const metadata: Metadata = {
  title: 'Blog - IVC Accounting | UK Business & Tax Insights',
  description: 'Expert insights on UK business accounting, tax strategy, and fighting for what you deserve. No jargon, just straight talk from James Howard.',
}

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  image: string
  category: string
}

const blogPosts: BlogPost[] = [
  {
    slug: 'rd-tax-credits',
    title: 'R&D Tax Credits for UK Tech Companies: The Complete Guide',
    description: 'Everything UK tech companies need to know about R&D tax credits in 2025. Learn what qualifies, how to claim, and common mistakes to avoid.',
    date: 'January 7, 2025',
    readTime: '15 min read',
    image: '/images/rd-tax-credits-guide.jpg',
    category: 'Tax Strategy'
  },
  {
    slug: 'pe-buys-accountant',
    title: 'What Happens When PE Buys Your Accountant?',
    description: 'A founder\'s guide to navigating the changes when private equity acquires your accounting firm. Real stories, real consequences.',
    date: 'Coming Soon',
    readTime: '12 min read',
    image: '/images/pe-acquisition-guide.jpg',
    category: 'Industry Insights'
  },
  {
    slug: 'cheap-accounting-cost',
    title: 'The True Cost of Cheap Accounting',
    description: '5 UK business horror stories that show why the cheapest option often becomes the most expensive mistake.',
    date: 'Coming Soon',
    readTime: '10 min read',
    image: '/images/accounting-mistakes.jpg',
    category: 'Business Strategy'
  },
  {
    slug: '50-client-limit',
    title: 'Why We Turn Away £500k in Revenue Annually',
    description: 'The business case for our 50-client limit, and why it actually makes us more money in the long run.',
    date: 'Coming Soon',
    readTime: '8 min read',
    image: '/images/client-limit.jpg',
    category: 'Company Culture'
  }
]

export default function BlogPage() {
  const { trackDoc } = useAnalytics()

  const breadcrumbs = [
    { name: 'Home', url: 'https://ivcaccounting.co.uk' },
    { name: 'Blog', url: 'https://ivcaccounting.co.uk/blog' }
  ]

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'IVC Accounting Blog',
    description: 'Expert insights on UK business accounting, tax strategy, and fighting for what you deserve.',
    url: 'https://ivcaccounting.co.uk/blog',
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

  const handlePostClick = (post: BlogPost) => {
    if (post.date !== 'Coming Soon') {
      trackDoc(`blog_post_${post.slug}`)
    }
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trackDoc('newsletter_signup_blog')
    // Add newsletter signup logic here
  }

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
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
            <span className="text-[#f5f1e8]">INSIGHTS THAT</span>{' '}
            <span className="text-[#ff6b35]">FIGHT FOR YOU</span>
          </h1>
          <p className="text-xl text-[#f5f1e8]/80 max-w-2xl mx-auto">
            No corporate jargon. No fluff. Just actionable advice to help your business win.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-[#f5f1e8]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <article key={post.slug} className="relative group">
                {/* Offset Border */}
                <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#ff6b35] group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                
                {/* Card Content */}
                <div className="relative bg-white border-2 border-[#1a2b4a] overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-[#1a2b4a]">
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 20px,
                          #ff6b35 20px,
                          #ff6b35 21px
                        )`
                      }} />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#ff6b35] text-[#f5f1e8] px-3 py-1 text-sm font-bold">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-center text-sm text-[#1a2b4a]/60 mb-4">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-2xl font-black text-[#1a2b4a] mb-4">
                      {post.title}
                    </h2>
                    
                    <p className="text-[#1a2b4a]/80 mb-6">
                      {post.description}
                    </p>
                    
                    {post.date === 'Coming Soon' ? (
                      <span className="text-[#ff6b35] font-bold">Coming Soon →</span>
                    ) : (
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="text-[#ff6b35] font-bold hover:text-[#e55a2b]"
                        onClick={() => handlePostClick(post)}
                      >
                        Read More →
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-[#1a2b4a]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-black uppercase text-[#f5f1e8] mb-4">
            GET INSIGHTS <span className="text-[#ff6b35]">FIRST</span>
          </h2>
          <p className="text-[#f5f1e8]/80 mb-8 max-w-2xl mx-auto">
            Join our fight. Get expert insights and actionable advice delivered straight to your inbox.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="px-6 py-3 bg-white border-2 border-[#ff6b35] text-[#1a2b4a] placeholder-[#1a2b4a]/50 focus:outline-none focus:border-[#e55a2b] min-w-[300px]"
              required
            />
            <button
              type="submit"
              className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase px-8 py-3 transition-all hover:translate-x-1"
            >
              JOIN THE FIGHT →
            </button>
          </form>
          
          <p className="text-[#f5f1e8]/60 text-sm mt-4">
            No spam. No fluff. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  )
} 