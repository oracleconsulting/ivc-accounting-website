import { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
import BlogPost from '@/components/blog/BlogPost'
import NewsletterForm from '@/components/blog/NewsletterForm'

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
              <BlogPost key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterForm />
    </>
  )
} 