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
  console.log('=== AI Research Route Debug ===');
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
    const { industry, targetMarket, timeframe, topic, researchType, targetAudience } = await request.json();
    console.log('Request params:', { industry, targetMarket, timeframe, topic, researchType, targetAudience });

    // Use direct settings - no internal fetch
    const settings = {
      research_system_prompt: `You are an expert UK accounting and tax research assistant specializing in finding timely, relevant topics for accounting blog content. Your expertise includes UK tax law and HMRC regulations, small business accounting challenges, regional business trends in Essex and East of England, and financial planning and strategy.`,
      research_temperature: 0.7,
      research_model: 'anthropic/claude-3-haiku'
    };

    const userPrompt = topic 
      ? `Research the following topic: ${topic}
                
Research Type: ${researchType || 'comprehensive analysis'}
Target Audience: ${targetAudience || 'UK small businesses'}

Please provide:
1. Key findings and insights
2. Relevant statistics and data
3. Practical implications for the target audience
4. Current trends and developments
5. Recommendations and next steps

Format your response in a clear, structured manner.`
      : `Research current topics in ${industry || 'accounting'} for ${targetMarket || 'UK small businesses'} during ${timeframe || 'Q1 2024'}.

Find 5 high-impact topics that:
1. Have recent developments or changes
2. Directly affect the target audience's finances
3. Provide actionable advice opportunities
4. Have SEO potential with clear search intent
5. Can differentiate IVC Accounting's expertise

For each topic provide:
- Clear title
- Impact assessment (why it matters now)
- Target audience specifics
- 5-7 relevant keywords
- Credible sources to reference`;

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
            'X-Title': 'IVC Research'
          },
          body: JSON.stringify({
            model: settings.research_model,
            messages: [
              { role: 'system', content: settings.research_system_prompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: settings.research_temperature,
            max_tokens: 2500
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
            error: 'AI research failed', 
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

      console.log('✅ AI research successful, content length:', content.length);
      
      // For research endpoint, we might want to parse the results
      // For now, return the raw content
      return NextResponse.json({
        results: content,
        content,
        settings: {
          model: settings.research_model,
          temperature: settings.research_temperature
        }
      });

    } catch (error: any) {
      if (error.message === 'Request timeout') {
        console.error('AI research request timed out after 8 seconds');
        return NextResponse.json(
          { error: 'AI research request timed out. Try using a faster model or more specific topic.' },
          { status: 504 }
        );
      }
      throw error;
    }

  } catch (error: any) {
    console.error('❌ AI Research Route Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to generate research',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 