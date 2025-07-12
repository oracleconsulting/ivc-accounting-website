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
  console.log('=== AI Social Media Route Debug ===');
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
    const { topic, platform, tone, targetAudience, callToAction } = await request.json();
    console.log('Request params:', { topic, platform, tone, targetAudience });

    // Get AI settings with error handling
    let settings;
    try {
      const settingsUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/ai/settings`;
      console.log('Fetching settings from:', settingsUrl);
      
      const settingsResponse = await fetch(settingsUrl);
      if (!settingsResponse.ok) {
        throw new Error(`Settings fetch failed: ${settingsResponse.status}`);
      }
      settings = await settingsResponse.json();
      console.log('Settings loaded:', { model: settings.social_model, temperature: settings.social_temperature });
    } catch (error) {
      console.error('Failed to fetch AI settings:', error);
      settings = {
        social_system_prompt: `You are an expert social media content creator specializing in accounting, tax, and business topics. Create engaging, professional content that provides value while maintaining brand voice.`,
        social_temperature: 0.8,
        social_model: 'anthropic/claude-3-sonnet'
      };
    }

    // Make OpenRouter API call with detailed error handling and timeout
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
            'X-Title': 'IVC Social Media'
          },
          body: JSON.stringify({
            model: settings.social_model || 'anthropic/claude-3-sonnet',
            messages: [
              { 
                role: 'system', 
                content: settings.social_system_prompt || `You are an expert social media content creator specializing in accounting, tax, and business topics. Create engaging, professional content that provides value while maintaining brand voice.`
              },
              { 
                role: 'user', 
                content: `Create social media content for: ${topic}
                
                Platform: ${platform || 'LinkedIn'}
                Tone: ${tone || 'professional yet engaging'}
                Target Audience: ${targetAudience || 'UK small business owners'}
                Call to Action: ${callToAction || 'Contact us for expert advice'}
                
                Please create:
                1. A compelling headline
                2. Main content (platform-appropriate length)
                3. Relevant hashtags
                4. Suggested image description
                5. Engagement questions
                
                Format for ${platform} specifically.`
              }
            ],
            temperature: settings.social_temperature || 0.8,
            max_tokens: 1500
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
            error: 'AI social media generation failed', 
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

      console.log('✅ AI social media generation successful, content length:', content.length);
      
      return NextResponse.json({
        content,
        settings: {
          model: settings.social_model,
          temperature: settings.social_temperature
        }
      });

    } catch (error: any) {
      if (error.message === 'Request timeout') {
        console.error('AI social media request timed out after 8 seconds');
        return NextResponse.json(
          { error: 'AI social media request timed out. Try using a faster model or shorter content.' },
          { status: 504 }
        );
      }
      throw error;
    }

  } catch (error: any) {
    console.error('❌ AI Social Media Route Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to generate social media content',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 