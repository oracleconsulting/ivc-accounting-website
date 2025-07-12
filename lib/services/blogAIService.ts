import { UnifiedAIService } from '@/lib/services/ai/unifiedAIService';
import { pineconeService } from '@/lib/services/pineconeService';
import { rssService } from '@/lib/services/rssService';

export interface BlogAIContext {
  title: string;
  content: string;
  excerpt: string;
  categories?: string[];
  tags?: string[];
  targetKeywords?: string[];
  companyInfo?: {
    name: string;
    tagline: string;
    location: string;
    specialties: string[];
  };
}

export interface ResearchResult {
  topic: string;
  relevance: number;
  impact: string;
  keywords: string[];
  sources: string[];
  targetAudience: string;
  keyInsights: string[];
  statistics?: { stat: string; source: string }[];
}

export interface SocialPost {
  platform: 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'youtube';
  content: string;
  hashtags: string[];
  mediaType?: 'image' | 'video' | 'carousel';
  imagePrompt?: string;
}

export class BlogAIService extends UnifiedAIService {
  private companyContext = {
    name: 'IVC Accounting',
    tagline: 'OTHER ACCOUNTANTS FILE. WE FIGHT.',
    location: 'Halstead, Essex',
    specialties: [
      'UK tax law',
      'Small business accounting', 
      'Strategic financial planning',
      'HMRC compliance',
      'Business growth consulting'
    ],
    targetAudience: 'UK small business owners',
    brandVoice: `Professional yet approachable. We're not stuffy accountants - we're financial fighters who genuinely care about our clients' success. We explain complex tax matters in plain English and always look for opportunities to save our clients money.`
  };

  // Enhanced content generation with UK accounting context
  async generateBlogContent(
    prompt: string,
    context: BlogAIContext,
    type: 'title' | 'intro' | 'outline' | 'conclusion' | 'section' | 'full'
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context);
    const enhancedPrompt = this.enhancePromptForType(prompt, type, context);

    const result = await this.generateContent('writing', enhancedPrompt, {
      provider: 'openrouter',
      model: type === 'full' ? 'anthropic/claude-3-opus' : 'anthropic/claude-3-haiku',
      temperature: type === 'title' ? 0.9 : 0.7,
      maxTokens: type === 'full' ? 4000 : 1000
    });

    return result.content;
  }

  private buildSystemPrompt(context: BlogAIContext): string {
    return `You are an expert content writer for ${this.companyContext.name}, a UK-based accounting firm.

Brand Voice: ${this.companyContext.brandVoice}

Key Information:
- Company: ${this.companyContext.name}
- Tagline: "${this.companyContext.tagline}"
- Location: ${this.companyContext.location}
- Specialties: ${this.companyContext.specialties.join(', ')}
- Target Audience: ${this.companyContext.targetAudience}

Current Blog Context:
- Title: ${context.title || 'Not set'}
- Categories: ${context.categories?.join(', ') || 'Not set'}
- Target Keywords: ${context.targetKeywords?.join(', ') || 'Not set'}

Writing Guidelines:
- Use UK English spelling (e.g., optimise, colour, centre, recognise)
- Reference UK tax laws, HMRC regulations, and UK business practices
- Include practical examples relevant to UK small businesses
- Mention specific UK tax reliefs, allowances, and deadlines where relevant
- Maintain an educational but engaging tone
- Format with proper markdown for headings, lists, bold text, etc.
- Always provide actionable advice that readers can implement
- Include a clear call-to-action when appropriate`;
  }

  private enhancePromptForType(prompt: string, type: string, context: BlogAIContext): string {
    const enhancements: Record<string, string> = {
      title: `Generate 5 compelling blog post titles for: "${prompt}". 
        Make them specific to UK businesses, include numbers where relevant, 
        and ensure they would appeal to small business owners looking for practical advice.`,
      
      intro: `Write an engaging introduction paragraph for a blog post about: "${prompt}".
        Start with a relatable scenario or surprising statistic relevant to UK businesses.
        Clearly state what the reader will learn and why it matters to their bottom line.`,
      
      outline: `Create a detailed blog post outline for: "${prompt}".
        Include:
        - An engaging introduction
        - 3-5 main sections with H2 headings
        - 2-3 subsections (H3) under each main section
        - Key points to cover in each section
        - A conclusion with clear next steps
        Focus on practical, actionable advice for UK small businesses.`,
      
      conclusion: `Write a compelling conclusion for a blog post about: "${prompt}".
        Summarize the key takeaways, emphasize the benefits of taking action,
        and include a clear call-to-action to contact ${this.companyContext.name}.
        Remind readers of our unique approach: "${this.companyContext.tagline}"`,
      
      section: `Write a detailed section about: "${prompt}".
        Include specific examples, UK regulations if relevant, and practical tips.
        Use subheadings, bullet points, and bold text for important information.`,
      
      full: `Write a complete, comprehensive blog post about: "${prompt}".
        Include all sections from introduction to conclusion, with proper formatting,
        examples, and actionable advice throughout. Aim for 1000-1500 words.`
    };

    return enhancements[type] || prompt;
  }

  // Research trending topics using RSS feeds and current events
  async researchTrendingTopics(
    industry: string = 'accounting',
    timeframe: string = 'current'
  ): Promise<ResearchResult[]> {
    try {
      // Get RSS feeds for the industry
      const feeds = await rssService.getFeeds();
      const industryFeeds = feeds.filter(f => 
        f.category?.toLowerCase().includes(industry) || 
        f.name.toLowerCase().includes(industry)
      );

      // Fetch recent items from relevant feeds
      const recentItems = await rssService.getItems({
        limit: 50,
        imported: false
      });

      // Use AI to analyze trends
      const trendAnalysis = await this.generateContent('research', 
        `Analyze these recent news items and identify trending topics for UK ${industry} businesses:
        ${recentItems.map(item => `- ${item.title}: ${item.description}`).join('\n')}
        
        Identify:
        1. Top 5 trending topics with relevance scores (0-100)
        2. Why each topic matters to UK small businesses
        3. Keywords associated with each topic
        4. Potential blog post angles`, 
        {
          provider: 'openrouter',
          model: 'perplexity/pplx-70b-online', // Use Perplexity for real-time data
          temperature: 0.3
        }
      );

      // Parse the AI response into structured data
      return this.parseResearchResults(trendAnalysis.content);
    } catch (error) {
      console.error('Research error:', error);
      // Fallback to predefined topics
      return this.getFallbackTopics(industry);
    }
  }

  private parseResearchResults(aiResponse: string): ResearchResult[] {
    // Parse AI response into structured format
    // This is a simplified version - you'd want more robust parsing
    const results: ResearchResult[] = [];
    
    try {
      // Extract topics using regex or structured parsing
      const topicMatches = aiResponse.match(/\d\.\s*([^:]+):\s*([^(\n]+)\((\d+)%?\)/g) || [];
      
      topicMatches.forEach(match => {
        const [, topic, description, relevance] = match.match(/\d\.\s*([^:]+):\s*([^(\n]+)\((\d+)%?\)/) || [];
        if (topic) {
          results.push({
            topic: topic.trim(),
            relevance: parseInt(relevance) || 75,
            impact: description?.trim() || '',
            keywords: this.extractKeywordsFromText(topic + ' ' + description),
            sources: ['HMRC Updates', 'AccountingWEB', 'ICAEW'],
            targetAudience: 'UK Small Business Owners',
            keyInsights: []
          });
        }
      });
    } catch (error) {
      console.error('Parse error:', error);
    }

    return results.length > 0 ? results : this.getFallbackTopics('accounting');
  }

  private getFallbackTopics(industry: string): ResearchResult[] {
    const fallbackTopics: Record<string, ResearchResult[]> = {
      accounting: [
        {
          topic: 'Making Tax Digital Phase 2: Preparing for 2026',
          relevance: 95,
          impact: 'All UK businesses will need to digitize their tax records',
          keywords: ['MTD', 'HMRC', 'digital tax', 'compliance'],
          sources: ['HMRC', 'Gov.uk'],
          targetAudience: 'UK VAT-registered businesses',
          keyInsights: ['Mandatory from April 2026', 'Affects all VAT-registered businesses']
        },
        {
          topic: 'Corporation Tax Rise: Strategies for Small Companies',
          relevance: 90,
          impact: 'Corporation tax increased to 25% for profits over £250,000',
          keywords: ['corporation tax', 'tax planning', 'small companies relief'],
          sources: ['HMRC', 'Budget 2023'],
          targetAudience: 'UK limited companies',
          keyInsights: ['Small profits rate remains at 19%', 'Marginal relief available']
        },
        {
          topic: 'R&D Tax Credits: Recent Changes and Opportunities',
          relevance: 85,
          impact: 'New rules affect how companies claim R&D tax relief',
          keywords: ['R&D tax credits', 'innovation', 'tax relief'],
          sources: ['HMRC', 'Innovation funding'],
          targetAudience: 'Innovative UK businesses',
          keyInsights: ['Enhanced support for UK-based R&D', 'Stricter evidence requirements']
        }
      ]
    };

    return fallbackTopics[industry] || fallbackTopics.accounting;
  }

  private extractKeywordsFromText(text: string): string[] {
    const words = text.toLowerCase().split(/\W+/);
    const stopWords = ['the', 'and', 'for', 'with', 'from', 'how', 'why', 'what'];
    return [...new Set(words.filter(w => w.length > 3 && !stopWords.includes(w)))].slice(0, 5);
  }

  // Generate SEO-optimized content
  async generateSEOContent(
    content: string,
    title: string,
    keywords: string[]
  ): Promise<{
    seoTitle: string;
    metaDescription: string;
    suggestedKeywords: string[];
    contentOptimizations: string[];
    schema: any;
  }> {
    const seoPrompt = `Analyze this blog post for SEO optimization:

Title: ${title}
Target Keywords: ${keywords.join(', ')}
Content Preview: ${content.substring(0, 1000)}...

Provide:
1. An optimized SEO title (max 60 chars) that includes the primary keyword
2. A compelling meta description (max 160 chars) that includes keywords naturally
3. 5 additional LSI keywords relevant to UK accounting/tax
4. 3 specific content optimizations to improve SEO
5. JSON-LD schema markup for the article

Focus on UK search intent and include location-specific keywords where relevant.`;

    const result = await this.generateContent('writing', seoPrompt, {
      provider: 'openrouter',
      model: 'openai/gpt-4-turbo',
      temperature: 0.3
    });

    // Parse the response
    try {
      const lines = result.content.split('\n');
      return {
        seoTitle: this.extractBetween(result.content, 'SEO Title:', '\n') || title,
        metaDescription: this.extractBetween(result.content, 'Meta Description:', '\n') || '',
        suggestedKeywords: this.extractListItems(result.content, 'LSI Keywords:') || [],
        contentOptimizations: this.extractListItems(result.content, 'Optimizations:') || [],
        schema: this.extractJSON(result.content) || this.getDefaultSchema(title)
      };
    } catch (error) {
      return {
        seoTitle: title.substring(0, 60),
        metaDescription: content.substring(0, 160),
        suggestedKeywords: keywords,
        contentOptimizations: [],
        schema: this.getDefaultSchema(title)
      };
    }
  }

  private getDefaultSchema(title: string): any {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "author": {
        "@type": "Organization",
        "name": "IVC Accounting"
      },
      "publisher": {
        "@type": "Organization",
        "name": "IVC Accounting",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ivcaccounting.co.uk/logo.png"
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString()
    };
  }

  // Generate social media posts
  async generateSocialMediaPosts(
    blogTitle: string,
    blogContent: string,
    blogUrl: string,
    platforms: string[]
  ): Promise<SocialPost[]> {
    const posts: SocialPost[] = [];

    for (const platform of platforms) {
      const prompt = this.getSocialMediaPrompt(platform, blogTitle, blogContent, blogUrl);
      
      const result = await this.generateContent('social', prompt, {
        provider: 'openrouter',
        model: 'anthropic/claude-3-haiku',
        temperature: 0.8,
        maxTokens: 500
      });

      const post = this.parseSocialPost(result.content, platform as any);
      posts.push(post);
    }

    return posts;
  }

  private getSocialMediaPrompt(platform: string, title: string, content: string, url: string): string {
    const prompts: Record<string, string> = {
      linkedin: `Create a professional LinkedIn post about: "${title}"
        - Start with an attention-grabbing insight or question
        - Include 2-3 key takeaways using bullet points or emojis
        - Professional tone but conversational
        - End with a CTA to read the full article
        - Include 3-5 relevant hashtags
        - Max 1300 characters
        - Link: ${url}`,
      
      twitter: `Create a Twitter/X thread (3-5 tweets) about: "${title}"
        - First tweet: Hook that makes people want to read more
        - Middle tweets: Key insights with specific examples
        - Last tweet: CTA with link
        - Use relevant emojis
        - Include 2-3 hashtags per tweet
        - Each tweet max 280 characters
        - Link: ${url}`,
      
      instagram: `Create an Instagram caption about: "${title}"
        - Start with a strong hook
        - Use line breaks for readability
        - Include relevant emojis throughout
        - Share a personal insight or behind-the-scenes element
        - End with a question to encourage engagement
        - Include 20-30 relevant hashtags at the end
        - Mention link in bio
        - Suggest an image concept`,
      
      facebook: `Create a Facebook post about: "${title}"
        - Conversational, friendly tone
        - Start with a relatable scenario or question
        - Include the main benefit clearly
        - Use emojis appropriately
        - End with engagement question
        - Include link preview text
        - Link: ${url}`,
        
      youtube: `Create a YouTube video description about: "${title}"
        - Compelling first 125 characters (shown in search)
        - Overview of what viewers will learn
        - Timestamps for main sections
        - Links to resources mentioned
        - CTA to subscribe and visit website
        - Relevant tags listed
        - Link: ${url}`
    };

    return prompts[platform] || prompts.linkedin;
  }

  private parseSocialPost(aiResponse: string, platform: SocialPost['platform']): SocialPost {
    const hashtagRegex = /#\w+/g;
    const hashtags = (aiResponse.match(hashtagRegex) || []).map(tag => tag.substring(1));
    
    // Remove hashtags from main content for cleaner display
    const content = aiResponse.replace(hashtagRegex, '').trim();

    // Extract image prompt if mentioned
    const imagePromptMatch = aiResponse.match(/Image:(.*?)(?:\n|$)/i);
    const imagePrompt = imagePromptMatch ? imagePromptMatch[1].trim() : undefined;

    return {
      platform,
      content,
      hashtags: platform === 'instagram' ? hashtags : hashtags.slice(0, 5),
      mediaType: platform === 'instagram' || platform === 'youtube' ? 'image' : undefined,
      imagePrompt
    };
  }

  // AI-powered content improvement
  async improveContent(
    content: string,
    improvementType: 'clarity' | 'engagement' | 'seo' | 'tone'
  ): Promise<string> {
    const prompts: Record<string, string> = {
      clarity: `Improve the clarity of this content. Make it easier to understand for UK small business owners who aren't accounting experts. Use simpler language, add examples, and break down complex concepts.`,
      
      engagement: `Make this content more engaging. Add storytelling elements, rhetorical questions, surprising statistics, and compelling examples that UK business owners can relate to.`,
      
      seo: `Optimize this content for SEO while maintaining readability. Add relevant keywords naturally, improve heading structure, and ensure good keyword density without stuffing.`,
      
      tone: `Adjust the tone to match IVC Accounting's brand voice: professional but approachable, confident but not arrogant, helpful and genuinely caring about client success. Remember: "${this.companyContext.tagline}"`
    };

    const result = await this.generateContent('writing', 
      `${prompts[improvementType]}\n\nContent to improve:\n${content}`, 
      {
        provider: 'openrouter',
        model: 'anthropic/claude-3-sonnet',
        temperature: 0.7
      }
    );

    return result.content;
  }

  // Fact-checking and compliance verification
  async factCheckContent(content: string): Promise<{
    facts: Array<{
      claim: string;
      status: 'verified' | 'needs-verification' | 'incorrect';
      source?: string;
      suggestion?: string;
    }>;
    complianceIssues: string[];
  }> {
    const result = await this.generateContent('research', 
      `Fact-check this UK accounting/tax content. Identify:
      1. All factual claims about UK tax law, HMRC rules, or financial regulations
      2. Whether each claim is correct as of 2024
      3. Any compliance issues or misleading statements
      4. Suggested corrections with sources
      
      Content: ${content}`, 
      {
        provider: 'openrouter',
        model: 'perplexity/pplx-70b-online',
        temperature: 0.1
      }
    );

    // Parse fact-checking results
    return this.parseFactCheckResults(result.content);
  }

  private parseFactCheckResults(aiResponse: string): any {
    // Implementation would parse the AI response into structured format
    // For now, return a simplified version
    return {
      facts: [],
      complianceIssues: []
    };
  }

  // Utility methods
  private extractBetween(text: string, start: string, end: string): string {
    const startIndex = text.indexOf(start);
    if (startIndex === -1) return '';
    const endIndex = text.indexOf(end, startIndex + start.length);
    if (endIndex === -1) return '';
    return text.substring(startIndex + start.length, endIndex).trim();
  }

  private extractListItems(text: string, marker: string): string[] {
    const markerIndex = text.indexOf(marker);
    if (markerIndex === -1) return [];
    
    const afterMarker = text.substring(markerIndex + marker.length);
    const listMatch = afterMarker.match(/[\s\S]*?(?=\n\n|\n[A-Z]|$)/);
    if (!listMatch) return [];
    
    return listMatch[0]
      .split('\n')
      .map(line => line.replace(/^[-*\d.]\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  private extractJSON(text: string): any {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('JSON parse error:', error);
    }
    return null;
  }
}

// Export singleton instance
export const blogAIService = new BlogAIService();

// Initialize the service when it's first imported
blogAIService.initialize().catch(error => {
  console.error('Failed to initialize BlogAIService:', error);
}); 