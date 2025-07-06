// FILE: app/api/admin/database/tables/route.ts
// Database tables API route

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get table information
    const tables: Array<{
      name: string;
      recordCount: number;
      size: string;
      lastModified: string;
      status: 'healthy' | 'needs_optimization' | 'error';
    }> = [
      {
        name: 'posts',
        recordCount: 0,
        size: '0 KB',
        lastModified: new Date().toISOString(),
        status: 'healthy' as const
      },
      {
        name: 'profiles',
        recordCount: 0,
        size: '0 KB',
        lastModified: new Date().toISOString(),
        status: 'healthy' as const
      },
      {
        name: 'categories',
        recordCount: 0,
        size: '0 KB',
        lastModified: new Date().toISOString(),
        status: 'healthy' as const
      },
      {
        name: 'tags',
        recordCount: 0,
        size: '0 KB',
        lastModified: new Date().toISOString(),
        status: 'healthy' as const
      },
      {
        name: 'ai_providers',
        recordCount: 0,
        size: '0 KB',
        lastModified: new Date().toISOString(),
        status: 'healthy' as const
      },
      {
        name: 'email_templates',
        recordCount: 0,
        size: '0 KB',
        lastModified: new Date().toISOString(),
        status: 'healthy' as const
      },
      {
        name: 'social_platforms',
        recordCount: 0,
        size: '0 KB',
        lastModified: new Date().toISOString(),
        status: 'healthy' as const
      },
      {
        name: 'rss_feeds',
        recordCount: 0,
        size: '0 KB',
        lastModified: new Date().toISOString(),
        status: 'healthy' as const
      }
    ];

    // Get actual record counts
    for (const table of tables) {
      try {
        const { count } = await supabase
          .from(table.name)
          .select('*', { count: 'exact', head: true });
        
        table.recordCount = count || 0;
        table.size = `${Math.round((count || 0) * 0.1)} KB`; // Rough estimate
      } catch (error) {
        console.error(`Error getting count for table ${table.name}:`, error);
        table.status = 'error';
      }
    }

    return NextResponse.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 