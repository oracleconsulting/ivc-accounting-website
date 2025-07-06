import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Get scheduled posts from database
    const { data: posts, error } = await supabase
      .from('social_scheduled_posts')
      .select('*')
      .order('scheduled_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching scheduled posts:', error);
      return NextResponse.json({ error: 'Failed to fetch scheduled posts' }, { status: 500 });
    }
    
    return NextResponse.json(posts || []);
  } catch (error) {
    console.error('Error in scheduled posts API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      content, 
      platforms, 
      scheduled_at, 
      images, 
      hashtags,
      status = 'scheduled'
    } = body;
    
    // Create new scheduled post
    const { data, error } = await supabase
      .from('social_scheduled_posts')
      .insert({
        content,
        platforms: JSON.stringify(platforms),
        scheduled_at,
        images: JSON.stringify(images || []),
        hashtags: JSON.stringify(hashtags || []),
        status,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating scheduled post:', error);
      return NextResponse.json({ error: 'Failed to create scheduled post' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in scheduled post creation API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 