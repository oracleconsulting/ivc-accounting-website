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

    const posts: SocialMediaPost[] = [];

    for (const platform of platforms) {
      const platformPrompt = getPlatformPrompt(platform, blogTitle, blogContent, businessInfo);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://www.ivcaccounting.co.uk',
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
      const generatedPost = parseSocialPost(data.choices[0].message.content, platform);
      posts.push(generatedPost);
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Social media API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate social posts' },
      { status: 500 }
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