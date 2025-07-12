// /lib/services/ayrshareService.ts
import { supabase } from '@/lib/supabaseClient';

interface AyrsharePost {
  post: string;
  platforms: string[];
  media_urls?: string[];
  scheduleDate: string;
  shortenLinks?: boolean;
  hashtags?: string[];
  profileKeys?: string[];
}

interface AyrshareResponse {
  id: string;
  status: string;
  errors?: any[];
  postIds?: {
    [platform: string]: string;
  };
  schedule?: {
    utc: string;
    timezone: string;
  };
}

export class AyrshareService {
  private apiKey: string;
  private baseUrl = 'https://api.ayrshare.com/api';

  constructor() {
    this.apiKey = process.env.AYRSHARE_API_KEY || '';
  }

  // Post to multiple platforms
  async createPost(params: AyrsharePost): Promise<AyrshareResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...params,
          // Ayrshare specific formatting
          platforms: params.platforms.map(p => {
            // Map our platform names to Ayrshare's
            const platformMap: Record<string, string> = {
              linkedin: 'linkedin',
              twitter: 'twitter',
              facebook: 'facebook',
              instagram: 'instagram',
              youtube: 'youtube',
              tiktok: 'tiktok'
            };
            return platformMap[p] || p;
          })
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Ayrshare API error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error posting to Ayrshare:', error);
      throw error;
    }
  }

  // Schedule a post for future publishing
  async schedulePost(params: AyrsharePost & { scheduleDate: string }): Promise<AyrshareResponse> {
    return this.createPost({
      ...params,
      scheduleDate: params.scheduleDate // ISO 8601 format
    });
  }

  // Delete a scheduled post
  async deletePost(postId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Get post analytics
  async getAnalytics(postId: string, platforms?: string[]): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (platforms) {
        params.append('platforms', platforms.join(','));
      }

      const response = await fetch(`${this.baseUrl}/analytics/post/${postId}?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // Get user's connected social accounts
  async getProfiles(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/profiles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  }

  // Generate short links
  async generateShortLink(url: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/shorten`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Failed to generate short link');
      }

      const data = await response.json();
      return data.shortUrl;
    } catch (error) {
      console.error('Error generating short link:', error);
      return url; // Return original URL as fallback
    }
  }

  // Upload media to Ayrshare
  async uploadMedia(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload media');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  // Post a complete campaign series
  async postCampaignSeries(campaignId: string, series: any): Promise<void> {
    try {
      // Post to each platform
      for (const [platform, platformSeries] of Object.entries(series)) {
        if (platform === 'linkedin' && platformSeries) {
          await this.postLinkedInSeries(campaignId, platformSeries as any);
        } else if (platform === 'twitter' && platformSeries) {
          await this.postTwitterThread(campaignId, platformSeries as any);
        } else if (platform === 'facebook' && platformSeries) {
          await this.postFacebookPosts(campaignId, platformSeries as any);
        } else if (platform === 'instagram' && platformSeries) {
          await this.postInstagramCarousel(campaignId, platformSeries as any);
        }
      }
    } catch (error) {
      console.error('Error posting campaign series:', error);
      throw error;
    }
  }

  // Post LinkedIn series with proper spacing
  private async postLinkedInSeries(campaignId: string, series: any): Promise<void> {
    for (let i = 0; i < series.posts.length; i++) {
      const post = series.posts[i];
      
      const ayrsharePost: AyrsharePost = {
        post: `${post.content}\n\n${post.hashtags.map((h: string) => `#${h}`).join(' ')}`,
        platforms: ['linkedin'],
        scheduleDate: post.scheduled_for || '',
        shortenLinks: true
      };

      const response = await this.schedulePost(ayrsharePost);
      
      // Save post ID for tracking
      await supabase
        .from('social_posts')
        .insert({
          campaign_id: campaignId,
          platform: 'linkedin',
          content: post.content,
          hashtags: post.hashtags,
          scheduled_at: post.scheduled_for,
          external_id: response.postIds?.linkedin,
          status: 'scheduled'
        });
    }
  }

  // Post Twitter thread
  private async postTwitterThread(campaignId: string, thread: any): Promise<void> {
    // For Twitter threads, we need to post them as a connected series
    const tweets = thread.tweets.map((tweet: any, index: number) => {
      const isLast = index === thread.tweets.length - 1;
      return `${tweet.content}${isLast ? '\n\n' + thread.cta : ''}`;
    });

    // Ayrshare supports Twitter threads
    const ayrsharePost: AyrsharePost = {
      post: tweets, // Array for thread
      platforms: ['twitter'],
      scheduleDate: thread.tweets[0].scheduled_for || '',
      shortenLinks: true
    };

    const response = await this.schedulePost(ayrsharePost);

    // Save thread info
    await supabase
      .from('social_posts')
      .insert({
        campaign_id: campaignId,
        platform: 'twitter',
        content: JSON.stringify(tweets),
        scheduled_at: thread.tweets[0].scheduled_for,
        external_id: response.postIds?.twitter,
        status: 'scheduled',
        metadata: { thread_length: tweets.length }
      });
  }

  // Post Facebook posts
  private async postFacebookPosts(campaignId: string, posts: any): Promise<void> {
    for (const post of posts.posts) {
      const ayrsharePost: AyrsharePost = {
        post: post.content,
        platforms: ['facebook'],
        scheduleDate: post.scheduled_for || '',
        shortenLinks: true
      };

      const response = await this.schedulePost(ayrsharePost);

      await supabase
        .from('social_posts')
        .insert({
          campaign_id: campaignId,
          platform: 'facebook',
          content: post.content,
          scheduled_at: post.scheduled_for,
          external_id: response.postIds?.facebook,
          status: 'scheduled',
          metadata: { post_type: post.type }
        });
    }
  }

  // Post Instagram carousel
  private async postInstagramCarousel(campaignId: string, carousel: any): Promise<void> {
    // Instagram carousels need images - for now we'll schedule the caption
    // In production, you'd generate or upload images first
    
    const ayrsharePost: AyrsharePost = {
      post: `${carousel.main_caption}\n\n${carousel.hashtags.map((h: string) => `#${h}`).join(' ')}`,
      platforms: ['instagram'],
      scheduleDate: new Date().toISOString(), // Schedule for optimal time
      // media_urls: carousel.slides.map(s => s.image_url), // Would need actual image URLs
    };

    const response = await this.schedulePost(ayrsharePost);

    await supabase
      .from('social_posts')
      .insert({
        campaign_id: campaignId,
        platform: 'instagram',
        content: carousel.main_caption,
        hashtags: carousel.hashtags,
        scheduled_at: ayrsharePost.scheduleDate,
        external_id: response.postIds?.instagram,
        status: 'scheduled',
        metadata: { 
          slide_count: carousel.slides.length,
          slides: carousel.slides 
        }
      });
  }

  // Fetch and update analytics for all posts
  async updateCampaignAnalytics(campaignId: string): Promise<void> {
    try {
      // Get all posts for this campaign
      const { data: posts } = await supabase
        .from('social_posts')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('status', 'published');

      if (!posts) return;

      // Fetch analytics for each post
      for (const post of posts) {
        if (post.external_id) {
          const analytics = await this.getAnalytics(post.external_id, [post.platform]);
          
          // Update post with latest analytics
          await supabase
            .from('social_posts')
            .update({
              engagement: analytics.engagement || 0,
              reach: analytics.reach || 0,
              clicks: analytics.clicks || 0,
              analytics_updated_at: new Date().toISOString()
            })
            .eq('id', post.id);

          // Update campaign analytics
          await supabase
            .from('campaign_analytics')
            .upsert({
              campaign_id: campaignId,
              channel: post.platform,
              metric_date: new Date().toISOString().split('T')[0],
              reach: analytics.reach || 0,
              engagement: analytics.engagement || 0,
              clicks: analytics.clicks || 0
            });
        }
      }
    } catch (error) {
      console.error('Error updating campaign analytics:', error);
    }
  }

  // Validate API key and connection
  async validateConnection(): Promise<boolean> {
    try {
      const profiles = await this.getProfiles();
      return profiles && profiles.length > 0;
    } catch (error) {
      console.error('Ayrshare connection validation failed:', error);
      return false;
    }
  }
}

export const ayrshareService = new AyrshareService();