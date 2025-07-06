import { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import BlogList from '@/components/blog/BlogList';
import BlogFilters from '@/components/blog/BlogFilters';
import BlogSearch from '@/components/blog/BlogSearch';
import { Post, Category, Tag } from '@/lib/types/blog';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const metadata: Metadata = {
  title: 'Blog | IVC Accounting - Latest Insights & Tips',
  description: 'Stay updated with the latest accounting insights, tax tips, and business advice from IVC Accounting. Expert guidance for businesses and individuals.',
  keywords: 'accounting blog, tax tips, business advice, IVC Accounting, Essex accountant',
  openGraph: {
    title: 'Blog | IVC Accounting',
    description: 'Latest insights, tips, and updates from IVC Accounting',
    type: 'website',
    url: 'https://ivcaccounting.co.uk/blog',
  },
};

interface BlogPageProps {
  searchParams: {
    category?: string;
    tag?: string;
    search?: string;
    page?: string;
  };
}

async function getBlogData(searchParams: BlogPageProps['searchParams']) {
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles!posts_author_id_fkey(name),
      categories:post_categories(category:categories(name, slug)),
      tags:post_tags(tag:tags(name, slug))
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  // Apply filters
  if (searchParams.category) {
    query = query.eq('post_categories.category.slug', searchParams.category);
  }

  if (searchParams.tag) {
    query = query.eq('post_tags.tag.slug', searchParams.tag);
  }

  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,content_text.ilike.%${searchParams.search}%`);
  }

  const { data: posts, count } = await query
    .range(offset, offset + limit - 1);

  // Get categories and tags for filters
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  const { data: tags } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  return {
    posts: posts || [],
    categories: categories || [],
    tags: tags || [],
    totalCount: count || 0,
    currentPage: page,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { posts, categories, tags, totalCount, currentPage, totalPages } = await getBlogData(searchParams);

  return (
    <div className="min-h-screen bg-oracle-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-oracle-navy to-oracle-blue text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-black mb-6">
              IVC Accounting Blog
            </h1>
            <p className="text-xl mb-8 text-oracle-cream/90">
              Expert insights, practical tips, and the latest updates to help your business thrive
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <BlogSearch initialSearch={searchParams.search} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <BlogFilters
                categories={categories}
                tags={tags}
                selectedCategory={searchParams.category}
                selectedTag={searchParams.tag}
                totalPosts={totalCount}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-oracle-navy">
                  {searchParams.search && `Search results for "${searchParams.search}"`}
                  {searchParams.category && `Category: ${categories.find(c => c.slug === searchParams.category)?.name}`}
                  {searchParams.tag && `Tag: ${tags.find(t => t.slug === searchParams.tag)?.name}`}
                  {!searchParams.search && !searchParams.category && !searchParams.tag && 'Latest Posts'}
                </h2>
                <span className="text-gray-600">
                  {totalCount} post{totalCount !== 1 ? 's' : ''}
                </span>
              </div>
              
              {/* Active Filters */}
              {(searchParams.category || searchParams.tag || searchParams.search) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {searchParams.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-oracle-orange text-white">
                      Category: {categories.find(c => c.slug === searchParams.category)?.name}
                    </span>
                  )}
                  {searchParams.tag && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-oracle-blue text-white">
                      Tag: {tags.find(t => t.slug === searchParams.tag)?.name}
                    </span>
                  )}
                  {searchParams.search && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-600 text-white">
                      Search: "{searchParams.search}"
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Blog Posts Grid */}
            <Suspense fallback={<div>Loading posts...</div>}>
              <BlogList 
                posts={posts} 
                currentPage={currentPage}
                totalPages={totalPages}
                searchParams={searchParams}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 