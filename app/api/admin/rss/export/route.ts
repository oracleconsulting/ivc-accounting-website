// RSS Export API endpoint
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

// GET /api/admin/rss/export
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'json';
    const feedId = searchParams.get('feedId');
    const includeItems = searchParams.get('includeItems') === 'true';
    
    // Build query for feeds
    let feedsQuery = supabase
      .from('rss_feeds')
      .select('*');
    
    if (feedId) {
      feedsQuery = feedsQuery.eq('id', feedId);
    }
    
    const { data: feeds, error: feedsError } = await feedsQuery;
    
    if (feedsError) throw feedsError;
    
    // Get items if requested
    let items: any[] = [];
    if (includeItems) {
      let itemsQuery = supabase
        .from('rss_items')
        .select('*');
      
      if (feedId) {
        itemsQuery = itemsQuery.eq('feed_id', feedId);
      }
      
      const { data: itemsData, error: itemsError } = await itemsQuery;
      if (itemsError) throw itemsError;
      items = itemsData || [];
    }
    
    // Prepare export data
    const exportData = {
      exported_at: new Date().toISOString(),
      feeds: feeds || [],
      items: items,
      summary: {
        total_feeds: feeds?.length || 0,
        total_items: items.length,
        active_feeds: feeds?.filter(f => f.is_active).length || 0
      }
    };
    
    // Return based on format
    if (format === 'csv') {
      // Convert to CSV format
      const csvFeeds = feeds?.map(feed => 
        `${feed.id},${feed.name},${feed.url},${feed.is_active},${feed.last_refresh}`
      ).join('\n');
      
      const csvHeaders = 'id,name,url,is_active,last_refresh\n';
      const csvContent = csvHeaders + csvFeeds;
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="rss_feeds_export.csv"'
        }
      });
    } else {
      // Default JSON format
      return NextResponse.json(exportData);
    }
  } catch (error) {
    console.error('Error exporting RSS data:', error);
    return NextResponse.json(
      { error: 'Failed to export RSS data' },
      { status: 500 }
    );
  }
} 