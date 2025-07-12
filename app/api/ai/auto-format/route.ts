import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    // Basic formatting improvements
    let enhanced = content;
    
    // Add proper heading hierarchy
    enhanced = enhanced.replace(/^([A-Z][^.\n]{10,50})$/gm, '## $1');
    
    // Convert long paragraphs to bullet points
    const paragraphs = enhanced.split('\n\n');
    enhanced = paragraphs.map((para: string) => {
      if (para.length > 300 && para.includes(',')) {
        const items = para.split(/[,;]/).filter((item: string) => item.trim().length > 20);
        if (items.length >= 3) {
          return items.map((item: string) => `- ${item.trim()}`).join('\n');
        }
      }
      return para;
    }).join('\n\n');
    
    // Add emphasis to key phrases
    const keyPhrases = ['important', 'note', 'remember', 'key point', 'deadline'];
    keyPhrases.forEach(phrase => {
      const regex = new RegExp(`(${phrase}:?)\\s+([^.]+\.)`, 'gi');
      enhanced = enhanced.replace(regex, '**$1** $2');
    });
    
    return NextResponse.json({ enhanced });
    
  } catch (error) {
    console.error('Auto-format error:', error);
    return NextResponse.json({ enhanced: request.body }, { status: 500 });
  }
} 