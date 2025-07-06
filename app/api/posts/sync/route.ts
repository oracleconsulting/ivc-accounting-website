import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Add error handling for missing env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables for posts sync');
}

// Create client only if we have the required keys
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// GET - Fetch posts for offline storage
export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const lastSync = searchParams.get('lastSync');
    
    let query = supabase
      .from('posts')
      .select(`
        *,
        post_categories(categories(name, slug)),
        post_tags(tags(name, slug))
      `)
      .order('updated_at', { ascending: false });
    
    // If lastSync provided, only get posts updated since then
    if (lastSync) {
      query = query.gt('updated_at', lastSync);
    }
    
    const { data: posts, error } = await query;
    
    if (error) {
      console.error('Error fetching posts for sync:', error);
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
    
    return NextResponse.json({
      posts: posts || [],
      lastSync: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in posts sync GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Sync offline changes back to server
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    const { posts, deletedPosts } = await request.json();
    
    const results = {
      created: 0,
      updated: 0,
      deleted: 0,
      errors: [] as string[]
    };
    
    // Handle new/updated posts
    if (posts && Array.isArray(posts)) {
      for (const post of posts) {
        try {
          if (post.id.startsWith('offline_')) {
            // New post created offline
            const { id, ...postData } = post;
            const { error } = await supabase
              .from('posts')
              .insert(postData);
            
            if (error) {
              results.errors.push(`Failed to create post: ${error.message}`);
            } else {
              results.created++;
            }
          } else {
            // Existing post updated offline
            const { error } = await supabase
              .from('posts')
              .update({
                title: post.title,
                content: post.content,
                content_text: post.content_text,
                content_html: post.content_html,
                excerpt: post.excerpt,
                status: post.status,
                seo_title: post.seo_title,
                seo_description: post.seo_description,
                seo_keywords: post.seo_keywords,
                updated_at: new Date().toISOString()
              })
              .eq('id', post.id);
            
            if (error) {
              results.errors.push(`Failed to update post ${post.id}: ${error.message}`);
            } else {
              results.updated++;
            }
          }
        } catch (error) {
          results.errors.push(`Error processing post: ${error}`);
        }
      }
    }
    
    // Handle deleted posts
    if (deletedPosts && Array.isArray(deletedPosts)) {
      for (const postId of deletedPosts) {
        try {
          const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);
          
          if (error) {
            results.errors.push(`Failed to delete post ${postId}: ${error.message}`);
          } else {
            results.deleted++;
          }
        } catch (error) {
          results.errors.push(`Error deleting post ${postId}: ${error}`);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in posts sync POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 