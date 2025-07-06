import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { topic, outline, tone, targetAudience, keywords } = await request.json();

    // Get AI settings
    const settingsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/ai/settings`);
    const settings = await settingsResponse.json();

    const systemPrompt = settings.writing_system_prompt || `You are an expert blog writer for IVC Accounting, a chartered accounting firm in Halstead, Essex. Your writing style is professional, educational, SEO-optimized without being keyword-stuffed, practical and actionable for UK small businesses, and compliant with UK financial regulations. Brand voice: "OTHER ACCOUNTANTS FILE. WE FIGHT." - We're proactive, protective, and passionate about our clients' success.`;

    const userPrompt = `Write a comprehensive blog post about: ${topic}

Outline: ${outline}
Tone: ${tone}
Target Audience: ${targetAudience}
Keywords to include: ${keywords.join(', ')}

Please write in a professional yet engaging style that:
- Provides practical, actionable advice
- Uses the specified keywords naturally
- Includes relevant UK tax and accounting context
- Maintains the IVC Accounting brand voice
- Is structured for easy reading with clear headings
- Includes a compelling introduction and conclusion

Format the response with proper markdown formatting.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://www.ivcaccounting.co.uk',
        'X-Title': 'IVC Blog Writing'
      },
      body: JSON.stringify({
        model: settings.writing_model || 'anthropic/claude-3-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: settings.writing_temperature || 0.8,
        max_tokens: 3000
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    return NextResponse.json({ 
      content,
      settings: {
        model: settings.writing_model,
        temperature: settings.writing_temperature
      }
    });
  } catch (error) {
    console.error('Writing API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 