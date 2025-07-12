// /app/api/campaign/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { campaignService } from '@/lib/services/campaignService';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      topic, 
      description, 
      keywords, 
      targetAudience,
      goals,
      tone,
      blogLength,
      includeData,
      includeCaseStudy,
      mode = 'complete',
      aiMode = 'excellence'
    } = body;

    // First, generate the blog post
    const blogResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/writing`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      },
      body: JSON.stringify({
        topic,
        description,
        keywords,
        targetAudience,
        tone,
        length: blogLength,
        includeData,
        includeCaseStudy,
        mode: aiMode
      })
    });

    if (!blogResponse.ok) {
      throw new Error('Failed to generate blog post');
    }

    const blogData = await blogResponse.json();
    
    // Save the blog post
    const { data: savedBlog } = await supabase
      .from('posts')
      .insert({
        title: blogData.title,
        content: blogData.content,
        excerpt: blogData.excerpt,
        slug: blogData.slug,
        keywords: keywords,
        meta_description: blogData.metaDescription,
        status: 'draft',
        author_id: 'default-user-id', // Use default for now
        score: blogData.score || 85
      })
      .select()
      .single();

    if (!savedBlog) {
      throw new Error('Failed to save blog post');
    }

    // Create the campaign with all components
    const campaign = await campaignService.createFromBlog({
      blogId: savedBlog.id,
      blogTitle: savedBlog.title,
      blogContent: savedBlog.content,
      keywords: keywords,
      userId: 'default-user-id' // Use default for now
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}