import { NextRequest, NextResponse } from 'next/server';
import { handleAPIError } from '@/lib/utils/errors';
import { requireAuth } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const { title, content, keywords, postCount = 3 } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate Facebook posts using AI
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://ivcaccounting.co.uk',
        'X-Title': 'IVC Accounting Facebook Posts Generator'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are a social media expert for IVC Accounting. Create engaging Facebook posts that:
- Are conversational and approachable
- Optimal length 100-250 words
- Include questions to drive comments
- Use storytelling elements
- Include clear value proposition
- Format for easy scanning
- Include relevant emojis
- Mix educational, engagement, and promotional content`
          },
          {
            role: 'user',
            content: `Create ${postCount} Facebook posts about: "${title}"

Content to work with: ${content}

Keywords: ${keywords?.join(', ') || ''}

Post types to create:
- Educational: Teach something valuable
- Engagement: Ask questions, encourage interaction
- Promotional: Subtle promotion of services

Return as JSON:
{
  "posts": [
    {
      "content": "post text",
      "type": "educational|engagement|promotional",
      "cta_button": "optional call to action"
    }
  ]
}`
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate Facebook posts');
    }

    const data = await response.json();
    const facebookPosts = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({
      success: true,
      data: facebookPosts
    });

  } catch (error) {
    const { status, body } = handleAPIError(error);
    return NextResponse.json(body, { status });
  }
} 