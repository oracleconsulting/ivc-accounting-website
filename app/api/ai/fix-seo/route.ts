import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content, keywords, title } = await req.json();
    
    let improvedContent = content;
    
    // Add keywords if missing from first paragraph
    const firstParagraph = content.split('\n\n')[0];
    const hasKeywordInFirst = keywords.some((k: string) => 
      firstParagraph.toLowerCase().includes(k.toLowerCase())
    );
    
    if (!hasKeywordInFirst && keywords.length > 0) {
      improvedContent = `${keywords[0]} is an important consideration for businesses. ${content}`;
    }
    
    // Add meta description suggestion
    if (!content.includes('meta description')) {
      const metaDesc = `\n\n**Suggested Meta Description:** ${title} - Learn about ${keywords.join(', ')} and how to optimize your business strategy.`;
      improvedContent += metaDesc;
    }
    
    // Add internal linking suggestions
    if (!content.includes('[') && !content.includes('](')) {
      improvedContent += '\n\n**Internal Linking Opportunities:**\n- Link to related service pages\n- Connect to case studies\n- Reference other blog posts';
    }
    
    return NextResponse.json({ improvedContent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fix SEO' }, { status: 500 });
  }
} 