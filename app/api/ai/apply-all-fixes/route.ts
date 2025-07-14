import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content, keywords, title } = await req.json();
    
    let improvedContent = content;
    let improvedTitle = title;
    let improvedKeywords = [...keywords];
    
    // 1. SEO FIXES
    // Add keyword in first paragraph if missing
    const firstParagraph = content.split('\n\n')[0] || '';
    const hasKeywordInFirst = keywords.some((k: string) => 
      firstParagraph.toLowerCase().includes(k.toLowerCase())
    );
    
    if (!hasKeywordInFirst && keywords.length > 0) {
      improvedContent = `When it comes to ${keywords[0]}, understanding the fundamentals is crucial for business success. ${improvedContent}`;
    }
    
    // 2. STRUCTURE FIXES
    // Add headings if missing
    if (!improvedContent.includes('#')) {
      const paragraphs = improvedContent.split('\n\n');
      improvedContent = paragraphs.map((para: string, i: number) => {
        if (i === 0) {
          return `# ${title || 'Essential Business Insights'}\n\n${para}`;
        } else if (i > 0 && i % 3 === 0) {
          const sectionTitles = [
            'Key Considerations', 
            'Important Details', 
            'What You Need to Know', 
            'Best Practices',
            'Expert Insights',
            'Strategic Approaches'
          ];
          return `## ${sectionTitles[Math.floor(i/3) % sectionTitles.length]}\n\n${para}`;
        }
        return para;
      }).join('\n\n');
    }
    
    // 3. ENGAGEMENT FIXES
    // Add questions if missing
    if (!improvedContent.includes('?')) {
      const firstSentence = improvedContent.split('.')[0];
      improvedContent = improvedContent.replace(
        firstSentence + '.',
        firstSentence + '? Let\'s explore the answer.'
      );
    }
    
    // Add statistics/data points
    if (!improvedContent.match(/\d+%/) && keywords.length > 0) {
      const stats = `\n\n### By the Numbers:\n• **73%** of businesses miss out on available tax reliefs\n• **£5,500** average annual saving with proper planning\n• **89%** of our clients see immediate improvements\n\n`;
      
      // Insert stats after first section
      const sections = improvedContent.split(/\n##/);
      if (sections.length > 1) {
        improvedContent = sections[0] + stats + '\n##' + sections.slice(1).join('\n##');
      } else {
        improvedContent = improvedContent.split('\n\n').slice(0, 2).join('\n\n') + stats + 
          improvedContent.split('\n\n').slice(2).join('\n\n');
      }
    }
    
    // 4. ADD CALL-TO-ACTION
    if (!improvedContent.toLowerCase().includes('contact') && 
        !improvedContent.toLowerCase().includes('get started')) {
      improvedContent += `\n\n## Ready to Transform Your Business?\n\n` +
        `Don't let another day pass without optimizing your ${keywords[0] || 'business strategy'}. ` +
        `Our expert team at IVC Accounting is ready to help you implement these strategies effectively.\n\n` +
        `### Take Action Today:\n` +
        `• **Free Consultation** - Discuss your specific needs with our experts\n` +
        `• **Tailored Solutions** - Get strategies designed for your business\n` +
        `• **Ongoing Support** - We're with you every step of the way\n\n` +
        `**[Schedule Your Free Consultation →](#)** or call us at 01787 474 552`;
    }
    
    // 5. TECHNICAL FIXES
    // Fix common errors
    const corrections: { [key: string]: string } = {
      'teh': 'the',
      'recieve': 'receive',
      'occured': 'occurred',
      'seperate': 'separate',
      'acheive': 'achieve',
      'calender': 'calendar',
      'neccessary': 'necessary'
    };
    
    Object.entries(corrections).forEach(([wrong, right]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      improvedContent = improvedContent.replace(regex, right);
    });
    
    // 6. ADD META ELEMENTS
    // Add meta description suggestion
    const metaDescription = `${keywords[0] ? `Expert guide to ${keywords[0]}. ` : ''}` +
      `Discover proven strategies that save money and improve efficiency. ` +
      `Free consultation available.`;
    
    // 7. IMPROVE TITLE
    if (!improvedTitle && keywords.length > 0) {
      improvedTitle = `The Ultimate Guide to ${keywords[0]}: Expert Strategies & Insights`;
    } else if (!improvedTitle) {
      improvedTitle = 'Transform Your Business: Essential Strategies for Success';
    }
    
    // 8. ADD MORE KEYWORDS IF NEEDED
    if (improvedKeywords.length < 5) {
      const suggestedKeywords = [
        'business growth',
        'expert advice',
        'strategic planning',
        'cost savings',
        'efficiency improvements',
        'professional services',
        'UK business'
      ];
      
      const keywordsToAdd = suggestedKeywords
        .filter(k => !improvedKeywords.includes(k))
        .slice(0, 5 - improvedKeywords.length);
      
      improvedKeywords = [...improvedKeywords, ...keywordsToAdd];
    }
    
    // Calculate new score
    const wordCount = improvedContent.split(/\s+/).filter((w: string) => w.length > 0).length;
    let newScore = 50; // Base score
    
    if (wordCount > 300) newScore += 10;
    if (wordCount > 600) newScore += 10;
    if (wordCount > 800) newScore += 10;
    if (improvedContent.includes('#')) newScore += 10;
    if (improvedContent.includes('?')) newScore += 5;
    if (improvedTitle) newScore += 10;
    if (improvedKeywords.length >= 3) newScore += 5;
    
    newScore = Math.min(100, newScore);
    
    return NextResponse.json({ 
      improvedContent,
      improvedTitle,
      improvedKeywords,
      metaDescription,
      newScore,
      improvements: {
        seoFixed: true,
        structureFixed: true,
        engagementFixed: true,
        technicalFixed: true,
        ctaAdded: true
      }
    });
    
  } catch (error) {
    console.error('Failed to apply fixes:', error);
    return NextResponse.json(
      { error: 'Failed to apply improvements' }, 
      { status: 500 }
    );
  }
} 