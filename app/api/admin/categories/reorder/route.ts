// Reorder categories API endpoint
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Validation schema for reorder
const reorderSchema = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    sort_order: z.number().min(0)
  })).min(1)
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

// POST /api/admin/categories/reorder
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check admin authentication
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = reorderSchema.parse(body);
    
    const { items } = validatedData;
    
    // Verify all category IDs exist
    const categoryIds = items.map(item => item.id);
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('id')
      .in('id', categoryIds);
    
    if (fetchError) throw fetchError;
    
    if (!existingCategories || existingCategories.length !== categoryIds.length) {
      return NextResponse.json(
        { error: 'One or more categories not found' },
        { status: 404 }
      );
    }
    
    // Update sort orders in a transaction
    const updates = items.map(item => ({
      id: item.id,
      sort_order: item.sort_order,
      updated_at: new Date().toISOString()
    }));
    
    const { data: updatedCategories, error: updateError } = await supabase
      .from('categories')
      .upsert(updates, { onConflict: 'id' })
      .select('id, name, sort_order');
    
    if (updateError) throw updateError;
    
    return NextResponse.json({ 
      success: true,
      updatedCount: updatedCategories?.length || 0,
      updatedCategories
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error reordering categories:', error);
    return NextResponse.json(
      { error: 'Failed to reorder categories' },
      { status: 500 }
    );
  }
} 