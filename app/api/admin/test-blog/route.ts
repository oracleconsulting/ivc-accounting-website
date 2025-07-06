// FILE: app/api/admin/test-blog/route.ts
// Test route to verify blog system is working

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check tables exist
    const tables = ['posts', 'categories', 'tags', 'post_categories', 'post_tags'];
    const tableStatus: Record<string, boolean> = {};
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      tableStatus[table] = !error;
    }
    
    // Get counts
    const counts: Record<string, number> = {};
    for (const table of tables) {
      if (tableStatus[table]) {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        counts[table] = count || 0;
      }
    }
    
    // Test post with relations
    const { data: testPost } = await supabase
      .from('posts')
      .select(`
        *,
        categories:post_categories(category:categories(*)),
        tags:post_tags(tag:tags(*))
      `)
      .limit(1)
      .single();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    return NextResponse.json({
      status: 'ok',
      tables: tableStatus,
      counts,
      samplePost: testPost,
      currentUser: user?.email,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Blog system test error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}