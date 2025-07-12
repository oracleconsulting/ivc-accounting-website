import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const { content } = await request.json();
    
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ enhanced: content }, { status: 200 });
    }
    
    const systemPrompt = `You are a citation assistant. Identify claims in the text that need citations and add appropriate references. Focus on:
- Statistical claims
- Legal references
- Tax rates and thresholds
- Regulatory requirements

Add citations in markdown format [^1] and list sources at the end.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk',
        'X-Title': 'IVC Citation Assistant'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Add citations to this content:\n\n${content}` }
        ],
        temperature: 0.1,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      return NextResponse.json({ enhanced: content }, { status: 200 });
    }

    const data = await response.json();
    const enhanced = data.choices?.[0]?.message?.content || content;
    
    return NextResponse.json({ enhanced });
    
  } catch (error) {
    console.error('Auto-cite error:', error);
    return NextResponse.json({ enhanced: request.body }, { status: 500 });
  }
} 