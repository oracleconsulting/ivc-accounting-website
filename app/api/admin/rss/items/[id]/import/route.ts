// RSS Item Import API endpoint
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Validation schema for import
const importSchema = z.object({
  category_id: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).optional().default('draft')
});

// Helper to check if user is admin
async function isAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  // Check if user is in admin_users table
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', user.email)
    .single();
    
  return !!adminUser;
}

// Helper to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Helper to check if slug exists
async function isSlugUnique(supabase: any, slug: string) {
  const { data } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', slug)
    .single();
    
  return !data;
}

// POST /api/admin/rss/items/[id]/import
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check admin authentication
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const itemId = params.id;
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = importSchema.parse(body);
    
    // Get RSS item
    const { data: rssItem, error: itemError } = await supabase
      .from('rss_items')
      .select('*')
      .eq('id', itemId)
      .single();
    
    if (itemError) throw itemError;
    
    if (!rssItem || rssItem.is_imported) {
      return NextResponse.json(
        { error: 'RSS item not found or already imported' },
        { status: 400 }
      );
    }
    
    // Create post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        title: rssItem.title,
        content: rssItem.description,
        status: validatedData.status,
        published_at: validatedData.status === 'published' ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (postError) throw postError;
    
    // Mark RSS item as imported
    await supabase
      .from('rss_items')
      .update({ 
        is_imported: true,
        imported_at: new Date().toISOString(),
        imported_post_id: post.id
      })
      .eq('id', itemId);
    
    return NextResponse.json({ 
      success: true,
      post,
      rssItem
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error importing RSS item:', error);
    return NextResponse.json(
      { error: 'Failed to import RSS item' },
      { status: 500 }
    );
  }
} 