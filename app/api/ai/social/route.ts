import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface SocialMediaPost {
  platform: string;
  content: string;
  hashtags: string[];
  mediaType?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { blogTitle, blogContent, platforms, businessInfo } = await request.json();

    const systemPrompt = `You are a social media expert for IVC Accounting. Create engaging, platform-specific content that:
- Maintains professional credibility while being approachable
- Uses platform best practices
- Includes relevant hashtags
- Drives traffic back to the blog
- Reflects the brand: "OTHER ACCOUNTANTS FILE. WE FIGHT."`;

    // Only make OpenRouter calls if API key exists
    if (!OPENROUTER_API_KEY) {
      console.warn('OpenRouter API key not configured');
      return NextResponse.json({ 
        posts: getMockSocialPosts(blogTitle, platforms) 
      });
    }

    const posts: SocialMediaPost[] = [];

    for (const platform of platforms) {
      try {
        const platformPrompt = getPlatformPrompt(platform, blogTitle, blogContent, businessInfo);
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk',
            'X-Title': 'IVC Social Media'
          },
          body: JSON.stringify({
            model: 'anthropic/claude-3-haiku',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: platformPrompt }
            ],
            temperature: 0.9,
            max_tokens: 500
          })
        });

        const data = await response.json();
        const generatedPost = parseSocialPost(data.choices?.[0]?.message?.content || '', platform);
        posts.push(generatedPost);
      } catch (error) {
        console.error(`Failed to generate content for ${platform}:`, error);
        // Add fallback post for this platform
        posts.push(getMockSocialPost(blogTitle, platform));
      }
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Social media API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate social posts', posts: getMockSocialPosts('', []) },
      { status: 200 } // Return 200 with mock data instead of 500
    );
  }
}

function getPlatformPrompt(platform: string, title: string, content: string, businessInfo: any): string {
  const baseInfo = `Blog Title: ${title}
Key Points: ${extractKeyPoints(content)}
Business: ${businessInfo.name} - ${businessInfo.tagline}
Location: ${businessInfo.location}`;

  const platformSpecifics = {
    linkedin: `Create a LinkedIn post that:
- Professional tone but conversational
- 1300 characters max
- Includes a compelling hook
- Has 3-5 relevant hashtags
- Ends with a question to encourage engagement
- Includes link placeholder: [BLOG LINK]`,
    
    instagram: `Create an Instagram caption that:
- Engaging and visual-focused opening
- 2200 characters max but front-load key message
- Includes 10-15 relevant hashtags
- Has emoji for visual appeal
- Call-to-action for link in bio
- Suggests carousel topics (3-5 slides)`,
    
    youtube: `Create a YouTube Community post or Short description that:
- Attention-grabbing opening
- 500 characters max
- Teases the blog content
- Includes 3-5 relevant hashtags
- Suggests video hook ideas
- Call-to-action to read full blog`
  };

  return `${baseInfo}\n\n${platformSpecifics[platform as keyof typeof platformSpecifics]}`;
}

function extractKeyPoints(content: string): string {
  // Extract first 3 key points from blog content
  const sentences = content.split('.').slice(0, 3);
  return sentences.join('. ');
}

function parseSocialPost(content: string, platform: string): SocialMediaPost {
  // Parse hashtags
  const hashtags = content.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
  const cleanContent = content.replace(/#\w+/g, '').trim();

  return {
    platform,
    content: cleanContent,
    hashtags,
    mediaType: platform === 'instagram' ? 'carousel' : undefined
  };
}

function getMockSocialPosts(blogTitle: string, platforms: string[]): SocialMediaPost[] {
  return platforms.map(platform => getMockSocialPost(blogTitle, platform));
}

function getMockSocialPost(blogTitle: string, platform: string): SocialMediaPost {
  const title = blogTitle || 'UK Tax Planning for Small Businesses';
  
  const platformContent = {
    linkedin: `💼 ${title}

As a UK small business owner, staying on top of your tax obligations is crucial for long-term success. The right tax planning strategies can save you thousands while ensuring full HMRC compliance.

Key takeaways:
• Understanding your specific tax obligations
• Making Tax Digital (MTD) compliance requirements  
• Maximizing R&D tax credits opportunities

What's your biggest tax planning challenge this year? Share your thoughts below! 👇

#UKTax #SmallBusiness #TaxPlanning #HMRC #BusinessGrowth`,
    
    instagram: `📊 Tax planning doesn't have to be overwhelming!

Our latest blog breaks down everything UK small businesses need to know about tax planning and compliance. From MTD requirements to R&D credits, we've got you covered.

💡 Pro tip: Start planning early to maximize your tax efficiency!

🔗 Link in bio for the full guide

#UKTax #SmallBusiness #TaxPlanning #HMRC #BusinessTips #Accounting #TaxCredits #MTD #BusinessGrowth #FinancialPlanning`,
    
    youtube: `📈 UK Small Business Tax Planning Guide

Everything you need to know about tax planning, MTD compliance, and maximizing your tax efficiency. Don't miss these crucial tips that could save your business thousands!

🔗 Full blog post in description

#UKTax #SmallBusiness #TaxPlanning #HMRC #BusinessTips`
  };

  const content = platformContent[platform as keyof typeof platformContent] || platformContent.linkedin;
  const hashtags = content.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
  const cleanContent = content.replace(/#\w+/g, '').trim();

  return {
    platform,
    content: cleanContent,
    hashtags,
    mediaType: platform === 'instagram' ? 'carousel' : undefined
  };
} 