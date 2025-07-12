// /lib/services/socialMediaService.ts (Enhanced Version)
import { supabase } from '@/lib/supabaseClient';
import { ayrshareService } from './ayrshareService';

export interface SocialPost {
  id?: string;
  campaign_id?: string;
  content: string;
  platforms: string[];
  scheduledAt?: Date;
  images?: string[];
  hashtags?: string[];
  status?: 'draft' | 'scheduled' | 'published' | 'failed';
  external_id?: string;
  engagement?: number;
  reach?: number;
}

export interface PlatformConnection {
  id: string;
  platform_id: string;
  platform_name: string;
  connected: boolean;
  profile_url?: string;
  profile_name?: string;
  profile_image?: string;
}

export interface PostAnalytics {
  engagement: number;
  reach: number;
  likes: number;
  shares: number;
  comments: number;
  clicks: number;
}

export class SocialMediaService {
  private useAyrshare: boolean;

  constructor() {
    // Check if Ayrshare is configured
    this.useAyrshare = !!process.env.AYRSHARE_API_KEY;
  }

  // Get platform connections - now checks Ayrshare profiles
  async getPlatformConnections(): Promise<PlatformConnection[]> {
    try {
      if (this.useAyrshare) {
        // Get profiles from Ayrshare
        const ayrshareProfiles = await ayrshareService.getProfiles();
        
        // Map Ayrshare profiles to our format
        const connections: PlatformConnection[] = ayrshareProfiles.map((profile: any) => ({
          id: profile.profileKey,
          platform_id: profile.platform,
          platform_name: this.formatPlatformName(profile.platform),
          connected: true,
          profile_url: profile.profileUrl,
          profile_name: profile.displayName,
          profile_image: profile.profileImage
        }));

        // Save to database for caching
        for (const connection of connections) {
          await supabase
            .from('social_platform_connections')
            .upsert({
              platform_id: connection.platform_id,
              platform_name: connection.platform_name,
              connected: true,
              profile_url: connection.profile_url,
              updated_at: new Date().toISOString()
            });
        }

        return connections;
      } else {
        // Fallback to database connections
        const { data, error } = await supabase
          .from('social_platform_connections')
          .select('*')
          .order('platform_name');

        if (error) throw error;
        return data || [];
      }
    } catch (error) {
      console.error('Error fetching platform connections:', error);
      throw error;
    }
  }

  // Create and schedule a post - now uses Ayrshare
  async createPost(post: SocialPost): Promise<SocialPost> {
    try {
      // Save to database first
      const { data: savedPost, error } = await supabase
        .from('social_posts')
        .insert({
          campaign_id: post.campaign_id,
          content: post.content,
          platforms: post.platforms,
          scheduled_at: post.scheduledAt,
          hashtags: post.hashtags,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      // If using Ayrshare, schedule the post
      if (this.useAyrshare) {
        const ayrshareResponse = await ayrshareService.createPost({
          post: this.formatPostContent(post),
          platforms: post.platforms,
          media_urls: post.images,
          scheduleDate: post.scheduledAt?.toISOString(),
          hashtags: post.hashtags
        });

        // Update post with external IDs
        await supabase
          .from('social_posts')
          .update({
            external_id: ayrshareResponse.id,
            external_post_ids: ayrshareResponse.postIds
          })
          .eq('id', savedPost.id);

        savedPost.external_id = ayrshareResponse.id;
      }

      return savedPost;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Publish a series of posts for a campaign
  async publishSeries(platform: string, series: any): Promise<void> {
    try {
      if (this.useAyrshare) {
        // Use Ayrshare's batch posting
        await ayrshareService.postCampaignSeries(series.campaign_id, { [platform]: series });
      } else {
        // Fallback to individual platform APIs
        switch (platform) {
          case 'linkedin':
            await this.publishLinkedInSeries(series);
            break;
          case 'twitter':
            await this.publishTwitterThread(series);
            break;
          case 'facebook':
            await this.publishFacebookPosts(series);
            break;
          case 'instagram':
            await this.publishInstagramCarousel(series);
            break;
        }
      }
    } catch (error) {
      console.error(`Error publishing ${platform} series:`, error);
      throw error;
    }
  }

  // Delete a scheduled post
  async deletePost(postId: string): Promise<void> {
    try {
      // Get post details
      const { data: post } = await supabase
        .from('social_posts')
        .select('external_id')
        .eq('id', postId)
        .single();

      // Delete from Ayrshare if exists
      if (this.useAyrshare && post?.external_id) {
        await ayrshareService.deletePost(post.external_id);
      }

      // Delete from database
      await supabase
        .from('social_posts')
        .delete()
        .eq('id', postId);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Get scheduled posts
  async getScheduledPosts(startDate?: Date, endDate?: Date): Promise<SocialPost[]> {
    try {
      let query = supabase
        .from('social_posts')
        .select('*')
        .in('status', ['scheduled', 'published'])
        .order('scheduled_at', { ascending: true });

      if (startDate) {
        query = query.gte('scheduled_at', startDate.toISOString());
      }
      if (endDate) {
        query = query.lte('scheduled_at', endDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
      throw error;
    }
  }

  // Get analytics for posts
  async getAnalytics(timeRange: string = '30d', platform?: string): Promise<any> {
    try {
      // If using Ayrshare, fetch fresh analytics
      if (this.useAyrshare) {
        const posts = await this.getScheduledPosts();
        
        // Update analytics for published posts
        for (const post of posts.filter(p => p.status === 'published' && p.external_id)) {
          if (post.external_id) {
            const analytics = await ayrshareService.getAnalytics(post.external_id);
            
            // Update post analytics in database
            await supabase
              .from('social_posts')
              .update({
                engagement: analytics.engagement || 0,
                reach: analytics.reach || 0,
                analytics_updated_at: new Date().toISOString()
              })
              .eq('id', post.id);
          }
        }
      }

      // Calculate analytics from database
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
      }

      let query = supabase
        .from('social_posts')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', now.toISOString());

      if (platform) {
        query = query.contains('platforms', [platform]);
      }

      const { data: posts, error } = await query;
      if (error) throw error;

      // Aggregate analytics
      const analytics = {
        totalPosts: posts?.length || 0,
        totalEngagement: posts?.reduce((sum, post) => sum + (post.engagement || 0), 0) || 0,
        totalReach: posts?.reduce((sum, post) => sum + (post.reach || 0), 0) || 0,
        averageEngagementRate: 0,
        topPosts: posts?.sort((a, b) => (b.engagement || 0) - (a.engagement || 0)).slice(0, 5) || [],
        platformStats: this.aggregatePlatformStats(posts || [])
      };

      if (analytics.totalReach > 0) {
        analytics.averageEngagementRate = (analytics.totalEngagement / analytics.totalReach) * 100;
      }

      return analytics;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // Helper methods
  private formatPlatformName(platform: string): string {
    const names: Record<string, string> = {
      linkedin: 'LinkedIn',
      twitter: 'Twitter/X',
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube',
      tiktok: 'TikTok'
    };
    return names[platform] || platform;
  }

  private formatPostContent(post: SocialPost): string {
    let content = post.content;
    
    // Add hashtags if not already included
    if (post.hashtags && post.hashtags.length > 0) {
      const hashtagString = post.hashtags.map(tag => `#${tag.replace(/^#/, '')}`).join(' ');
      if (!content.includes(hashtagString)) {
        content += `\n\n${hashtagString}`;
      }
    }
    
    return content;
  }

  private aggregatePlatformStats(posts: any[]): Record<string, any> {
    const stats: Record<string, any> = {};
    
    posts.forEach(post => {
      post.platforms?.forEach((platform: string) => {
        if (!stats[platform]) {
          stats[platform] = { posts: 0, engagement: 0, reach: 0 };
        }
        stats[platform].posts++;
        stats[platform].engagement += post.engagement || 0;
        stats[platform].reach += post.reach || 0;
      });
    });
    
    return stats;
  }

  // Fallback methods for individual platform posting (when not using Ayrshare)
  private async publishLinkedInSeries(series: any): Promise<void> {
    // Implementation for direct LinkedIn API posting
    console.log('Direct LinkedIn posting not implemented - use Ayrshare');
  }

  private async publishTwitterThread(thread: any): Promise<void> {
    // Implementation for direct Twitter API posting
    console.log('Direct Twitter posting not implemented - use Ayrshare');
  }

  private async publishFacebookPosts(posts: any): Promise<void> {
    // Implementation for direct Facebook API posting
    console.log('Direct Facebook posting not implemented - use Ayrshare');
  }

  private async publishInstagramCarousel(carousel: any): Promise<void> {
    // Implementation for direct Instagram API posting
    console.log('Direct Instagram posting not implemented - use Ayrshare');
  }

  // Validate all connections
  async validateConnections(): Promise<boolean> {
    if (this.useAyrshare) {
      return await ayrshareService.validateConnection();
    }
    
    // Check database connections
    const connections = await this.getPlatformConnections();
    return connections.some(c => c.connected);
  }

  // Get optimal posting times
  async getOptimalPostingTimes(platform: string): Promise<any> {
    const optimalTimes = {
      linkedin: {
        days: ['Tuesday', 'Wednesday', 'Thursday'],
        times: ['9:00 AM', '12:00 PM', '5:00 PM']
      },
      twitter: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        times: ['9:00 AM', '1:00 PM', '6:00 PM']
      },
      facebook: {
        days: ['Sunday', 'Wednesday', 'Friday'],
        times: ['1:00 PM', '7:00 PM']
      },
      instagram: {
        days: ['Monday', 'Wednesday', 'Friday'],
        times: ['11:00 AM', '6:00 PM']
      }
    };
    
    return optimalTimes[platform as keyof typeof optimalTimes] || null;
  }
}

export const socialMediaService = new SocialMediaService();