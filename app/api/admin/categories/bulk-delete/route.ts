// Bulk delete categories API endpoint
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Validation schema for bulk delete
const bulkDeleteSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100)
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

// POST /api/admin/categories/bulk-delete
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check admin authentication
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = bulkDeleteSchema.parse(body);
    
    const { ids } = validatedData;
    
    // Check if any categories have posts
    const { data: categoriesWithPosts } = await supabase
      .from('post_categories')
      .select('category_id')
      .in('category_id', ids);
    
    if (categoriesWithPosts && categoriesWithPosts.length > 0) {
      const categoryIdsWithPosts = [...new Set(categoriesWithPosts.map(c => c.category_id))];
      return NextResponse.json(
        { 
          error: 'Cannot delete categories with posts',
          categoriesWithPosts: categoryIdsWithPosts,
          message: 'Please reassign posts from these categories before deleting them.'
        },
        { status: 400 }
      );
    }
    
    // Delete categories
    const { data: deletedCategories, error } = await supabase
      .from('categories')
      .delete()
      .in('id', ids)
      .select('id, name');
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true,
      deletedCount: deletedCategories?.length || 0,
      deletedCategories
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error bulk deleting categories:', error);
    return NextResponse.json(
      { error: 'Failed to delete categories' },
      { status: 500 }
    );
  }
} 