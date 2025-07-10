import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ 
    cookies: () => cookieStore 
  });
  
  try {
    // Test basic query
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', params.slug)
      .single();
    
    // Test with relations
    const { data: postWithRelations, error: relError } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!author_id(full_name, avatar_url),
        categories:post_categories(category:categories(*)),
        tags:post_tags(tag:tags(*))
      `)
      .eq('slug', params.slug)
      .single();
    
    return NextResponse.json({
      slug: params.slug,
      basicQuery: {
        success: !error,
        data: post,
        error: error?.message
      },
      withRelations: {
        success: !relError,
        data: postWithRelations,
        error: relError?.message
      }
    });
  } catch (e: any) {
    return NextResponse.json({ 
      error: 'Exception', 
      message: e.message 
    });
  }
} 