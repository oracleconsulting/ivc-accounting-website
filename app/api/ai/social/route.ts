import { NextRequest, NextResponse } from 'next/server';

// Helper function for Railway timeout handling
async function withTimeout<T>(
  promise: Promise<T>, 
  timeoutMs: number = 9000
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  );
  
  return Promise.race([promise, timeout]);
}

interface SocialMediaPost {
  platform: string;
  content: string;
  hashtags: string[];
  mediaType?: string;
}

export async function POST(request: NextRequest) {
  // Comprehensive debug logging
  console.log('=== AI Social Media Route Debug ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    keyLength: process.env.OPENROUTER_API_KEY?.length,
    keyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 10) + '...',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL
  });

  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
      console.error('❌ OpenRouter API key not found in environment');
      return NextResponse.json(
        { error: 'AI service not configured. Please check environment variables.' },
        { status: 503 }
      );
    }

    console.log('✅ OpenRouter key found, parsing request body...');
    const { blogTitle, blogContent, platforms, businessInfo, topic, platform, tone, targetAudience, callToAction } = await request.json();
    console.log('Request params:', { topic: topic || blogTitle, platform: platform || platforms?.[0], tone, targetAudience });

    // Use direct settings - no internal fetch
    const settings = {
      social_system_prompt: `You are a social media expert for IVC Accounting. Create engaging, platform-specific content that:
- Maintains professional credibility while being approachable
- Uses platform best practices
- Includes relevant hashtags
- Drives traffic back to the blog
- Reflects the brand: "OTHER ACCOUNTANTS FILE. WE FIGHT."`,
      social_temperature: 0.9,
      social_model: 'anthropic/claude-3-haiku'
    };

    // Handle both single platform and multiple platforms
    const platformsToGenerate = platforms || [platform || 'LinkedIn'];
    const posts: SocialMediaPost[] = [];

    for (const currentPlatform of platformsToGenerate) {
      const userPrompt = blogTitle && blogContent 
        ? `Create a ${currentPlatform} post for this blog:
Title: ${blogTitle}
Content Summary: ${blogContent.substring(0, 500)}...
Business Info: ${businessInfo || 'IVC Accounting - Chartered Accountants in Halstead, Essex'}

Create engaging ${currentPlatform}-specific content with:
- Attention-grabbing opener
- Key value points
- Clear call-to-action
- Relevant hashtags
- Platform best practices`
        : `Create social media content for: ${topic}
                
Platform: ${currentPlatform}
Tone: ${tone || 'professional yet engaging'}
Target Audience: ${targetAudience || 'UK small business owners'}
Call to Action: ${callToAction || 'Contact us for expert advice'}

Please create:
1. A compelling headline
2. Main content (platform-appropriate length)
3. Relevant hashtags
4. Suggested image description
5. Engagement questions

Format for ${currentPlatform} specifically.`;

      console.log(`Making OpenRouter API call for ${currentPlatform}...`);
      const startTime = Date.now();
      
      try {
        const response = await withTimeout(
          fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk',
              'X-Title': 'IVC Social Media'
            },
            body: JSON.stringify({
              model: settings.social_model,
              messages: [
                { role: 'system', content: settings.social_system_prompt },
                { role: 'user', content: userPrompt }
              ],
              temperature: settings.social_temperature,
              max_tokens: 500
            })
          }),
          8000 // 8 seconds to leave buffer for Railway's 10-second limit
        );

        const responseTime = Date.now() - startTime;
        console.log(`OpenRouter response time for ${currentPlatform}: ${responseTime}ms`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenRouter API error for ${currentPlatform}:`, errorText);
          continue; // Skip this platform and try the next
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        if (content) {
          // Parse the content to extract hashtags
          const hashtagMatch = content.match(/#\w+/g) || [];
          const cleanContent = content.replace(/#\w+/g, '').trim();
          
          posts.push({
            platform: currentPlatform,
            content: cleanContent,
            hashtags: hashtagMatch.map((tag: string) => tag.substring(1)),
            mediaType: currentPlatform === 'Instagram' ? 'image' : 'text'
          });
        }

      } catch (error: any) {
        if (error.message === 'Request timeout') {
          console.error(`Social media request timed out for ${currentPlatform}`);
        } else {
          console.error(`Error generating content for ${currentPlatform}:`, error);
        }
        // Continue with other platforms
      }
    }

    if (posts.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate content for any platform' },
        { status: 500 }
      );
    }

    console.log(`✅ Generated social media content for ${posts.length} platforms`);
    
    return NextResponse.json({
      posts,
      content: posts[0]?.content, // For backward compatibility
      settings: {
        model: settings.social_model,
        temperature: settings.social_temperature
      }
    });

  } catch (error: any) {
    console.error('❌ AI Social Media Route Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to generate social media content',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 