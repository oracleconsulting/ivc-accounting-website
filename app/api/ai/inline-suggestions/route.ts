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
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    const { content, aiMode } = await request.json();
    
    // Select model based on AI mode
    const models = {
      speed: 'anthropic/claude-3-haiku',
      quality: 'anthropic/claude-3-sonnet',
      excellence: 'anthropic/claude-3-opus'
    };
    
    const model = models[aiMode as keyof typeof models] || models.quality;
    
    const systemPrompt = `You are an inline writing assistant. Analyze the text and suggest specific improvements for clarity, style, and impact. Focus on:
- Grammar and spelling errors
- Awkward phrasing
- Wordiness
- Passive voice
- Unclear expressions

Return suggestions in JSON format:
[{
  "original": "exact text to replace",
  "suggested": "improved text",
  "reason": "brief explanation",
  "type": "grammar|style|clarity"
}]`;

    const response = await withTimeout(
      fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk',
          'X-Title': 'IVC Inline Editor'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Analyze this text and provide inline suggestions:\n\n${content}` }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      }),
      8000
    );

    if (!response.ok) {
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    const data = await response.json();
    const suggestionsText = data.choices?.[0]?.message?.content || '[]';
    
    try {
      const suggestions = JSON.parse(suggestionsText);
      
      // Add IDs and find positions
      const processedSuggestions = suggestions.map((sug: any, index: number) => {
        const start = content.indexOf(sug.original);
        return {
          id: `inline-${Date.now()}-${index}`,
          start,
          end: start + sug.original.length,
          ...sug
        };
      }).filter((sug: any) => sug.start !== -1);
      
      return NextResponse.json({ suggestions: processedSuggestions });
    } catch (parseError) {
      return NextResponse.json({ suggestions: [] });
    }
    
  } catch (error: any) {
    console.error('Inline suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
} 