import { supabase } from '@/lib/supabaseClient';

export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  is_active: boolean;
  last_fetch: string;
  fetch_interval: number;
  auto_import: boolean;
  created_at: string;
}

export interface RSSItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author?: string;
  category?: string;
  feed_id: string;
  imported: boolean;
  created_at: string;
}

export interface RSSFeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author?: string;
  category?: string;
  guid?: string;
}

export class RSSService {
  // Fetch RSS feed content
  async fetchRSSFeed(url: string): Promise<RSSFeedItem[]> {
    try {
      // Use a CORS proxy or server-side fetching
      const response = await fetch(`/api/admin/rss/fetch?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      throw error;
    }
  }

  // Get all RSS feeds
  async getFeeds(): Promise<RSSFeed[]> {
    try {
      const { data, error } = await supabase
        .from('rss_feeds')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching RSS feeds:', error);
      throw error;
    }
  }

  // Create new RSS feed
  async createFeed(feed: Partial<RSSFeed>): Promise<RSSFeed> {
    try {
      const { data, error } = await supabase
        .from('rss_feeds')
        .insert(feed)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating RSS feed:', error);
      throw error;
    }
  }

  // Update RSS feed
  async updateFeed(id: string, updates: Partial<RSSFeed>): Promise<RSSFeed> {
    try {
      const { data, error } = await supabase
        .from('rss_feeds')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating RSS feed:', error);
      throw error;
    }
  }

  // Delete RSS feed
  async deleteFeed(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('rss_feeds')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting RSS feed:', error);
      throw error;
    }
  }

  // Refresh RSS feed (fetch new items)
  async refreshFeed(feedId: string): Promise<void> {
    try {
      // Get feed details
      const { data: feed, error: feedError } = await supabase
        .from('rss_feeds')
        .select('*')
        .eq('id', feedId)
        .single();

      if (feedError) throw feedError;

      // Fetch RSS content
      const items = await this.fetchRSSFeed(feed.url);

      // Save new items to database
      for (const item of items) {
        await this.saveRSSItem({
          feed_id: feedId,
          title: item.title,
          description: item.description,
          link: item.link,
          pub_date: item.pubDate,
          author: item.author,
          category: item.category,
          guid: item.guid
        });
      }

      // Update last_fetch timestamp
      await this.updateFeed(feedId, { last_fetch: new Date().toISOString() });

    } catch (error) {
      console.error('Error refreshing RSS feed:', error);
      throw error;
    }
  }

  // Save RSS item to database
  async saveRSSItem(item: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('rss_items')
        .upsert(item, { onConflict: 'feed_id,guid' });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving RSS item:', error);
      throw error;
    }
  }

  // Get RSS items
  async getItems(filters?: {
    feedId?: string;
    imported?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<RSSItem[]> {
    try {
      let query = supabase
        .from('rss_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.feedId) {
        query = query.eq('feed_id', filters.feedId);
      }

      if (filters?.imported !== undefined) {
        query = query.eq('imported', filters.imported);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching RSS items:', error);
      throw error;
    }
  }

  // Import RSS item as blog post
  async importItem(itemId: string): Promise<any> {
    try {
      // Get RSS item
      const { data: item, error: itemError } = await supabase
        .from('rss_items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (itemError) throw itemError;

      // Get feed details
      const { data: feed, error: feedError } = await supabase
        .from('rss_feeds')
        .select('*')
        .eq('id', item.feed_id)
        .single();

      if (feedError) throw feedError;

      // Create blog post from RSS item
      const postData = {
        title: item.title,
        content: this.formatContentForBlog(item, feed),
        excerpt: item.description?.substring(0, 200) + '...',
        status: 'draft',
        published_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

      if (postError) throw postError;

      // Mark RSS item as imported
      await supabase
        .from('rss_items')
        .update({ 
          imported: true, 
          imported_at: new Date().toISOString() 
        })
        .eq('id', itemId);

      // Log import history
      await supabase
        .from('rss_import_history')
        .insert({
          feed_id: item.feed_id,
          item_id: itemId,
          import_type: 'manual',
          status: 'success'
        });

      return post;
    } catch (error) {
      console.error('Error importing RSS item:', error);
      
      // Log failed import
      try {
        await supabase
          .from('rss_import_history')
          .insert({
            feed_id: itemId,
            item_id: itemId,
            import_type: 'manual',
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error'
          });
      } catch (logError) {
        console.error('Error logging import failure:', logError);
      }
      
      throw error;
    }
  }

  // Bulk import RSS items
  async bulkImportItems(itemIds: string[]): Promise<any[]> {
    const results = [];
    
    for (const itemId of itemIds) {
      try {
        const result = await this.importItem(itemId);
        results.push({ id: itemId, status: 'success', data: result });
      } catch (error) {
        results.push({ 
          id: itemId, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
    return results;
  }

  // Format RSS content for blog post
  private formatContentForBlog(item: any, feed: any): string {
    let content = `# ${item.title}\n\n`;
    
    if (item.description) {
      content += `${item.description}\n\n`;
    }
    
    content += `---\n\n`;
    content += `*This article was imported from [${feed.name}](${item.link}) on ${new Date().toLocaleDateString()}.*\n\n`;
    
    if (item.author) {
      content += `*Author: ${item.author}*\n\n`;
    }
    
    content += `[Read original article](${item.link})`;
    
    return content;
  }

  // Get RSS analytics
  async getAnalytics(timeRange: string = '30d'): Promise<any> {
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      // Get feeds and items for the time range
      const { data: feeds } = await supabase
        .from('rss_feeds')
        .select('*');

      const { data: items } = await supabase
        .from('rss_items')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', now.toISOString());

      const { data: importHistory } = await supabase
        .from('rss_import_history')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', now.toISOString());

      // Calculate analytics
      const analytics: any = {
        totalFeeds: feeds?.length || 0,
        activeFeeds: feeds?.filter(f => f.is_active).length || 0,
        totalItems: items?.length || 0,
        importedItems: items?.filter(i => i.imported).length || 0,
        importRate: items?.length ? (items.filter(i => i.imported).length / items.length) * 100 : 0,
        successfulImports: importHistory?.filter(h => h.status === 'success').length || 0,
        failedImports: importHistory?.filter(h => h.status === 'failed').length || 0,
        itemsByFeed: [],
        itemsByDate: {},
        topCategories: {}
      };

      // Calculate items by feed
      if (feeds && items) {
        analytics.itemsByFeed = feeds.map(feed => ({
          feed: feed.name,
          total: items.filter(item => item.feed_id === feed.id).length,
          imported: items.filter(item => item.feed_id === feed.id && item.imported).length
        }));
      }

      // Calculate items by date
      if (items) {
        items.forEach(item => {
          const date = new Date(item.created_at).toLocaleDateString();
          analytics.itemsByDate[date] = (analytics.itemsByDate[date] || 0) + 1;
        });
      }

      // Calculate top categories
      if (feeds) {
        feeds.forEach(feed => {
          if (feed.category) {
            analytics.topCategories[feed.category] = (analytics.topCategories[feed.category] || 0) + 1;
          }
        });
      }

      return analytics;
    } catch (error) {
      console.error('Error fetching RSS analytics:', error);
      throw error;
    }
  }

  // Auto-import enabled feeds
  async autoImportFeeds(): Promise<void> {
    try {
      // Get feeds with auto-import enabled
      const { data: feeds, error } = await supabase
        .from('rss_feeds')
        .select('*')
        .eq('auto_import', true)
        .eq('is_active', true);

      if (error) throw error;

      // Refresh each feed
      for (const feed of feeds || []) {
        try {
          await this.refreshFeed(feed.id);
          
          // Auto-import new items
          const { data: newItems } = await supabase
            .from('rss_items')
            .select('*')
            .eq('feed_id', feed.id)
            .eq('imported', false)
            .order('created_at', { ascending: false })
            .limit(5); // Import latest 5 items

          for (const item of newItems || []) {
            try {
              await this.importItem(item.id);
            } catch (importError) {
              console.error(`Error auto-importing item ${item.id}:`, importError);
            }
          }
        } catch (feedError) {
          console.error(`Error processing feed ${feed.id}:`, feedError);
        }
      }
    } catch (error) {
      console.error('Error in auto-import process:', error);
      throw error;
    }
  }
}

export const rssService = new RSSService(); 