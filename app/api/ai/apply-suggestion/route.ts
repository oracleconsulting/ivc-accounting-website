import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content, suggestion } = await req.json();
    
    let improvedContent = content;
    
    switch (suggestion.type) {
      case 'hook':
        // Improve opening
        const firstParagraph = content.split('\n\n')[0];
        if (firstParagraph.length < 100) {
          improvedContent = `Did you know that 73% of small businesses overpay on their taxes? In this guide, we'll reveal the strategies that could save your business thousands.\n\n${content}`;
        }
        break;
        
      case 'keywords':
        // Add keywords naturally
        if (suggestion.suggestion.includes('first paragraph')) {
          const keyword = suggestion.suggestion.match(/"([^"]+)"/)?.[1];
          if (keyword && !content.toLowerCase().includes(keyword.toLowerCase())) {
            improvedContent = content.replace(
              /^(.+?\.)/, 
              `$1 Understanding ${keyword} is crucial for business success.`
            );
          }
        }
        break;
        
      case 'cta':
        // Add call-to-action
        improvedContent += `\n\n## What's Your Next Move?\n\nYou've learned the strategies - now it's time to implement them. Schedule a free consultation with our expert team and start saving on your taxes today.\n\n**[Book Your Free Consultation →](#)**`;
        break;
    }
    
    return NextResponse.json({ improvedContent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to apply suggestion' }, { status: 500 });
  }
} 