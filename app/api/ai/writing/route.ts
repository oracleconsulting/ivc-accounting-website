import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { currentContent, prompt, tone, style, seoOptimization, targetKeywords } = await req.json();
    
    // Simple content generation based on prompt
    let generatedContent = currentContent || '';
    
    if (prompt.toLowerCase().includes('introduction')) {
      generatedContent = `# ${targetKeywords[0] || 'Tax Planning'}: Your Complete Guide\n\n` +
        `In today's complex business environment, understanding ${targetKeywords[0] || 'tax planning'} isn't just advisable—it's essential. ` +
        `Whether you're a startup founder or an established business owner, the strategies we'll explore could save you thousands in unnecessary tax payments.\n\n` +
        `## Why This Matters Now\n\n` +
        `Recent changes in UK tax legislation have created both challenges and opportunities. ` +
        `Smart businesses are already adapting their strategies to maximize benefits while ensuring full compliance.\n\n` +
        generatedContent;
    } else if (prompt.toLowerCase().includes('conclusion')) {
      generatedContent += `\n\n## Conclusion: Your Path Forward\n\n` +
        `We've covered the essential strategies for ${targetKeywords[0] || 'optimizing your tax position'}. ` +
        `The key is not just understanding these concepts but implementing them strategically throughout your fiscal year.\n\n` +
        `### Key Takeaways:\n` +
        `• Start planning early - don't wait until year-end\n` +
        `• Document everything meticulously\n` +
        `• Seek professional advice for complex situations\n` +
        `• Stay informed about legislative changes\n\n` +
        `### Ready to Optimize Your Tax Strategy?\n\n` +
        `Don't navigate these complexities alone. Our team of experienced accountants can help you implement these strategies effectively. ` +
        `Contact us today for a free consultation and discover how much you could be saving.`;
    } else if (prompt.toLowerCase().includes('statistics') || prompt.toLowerCase().includes('data')) {
      const stats = `\n\n### By the Numbers:\n` +
        `• **67%** of SMEs miss out on available tax reliefs\n` +
        `• **£2.4 billion** in R&D tax credits claimed in 2023\n` +
        `• **89%** of businesses save money with proper tax planning\n` +
        `• **£5,500** average annual saving per small business\n\n`;
      
      generatedContent = generatedContent.replace(/\n\n/, stats);
    }
    
    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    return NextResponse.json({ error: 'Writing generation failed' }, { status: 500 });
  }
} 