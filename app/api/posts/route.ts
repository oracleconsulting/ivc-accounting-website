import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ posts: posts || [] });
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    // Return mock data as fallback
    const mockPosts = [
      {
        id: '1',
        title: 'Welcome to IVC Accounting Blog',
        slug: 'welcome-to-ivc-accounting-blog',
        content: 'Blog content here...',
        status: 'published',
        created_at: new Date('2025-01-10').toISOString(),
      }
    ];
    
    return NextResponse.json({ posts: mockPosts });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { data: post, error } = await supabase
      .from('posts')
      .insert([{
        title: body.title,
        content: body.content,
        status: body.status || 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 