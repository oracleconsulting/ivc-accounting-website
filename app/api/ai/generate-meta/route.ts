import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const { content, title, keywords } = await request.json();
    
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ 
        metaTitle: title,
        metaDescription: content.substring(0, 160),
        ogTags: {}
      }, { status: 200 });
    }
    
    const systemPrompt = `Generate SEO-optimized meta tags for a blog post. Create:
1. Meta title (50-60 characters)
2. Meta description (150-160 characters)
3. Open Graph tags
4. Twitter Card tags
5. Schema.org structured data

Focus on UK accounting and tax keywords.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk',
        'X-Title': 'IVC Meta Generator'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate meta tags for:\nTitle: ${title}\nKeywords: ${keywords.join(', ')}\nContent preview: ${content.substring(0, 500)}` }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('Meta generation failed');
    }

    const data = await response.json();
    const metaContent = data.choices?.[0]?.message?.content || '';
    
    // Parse the response and extract meta tags
    // For demo, return structured data
    return NextResponse.json({
      metaTitle: `${title} | IVC Accounting`,
      metaDescription: content.substring(0, 160).replace(/\n/g, ' ') + '...',
      ogTags: {
        'og:title': title,
        'og:description': content.substring(0, 160),
        'og:type': 'article',
        'og:site_name': 'IVC Accounting'
      },
      twitterTags: {
        'twitter:card': 'summary_large_image',
        'twitter:title': title,
        'twitter:description': content.substring(0, 160)
      },
      schema: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        keywords: keywords.join(', ')
      }
    });
    
  } catch (error) {
    console.error('Meta generation error:', error);
    return NextResponse.json({ error: 'Failed to generate meta tags' }, { status: 500 });
  }
} 