// RSS Items Bulk Import API endpoint
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Validation schema for bulk import
const bulkImportSchema = z.object({
  item_ids: z.array(z.string().uuid()).min(1).max(100),
  category_id: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).optional().default('draft')
});

// Helper to check if user is admin
async function isAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', user.email)
    .single();
    
  return !!adminUser;
}

// POST /api/admin/rss/items/bulk-import
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validatedData = bulkImportSchema.parse(body);
    
    const { item_ids, category_id, tags, status } = validatedData;
    
    // Get RSS items
    const { data: rssItems, error: itemsError } = await supabase
      .from('rss_items')
      .select('*')
      .in('id', item_ids)
      .eq('is_imported', false);
    
    if (itemsError) throw itemsError;
    
    if (!rssItems || rssItems.length === 0) {
      return NextResponse.json(
        { error: 'No unimported RSS items found' },
        { status: 400 }
      );
    }
    
    const results = {
      imported: [] as any[],
      failed: [] as any[],
      skipped: [] as any[]
    };
    
    // Import each item
    for (const rssItem of rssItems) {
      try {
        // Create post
        const { data: post, error: postError } = await supabase
          .from('posts')
          .insert({
            title: rssItem.title,
            content: rssItem.description,
            status,
            published_at: status === 'published' ? new Date().toISOString() : null,
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
          .eq('id', rssItem.id);
        
        results.imported.push({
          rssItemId: rssItem.id,
          postId: post.id,
          title: rssItem.title
        });
      } catch (error) {
        console.error(`Error importing RSS item ${rssItem.id}:`, error);
        results.failed.push({
          rssItemId: rssItem.id,
          title: rssItem.title,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Add skipped items (already imported)
    const importedIds = rssItems.map(item => item.id);
    const skippedIds = item_ids.filter(id => !importedIds.includes(id));
    if (skippedIds.length > 0) {
      results.skipped = skippedIds;
    }
    
    return NextResponse.json({ 
      success: true,
      results,
      summary: {
        total: item_ids.length,
        imported: results.imported.length,
        failed: results.failed.length,
        skipped: results.skipped.length
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error bulk importing RSS items:', error);
    return NextResponse.json(
      { error: 'Failed to bulk import RSS items' },
      { status: 500 }
    );
  }
} 