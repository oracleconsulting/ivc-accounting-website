import { NextRequest, NextResponse } from 'next/server';
import { PineconeService } from '@/lib/services/pineconeService';

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

// Research topics relevant to UK accounting and target markets
const RESEARCH_PROMPTS = {
  'accounting': {
    sources: ['HMRC updates', 'Budget announcements', 'Tax law changes'],
    focus: ['MTD updates', 'Corporation tax', 'VAT changes', 'R&D credits']
  },
  'small-business': {
    sources: ['Government schemes', 'Business support', 'Economic trends'],
    focus: ['Cash flow', 'Growth strategies', 'Compliance', 'Cost reduction']
  }
};

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
    const { topic, researchType, targetAudience } = await request.json();
    console.log('Request params:', { topic, researchType, targetAudience });

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
      console.log('Settings loaded:', { model: settings.research_model, temperature: settings.research_temperature });
    } catch (error) {
      console.error('Failed to fetch AI settings:', error);
      settings = {
        research_system_prompt: `You are an expert research analyst specializing in accounting, tax, and business topics. Provide comprehensive, well-researched insights that are accurate and actionable.`,
        research_temperature: 0.7,
        research_model: 'anthropic/claude-3-sonnet'
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
            'X-Title': 'IVC Research'
          },
          body: JSON.stringify({
            model: settings.research_model || 'anthropic/claude-3-sonnet',
            messages: [
              { 
                role: 'system', 
                content: settings.research_system_prompt || `You are an expert research analyst specializing in accounting, tax, and business topics. Provide comprehensive, well-researched insights that are accurate and actionable.`
              },
              { 
                role: 'user', 
                content: `Research the following topic: ${topic}
                
                Research Type: ${researchType || 'comprehensive analysis'}
                Target Audience: ${targetAudience || 'UK small businesses'}
                
                Please provide:
                1. Key findings and insights
                2. Relevant statistics and data
                3. Practical implications for the target audience
                4. Current trends and developments
                5. Recommendations and next steps
                
                Format your response in a clear, structured manner.`
              }
            ],
            temperature: settings.research_temperature || 0.7,
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
      
      return NextResponse.json({
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

function parseResearchResults(content: string): any[] {
  // Parse AI response - for now return mock data if parsing fails
  try {
    // Add your parsing logic here
    return getMockResearchResults();
  } catch (error) {
    return getMockResearchResults();
  }
}

function getMockResearchResults() {
  return [
    {
      topic: "Spring Budget 2024: Key Changes for Small Businesses",
      relevance: 95,
      impact: "New dividend tax thresholds and R&D credit changes affect 80% of Essex SMEs",
      keywords: ["spring budget 2024", "dividend tax", "R&D tax credits", "small business tax"],
      sources: ["HMRC", "Treasury"],
      targetAudience: "Small business owners with £50k-£500k revenue"
    },
    {
      topic: "Making Tax Digital: Phase 2 Preparation Guide",
      relevance: 88,
      impact: "ITSA requirements starting April 2026 - businesses need 18 months to prepare",
      keywords: ["making tax digital", "MTD ITSA", "digital tax", "HMRC compliance"],
      sources: ["HMRC MTD Guide"],
      targetAudience: "Self-employed and landlords with income over £10k"
    }
  ];
} 