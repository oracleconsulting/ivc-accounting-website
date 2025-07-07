import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const postId = searchParams.get('id');
  
  if (!postId) {
    return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Check if post exists
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, title, slug, status, created_at, updated_at')
      .eq('id', postId)
      .single();
    
    // Check total posts count
    const { count: totalPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      postId,
      authenticated: !!user,
      userEmail: user?.email,
      postExists: !!post,
      post: post || null,
      postError: postError?.message,
      totalPostsInDatabase: totalPosts || 0,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      postId,
      timestamp: new Date().toISOString()
    });
  }
} 