// Refresh All RSS Feeds API endpoint
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Helper to check if user is admin
async function isAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', user.email)
    .single();
    
  return !!adminUser;
}

// POST /api/admin/rss/refresh-all
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get all active RSS feeds
    const { data: feeds, error: feedsError } = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('is_active', true);
    
    if (feedsError) throw feedsError;
    
    if (!feeds || feeds.length === 0) {
      return NextResponse.json({ 
        success: true,
        message: 'No active RSS feeds found',
        results: { total: 0, refreshed: 0, failed: 0 }
      });
    }
    
    const results = {
      total: feeds.length,
      refreshed: 0,
      failed: 0,
      errors: [] as any[]
    };
    
    // Refresh each feed
    for (const feed of feeds) {
      try {
        // Call the individual refresh endpoint
        const response = await fetch(`${request.nextUrl.origin}/api/admin/rss/feeds/${feed.id}/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': request.headers.get('cookie') || ''
          }
        });
        
        if (response.ok) {
          results.refreshed++;
        } else {
          results.failed++;
          const errorData = await response.json();
          results.errors.push({
            feedId: feed.id,
            feedName: feed.name,
            error: errorData.error || 'Unknown error'
          });
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          feedId: feed.id,
          feedName: feed.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({ 
      success: true,
      results
    });
  } catch (error) {
    console.error('Error refreshing all RSS feeds:', error);
    return NextResponse.json(
      { error: 'Failed to refresh RSS feeds' },
      { status: 500 }
    );
  }
} 