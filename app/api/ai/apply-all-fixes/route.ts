import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content, keywords, title } = await req.json();
    
    // Apply all fixes in sequence
    let improvedContent = content;
    
    // SEO fixes
    const firstParagraph = content.split('\n\n')[0];
    const hasKeywordInFirst = keywords.some((k: string) => 
      firstParagraph.toLowerCase().includes(k.toLowerCase())
    );
    
    if (!hasKeywordInFirst && keywords.length > 0) {
      improvedContent = `When it comes to ${keywords[0]}, many businesses miss crucial opportunities. ${improvedContent}`;
    }
    
    // Structure fixes
    if (!improvedContent.includes('#')) {
      const paragraphs = improvedContent.split('\n\n');
      improvedContent = `# ${title || 'Key Insights for Your Business'}\n\n` + 
        paragraphs.map((p: string, i: number) => {
          if (i > 0 && i % 3 === 0) {
            const sectionTitles = ['Key Considerations', 'Important Details', 'What You Need to Know', 'Best Practices'];
            return `## ${sectionTitles[Math.floor(i/3) % sectionTitles.length]}\n\n${p}`;
          }
          return p;
        }).join('\n\n');
    }
    
    // Engagement fixes
    if (!improvedContent.includes('?')) {
      improvedContent = improvedContent.replace(
        /\./,
        '? Let\'s explore the answer.'
      );
    }
    
    // Add CTA
    if (!improvedContent.toLowerCase().includes('contact')) {
      improvedContent += `\n\n## Ready to Take the Next Step?\n\nOur team of experts is here to help you implement these strategies effectively. Contact us today for a personalized consultation and discover how we can help optimize your business finances.`;
    }
    
    // Technical fixes
    const corrections = {
      'teh': 'the',
      'recieve': 'receive',
      'occured': 'occurred'
    };
    
    Object.entries(corrections).forEach(([wrong, right]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      improvedContent = improvedContent.replace(regex, right);
    });
    
    return NextResponse.json({ improvedContent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to apply fixes' }, { status: 500 });
  }
} 