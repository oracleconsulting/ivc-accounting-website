import { supabase } from '@/lib/supabaseClient';

export interface SocialPost {
  id?: string;
  content: string;
  platforms: string[];
  scheduledAt?: Date;
  images?: string[];
  hashtags?: string[];
  status?: 'draft' | 'scheduled' | 'published' | 'failed';
}

export interface PlatformConnection {
  id: string;
  platform_id: string;
  platform_name: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  profile_url?: string;
  connected: boolean;
}

export interface PostAnalytics {
  engagement: number;
  reach: number;
  likes: number;
  shares: number;
  comments: number;
}

export class SocialMediaService {
  // LinkedIn Integration
  private async postToLinkedIn(content: string, accessToken: string): Promise<string> {
    try {
      // LinkedIn API v2 endpoint for posting
      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify({
          author: `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: content
              },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('LinkedIn posting error:', error);
      throw error;
    }
  }

  // Twitter/X Integration
  private async postToTwitter(content: string, accessToken: string): Promise<string> {
    try {
      // Twitter API v2 endpoint for posting
      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: content
        })
      });

      if (!response.ok) {
        throw new Error(`Twitter API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.id;
    } catch (error) {
      console.error('Twitter posting error:', error);
      throw error;
    }
  }

  // Instagram Integration (via Facebook Graph API)
  private async postToInstagram(content: string, accessToken: string): Promise<string> {
    try {
      // Instagram Basic Display API for posting
      const response = await fetch(`https://graph.instagram.com/me/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: '', // Would need image URL for Instagram
          caption: content,
          access_token: accessToken
        })
      });

      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Instagram posting error:', error);
      throw error;
    }
  }

  // YouTube Integration
  private async postToYouTube(content: string, accessToken: string): Promise<string> {
    try {
      // YouTube Data API v3 for posting
      const response = await fetch('https://www.googleapis.com/youtube/v3/videos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          snippet: {
            title: content.substring(0, 100),
            description: content,
            tags: []
          },
          status: {
            privacyStatus: 'public'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('YouTube posting error:', error);
      throw error;
    }
  }

  // Get platform connections
  async getPlatformConnections(): Promise<PlatformConnection[]> {
    try {
      const { data, error } = await supabase
        .from('social_platform_connections')
        .select('*')
        .order('platform_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching platform connections:', error);
      throw error;
    }
  }

  // Save platform connection
  async savePlatformConnection(connection: Partial<PlatformConnection>): Promise<PlatformConnection> {
    try {
      const { data, error } = await supabase
        .from('social_platform_connections')
        .upsert(connection)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving platform connection:', error);
      throw error;
    }
  }

  // Create scheduled post
  async createScheduledPost(post: SocialPost): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('social_scheduled_posts')
        .insert({
          content: post.content,
          platforms: post.platforms,
          scheduled_at: post.scheduledAt?.toISOString(),
          images: post.images,
          hashtags: post.hashtags,
          status: post.status || 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating scheduled post:', error);
      throw error;
    }
  }

  // Publish post immediately
  async publishPost(post: SocialPost): Promise<any> {
    try {
      const connections = await this.getPlatformConnections();
      const publishedPosts: any[] = [];

      for (const platform of post.platforms) {
        const connection = connections.find(c => c.platform_id === platform && c.connected);
        
        if (!connection?.access_token) {
          console.warn(`No valid connection for platform: ${platform}`);
          continue;
        }

        try {
          let postId: string;

          switch (platform) {
            case 'linkedin':
              postId = await this.postToLinkedIn(post.content, connection.access_token);
              break;
            case 'twitter':
              postId = await this.postToTwitter(post.content, connection.access_token);
              break;
            case 'instagram':
              postId = await this.postToInstagram(post.content, connection.access_token);
              break;
            case 'youtube':
              postId = await this.postToYouTube(post.content, connection.access_token);
              break;
            default:
              console.warn(`Unsupported platform: ${platform}`);
              continue;
          }

          // Save to database
          const { data: savedPost, error } = await supabase
            .from('social_posts')
            .insert({
              content: post.content,
              platform,
              post_id: postId,
              images: post.images,
              hashtags: post.hashtags,
              status: 'published',
              published_at: new Date().toISOString()
            })
            .select()
            .single();

          if (error) throw error;
          publishedPosts.push(savedPost);

        } catch (error) {
          console.error(`Error posting to ${platform}:`, error);
          // Continue with other platforms
        }
      }

      return publishedPosts;
    } catch (error) {
      console.error('Error publishing post:', error);
      throw error;
    }
  }

  // Get scheduled posts
  async getScheduledPosts(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('social_scheduled_posts')
        .select('*')
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
      throw error;
    }
  }

  // Update post analytics
  async updatePostAnalytics(postId: string, analytics: PostAnalytics): Promise<void> {
    try {
      const { error } = await supabase
        .from('social_posts')
        .update({
          engagement: analytics.engagement,
          reach: analytics.reach,
          likes: analytics.likes,
          shares: analytics.shares,
          comments: analytics.comments,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating post analytics:', error);
      throw error;
    }
  }

  // Get analytics data
  async getAnalytics(timeRange: string = '30d', platform?: string): Promise<any> {
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

      let query = supabase
        .from('social_posts')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', now.toISOString());

      if (platform) {
        query = query.eq('platform', platform);
      }

      const { data: posts, error } = await query;

      if (error) throw error;

      // Calculate analytics
      const analytics = {
        totalPosts: posts?.length || 0,
        totalEngagement: posts?.reduce((sum, post) => sum + (post.engagement || 0), 0) || 0,
        totalReach: posts?.reduce((sum, post) => sum + (post.reach || 0), 0) || 0,
        averageEngagementRate: posts?.length ? 
          (posts.reduce((sum, post) => sum + (post.engagement || 0), 0) / posts.reduce((sum, post) => sum + (post.reach || 0), 0)) * 100 : 0,
        topPosts: posts?.slice(0, 5) || [],
        platformStats: {}
      };

      // Calculate platform-specific stats
      if (posts) {
        const platformStats: Record<string, any> = {};
        
        posts.forEach(post => {
          if (!platformStats[post.platform]) {
            platformStats[post.platform] = { posts: 0, engagement: 0, reach: 0 };
          }
          platformStats[post.platform].posts++;
          platformStats[post.platform].engagement += post.engagement || 0;
          platformStats[post.platform].reach += post.reach || 0;
        });
        
        analytics.platformStats = platformStats;
      }

      return analytics;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshAccessToken(platformId: string, refreshToken: string): Promise<string> {
    try {
      let tokenEndpoint: string;
      let clientId: string;
      let clientSecret: string;

      switch (platformId) {
        case 'linkedin':
          tokenEndpoint = 'https://www.linkedin.com/oauth/v2/accessToken';
          clientId = process.env.LINKEDIN_CLIENT_ID!;
          clientSecret = process.env.LINKEDIN_CLIENT_SECRET!;
          break;
        case 'twitter':
          tokenEndpoint = 'https://api.twitter.com/2/oauth2/token';
          clientId = process.env.TWITTER_CLIENT_ID!;
          clientSecret = process.env.TWITTER_CLIENT_SECRET!;
          break;
        case 'instagram':
          tokenEndpoint = 'https://graph.instagram.com/access_token';
          clientId = process.env.INSTAGRAM_APP_ID!;
          clientSecret = process.env.INSTAGRAM_APP_SECRET!;
          break;
        default:
          throw new Error(`Unsupported platform: ${platformId}`);
      }

      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }
}

export const socialMediaService = new SocialMediaService(); 