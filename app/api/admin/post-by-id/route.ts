import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    console.log('GET /api/admin/post-by-id called with id:', id);
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });
    
    // Check authentication
    console.log('Checking authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Auth result:', { 
      user: user?.email, 
      userId: user?.id,
      authError: authError?.message, 
      hasUser: !!user,
      cookies: cookieStore.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
    });
    
    if (authError || !user) {
      console.log('Auth failed:', authError?.message || 'No user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Auth successful, fetching post:', id);

    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!author_id(id, full_name, avatar_url),
        categories:post_categories(category:categories(*)),
        tags:post_tags(tag:tags(*))
      `)
      .eq('id', id)
      .single();

    console.log('Supabase query result:', { post: !!post, error, id });

    if (error || !post) {
      console.log('Post not found or error:', error);
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in GET /api/admin/post-by-id:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    console.log('PUT /api/admin/post-by-id called with id:', id);
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Check if post exists
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('id, author_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Extract categories and tags from body
    const { category_ids, tag_ids, ...postData } = body;

    // Update post
    const { data: post, error: updateError } = await supabase
      .from('posts')
      .update({
        ...postData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating post:', updateError);
      return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }

    // Update categories (delete existing and insert new)
    await supabase
      .from('post_categories')
      .delete()
      .eq('post_id', id);

    if (category_ids && category_ids.length > 0) {
      const categoryRelations = category_ids.map((categoryId: string) => ({
        post_id: id,
        category_id: categoryId
      }));

      await supabase
        .from('post_categories')
        .insert(categoryRelations);
    }

    // Update tags (delete existing and insert new)
    await supabase
      .from('post_tags')
      .delete()
      .eq('post_id', id);

    if (tag_ids && tag_ids.length > 0) {
      const tagRelations = tag_ids.map((tagId: string) => ({
        post_id: id,
        tag_id: tagId
      }));

      await supabase
        .from('post_tags')
        .insert(tagRelations);
    }

    // Fetch complete updated post
    const { data: completePost } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!author_id(id, full_name, avatar_url),
        categories:post_categories(category:categories(*)),
        tags:post_tags(tag:tags(*))
      `)
      .eq('id', id)
      .single();

    return NextResponse.json(completePost);
  } catch (error) {
    console.error('Error in PUT /api/admin/post-by-id:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    console.log('DELETE /api/admin/post-by-id called with id:', id);
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if post exists
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('id, featured_image')
      .eq('id', id)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete featured image from storage if exists
    if (existingPost.featured_image) {
      try {
        const imagePath = existingPost.featured_image.split('/').pop();
        await supabase.storage
          .from('blog-images')
          .remove([`blog-images/${imagePath}`]);
      } catch (error) {
        console.error('Error deleting featured image:', error);
      }
    }

    // Delete post (cascades to categories and tags)
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting post:', deleteError);
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/post-by-id:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 