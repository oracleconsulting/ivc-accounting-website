// RSS Feed Refresh API endpoint
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

// Helper to parse RSS/Atom feed
async function parseRssFeed(url: string) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS-Parser/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    
    // Basic RSS/Atom parsing (you might want to use a proper RSS parser library)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    const items: any[] = [];
    
    // Handle both RSS and Atom formats
    const rssItems = xmlDoc.querySelectorAll('item');
    const atomEntries = xmlDoc.querySelectorAll('entry');
    
    const elements = rssItems.length > 0 ? rssItems : atomEntries;
    
    elements.forEach((element) => {
      const item = {
        title: element.querySelector('title')?.textContent || '',
        link: element.querySelector('link')?.textContent || '',
        description: element.querySelector('description')?.textContent || 
                    element.querySelector('summary')?.textContent || '',
        pubDate: element.querySelector('pubDate')?.textContent || 
                element.querySelector('published')?.textContent || '',
        guid: element.querySelector('guid')?.textContent || 
              element.querySelector('id')?.textContent || '',
        author: element.querySelector('author')?.textContent || '',
        category: element.querySelector('category')?.textContent || ''
      };
      
      items.push(item);
    });
    
    return items;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    throw error;
  }
}

// POST /api/admin/rss/feeds/[id]/refresh
export async function POST(
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
    
    // Get RSS feed details
    const { data: feed, error: feedError } = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('id', feedId)
      .single();
    
    if (feedError) throw feedError;
    
    if (!feed) {
      return NextResponse.json(
        { error: 'RSS feed not found' },
        { status: 404 }
      );
    }
    
    if (!feed.is_active) {
      return NextResponse.json(
        { error: 'Cannot refresh inactive RSS feed' },
        { status: 400 }
      );
    }
    
    // Parse RSS feed
    const items = await parseRssFeed(feed.url);
    
    // Store new items in database
    const newItems = items.map(item => ({
      feed_id: feedId,
      title: item.title,
      link: item.link,
      description: item.description,
      pub_date: item.pubDate ? new Date(item.pubDate).toISOString() : null,
      guid: item.guid,
      author: item.author,
      category: item.category,
      is_imported: false,
      created_at: new Date().toISOString()
    }));
    
    // Insert new items (ignore duplicates based on guid)
    const { data: insertedItems, error: insertError } = await supabase
      .from('rss_items')
      .upsert(newItems, { 
        onConflict: 'guid,feed_id',
        ignoreDuplicates: true 
      })
      .select('id, title, guid');
    
    if (insertError) throw insertError;
    
    // Update feed's last_refresh timestamp
    await supabase
      .from('rss_feeds')
      .update({ 
        last_refresh: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', feedId);
    
    return NextResponse.json({ 
      success: true,
      feedId,
      itemsFound: items.length,
      newItemsCount: insertedItems?.length || 0,
      newItems: insertedItems || []
    });
  } catch (error) {
    console.error('Error refreshing RSS feed:', error);
    return NextResponse.json(
      { error: 'Failed to refresh RSS feed' },
      { status: 500 }
    );
  }
} 