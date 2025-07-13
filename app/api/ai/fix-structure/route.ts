import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    
    let improvedContent = content;
    const paragraphs = content.split('\n\n');
    
    // Add headings if missing
    if (!content.includes('#')) {
      improvedContent = paragraphs.map((p: string, i: number) => {
        if (i === 0) return `# Introduction\n\n${p}`;
        if (i % 3 === 0 && i > 0) {
          return `## Section ${Math.floor(i/3)}\n\n${p}`;
        }
        return p;
      }).join('\n\n');
    }
    
    // Break up long paragraphs
    improvedContent = improvedContent.split('\n\n').map((p: string) => {
      const sentences = p.split(/(?<=[.!?])\s+/);
      if (sentences.length > 5) {
        const mid = Math.floor(sentences.length / 2);
        return sentences.slice(0, mid).join(' ') + '\n\n' + sentences.slice(mid).join(' ');
      }
      return p;
    }).join('\n\n');
    
    // Add bullet points for lists
    improvedContent = improvedContent.replace(
      /(\d+\.?\s+[A-Z][^.]+\.\s*)+/g,
      (match: string) => {
        const items = match.split(/\d+\.?\s+/).filter(Boolean);
        return '\n' + items.map(item => `• ${item.trim()}`).join('\n') + '\n';
      }
    );
    
    return NextResponse.json({ improvedContent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fix structure' }, { status: 500 });
  }
} 