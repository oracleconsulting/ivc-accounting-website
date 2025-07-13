import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    
    let improvedContent = content;
    
    // Add engaging opening if bland
    const firstSentence = content.split('.')[0];
    if (firstSentence.length < 50 && !firstSentence.includes('?')) {
      improvedContent = `Have you ever wondered how much your business could save on taxes? ${content}`;
    }
    
    // Add questions throughout
    const paragraphs = improvedContent.split('\n\n');
    const improvedParagraphs = paragraphs.map((p: string, i: number) => {
      if (i > 0 && i % 3 === 0 && !p.includes('?')) {
        return p + ' What does this mean for your business?';
      }
      return p;
    });
    improvedContent = improvedParagraphs.join('\n\n');
    
    // Add call-to-action if missing
    const ctaKeywords = ['contact', 'get started', 'learn more', 'book', 'schedule'];
    const hasCTA = ctaKeywords.some(keyword => content.toLowerCase().includes(keyword));
    
    if (!hasCTA) {
      improvedContent += `\n\n## Take Action Today\n\nDon't miss out on potential savings. Contact our expert team to discuss how these strategies can benefit your specific situation. Book a free consultation to get started.`;
    }
    
    // Add statistics or data points
    if (!content.match(/\d+%/) && !content.match(/£\d+/)) {
      improvedContent = improvedContent.replace(
        'tax savings',
        'tax savings (typically 15-30% for most businesses)'
      );
    }
    
    return NextResponse.json({ improvedContent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fix engagement' }, { status: 500 });
  }
} 