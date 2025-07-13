import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { blogTitle, blogContent, platforms, businessInfo } = await req.json();
    
    const posts = [];
    
    if (platforms.includes('linkedin')) {
      posts.push({
        platform: 'linkedin',
        content: `🎯 ${blogTitle}\n\n` +
          `${blogContent.substring(0, 200)}...\n\n` +
          `Key insights:\n` +
          `✅ Save money legally and ethically\n` +
          `✅ Understand your obligations\n` +
          `✅ Plan strategically for growth\n\n` +
          `Read the full article and transform your approach to business finances.\n\n` +
          `#AccountingTips #SmallBusinessUK #TaxPlanning #BusinessGrowth #UKBusiness`,
        hashtags: ['AccountingTips', 'SmallBusinessUK', 'TaxPlanning', 'BusinessGrowth'],
        mediaType: 'article',
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
      });
    }
    
    if (platforms.includes('twitter')) {
      posts.push({
        platform: 'twitter',
        content: `${blogTitle} 🧵\n\n` +
          `1/ ${blogContent.substring(0, 250)}...\n\n` +
          `Want to know more? Here's what we cover: ⬇️`,
        hashtags: ['UKTax', 'SmallBiz', 'Accounting'],
        mediaType: 'thread'
      });
    }
    
    if (platforms.includes('instagram')) {
      posts.push({
        platform: 'instagram',
        content: `💡 ${blogTitle}\n\n` +
          `Swipe for game-changing insights that could save your business thousands! ➡️\n\n` +
          `We break down complex tax strategies into simple, actionable steps.\n\n` +
          `Save this post for your next planning session! 📌\n\n` +
          `#TaxTips #BusinessStrategy #AccountingAdvice #UKSmallBusiness #EntrepreneurLife #TaxPlanning`,
        hashtags: ['TaxTips', 'BusinessStrategy', 'AccountingAdvice', 'UKSmallBusiness'],
        mediaType: 'carousel'
      });
    }
    
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: 'Social media generation failed' }, { status: 500 });
  }
} 