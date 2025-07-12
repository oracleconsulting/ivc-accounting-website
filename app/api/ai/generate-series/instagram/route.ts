import { NextRequest, NextResponse } from 'next/server';
import { handleAPIError } from '@/lib/utils/errors';
import { requireAuth } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const { title, content, keywords, slideCount = 5 } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate Instagram carousel using AI
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://ivcaccounting.co.uk',
        'X-Title': 'IVC Accounting Instagram Carousel Generator'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are a social media expert for IVC Accounting. Create engaging Instagram carousels that:
- Have compelling visual descriptions for each slide
- Include concise, impactful captions
- Use relevant hashtags (15-20 total)
- Create a cohesive story across all slides
- Include clear call-to-action
- Optimize for Instagram's visual format
- Use professional yet approachable tone`
          },
          {
            role: 'user',
            content: `Create a ${slideCount}-slide Instagram carousel about: "${title}"

Content to work with: ${content}

Keywords: ${keywords?.join(', ') || ''}

Carousel structure:
- Slide 1: Hook/Title slide
- Slides 2-3: Key points or tips
- Slide 4: Example or case study
- Slide 5: Call to action

Return as JSON:
{
  "slides": [
    {
      "image_prompt": "detailed description for image generation",
      "caption": "slide caption text",
      "order": 1
    }
  ],
  "main_caption": "main carousel caption",
  "hashtags": ["hashtag1", "hashtag2", ...]
}`
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate Instagram carousel');
    }

    const data = await response.json();
    const instagramCarousel = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({
      success: true,
      data: instagramCarousel
    });

  } catch (error) {
    const { status, body } = handleAPIError(error);
    return NextResponse.json(body, { status });
  }
} 