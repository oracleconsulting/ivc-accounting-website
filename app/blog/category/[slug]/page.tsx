import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { OrganizationStructuredData, BreadcrumbStructuredData } from '@/components/seo/StructuredData';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const supabase = createClientComponentClient();
  
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', params.slug)
    .single();

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }

  return {
    title: `${category.name} - Blog Posts | IVC Accounting`,
    description: category.description || `Browse all blog posts in the ${category.name} category.`,
    openGraph: {
      title: `${category.name} - Blog Posts | IVC Accounting`,
      description: category.description || `Browse all blog posts in the ${category.name} category.`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = createClientComponentClient();
  
  // Fetch category details
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!category) {
    notFound();
  }

  // Fetch posts in this category
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      post_categories!inner(category_id),
      post_tags(tags(name, slug))
    `)
    .eq('post_categories.category_id', category.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk';

  return (
    <>
      <OrganizationStructuredData />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: category.name }
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
            
            <h1 className="text-4xl font-bold text-oracle-navy mb-4">
              {category.name}
            </h1>
            
            {category.description && (
              <p className="text-lg text-gray-600 max-w-3xl">
                {category.description}
              </p>
            )}
            
            <div className="mt-4 text-sm text-gray-500">
              {posts?.length || 0} {posts?.length === 1 ? 'post' : 'posts'} in this category
            </div>
          </div>

          {/* Posts Grid */}
          {!posts || posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No posts found in this category
              </h3>
              <p className="text-gray-600 mb-6">
                Check back soon for new content in {category.name}.
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
                    
                    {/* Tags */}
                    {post.post_tags && post.post_tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.post_tags.slice(0, 3).map((tagRef: { tags: { name: string; slug: string } }) => (
                          <Link
                            key={tagRef.tags.slug}
                            href={`/blog/tag/${tagRef.tags.slug}`}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-[#ff6b35] hover:text-white transition-colors"
                          >
                            #{tagRef.tags.name}
                          </Link>
                        ))}
                        {post.post_tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{post.post_tags.length - 3} more
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