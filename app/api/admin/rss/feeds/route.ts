// RSS Feeds API endpoints
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Validation schemas
const rssFeedSchema = z.object({
  name: z.string().min(2).max(100),
  url: z.string().url(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  is_active: z.boolean().optional().default(true),
  refresh_interval: z.number().min(300).max(86400).optional().default(3600), // 5 min to 24 hours
  last_refresh: z.string().datetime().nullable().optional()
});

const updateRssFeedSchema = rssFeedSchema.partial();

// Helper to check if user is admin
async function isAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  // Check if user is in admin_users table
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', user.email)
    .single();
    
  return !!adminUser;
}

// Helper to validate RSS feed URL
async function validateRssUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS-Validator/1.0)'
      }
    });
    
    if (!response.ok) return false;
    
    const contentType = response.headers.get('content-type');
    if (!contentType) return false;
    
    // Check if it's XML or RSS
    return contentType.includes('xml') || 
           contentType.includes('rss') || 
           contentType.includes('atom');
  } catch (error) {
    console.error('Error validating RSS URL:', error);
    return false;
  }
}

// GET /api/admin/rss/feeds
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const isActive = searchParams.get('active');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    // Build query
    let query = supabase
      .from('rss_feeds')
      .select('*');
    
    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    const { data: feeds, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({ feeds: feeds || [] });
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSS feeds' },
      { status: 500 }
    );
  }
}

// POST /api/admin/rss/feeds
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check admin authentication
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = rssFeedSchema.parse(body);
    
    // Validate RSS URL
    const isValidRss = await validateRssUrl(validatedData.url);
    if (!isValidRss) {
      return NextResponse.json(
        { error: 'Invalid RSS feed URL or feed not accessible' },
        { status: 400 }
      );
    }
    
    // Check if URL already exists
    const { data: existingFeed } = await supabase
      .from('rss_feeds')
      .select('id')
      .eq('url', validatedData.url)
      .single();
    
    if (existingFeed) {
      return NextResponse.json(
        { error: 'RSS feed with this URL already exists' },
        { status: 400 }
      );
    }
    
    // Create RSS feed
    const { data: feed, error } = await supabase
      .from('rss_feeds')
      .insert({
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ feed });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating RSS feed:', error);
    return NextResponse.json(
      { error: 'Failed to create RSS feed' },
      { status: 500 }
    );
  }
} 