import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { OrganizationStructuredData, BreadcrumbStructuredData } from '@/components/seo/StructuredData';

interface TagPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: TagPageProps) {
  const supabase = createClientComponentClient();
  
  const { data: tag } = await supabase
    .from('tags')
    .select('name')
    .eq('slug', params.slug)
    .single();

  if (!tag) {
    return {
      title: 'Tag Not Found',
      description: 'The requested tag could not be found.'
    };
  }

  return {
    title: `#${tag.name} - Blog Posts | IVC Accounting`,
    description: `Browse all blog posts tagged with ${tag.name}.`,
    openGraph: {
      title: `#${tag.name} - Blog Posts | IVC Accounting`,
      description: `Browse all blog posts tagged with ${tag.name}.`,
      type: 'website',
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const supabase = createClientComponentClient();
  
  // Fetch tag details
  const { data: tag } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!tag) {
    notFound();
  }

  // Fetch posts with this tag
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      post_tags!inner(tag_id),
      post_categories(categories(name, slug))
    `)
    .eq('post_tags.tag_id', tag.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return (
    <>
      <OrganizationStructuredData />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: `#${tag.name}` }
        ]}
      />
      
      <div className="min-h-screen bg-oracle-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <Link 
              href="/blog"
              className="inline-flex items-center text-[#ff6b35] hover:text-[#e55a2b] mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-8 h-8 text-[#ff6b35]" />
              <h1 className="text-4xl font-bold text-oracle-navy">
                #{tag.name}
              </h1>
            </div>
            
            <div className="text-lg text-gray-600 mb-4">
              Browse all posts tagged with <span className="font-semibold">#{tag.name}</span>
            </div>
            
            <div className="text-sm text-gray-500">
              {posts?.length || 0} {posts?.length === 1 ? 'post' : 'posts'} with this tag
            </div>
          </div>

          {/* Posts Grid */}
          {!posts || posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No posts found with this tag
              </h3>
              <p className="text-gray-600 mb-6">
                Check back soon for new content tagged with #{tag.name}.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-[#ff6b35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
              >
                Browse All Posts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.featured_image && (
                    <div className="aspect-video bg-gray-200">
                      <img
                        src={post.featured_image}
                        alt={post.featured_image_alt || post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.published_at && format(new Date(post.published_at), 'MMM dd, yyyy')}
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 mr-1" />
                      {post.reading_time || 5} min read
                    </div>
                    
                    <h2 className="text-xl font-bold text-oracle-navy mb-3 line-clamp-2">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="hover:text-[#ff6b35] transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    
                    {/* Categories */}
                    {post.post_categories && post.post_categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.post_categories.slice(0, 2).map((catRef: any) => (
                          <Link
                            key={catRef.categories.slug}
                            href={`/blog/category/${catRef.categories.slug}`}
                            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            {catRef.categories.name}
                          </Link>
                        ))}
                        {post.post_categories.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{post.post_categories.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-[#ff6b35] hover:text-[#e55a2b] font-medium transition-colors"
                    >
                      Read More
                      <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 