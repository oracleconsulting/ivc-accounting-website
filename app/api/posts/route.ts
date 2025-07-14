import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Fetch posts from Supabase
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // If no posts, return empty array
    return NextResponse.json({ posts: posts || [] });
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    // Return mock data for now if database fails
    const mockPosts = [
      {
        id: '1',
        title: 'Welcome to IVC Accounting Blog',
        slug: 'welcome-to-ivc-accounting-blog',
        content: 'Blog content here...',
        status: 'published',
        created_at: new Date('2025-01-10').toISOString(),
      },
      {
        id: '2',
        title: 'The Changing Face of UK Accounting',
        slug: 'the-changing-face-of-uk-accounting',
        content: 'Blog content here...',
        status: 'draft',
        created_at: new Date('2025-01-12').toISOString(),
      }
    ];

    return NextResponse.json({ posts: mockPosts });
  }
}

// CREATE new post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Add your database creation logic here
    const newPost = {
      id: Date.now().toString(),
      ...body,
      created_at: new Date().toISOString(),
      status: 'draft'
    };

    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
} 