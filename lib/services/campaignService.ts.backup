// /lib/services/campaignService.ts
import { supabase } from '@/lib/supabaseClient';
import { aiSeriesGenerator } from './aiSeriesGenerator';
import { socialMediaService } from './socialMediaService';
import { newsletterService } from './newsletterService';
import { exportService } from './exportService';

export interface Campaign {
  id: string;
  name: string;
  topic: string;
  blog_post_id?: string;
  newsletter_id?: string;
  status: 'draft' | 'generating' | 'ready' | 'publishing' | 'published' | 'failed';
  created_at: string;
  created_by: string;
  analytics: CampaignAnalytics;
  components: CampaignComponents;
}

export interface CampaignComponents {
  blog?: {
    id: string;
    title: string;
    content: string;
    score: number;
    published_at?: string;
  };
  newsletter?: {
    id: string;
    subject: string;
    content: string;
    sent_at?: string;
    recipient_count?: number;
  };
  socialSeries?: {
    linkedin?: LinkedInSeries;
    twitter?: TwitterThread;
    facebook?: FacebookPosts;
    instagram?: InstagramCarousel;
  };
  downloads?: {
    pdf?: { url: string; download_count: number };
    videoScript?: { url: string; download_count: number };
  };
}

export interface LinkedInSeries {
  posts: Array<{
    content: string;
    hashtags: string[];
    scheduled_for?: string;
    published_at?: string;
    engagement?: any;
  }>;
  theme: string;
  hook: string;
}

export interface TwitterThread {
  tweets: Array<{
    content: string;
    order: number;
    scheduled_for?: string;
    published_at?: string;
    engagement?: any;
  }>;
  opener: string;
  cta: string;
}

export interface FacebookPosts {
  posts: Array<{
    content: string;
    type: 'educational' | 'engagement' | 'promotional';
    scheduled_for?: string;
    published_at?: string;
  }>;
}

export interface InstagramCarousel {
  slides: Array<{
    image_prompt: string;
    caption: string;
    order: number;
  }>;
  main_caption: string;
  hashtags: string[];
}

export interface CampaignAnalytics {
  total_reach: number;
  total_engagement: number;
  conversion_rate: number;
  best_performing_channel: string;
  roi: number;
}

export class CampaignService {
  // Create a new campaign from a blog post
  async createFromBlog(params: {
    blogId: string;
    blogTitle: string;
    blogContent: string;
    keywords: string[];
    userId: string;
  }): Promise<Campaign> {
    try {
      // Step 1: Create campaign record
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          name: `Campaign: ${params.blogTitle}`,
          topic: params.blogTitle,
          blog_post_id: params.blogId,
          status: 'generating',
          created_by: params.userId,
          analytics: {
            total_reach: 0,
            total_engagement: 0,
            conversion_rate: 0,
            best_performing_channel: 'pending',
            roi: 0
          }
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Step 2: Generate all content components in parallel
      const [
        newsletter,
        socialSeries,
        pdfGuide,
        videoScript
      ] = await Promise.all([
        this.generateNewsletter(params.blogTitle, params.blogContent),
        this.generateSocialSeries(params.blogTitle, params.blogContent, params.keywords),
        this.generatePDFGuide(params.blogTitle, params.blogContent),
        this.generateVideoScript(params.blogTitle, params.blogContent)
      ]);

      // Step 3: Save all components
      await this.saveCampaignComponents(campaign.id, {
        newsletter,
        socialSeries,
        downloads: { pdfGuide, videoScript }
      });

      // Step 4: Update campaign status
      await supabase
        .from('campaigns')
        .update({ status: 'ready' })
        .eq('id', campaign.id);

      // Step 5: Return complete campaign
      return await this.getCampaign(campaign.id);
      
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  // Generate newsletter from blog content
  private async generateNewsletter(title: string, content: string) {
    try {
      const newsletterContent = await fetch('/api/ai/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          style: 'professional-engaging'
        })
      }).then(res => res.json());

      // Save to newsletter table
      const { data, error } = await supabase
        .from('newsletters')
        .insert({
          title: `Newsletter: ${title}`,
          subject: newsletterContent.subject,
          content: newsletterContent.html,
          plain_text: newsletterContent.plainText,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error('Error generating newsletter:', error);
      throw error;
    }
  }

  // Generate social media series
  private async generateSocialSeries(
    title: string, 
    content: string, 
    keywords: string[]
  ) {
    try {
      const series = await aiSeriesGenerator.generateCompleteSeries({
        title,
        content,
        keywords,
        platforms: ['linkedin', 'twitter', 'facebook', 'instagram'],
        seriesLength: {
          linkedin: 5,
          twitter: 10,
          facebook: 3,
          instagram: 5
        }
      });

      // Save each series to database
      const savedSeries: any = {};
      
      for (const [platform, platformSeries] of Object.entries(series)) {
        const { data, error } = await supabase
          .from('campaign_social_series')
          .insert({
            platform,
            series_type: this.getSeriesType(platform),
            posts: platformSeries,
            status: 'draft'
          })
          .select()
          .single();

        if (error) throw error;
        savedSeries[platform] = data;
      }

      return savedSeries;
      
    } catch (error) {
      console.error('Error generating social series:', error);
      throw error;
    }
  }

  // Generate PDF guide
  private async generatePDFGuide(title: string, content: string) {
    try {
      const pdfData = await exportService.generatePDF({
        title,
        content,
        format: 'guide',
        includeWorksheets: true
      });

      // Save to downloads table
      const { data, error } = await supabase
        .from('campaign_downloads')
        .insert({
          type: 'pdf',
          file_url: pdfData.url,
          title: `${title} - Complete Guide`,
          download_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  // Generate video script
  private async generateVideoScript(title: string, content: string) {
    try {
      const scriptData = await fetch('/api/ai/video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          duration: '5-7 minutes',
          style: 'educational-engaging'
        })
      }).then(res => res.json());

      // Save to downloads table
      const { data, error } = await supabase
        .from('campaign_downloads')
        .insert({
          type: 'video_script',
          file_url: scriptData.url,
          title: `${title} - Video Script`,
          content: scriptData.script,
          download_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error('Error generating video script:', error);
      throw error;
    }
  }

  // Save all campaign components
  private async saveCampaignComponents(
    campaignId: string,
    components: any
  ) {
    try {
      // Link newsletter to campaign
      if (components.newsletter) {
        await supabase
          .from('campaigns')
          .update({ newsletter_id: components.newsletter.id })
          .eq('id', campaignId);
      }

      // Link social series to campaign
      if (components.socialSeries) {
        for (const [platform, series] of Object.entries(components.socialSeries)) {
          await supabase
            .from('campaign_social_series')
            .update({ campaign_id: campaignId })
            .eq('id', (series as any).id);
        }
      }

      // Link downloads to campaign
      if (components.downloads) {
        for (const download of Object.values(components.downloads)) {
          if (download) {
            await supabase
              .from('campaign_downloads')
              .update({ campaign_id: campaignId })
              .eq('id', (download as any).id);
          }
        }
      }
      
    } catch (error) {
      console.error('Error saving campaign components:', error);
      throw error;
    }
  }

  // Get complete campaign data
  async getCampaign(campaignId: string): Promise<Campaign> {
    try {
      // Fetch campaign with all related data
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          blog_post:posts(id, title, content, score, published_at),
          newsletter:newsletters(id, subject, content, sent_at, recipient_count),
          social_series:campaign_social_series(id, platform, series_type, posts, status),
          downloads:campaign_downloads(id, type, file_url, download_count)
        `)
        .eq('id', campaignId)
        .single();

      if (error) throw error;

      // Format the response
      return this.formatCampaignData(campaign);
      
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  }

  // Publish campaign to all channels
  async publishCampaign(campaignId: string): Promise<void> {
    try {
      const campaign = await this.getCampaign(campaignId);
      
      // Update status to publishing
      await supabase
        .from('campaigns')
        .update({ status: 'publishing' })
        .eq('id', campaignId);

      // Publish in parallel with error handling for each channel
      const publishResults = await Promise.allSettled([
        this.publishBlog(campaign.components.blog),
        this.sendNewsletter(campaign.components.newsletter),
        this.publishSocialSeries(campaign.components.socialSeries),
        this.activateDownloads(campaign.components.downloads)
      ]);

      // Check results and update status
      const hasFailures = publishResults.some(r => r.status === 'rejected');
      
      await supabase
        .from('campaigns')
        .update({ 
          status: hasFailures ? 'failed' : 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', campaignId);
        
    } catch (error) {
      console.error('Error publishing campaign:', error);
      throw error;
    }
  }

  // Get campaign analytics
  async getCampaignAnalytics(campaignId: string): Promise<CampaignAnalytics> {
    try {
      const campaign = await this.getCampaign(campaignId);
      
      // Aggregate analytics from all channels
      const analytics = {
        total_reach: 0,
        total_engagement: 0,
        conversion_rate: 0,
        best_performing_channel: '',
        roi: 0,
        channel_breakdown: {} as any
      };

      // Blog analytics
      if (campaign.components.blog) {
        const blogStats = await this.getBlogAnalytics(campaign.components.blog.id);
        analytics.total_reach += blogStats.views;
        analytics.total_engagement += blogStats.read_time;
        analytics.channel_breakdown.blog = blogStats;
      }

      // Newsletter analytics
      if (campaign.components.newsletter) {
        const newsletterStats = await this.getNewsletterAnalytics(campaign.components.newsletter.id);
        analytics.total_reach += newsletterStats.opens;
        analytics.total_engagement += newsletterStats.clicks;
        analytics.channel_breakdown.newsletter = newsletterStats;
      }

      // Social analytics
      if (campaign.components.socialSeries) {
        const socialStats = await this.getSocialAnalytics(campaign.id);
        analytics.total_reach += socialStats.total_reach;
        analytics.total_engagement += socialStats.total_engagement;
        analytics.channel_breakdown.social = socialStats;
      }

      // Calculate best performing channel
      analytics.best_performing_channel = this.calculateBestChannel(analytics.channel_breakdown);
      
      // Calculate ROI (simplified)
      analytics.roi = this.calculateROI(analytics);

      return analytics;
      
    } catch (error) {
      console.error('Error fetching campaign analytics:', error);
      throw error;
    }
  }

  // Helper methods
  private getSeriesType(platform: string): string {
    const types: Record<string, string> = {
      linkedin: 'series',
      twitter: 'thread',
      facebook: 'posts',
      instagram: 'carousel'
    };
    return types[platform] || 'posts';
  }

  private formatCampaignData(rawData: any): Campaign {
    return {
      id: rawData.id,
      name: rawData.name,
      topic: rawData.topic,
      blog_post_id: rawData.blog_post_id,
      newsletter_id: rawData.newsletter_id,
      status: rawData.status,
      created_at: rawData.created_at,
      created_by: rawData.created_by,
      analytics: rawData.analytics || {},
      components: {
        blog: rawData.blog_post,
        newsletter: rawData.newsletter,
        socialSeries: this.formatSocialSeries(rawData.social_series),
        downloads: this.formatDownloads(rawData.downloads)
      }
    };
  }

  private formatSocialSeries(series: any[]): any {
    if (!series) return {};
    
    const formatted: any = {};
    series.forEach(s => {
      formatted[s.platform] = s.posts;
    });
    return formatted;
  }

  private formatDownloads(downloads: any[]): any {
    if (!downloads) return {};
    
    const formatted: any = {};
    downloads.forEach(d => {
      formatted[d.type] = {
        url: d.file_url,
        download_count: d.download_count
      };
    });
    return formatted;
  }

  private async publishBlog(blog: any): Promise<void> {
    if (!blog || blog.published_at) return;
    
    await supabase
      .from('posts')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', blog.id);
  }

  private async sendNewsletter(newsletter: any): Promise<void> {
    if (!newsletter || newsletter.sent_at) return;
    
    // Implement newsletter sending logic
    await newsletterService.send(newsletter.id);
  }

  private async publishSocialSeries(socialSeries: any): Promise<void> {
    if (!socialSeries) return;
    
    // Publish each platform's series
    for (const [platform, series] of Object.entries(socialSeries)) {
      await socialMediaService.publishSeries(platform, series);
    }
  }

  private async activateDownloads(downloads: any): Promise<void> {
    if (!downloads) return;
    
    // Make downloads publicly available
    for (const [type, download] of Object.entries(downloads)) {
      await supabase
        .from('campaign_downloads')
        .update({ is_active: true })
        .eq('file_url', (download as any).url);
    }
  }

  private async getBlogAnalytics(blogId: string): Promise<any> {
    // Implement blog analytics fetching
    return { views: 0, read_time: 0, shares: 0 };
  }

  private async getNewsletterAnalytics(newsletterId: string): Promise<any> {
    // Implement newsletter analytics fetching
    return { opens: 0, clicks: 0, unsubscribes: 0 };
  }

  private async getSocialAnalytics(campaignId: string): Promise<any> {
    // Implement social analytics aggregation
    return { total_reach: 0, total_engagement: 0, by_platform: {} };
  }

  private calculateBestChannel(breakdown: any): string {
    let best = '';
    let maxEngagement = 0;
    
    for (const [channel, stats] of Object.entries(breakdown)) {
      const engagement = (stats as any).engagement || 0;
      if (engagement > maxEngagement) {
        maxEngagement = engagement;
        best = channel;
      }
    }
    
    return best;
  }

  private calculateROI(analytics: any): number {
    // Simplified ROI calculation
    const value = analytics.total_engagement * 0.5; // $0.50 per engagement
    const cost = 10; // Estimated cost per campaign
    return ((value - cost) / cost) * 100;
  }
}

export const campaignService = new CampaignService();