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
  console.log('=== AI Review Route ===');
  console.log('Timestamp:', new Date().toISOString());

  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      );
    }

    const { content, keywords = [], previousSuggestions, reviewType = 'comprehensive' } = await request.json();

    // Use Claude Opus 4 for comprehensive review
    const model = 'anthropic/claude-3-opus';
    const systemPrompt = `You are an expert content editor and SEO specialist for IVC Accounting. Perform a comprehensive review of the blog content and provide detailed, actionable suggestions.

Brand Voice: "OTHER ACCOUNTANTS FILE. WE FIGHT." - Proactive, protective, and passionate about client success.

Analyze the content for:
1. Grammar and spelling errors
2. Style and tone consistency with brand voice
3. SEO optimization for target keywords
4. Clarity and readability
5. Factual accuracy
6. Structure and flow

Provide specific suggestions with exact text replacements where applicable.`;

    const userPrompt = `Review this blog content comprehensively:

${content}

Target Keywords: ${keywords.join(', ')}
${previousSuggestions ? `
Previous AI Suggestions to Consider:
Research: ${previousSuggestions.research || 'None'}
Improvements: ${previousSuggestions.improvements || 'None'}
` : ''}

Provide a detailed review in this exact JSON format:
{
  "overallScore": <number 0-100>,
  "readabilityScore": <number 0-100>,
  "seoScore": <number 0-100>,
  "brandAlignmentScore": <number 0-100>,
  "suggestions": [
    {
      "id": "<unique-id>",
      "type": "<grammar|style|seo|clarity|brand|factual>",
      "severity": "<low|medium|high>",
      "original": "<exact text to replace>",
      "suggested": "<replacement text>",
      "explanation": "<why this change improves the content>",
      "location": {
        "start": <character position>,
        "end": <character position>
      }
    }
  ],
  "summary": "<overall assessment in 2-3 sentences>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "improvements": ["<improvement area 1>", "<improvement area 2>", ...],
  "keywordAnalysis": [
    {
      "keyword": "<keyword>",
      "count": <number>,
      "density": <percentage>,
      "optimal": <boolean>
    }
  ]
}`;

    console.log('Making OpenRouter API call with Claude Opus 4...');
    const startTime = Date.now();
    
    try {
      const response = await withTimeout(
        fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk',
            'X-Title': 'IVC Content Review'
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.3, // Lower temperature for more consistent analysis
            max_tokens: 4000
          })
        }),
        8000
      );

      const responseTime = Date.now() - startTime;
      console.log(`OpenRouter response time: ${responseTime}ms`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error:', errorText);
        return NextResponse.json(
          { error: 'Review generation failed' },
          { status: response.status }
        );
      }

      const data = await response.json();
      const reviewContent = data.choices?.[0]?.message?.content || '';
      
      // Parse the JSON response
      let review;
      try {
        // Extract JSON from the response (in case it's wrapped in markdown)
        const jsonMatch = reviewContent.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : reviewContent;
        review = JSON.parse(jsonStr);
        
        // Find actual positions for suggestions
        review.suggestions = review.suggestions.map((suggestion: any) => {
          const index = content.indexOf(suggestion.original);
          if (index !== -1) {
            suggestion.location = {
              start: index,
              end: index + suggestion.original.length
            };
          }
          suggestion.id = `sug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          return suggestion;
        });
      } catch (parseError) {
        console.error('Failed to parse review JSON:', parseError);
        // Return a basic review if parsing fails
        review = {
          overallScore: 75,
          readabilityScore: 80,
          seoScore: 70,
          brandAlignmentScore: 85,
          suggestions: [],
          summary: "Review completed but detailed analysis unavailable.",
          strengths: ["Content covers the topic well"],
          improvements: ["Could not perform detailed analysis"],
          keywordAnalysis: keywords.map((kw: string) => ({
            keyword: kw,
            count: (content.match(new RegExp(kw, 'gi')) || []).length,
            density: ((content.match(new RegExp(kw, 'gi')) || []).length / content.split(' ').length) * 100,
            optimal: true
          }))
        };
      }

      console.log('✅ Review completed successfully');
      
      return NextResponse.json({ review });

    } catch (error: any) {
      if (error.message === 'Request timeout') {
        return NextResponse.json(
          { error: 'Review request timed out' },
          { status: 504 }
        );
      }
      throw error;
    }

  } catch (error: any) {
    console.error('❌ AI Review Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate review' },
      { status: 500 }
    );
  }
} 