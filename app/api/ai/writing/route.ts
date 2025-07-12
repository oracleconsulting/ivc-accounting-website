import { NextRequest, NextResponse } from 'next/server';

// Railway sometimes needs explicit env access
const getApiKey = () => {
  // Try multiple methods
  const key = process.env.OPENROUTER_API_KEY || 
              process.env['OPENROUTER_API_KEY'] ||
              globalThis.process?.env?.OPENROUTER_API_KEY;
  
  console.log('API Key check:', {
    exists: !!key,
    starts_with: key?.substring(0, 6),
    length: key?.length
  });
  
  return key;
};

// Add immediate logging
console.log('=== AI Writing Route Loaded ===');
console.log('Environment:', process.env.NODE_ENV);

export async function POST(request: NextRequest) {
  const OPENROUTER_API_KEY = getApiKey();
  
  console.log('=== AI Writing POST Request ===');
  console.log('OPENROUTER_API_KEY exists:', !!OPENROUTER_API_KEY);
  
  if (!OPENROUTER_API_KEY) {
    console.error('OPENROUTER_API_KEY not found');
    return NextResponse.json(
      { error: 'AI service not configured' },
      { status: 503 }
    );
  }
  
  try {

    const { topic, outline, tone, targetAudience, keywords } = await request.json();

    // Get AI settings
    let settings;
    try {
      const settingsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/ai/settings`);
      settings = await settingsResponse.json();
    } catch (error) {
      console.error('Failed to fetch AI settings:', error);
      settings = {
        writing_system_prompt: `You are an expert blog writer for IVC Accounting...`,
        writing_temperature: 0.8
      };
    }

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

    // Only make OpenRouter call if API key exists
    if (!OPENROUTER_API_KEY) {
      console.warn('OpenRouter API key not configured');
      return NextResponse.json({ 
        content: getMockBlogContent(topic, keywords),
        settings: {
          model: settings.writing_model,
          temperature: settings.writing_temperature
        }
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk',
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
    const content = data.choices?.[0]?.message?.content || '';

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
      { error: 'Failed to generate content', content: getMockBlogContent('', []) },
      { status: 200 } // Return 200 with mock data instead of 500
    );
  }
}

function getMockBlogContent(topic: string, keywords: string[]) {
  return `# ${topic || 'UK Tax Planning for Small Businesses'}

## Introduction

In today's complex financial landscape, UK small businesses face numerous challenges when it comes to tax planning and compliance. With the right strategies and professional guidance, you can optimize your tax position while ensuring full compliance with HMRC requirements.

## Key Considerations for Small Business Tax Planning

### 1. Understanding Your Tax Obligations

Every business structure has different tax implications. Whether you're operating as a sole trader, partnership, or limited company, understanding your specific obligations is crucial.

### 2. Making Tax Digital (MTD) Compliance

The MTD initiative continues to evolve, with new requirements being phased in. Staying ahead of these changes can save you time and prevent costly penalties.

### 3. R&D Tax Credits

Many businesses miss out on valuable R&D tax credits. If your business is developing new products, processes, or services, you might be eligible for significant tax relief.

## Conclusion

Effective tax planning requires ongoing attention and professional expertise. At IVC Accounting, we don't just file your returns – we fight for your financial success. Contact us today to discuss how we can help optimize your tax position.

*Keywords: ${keywords.join(', ') || 'tax planning, small business, UK tax, HMRC compliance'}*`;
} 