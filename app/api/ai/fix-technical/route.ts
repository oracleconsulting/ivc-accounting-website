import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    
    let improvedContent = content;
    
    // Fix common misspellings
    const corrections = {
      'teh': 'the',
      'recieve': 'receive',
      'occured': 'occurred',
      'seperate': 'separate',
      'definately': 'definitely',
      'accomodation': 'accommodation',
      'occassion': 'occasion',
      'neccessary': 'necessary'
    };
    
    Object.entries(corrections).forEach(([wrong, right]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      improvedContent = improvedContent.replace(regex, right);
    });
    
    // Convert passive to active voice (simple examples)
    improvedContent = improvedContent
      .replace(/was (\w+ed) by/g, 'actively $1')
      .replace(/were (\w+ed) by/g, 'actively $1')
      .replace(/has been (\w+ed)/g, 'has $1')
      .replace(/have been (\w+ed)/g, 'have $1');
    
    // Improve sentence variety
    const sentences = improvedContent.split(/(?<=[.!?])\s+/);
    const improvedSentences = sentences.map((sentence: string, i: number) => {
      // Add transition words periodically
      if (i > 0 && i % 4 === 0 && !sentence.match(/^(However|Moreover|Furthermore|Additionally|Therefore)/)) {
        const transitions = ['Moreover', 'Furthermore', 'Additionally', 'In addition'];
        const transition = transitions[Math.floor(Math.random() * transitions.length)];
        return `${transition}, ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`;
      }
      return sentence;
    });
    
    improvedContent = improvedSentences.join(' ');
    
    return NextResponse.json({ improvedContent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fix technical issues' }, { status: 500 });
  }
} 