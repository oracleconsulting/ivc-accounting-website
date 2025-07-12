import { NextRequest, NextResponse } from 'next/server';

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 9000): Promise<T> {
  const timeout = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  );
  return Promise.race([promise, timeout]);
}

export async function POST(request: NextRequest) {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const { content, title, keywords, format } = await request.json();
    
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ content: 'Export service unavailable' }, { status: 503 });
    }
    
    const formatPrompts = {
      'email': `Convert this blog post into an engaging email newsletter. Include:
- Compelling subject line
- Preview text
- Personalized greeting
- Key takeaways in bullet points
- Clear CTA
- Footer with unsubscribe`,
      
      'social-series': `Transform this blog into a 5-part social media series for LinkedIn. Each post should:
- Be 200-300 words
- Have a hook opening
- Include relevant hashtags
- End with engagement question
- Build on previous posts`,
      
      'pdf-guide': `Reformat as a downloadable PDF guide with:
- Executive summary
- Table of contents
- Section headings
- Key takeaway boxes
- Action items checklist
- Resources section`,
      
      'video-script': `Create a video script (3-5 minutes) with:
- Hook (first 10 seconds)
- Introduction
- Main points with b-roll suggestions
- Graphics/text overlay notes
- Call to action
- Estimated timestamps`
    };
    
    const systemPrompt = `You are a content transformation expert. ${formatPrompts[format as keyof typeof formatPrompts] || formatPrompts.email}`;

    const response = await withTimeout(
      fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk',
          'X-Title': 'IVC Content Exporter'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-sonnet',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Transform this content:\n\nTitle: ${title}\nKeywords: ${keywords.join(', ')}\n\n${content}` }
          ],
          temperature: 0.7,
          max_tokens: 3000
        })
      }),
      8000
    );

    if (!response.ok) {
      throw new Error('Export transformation failed');
    }

    const data = await response.json();
    const exportedContent = data.choices?.[0]?.message?.content || '';
    
    return NextResponse.json({ 
      content: exportedContent,
      format,
      metadata: {
        originalLength: content.length,
        exportedLength: exportedContent.length,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
} 