import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Check database connection
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, slug, status')
      .limit(5);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check if specific post exists
    const { data: specificPost, error: specificError } = await supabase
      .from('posts')
      .select('id, title, slug')
      .eq('id', 'dc419873-2ec9-41f0-9041-1c17a536aa22')
      .single();
    
    return NextResponse.json({
      connected: true,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      authenticated: !!user,
      userEmail: user?.email,
      postsCount: posts?.length || 0,
      posts: posts || [],
      specificPost: specificPost || null,
      postsError: postsError?.message,
      specificError: specificError?.message
    });
  } catch (error) {
    return NextResponse.json({ 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 