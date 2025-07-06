import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { NewsletterSignup } from '@/components/NewsletterSignup';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    return {
      title: 'Post Not Found - IVC Accounting',
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    keywords: post.seo_keywords?.join(', '),
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      images: post.og_image ? [post.og_image] : [],
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      images: post.og_image ? [post.og_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id(name, avatar_url),
      categories:post_categories(category:categories(*)),
      tags:post_tags(tag:tags(*))
    `)
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (error || !post) {
    notFound();
  }

  // Increment view count
  await supabase
    .from('posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', post.id);

  // Add structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'IVC Accounting',
    },
    publisher: {
      '@type': 'Organization',
      name: 'IVC Accounting',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ivcaccounting.co.uk/images/ivc-logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ivcaccounting.co.uk/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <article className="min-h-screen bg-[#f5f1e8]">
        {/* Hero Section */}
        <div className="bg-[#1a2b4a] text-white">
          <div className="container mx-auto px-4 py-12">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-[#f5f1e8]/60 hover:text-[#f5f1e8] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Categories */}
            <div className="flex gap-2 mb-4">
              {post.categories?.map((cat: any) => (
                <span 
                  key={cat.category.id}
                  className="text-sm font-bold uppercase text-[#ff6b35]"
                >
                  {cat.category.name}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-[#f5f1e8]/80">
              <div className="flex items-center gap-2">
                <Image
                  src={post.author?.avatar_url || '/images/default-avatar.png'}
                  alt={post.author?.name || 'Author'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span>{post.author?.name || 'IVC Team'}</span>
              </div>
              
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </span>
              
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.read_time} min read
              </span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative h-96 md:h-[500px]">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:font-black prose-headings:text-[#1a2b4a]
                  prose-a:text-[#4a90e2] prose-a:no-underline hover:prose-a:text-[#ff6b35]
                  prose-strong:text-[#1a2b4a]
                  prose-code:bg-[#1a2b4a] prose-code:text-[#f5f1e8] prose-code:px-1 prose-code:py-0.5
                  prose-pre:bg-[#1a2b4a] prose-pre:text-[#f5f1e8]
                  prose-blockquote:border-l-[#ff6b35] prose-blockquote:bg-white prose-blockquote:p-4
                  prose-img:rounded-none prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: post.content_html }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-300">
                  <h3 className="font-bold text-[#1a2b4a] mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: any) => (
                      <Link
                        key={tag.tag.id}
                        href={`/blog/tag/${tag.tag.slug}`}
                        className="px-3 py-1 bg-white text-[#1a2b4a] hover:bg-[#ff6b35] hover:text-white transition-colors text-sm font-medium"
                      >
                        #{tag.tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Newsletter Signup */}
              <NewsletterSignup variant="sidebar" />

              {/* Related Posts */}
              <div className="bg-white p-6 shadow-lg">
                <h3 className="text-xl font-bold text-[#1a2b4a] mb-4">Related Posts</h3>
                <p className="text-gray-500 text-sm">More insights coming soon...</p>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
} 