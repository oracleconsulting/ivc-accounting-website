import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
import BlogPost from '@/components/blog/BlogPost'
import NewsletterForm from '@/components/blog/NewsletterForm'
import { formatDistanceToNow } from 'date-fns';

export const metadata: Metadata = {
  title: 'Blog - IVC Accounting | UK Business & Tax Insights',
  description: 'Expert insights on UK business accounting, tax strategy, and fighting for what you deserve. No jargon, just straight talk from James Howard.',
}

export default async function BlogPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // Fetch published posts from database
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      categories:post_categories(category:categories(*)),
      tags:post_tags(tag:tags(*))
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  // Transform database posts to match existing BlogPost interface
  const blogPosts = posts?.map(post => ({
    slug: post.slug,
    title: post.title,
    description: post.excerpt || post.content_text?.substring(0, 150) + '...',
    date: post.published_at ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true }) : 'Recently',
    readTime: `${post.read_time || 5} min read`,
    image: post.featured_image || '/images/default-blog-image.jpg',
    category: post.categories?.[0]?.category?.name || 'Business'
  })) || [];

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
          
          {blogPosts.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-[#1a2b4a] mb-4">Coming Soon</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're working on some killer content. Check back soon for expert insights on accounting, tax strategy, and business growth.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterForm />
    </>
  )
} 