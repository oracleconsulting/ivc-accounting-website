import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, keywords, seriesLength, seriesStructure, guidelines } = body;

    // Call OpenRouter API with Claude Opus for best quality
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://ivcaccounting.com',
        'X-Title': 'IVC LinkedIn Series Generator',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus',
        messages: [
          {
            role: 'system',
            content: `You are an expert LinkedIn content strategist for IVC Accounting, a premium accounting firm.
            Create a ${seriesLength}-part LinkedIn series that builds a compelling narrative arc.
            
            Series Structure:
            ${Object.entries(seriesStructure).map(([post, desc]) => `${post}: ${desc}`).join('\n')}
            
            Guidelines:
            ${guidelines.join('\n')}
            
            For each post, provide:
            1. Compelling content (1200-1300 characters)
            2. 5-7 relevant hashtags
            3. A media suggestion (image type or infographic idea)
            4. Engagement hook (question or thought-provoker)
            
            Ensure each post connects to the next while being valuable standalone.`
          },
          {
            role: 'user',
            content: `Create a ${seriesLength}-part LinkedIn series about: "${title}"
            
            Base content to work from:
            ${content}
            
            Keywords to incorporate: ${keywords.join(', ')}
            
            Format the response as JSON with this structure:
            {
              "theme": "Overall series theme",
              "hook": "Series opening hook",
              "posts": [
                {
                  "content": "Post content",
                  "hashtags": ["hashtag1", "hashtag2"],
                  "media_suggestions": "Description of visual content",
                  "engagement_hook": "Question or thought-provoker"
                }
              ]
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate LinkedIn series');
    }

    const data = await response.json();
    const generatedContent = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error('LinkedIn series generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate LinkedIn series' },
      { status: 500 }
    );
  }
}