import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { blogAIService } from '@/lib/services/blogAIService';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { prompt, type, context } = await request.json();

    // Rate limiting - track usage
    const { count } = await supabase
      .from('ai_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (count && count >= 1000) { // 1000 requests per day limit
      return NextResponse.json({ error: 'Daily limit reached' }, { status: 429 });
    }

    // Generate content based on type
    let result;
    
    switch (type) {
      case 'blog_assistance':
        result = await blogAIService.generateBlogContent(prompt, context, 'section');
        break;
        
      case 'research':
        const research = await blogAIService.researchTrendingTopics();
        result = research.map(r => 
          `**${r.topic}** (${r.relevance}% relevant)\n${r.impact}`
        ).join('\n\n');
        break;
        
      case 'seo':
        const seoData = await blogAIService.generateSEOContent(
          context.content,
          context.title,
          context.tags || []
        );
        result = JSON.stringify(seoData, null, 2);
        break;
        
      case 'social':
        const posts = await blogAIService.generateSocialMediaPosts(
          context.title,
          context.content,
          `https://ivcaccounting.co.uk/blog/${context.slug}`,
          ['linkedin', 'twitter']
        );
        result = posts.map(p => `**${p.platform}**\n${p.content}`).join('\n\n---\n\n');
        break;
        
      default:
        result = await blogAIService.generateBlogContent(prompt, context, 'section');
    }

    // Log usage
    await supabase.from('ai_usage').insert({
      user_id: user.id,
      type,
      tokens_used: result.length / 4, // Rough estimate
      cost: result.length / 4000 * 0.01, // Rough cost estimate
      created_at: new Date().toISOString()
    });

    return NextResponse.json({ content: result });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 