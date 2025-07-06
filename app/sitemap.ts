import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ivcaccounting.co.uk'
  
  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.8,
    },
  ]

  // If Supabase is not configured, return only static pages
  if (!supabase) {
    console.warn('Supabase not configured, returning static sitemap only');
    return staticPages;
  }

  try {
    // Fetch all published blog posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (postsError) {
      console.error('Error fetching posts for sitemap:', postsError)
      return staticPages
    }

    // Fetch all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .order('name')

    if (categoriesError) {
      console.error('Error fetching categories for sitemap:', categoriesError)
    }

    // Fetch all tags with at least one post
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select(`
        slug,
        created_at,
        post_tags!inner(post_id)
      `)
      .order('name')

    if (tagsError) {
      console.error('Error fetching tags for sitemap:', tagsError)
    }

    // Generate blog post URLs
    const postUrls: MetadataRoute.Sitemap = posts?.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.6,
    })) || []

    // Generate category archive URLs
    const categoryUrls: MetadataRoute.Sitemap = categories?.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: new Date(category.updated_at || new Date()),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.5,
    })) || []

    // Generate tag archive URLs (only for tags with posts)
    const uniqueTags = tags?.filter((tag, index, self) => 
      index === self.findIndex((t) => t.slug === tag.slug)
    ) || []
    
    const tagUrls: MetadataRoute.Sitemap = uniqueTags.map((tag) => ({
      url: `${baseUrl}/blog/tag/${tag.slug}`,
      lastModified: new Date(tag.created_at),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.4,
    }))

    // Service-specific pages (for accounting services)
    const servicePages: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/services/tax-planning`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/services/business-accounting`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/services/vat-returns`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/services/payroll`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as ChangeFrequency,
        priority: 0.7,
      },
    ]

    // Combine all URLs
    return [
      ...staticPages,
      ...postUrls,
      ...categoryUrls,
      ...tagUrls,
      ...servicePages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least the static pages if there's an error
    return staticPages
  }
}

// Optional: robots.txt configuration
export async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ivcaccounting.co.uk'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 