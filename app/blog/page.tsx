import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { OrganizationStructuredData, BreadcrumbStructuredData } from '@/components/seo/StructuredData';

// Initialize Supabase client with fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export const metadata: Metadata = {
  title: 'Blog | IVC Accounting - Tax Tips & Business Insights',
  description: 'Expert insights on tax planning, business growth, and financial strategies from IVC Accounting, chartered accountants in Halstead, Essex.',
  openGraph: {
    title: 'Blog | IVC Accounting',
    description: 'Expert insights on tax planning, business growth, and financial strategies.',
    url: 'https://www.ivcaccounting.co.uk/blog',
    siteName: 'IVC Accounting',
    images: [
      {
        url: 'https://www.ivcaccounting.co.uk/og-blog.jpg',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | IVC Accounting',
    description: 'Expert insights on tax planning, business growth, and financial strategies.',
    images: ['https://www.ivcaccounting.co.uk/og-blog.jpg'],
  },
  alternates: {
    canonical: 'https://www.ivcaccounting.co.uk/blog',
    types: {
      'application/rss+xml': 'https://www.ivcaccounting.co.uk/feed.xml'
    }
  }
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  featured_image_alt: string | null;
  published_at: string;
  reading_time: number;
  author: {
    name: string;
    avatar?: string;
  };
  categories: Array<{
    name: string;
    slug: string;
  }>;
  tags: Array<{
    name: string;
    slug: string;
  }>;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  if (!supabase) {
    console.warn('Supabase not configured, returning empty blog posts');
    return [];
  }

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      featured_image,
      featured_image_alt,
      published_at,
      reading_time,
      author_id,
      post_categories (
        categories (
          name,
          slug
        )
      ),
      post_tags (
        tags (
          name,
          slug
        )
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  // Transform the data to match our interface
  return posts?.map(post => ({
    ...post,
    author: {
      name: 'IVC Accounting Team', // You can fetch author details separately
    },
    categories: post.post_categories?.map((pc: any) => pc.categories) || [],
    tags: post.post_tags?.map((pt: any) => pt.tags) || []
  })) || [];
}

async function getFeaturedPost(): Promise<BlogPost | null> {
  if (!supabase) {
    console.warn('Supabase not configured, returning null featured post');
    return null;
  }

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      featured_image,
      featured_image_alt,
      published_at,
      reading_time,
      author_id,
      post_categories (
        categories (
          name,
          slug
        )
      ),
      post_tags (
        tags (
          name,
          slug
        )
      )
    `)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;

  return {
    ...post,
    author: {
      name: 'IVC Accounting Team',
    },
    categories: post.post_categories?.map((pc: any) => pc.categories) || [],
    tags: post.post_tags?.map((pt: any) => pt.tags) || []
  };
}

export default async function BlogPage() {
  const [posts, featuredPost] = await Promise.all([
    getBlogPosts(),
    getFeaturedPost()
  ]);

  // Filter out featured post from regular posts if it exists
  const regularPosts = featuredPost 
    ? posts.filter(post => post.id !== featuredPost.id)
    : posts;

  return (
    <>
      <OrganizationStructuredData includeSiteSearch />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog' }
        ]}
      />

      <div className="min-h-screen bg-[#f5f1e8]">
        {/* Hero Section */}
        <section className="bg-[#1a2b4a] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Tax Tips & Business Insights
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Expert advice from chartered accountants who understand Essex businesses
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/blog/category/tax-planning"
                  className="bg-[#ff6b35] text-white px-6 py-3 rounded-lg hover:bg-[#e55a2b] transition-colors"
                >
                  Tax Planning
                </Link>
                <Link
                  href="/blog/category/business-growth"
                  className="bg-white text-[#1a2b4a] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Business Growth
                </Link>
                <Link
                  href="/feed.xml"
                  className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#1a2b4a] transition-colors"
                >
                  RSS Feed
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-full">
                      {featuredPost.featured_image ? (
                        <Image
                          src={featuredPost.featured_image}
                          alt={featuredPost.featured_image_alt || featuredPost.title}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-[#1a2b4a] to-[#4a90e2] flex items-center justify-center">
                          <span className="text-white text-6xl font-bold opacity-20">
                            IVC
                          </span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#ff6b35] text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8 md:p-12">
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(featuredPost.published_at), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredPost.reading_time} min read
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-[#1a2b4a] mb-4">
                        <Link 
                          href={`/blog/${featuredPost.slug}`}
                          className="hover:text-[#ff6b35] transition-colors"
                        >
                          {featuredPost.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {featuredPost.categories.map(category => (
                            <Link
                              key={category.slug}
                              href={`/blog/category/${category.slug}`}
                              className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-[#ff6b35] hover:text-white transition-colors"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                        <Link
                          href={`/blog/${featuredPost.slug}`}
                          className="text-[#ff6b35] hover:text-[#e55a2b] flex items-center gap-1 font-medium"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-[#1a2b4a] mb-8">
                Latest Articles
              </h2>
              
              {regularPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No blog posts yet. Check back soon!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map(post => (
                    <article 
                      key={post.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <div className="relative h-48">
                          {post.featured_image ? (
                            <Image
                              src={post.featured_image}
                              alt={post.featured_image_alt || post.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-4xl font-bold opacity-20">
                                IVC
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(post.published_at), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.reading_time} min
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-[#1a2b4a] mb-3">
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="hover:text-[#ff6b35] transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map(tag => (
                            <Link
                              key={tag.slug}
                              href={`/blog/tag/${tag.slug}`}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-[#4a90e2] hover:text-white transition-colors"
                            >
                              <Tag className="w-3 h-3 inline mr-1" />
                              {tag.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-[#1a2b4a]">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Stay Updated on Tax Changes
              </h2>
              <p className="text-gray-200 mb-8">
                Get monthly insights on tax planning and business growth strategies
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#ff6b35] text-white px-6 py-3 rounded-lg hover:bg-[#e55a2b] transition-colors font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 