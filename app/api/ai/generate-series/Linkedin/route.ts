// /app/api/ai/generate-series/linkedin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, keywords, seriesLength, seriesStructure, guidelines } = body;

    // Call OpenRouter API with Claude Opus for best quality
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://ivcaccounting.com',
        'X-Title': 'IVC LinkedIn Series Generator',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus',
        messages: [
          {
            role: 'system',
            content: `You are an expert LinkedIn content strategist for IVC Accounting, a premium accounting firm. 
            Create a ${seriesLength}-part LinkedIn series that builds a compelling narrative arc.
            
            Series Structure:
            ${Object.entries(seriesStructure).map(([post, desc]) => `${post}: ${desc}`).join('\n')}
            
            Guidelines:
            ${guidelines.join('\n')}
            
            For each post, provide:
            1. Compelling content (1200-1300 characters)
            2. 5-7 relevant hashtags
            3. A media suggestion (image type or infographic idea)
            4. Engagement hook (question or thought-provoker)
            
            Ensure each post connects to the next while being valuable standalone.`
          },
          {
            role: 'user',
            content: `Create a ${seriesLength}-part LinkedIn series about: "${title}"
            
            Base content to work from:
            ${content}
            
            Keywords to incorporate: ${keywords.join(', ')}
            
            Format the response as JSON with this structure:
            {
              "theme": "Overall series theme",
              "hook": "Series opening hook",
              "posts": [
                {
                  "content": "Post content",
                  "hashtags": ["hashtag1", "hashtag2"],
                  "media_suggestions": "Description of visual content",
                  "engagement_hook": "Question or thought-provoker"
                }
              ]
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate LinkedIn series');
    }

    const data = await response.json();
    const generatedContent = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error('LinkedIn series generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate LinkedIn series' },
      { status: 500 }
    );
  }
}

// /app/api/ai/generate-series/twitter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, keywords, threadLength, threadStructure, guidelines } = body;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://ivcaccounting.com',
        'X-Title': 'IVC Twitter Thread Generator',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-sonnet', // Faster for Twitter
        messages: [
          {
            role: 'system',
            content: `You are a Twitter thread expert for IVC Accounting. 
            Create engaging, viral-worthy threads that educate and convert.
            
            Thread Structure:
            ${Object.entries(threadStructure).map(([tweet, desc]) => `${tweet}: ${desc}`).join('\n')}
            
            Guidelines:
            ${guidelines.join('\n')}
            
            Make each tweet punchy, valuable, and encourage reading the next one.`
          },
          {
            role: 'user',
            content: `Create a ${threadLength}-tweet thread about: "${title}"
            
            Base content:
            ${content}
            
            Keywords: ${keywords.join(', ')}
            
            Format as JSON:
            {
              "opener": "Hook tweet that grabs attention",
              "cta": "Final call-to-action tweet",
              "tweets": [
                {
                  "content": "Tweet content with number (1/${threadLength})",
                  "media_url": "Optional media suggestion"
                }
              ]
            }`
          }
        ],
        temperature: 0.8,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate Twitter thread');
    }

    const data = await response.json();
    const generatedContent = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error('Twitter thread generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Twitter thread' },
      { status: 500 }
    );
  }
}

// /app/api/ai/generate-series/facebook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, keywords, postCount, postTypes, guidelines } = body;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://ivcaccounting.com',
        'X-Title': 'IVC Facebook Posts Generator',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku', // Fast for shorter content
        messages: [
          {
            role: 'system',
            content: `You are a Facebook content expert for IVC Accounting. 
            Create posts optimized for engagement and shares.
            
            Post Types: ${postTypes.join(', ')}
            
            Guidelines:
            ${guidelines.join('\n')}
            
            Focus on storytelling, value, and community engagement.`
          },
          {
            role: 'user',
            content: `Create ${postCount} Facebook posts about: "${title}"
            
            Base content:
            ${content}
            
            Keywords: ${keywords.join(', ')}
            
            Format as JSON:
            {
              "posts": [
                {
                  "content": "Post content with emojis",
                  "type": "educational|engagement|promotional",
                  "media_suggestions": "Image or video idea",
                  "cta_button": "Learn More|Sign Up|Contact Us"
                }
              ]
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate Facebook posts');
    }

    const data = await response.json();
    const generatedContent = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error('Facebook posts generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Facebook posts' },
      { status: 500 }
    );
  }
}

// /app/api/ai/generate-series/instagram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, keywords, slideCount, carouselStructure, guidelines } = body;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://ivcaccounting.com',
        'X-Title': 'IVC Instagram Carousel Generator',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are an Instagram content expert for IVC Accounting. 
            Create visually-driven carousel content that educates and engages.
            
            Carousel Structure:
            ${Object.entries(carouselStructure).map(([slide, desc]) => `${slide}: ${desc}`).join('\n')}
            
            Guidelines:
            ${guidelines.join('\n')}
            
            Focus on visual storytelling with minimal, impactful text.`
          },
          {
            role: 'user',
            content: `Create a ${slideCount}-slide Instagram carousel about: "${title}"
            
            Base content:
            ${content}
            
            Keywords: ${keywords.join(', ')}
            
            Format as JSON:
            {
              "main_caption": "Full Instagram caption with emojis",
              "hashtags": ["hashtag1", "hashtag2", ...15 total],
              "slides": [
                {
                  "image_prompt": "Detailed description for designer/AI",
                  "caption": "Text overlay for slide (30-50 words)",
                  "design_elements": ["color scheme", "fonts", "layout"]
                }
              ]
            }`
          }
        ],
        temperature: 0.8,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate Instagram carousel');
    }

    const data = await response.json();
    const generatedContent = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error('Instagram carousel generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Instagram carousel' },
      { status: 500 }
    );
  }
}