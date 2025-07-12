import { NextRequest, NextResponse } from 'next/server';
import { handleAPIError } from '@/lib/utils/errors';
import { requireAuth } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const { title, content, keywords, threadLength = 10 } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate Twitter thread using AI
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://ivcaccounting.co.uk',
        'X-Title': 'IVC Accounting Twitter Thread Generator'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are a social media expert for IVC Accounting. Create engaging Twitter threads that:
- Are professional yet conversational
- Include relevant hashtags (1-2 per tweet max)
- Use emojis strategically
- Create natural break points
- Include statistics and data when relevant
- Make each tweet valuable standalone
- Use bullet points and formatting
- Maximum 280 characters per tweet
- Use thread numbering (1/${threadLength}, 2/${threadLength}, etc.)
- End with a strong call to action`
          },
          {
            role: 'user',
            content: `Create a ${threadLength}-tweet thread about: "${title}"

Content to work with: ${content}

Keywords: ${keywords?.join(', ') || ''}

Structure:
- Tweet 1: Attention-grabbing opener with numbers/stats
- Tweets 2-3: Problem explanation
- Tweets 4-6: Solution breakdown
- Tweets 7-8: Real examples or case studies
- Tweet 9: Key takeaways
- Tweet 10: Call to action

Return as JSON:
{
  "tweets": [
    {"content": "tweet text", "order": 1},
    ...
  ],
  "opener": "summary of opening approach",
  "cta": "call to action summary"
}`
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate Twitter thread');
    }

    const data = await response.json();
    const twitterThread = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({
      success: true,
      data: twitterThread
    });

  } catch (error) {
    const { status, body } = handleAPIError(error);
    return NextResponse.json(body, { status });
  }
} 