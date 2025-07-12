// /lib/services/aiSeriesGenerator.ts
import { LinkedInSeries, TwitterThread, FacebookPosts, InstagramCarousel } from './campaignService';

interface SeriesGenerationParams {
  title: string;
  content: string;
  keywords: string[];
  platforms: string[];
  seriesLength: {
    linkedin?: number;
    twitter?: number;
    facebook?: number;
    instagram?: number;
  };
}

export class AISeriesGenerator {
  // Generate complete series for all platforms
  async generateCompleteSeries(params: SeriesGenerationParams): Promise<any> {
    const series: any = {};
    
    // Generate each platform's series in parallel
    const generationPromises = params.platforms.map(async (platform) => {
      switch (platform) {
        case 'linkedin':
          series.linkedin = await this.generateLinkedInSeries(
            params.title,
            params.content,
            params.keywords,
            params.seriesLength.linkedin || 5
          );
          break;
        case 'twitter':
          series.twitter = await this.generateTwitterThread(
            params.title,
            params.content,
            params.keywords,
            params.seriesLength.twitter || 10
          );
          break;
        case 'facebook':
          series.facebook = await this.generateFacebookPosts(
            params.title,
            params.content,
            params.keywords,
            params.seriesLength.facebook || 3
          );
          break;
        case 'instagram':
          series.instagram = await this.generateInstagramCarousel(
            params.title,
            params.content,
            params.keywords,
            params.seriesLength.instagram || 5
          );
          break;
      }
    });

    await Promise.all(generationPromises);
    return series;
  }

  // Generate LinkedIn 5-part series with narrative arc
  private async generateLinkedInSeries(
    title: string,
    content: string,
    keywords: string[],
    seriesLength: number = 5
  ): Promise<LinkedInSeries> {
    try {
      const response = await fetch('/api/ai/generate-series/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          keywords,
          seriesLength,
          seriesStructure: {
            post1: 'Hook & Problem Introduction',
            post2: 'Deep Dive into Challenge',
            post3: 'Solution Framework',
            post4: 'Implementation Steps',
            post5: 'Results & Call to Action'
          },
          guidelines: [
            'Professional yet conversational tone',
            'Each post 1200-1300 characters',
            'Include relevant hashtags (5-7 per post)',
            'End each post with a question or thought-provoker',
            'Create a narrative that builds across all posts',
            'Include data points and statistics',
            'Reference IVC Accounting expertise naturally'
          ]
        })
      });

      const data = await response.json();
      
      return {
        posts: data.posts.map((post: any, index: number) => ({
          content: post.content,
          hashtags: post.hashtags,
          scheduled_for: this.calculateScheduleDate(index, 'linkedin'),
          media_suggestions: post.media_suggestions
        })),
        theme: data.theme,
        hook: data.hook
      };
    } catch (error) {
      console.error('Error generating LinkedIn series:', error);
      throw error;
    }
  }

  // Generate Twitter 10-tweet thread with engagement hooks
  private async generateTwitterThread(
    title: string,
    content: string,
    keywords: string[],
    threadLength: number = 10
  ): Promise<TwitterThread> {
    try {
      const response = await fetch('/api/ai/generate-series/twitter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          keywords,
          threadLength,
          threadStructure: {
            tweet1: 'Attention-grabbing opener with numbers/stats',
            tweet2to3: 'Problem explanation',
            tweet4to6: 'Solution breakdown',
            tweet7to8: 'Real examples or case studies',
            tweet9: 'Key takeaways',
            tweet10: 'Call to action with link'
          },
          guidelines: [
            'Maximum 280 characters per tweet',
            'Use thread numbering (1/10, 2/10, etc.)',
            'Include 1-2 hashtags per tweet max',
            'Use emojis strategically',
            'Create natural break points',
            'Include statistics and data',
            'Make each tweet valuable standalone',
            'Use bullet points and formatting'
          ]
        })
      });

      const data = await response.json();
      
      return {
        tweets: data.tweets.map((tweet: any, index: number) => ({
          content: tweet.content,
          order: index + 1,
          scheduled_for: this.calculateScheduleDate(index, 'twitter'),
          media_url: tweet.media_url
        })),
        opener: data.opener,
        cta: data.cta
      };
    } catch (error) {
      console.error('Error generating Twitter thread:', error);
      throw error;
    }
  }

  // Generate Facebook posts optimized for shares
  private async generateFacebookPosts(
    title: string,
    content: string,
    keywords: string[],
    postCount: number = 3
  ): Promise<FacebookPosts> {
    try {
      const response = await fetch('/api/ai/generate-series/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          keywords,
          postCount,
          postTypes: ['educational', 'engagement', 'promotional'],
          guidelines: [
            'Conversational and approachable tone',
            'Optimal length 100-250 words',
            'Include questions to drive comments',
            'Use storytelling elements',
            'Include clear value proposition',
            'Format for easy scanning',
            'Include relevant emojis'
          ]
        })
      });

      const data = await response.json();
      
      return {
        posts: data.posts.map((post: any, index: number) => ({
          content: post.content,
          type: post.type,
          scheduled_for: this.calculateScheduleDate(index * 2, 'facebook'), // Space out more
          media_suggestions: post.media_suggestions,
          cta_button: post.cta_button
        }))
      };
    } catch (error) {
      console.error('Error generating Facebook posts:', error);
      throw error;
    }
  }

  // Generate Instagram carousel with visual suggestions
  private async generateInstagramCarousel(
    title: string,
    content: string,
    keywords: string[],
    slideCount: number = 5
  ): Promise<InstagramCarousel> {
    try {
      const response = await fetch('/api/ai/generate-series/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          keywords,
          slideCount,
          carouselStructure: {
            slide1: 'Eye-catching title slide',
            slide2to4: 'Value points with visuals',
            slide5: 'Call to action slide'
          },
          guidelines: [
            'Visual-first approach',
            'Minimal text per slide (30-50 words)',
            'Consistent visual theme',
            'Include slide transition hooks',
            'Use Instagram-friendly fonts',
            'Optimize for mobile viewing',
            'Include swipe prompts'
          ]
        })
      });

      const data = await response.json();
      
      return {
        slides: data.slides.map((slide: any, index: number) => ({
          image_prompt: slide.image_prompt,
          caption: slide.caption,
          order: index + 1,
          design_elements: slide.design_elements
        })),
        main_caption: data.main_caption,
        hashtags: data.hashtags
      };
    } catch (error) {
      console.error('Error generating Instagram carousel:', error);
      throw error;
    }
  }

  // Calculate optimal scheduling dates
  private calculateScheduleDate(index: number, platform: string): string {
    const now = new Date();
    const scheduleDates = {
      linkedin: {
        days: [2, 3, 4], // Tuesday, Wednesday, Thursday
        hours: [9, 12, 17], // 9am, 12pm, 5pm
        spacing: 1 // Daily
      },
      twitter: {
        days: [1, 2, 3, 4, 5], // Weekdays
        hours: [9, 13, 18], // 9am, 1pm, 6pm
        spacing: 0.5 // Twice daily for threads
      },
      facebook: {
        days: [0, 3, 5], // Sunday, Wednesday, Friday
        hours: [13, 19], // 1pm, 7pm
        spacing: 2 // Every 2 days
      },
      instagram: {
        days: [1, 3, 5], // Monday, Wednesday, Friday
        hours: [11, 18], // 11am, 6pm
        spacing: 2 // Every 2 days
      }
    };

    const config = scheduleDates[platform as keyof typeof scheduleDates];
    const baseDate = new Date(now);
    
    // Add days based on index and spacing
    baseDate.setDate(baseDate.getDate() + (index * config.spacing));
    
    // Find next valid day
    while (!config.days.includes(baseDate.getDay())) {
      baseDate.setDate(baseDate.getDate() + 1);
    }
    
    // Set optimal hour
    const hour = config.hours[index % config.hours.length];
    baseDate.setHours(hour, 0, 0, 0);
    
    return baseDate.toISOString();
  }

  // Generate optimal hashtags for each platform
  async generateHashtags(platform: string, content: string, keywords: string[]): Promise<string[]> {
    try {
      const response = await fetch('/api/ai/hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          content,
          keywords,
          guidelines: {
            linkedin: { count: 5, style: 'professional' },
            twitter: { count: 2, style: 'trending' },
            facebook: { count: 3, style: 'discoverable' },
            instagram: { count: 15, style: 'mixed-niche-broad' }
          }
        })
      });

      const data = await response.json();
      return data.hashtags;
    } catch (error) {
      console.error('Error generating hashtags:', error);
      return keywords.map(k => `#${k.replace(/\s+/g, '')}`);
    }
  }

  // Analyze competitor content for insights
  async analyzeCompetitorContent(platform: string, topic: string): Promise<any> {
    try {
      const response = await fetch('/api/ai/competitor-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          topic,
          analysis_points: [
            'content_length',
            'engagement_patterns',
            'posting_frequency',
            'hashtag_usage',
            'content_themes'
          ]
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error analyzing competitor content:', error);
      return null;
    }
  }

  // Optimize content for platform algorithms
  async optimizeForAlgorithm(platform: string, content: string): Promise<string> {
    const algorithmFactors = {
      linkedin: [
        'dwell_time', // Longer posts that keep people reading
        'meaningful_interactions', // Questions and discussions
        'professional_relevance'
      ],
      twitter: [
        'engagement_velocity', // Quick likes and retweets
        'conversation_depth', // Replies and quote tweets
        'topic_relevance'
      ],
      facebook: [
        'meaningful_social_interactions', // Comments over likes
        'time_spent', // Video and long-form content
        'relationship_signals' // Friends and family engagement
      ],
      instagram: [
        'saves_and_shares', // Save-worthy content
        'story_interactions', // DMs and replies
        'explore_page_factors' // Niche relevance
      ]
    };

    // Apply platform-specific optimizations
    return content; // Implement actual optimization logic
  }
}

export const aiSeriesGenerator = new AISeriesGenerator();