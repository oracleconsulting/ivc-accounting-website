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

export async function POST(request: NextRequest) {
  // Comprehensive debug logging
  console.log('=== AI Writing Route Debug ===');
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
    const { topic, outline, tone, targetAudience, keywords } = await request.json();
    console.log('Request params:', { topic, tone, targetAudience });

    // Use direct settings - no internal fetch
    const settings = {
      writing_system_prompt: `You are an expert blog writer for IVC Accounting, a chartered accounting firm in Halstead, Essex. Your writing style is professional, educational, SEO-optimized without being keyword-stuffed, practical and actionable for UK small businesses, and compliant with UK financial regulations. Brand voice: "OTHER ACCOUNTANTS FILE. WE FIGHT." - We're proactive, protective, and passionate about our clients' success.`,
      writing_temperature: 0.8,
      writing_model: 'anthropic/claude-3-sonnet'
    };

    const systemPrompt = settings.writing_system_prompt;

    const userPrompt = `Write a comprehensive blog post about: ${topic}

${outline ? `Outline: ${outline}` : ''}
Tone: ${tone || 'professional yet engaging'}
Target Audience: ${targetAudience || 'UK small business owners'}
${keywords ? `Keywords to include: ${keywords.join(', ')}` : ''}

Please write in a professional yet engaging style that:
- Provides practical, actionable advice
- Uses the specified keywords naturally
- Includes relevant UK tax and accounting context
- Maintains the IVC Accounting brand voice
- Is structured for easy reading with clear headings
- Includes a compelling introduction and conclusion

Format the response with proper markdown formatting.`;

    // Make OpenRouter API call with timeout
    console.log('Making OpenRouter API call...');
    const startTime = Date.now();
    
    try {
      const response = await withTimeout(
        fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk',
            'X-Title': 'IVC Blog Writing'
          },
          body: JSON.stringify({
            model: settings.writing_model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: settings.writing_temperature,
            max_tokens: 3000
          })
        }),
        8000 // 8 seconds to leave buffer for Railway's 10-second limit
      );

      const responseTime = Date.now() - startTime;
      console.log(`OpenRouter response time: ${responseTime}ms`);
      console.log(`Response status: ${response.status}`);
      
      const responseText = await response.text();
      console.log('Response preview:', responseText.substring(0, 200));
      
      if (!response.ok) {
        console.error('OpenRouter API error:', {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        });
        
        return NextResponse.json(
          { 
            error: 'AI generation failed', 
            details: {
              status: response.status,
              message: responseText
            }
          },
          { status: response.status }
        );
      }

      const data = JSON.parse(responseText);
      const content = data.choices?.[0]?.message?.content || '';
      
      if (!content) {
        console.error('No content in OpenRouter response:', data);
        return NextResponse.json(
          { error: 'AI generated empty response' },
          { status: 500 }
        );
      }

      console.log('✅ AI generation successful, content length:', content.length);
      
      return NextResponse.json({
        content,
        settings: {
          model: settings.writing_model,
          temperature: settings.writing_temperature
        }
      });

    } catch (error: any) {
      if (error.message === 'Request timeout') {
        console.error('AI request timed out after 8 seconds');
        return NextResponse.json(
          { error: 'AI request timed out. Try using a faster model or shorter content.' },
          { status: 504 }
        );
      }
      throw error;
    }

  } catch (error: any) {
    console.error('❌ AI Writing Route Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 