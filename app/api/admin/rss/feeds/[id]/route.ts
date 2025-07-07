// Individual RSS Feed API endpoints
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Validation schema for updating RSS feed
const updateRssFeedSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  url: z.string().url().optional(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  refresh_interval: z.number().min(300).max(86400).optional() // 5 min to 24 hours
});

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

// GET /api/admin/rss/feeds/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const feedId = params.id;
    
    // Get RSS feed
    const { data: feed, error } = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('id', feedId)
      .single();
    
    if (error) throw error;
    
    if (!feed) {
      return NextResponse.json(
        { error: 'RSS feed not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ feed });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSS feed' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/rss/feeds/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check admin authentication
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const feedId = params.id;
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateRssFeedSchema.parse(body);
    
    // If URL is being updated, validate it
    if (validatedData.url) {
      const isValidRss = await validateRssUrl(validatedData.url);
      if (!isValidRss) {
        return NextResponse.json(
          { error: 'Invalid RSS feed URL or feed not accessible' },
          { status: 400 }
        );
      }
      
      // Check if URL already exists (excluding current feed)
      const { data: existingFeed } = await supabase
        .from('rss_feeds')
        .select('id')
        .eq('url', validatedData.url)
        .neq('id', feedId)
        .single();
      
      if (existingFeed) {
        return NextResponse.json(
          { error: 'RSS feed with this URL already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update RSS feed
    const { data: feed, error } = await supabase
      .from('rss_feeds')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', feedId)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!feed) {
      return NextResponse.json(
        { error: 'RSS feed not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ feed });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating RSS feed:', error);
    return NextResponse.json(
      { error: 'Failed to update RSS feed' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/rss/feeds/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check admin authentication
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const feedId = params.id;
    
    // Check if feed has imported items
    const { data: importedItems } = await supabase
      .from('rss_items')
      .select('id')
      .eq('feed_id', feedId)
      .limit(1);
    
    if (importedItems && importedItems.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete RSS feed with imported items. Please delete items first.' },
        { status: 400 }
      );
    }
    
    // Delete RSS feed
    const { error } = await supabase
      .from('rss_feeds')
      .delete()
      .eq('id', feedId);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting RSS feed:', error);
    return NextResponse.json(
      { error: 'Failed to delete RSS feed' },
      { status: 500 }
    );
  }
} 