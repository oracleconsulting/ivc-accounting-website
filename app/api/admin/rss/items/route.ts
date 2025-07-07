// RSS Items API endpoints
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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

// GET /api/admin/rss/items
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
    const feedId = searchParams.get('feedId');
    const category = searchParams.get('category');
    const isImported = searchParams.get('imported');
    const sortBy = searchParams.get('sortBy') || 'pub_date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Build query
    let query = supabase
      .from('rss_items')
      .select(`
        *,
        rss_feeds (
          id,
          name,
          url
        )
      `);
    
    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (feedId) {
      query = query.eq('feed_id', feedId);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (isImported !== null) {
      query = query.eq('is_imported', isImported === 'true');
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    const { data: items, error, count } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({ 
      items: items || [],
      pagination: {
        limit,
        offset,
        total: count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching RSS items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSS items' },
      { status: 500 }
    );
  }
} 