import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content, keywords } = await req.json();
    
    // Calculate various scores
    const wordCount = content.split(/\s+/).filter((w: string) => w.length > 0).length;
    const sentenceCount = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 0).length;
    const avgWordsPerSentence = wordCount / sentenceCount;
    
    // Basic scoring logic
    let score = 100;
    
    // Length scoring
    if (wordCount < 300) score -= 30;
    else if (wordCount < 600) score -= 15;
    else if (wordCount < 800) score -= 5;
    
    // Keyword density
    const keywordDensity = keywords.reduce((acc: number, keyword: string) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex);
      return acc + (matches ? matches.length : 0);
    }, 0) / wordCount * 100;
    
    if (keywordDensity < 1) score -= 10;
    if (keywordDensity > 5) score -= 5;
    
    // Readability
    if (avgWordsPerSentence > 25) score -= 10;
    if (avgWordsPerSentence < 10) score -= 5;
    
    // Check for headings
    const hasHeadings = content.includes('#');
    if (!hasHeadings) score -= 10;
    
    // Check for questions
    const questionCount = (content.match(/\?/g) || []).length;
    if (questionCount < 1) score -= 5;
    
    score = Math.max(0, Math.min(100, score));
    
    return NextResponse.json({ 
      score,
      details: {
        wordCount,
        readability: Math.round(100 - avgWordsPerSentence * 2),
        keywordDensity: Math.round(keywordDensity * 100) / 100,
        structure: hasHeadings ? 'good' : 'needs improvement'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze content' }, { status: 500 });
  }
} 