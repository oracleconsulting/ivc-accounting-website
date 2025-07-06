import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET /api/admin/posts - List all posts with filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:profiles!author_id(id, full_name, avatar_url),
        categories:post_categories(category:categories(*)),
        tags:post_tags(tag:tags(*))
      `, { count: 'exact' });

    // Apply filters
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content_text.ilike.%${search}%`);
    }

    if (category) {
      // Get post IDs for the category
      const { data: categoryPosts } = await supabase
        .from('post_categories')
        .select('post_id')
        .eq('category_id', category);
      
      if (categoryPosts && categoryPosts.length > 0) {
        const postIds = categoryPosts.map(cp => cp.post_id);
        query = query.in('id', postIds);
      } else {
        // No posts in this category, return empty result
        return NextResponse.json({
          posts: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
          stats: { total: 0, published: 0, draft: 0, scheduled: 0 }
        });
      }
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: posts, error, count } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }

    // Get statistics
    const { data: stats } = await supabase
      .from('posts')
      .select('status')
      .then(result => {
        const data = result.data || [];
        return {
          data: {
            total: data.length,
            published: data.filter(p => p.status === 'published').length,
            draft: data.filter(p => p.status === 'draft').length,
            scheduled: data.filter(p => p.status === 'scheduled').length
          }
        };
      });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      stats
    });
  } catch (error) {
    console.error('Error in GET /api/admin/posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if slug already exists
    const { data: existingPost } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', body.slug)
      .single();

    if (existingPost) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Extract categories and tags from body
    const { category_ids, tag_ids, ...postData } = body;

    // Create post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        ...postData,
        author_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (postError) {
      console.error('Error creating post:', postError);
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }

    // Add categories
    if (category_ids && category_ids.length > 0) {
      const categoryRelations = category_ids.map((categoryId: string) => ({
        post_id: post.id,
        category_id: categoryId
      }));

      await supabase
        .from('post_categories')
        .insert(categoryRelations);
    }

    // Add tags
    if (tag_ids && tag_ids.length > 0) {
      const tagRelations = tag_ids.map((tagId: string) => ({
        post_id: post.id,
        tag_id: tagId
      }));

      await supabase
        .from('post_tags')
        .insert(tagRelations);
    }

    // Fetch complete post with relations
    const { data: completePost } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!author_id(id, full_name, avatar_url),
        categories:post_categories(category:categories(*)),
        tags:post_tags(tag:tags(*))
      `)
      .eq('id', post.id)
      .single();

    return NextResponse.json({ post: completePost }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 