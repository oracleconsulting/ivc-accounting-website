export interface Campaign {
  id: string;
  name: string;
  topic: string;
  blog_post_id?: string;
  newsletter_id?: string;
  status: CampaignStatus;
  created_at: string;
  updated_at?: string;
  published_at?: string;
  created_by: string;
  analytics: CampaignAnalytics;
  components: CampaignComponents;
}

export type CampaignStatus = 
  | 'draft' 
  | 'generating' 
  | 'ready' 
  | 'publishing' 
  | 'published' 
  | 'failed';

export interface CampaignComponents {
  blog?: BlogComponent;
  newsletter?: NewsletterComponent;
  socialSeries?: SocialSeriesComponents;
  downloads?: DownloadComponents;
}

export interface BlogComponent {
  id: string;
  title: string;
  content: string;
  score: number;
  published_at?: string;
  url?: string;
  views?: number;
}

export interface NewsletterComponent {
  id: string;
  subject: string;
  content: string;
  sent_at?: string;
  recipient_count?: number;
  open_rate?: number;
  click_rate?: number;
}

export interface SocialSeriesComponents {
  linkedin?: LinkedInSeries;
  twitter?: TwitterThread;
  facebook?: FacebookPosts;
  instagram?: InstagramCarousel;
}

export interface LinkedInSeries {
  posts: LinkedInPost[];
  theme: string;
  hook: string;
}

export interface LinkedInPost {
  content: string;
  hashtags: string[];
  scheduled_for?: string;
  published_at?: string;
  engagement?: PostEngagement;
  media_suggestions?: string;
}

export interface TwitterThread {
  tweets: Tweet[];
  opener: string;
  cta: string;
}

export interface Tweet {
  content: string;
  order: number;
  scheduled_for?: string;
  published_at?: string;
  engagement?: PostEngagement;
  media_url?: string;
}

export interface FacebookPosts {
  posts: FacebookPost[];
}

export interface FacebookPost {
  content: string;
  type: 'educational' | 'engagement' | 'promotional';
  scheduled_for?: string;
  published_at?: string;
  media_suggestions?: string;
  cta_button?: string;
}

export interface InstagramCarousel {
  slides: InstagramSlide[];
  main_caption: string;
  hashtags: string[];
}

export interface InstagramSlide {
  image_prompt: string;
  caption: string;
  order: number;
  design_elements?: string[];
}

export interface DownloadComponents {
  pdf?: DownloadItem;
  videoScript?: DownloadItem;
}

export interface DownloadItem {
  url: string;
  download_count: number;
  title?: string;
}

export interface CampaignAnalytics {
  total_reach: number;
  total_engagement: number;
  conversion_rate: number;
  best_performing_channel: string;
  roi: number;
  channel_breakdown?: ChannelBreakdown;
}

export interface ChannelBreakdown {
  [channel: string]: ChannelMetrics;
}

export interface ChannelMetrics {
  reach: number;
  engagement: number;
  clicks: number;
  conversions?: number;
}

export interface PostEngagement {
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  impressions: number;
} 