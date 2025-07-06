import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Validation schemas
const categorySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().nullable().optional(),
  slug: z.string().optional(), // Will be generated if not provided
  meta_description: z.string().max(160).nullable().optional(),
  meta_keywords: z.array(z.string()).nullable().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  is_featured: z.boolean().optional().default(false),
  is_visible: z.boolean().optional().default(true),
  sort_order: z.number().optional()
});

const updateCategorySchema = categorySchema.partial();

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
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Helper to check if slug exists
async function isSlugUnique(supabase: any, slug: string, excludeId?: string) {
  const query = supabase
    .from('categories')
    .select('id')
    .eq('slug', slug);
    
  if (excludeId) {
    query.neq('id', excludeId);
  }
  
  const { data } = await query.single();
  return !data;
}

// GET /api/admin/categories
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const includePostCount = searchParams.get('includePostCount') === 'true';
    const onlyFeatured = searchParams.get('featured') === 'true';
    const onlyVisible = searchParams.get('visible') === 'true';
    
    // Build query
    let query = supabase
      .from('categories')
      .select(`
        *,
        ${includePostCount ? 'post_categories(count)' : ''}
      `);
    
    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (onlyFeatured) {
      query = query.eq('is_featured', true);
    }
    
    if (onlyVisible) {
      query = query.eq('is_visible', true);
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    const { data: categories, error } = await query;
    
    if (error) throw error;
    
    // Transform data to include post count
    const transformedCategories = categories?.map((cat: any) => ({
      ...cat,
      post_count: includePostCount ? cat.post_categories?.[0]?.count || 0 : undefined
    })) || [];
    
    return NextResponse.json({ categories: transformedCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check admin authentication
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = categorySchema.parse(body);
    
    // Generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = generateSlug(validatedData.name);
    }
    
    // Ensure slug is unique
    let finalSlug = validatedData.slug;
    let counter = 1;
    while (!await isSlugUnique(supabase, finalSlug)) {
      finalSlug = `${validatedData.slug}-${counter}`;
      counter++;
    }
    validatedData.slug = finalSlug;
    
    // Get max sort_order if not provided
    if (validatedData.sort_order === undefined) {
      const { data: maxOrder } = await supabase
        .from('categories')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();
        
      validatedData.sort_order = (maxOrder?.sort_order || 0) + 1;
    }
    
    // Create category
    const { data: category, error } = await supabase
      .from('categories')
      .insert(validatedData)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ category });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/categories/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check admin authentication
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const categoryId = params.id;
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);
    
    // If name changed, regenerate slug
    if (validatedData.name && !validatedData.slug) {
      validatedData.slug = generateSlug(validatedData.name);
      
      // Ensure slug is unique
      let finalSlug = validatedData.slug;
      let counter = 1;
      while (!await isSlugUnique(supabase, finalSlug, categoryId)) {
        finalSlug = `${validatedData.slug}-${counter}`;
        counter++;
      }
      validatedData.slug = finalSlug;
    }
    
    // Update category
    const { data: category, error } = await supabase
      .from('categories')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', categoryId)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ category });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check admin authentication
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const categoryId = params.id;
    
    // Check if category has posts
    const { data: postCount } = await supabase
      .from('post_categories')
      .select('id', { count: 'exact' })
      .eq('category_id', categoryId);
    
    if (postCount && postCount.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with posts. Please reassign posts first.' },
        { status: 400 }
      );
    }
    
    // Delete category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}

// Additional endpoints

// POST /api/admin/categories/bulk-delete
export async function bulkDelete(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { categoryIds } = await request.json();
    
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid category IDs' },
        { status: 400 }
      );
    }
    
    // Check if any categories have posts
    const { data: postsExist } = await supabase
      .from('post_categories')
      .select('category_id')
      .in('category_id', categoryIds);
    
    if (postsExist && postsExist.length > 0) {
      const categoriesWithPosts = [...new Set(postsExist.map(p => p.category_id))];
      return NextResponse.json(
        { 
          error: 'Some categories have posts and cannot be deleted',
          categoriesWithPosts 
        },
        { status: 400 }
      );
    }
    
    // Delete categories
    const { error } = await supabase
      .from('categories')
      .delete()
      .in('id', categoryIds);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, deletedCount: categoryIds.length });
  } catch (error) {
    console.error('Error bulk deleting categories:', error);
    return NextResponse.json(
      { error: 'Failed to delete categories' },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories/reorder
export async function reorder(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { categoryOrders } = await request.json();
    
    if (!Array.isArray(categoryOrders)) {
      return NextResponse.json(
        { error: 'Invalid order data' },
        { status: 400 }
      );
    }
    
    // Update sort orders in a transaction
    const updates = categoryOrders.map(({ id, sort_order }) => 
      supabase
        .from('categories')
        .update({ sort_order })
        .eq('id', id)
    );
    
    await Promise.all(updates);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering categories:', error);
    return NextResponse.json(
      { error: 'Failed to reorder categories' },
      { status: 500 }
    );
  }
} 