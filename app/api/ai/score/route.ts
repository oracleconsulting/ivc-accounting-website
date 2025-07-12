import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content, keywords } = await request.json();
    
    // Calculate various scores
    const wordCount = content.split(/\s+/).length;
    const sentenceCount = content.split(/[.!?]+/).filter(Boolean).length;
    const avgWordsPerSentence = wordCount / sentenceCount;
    
    // Readability score (simplified Flesch Reading Ease)
    const readabilityScore = Math.min(100, Math.max(0, 
      206.835 - 1.015 * avgWordsPerSentence - 84.6 * (content.length / wordCount)
    ));
    
    // SEO score based on keyword usage
    let seoScore = 50;
    keywords.forEach((keyword: string) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex) || [];
      const density = (matches.length / wordCount) * 100;
      
      // Optimal keyword density is 1-2%
      if (density >= 0.5 && density <= 2.5) {
        seoScore += 10;
      } else if (density > 2.5) {
        seoScore -= 5; // Over-optimization penalty
      }
    });
    
    // Content structure score
    const hasHeadings = /^#{1,6}\s/m.test(content);
    const hasList = /^[\*\-\+]\s/m.test(content) || /^\d+\.\s/m.test(content);
    const structureScore = (hasHeadings ? 50 : 0) + (hasList ? 30 : 0) + (wordCount > 300 ? 20 : 0);
    
    // Overall score
    const overallScore = Math.round(
      (readabilityScore * 0.3) + 
      (Math.min(100, seoScore) * 0.4) + 
      (structureScore * 0.3)
    );
    
    return NextResponse.json({ 
      score: overallScore,
      details: {
        readability: Math.round(readabilityScore),
        seo: Math.min(100, seoScore),
        structure: structureScore,
        wordCount
      }
    });
  } catch (error) {
    console.error('Content scoring error:', error);
    return NextResponse.json({ score: 0 }, { status: 500 });
  }
} 