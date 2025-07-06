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

    // Get database statistics
    const stats = {
      totalTables: 0,
      totalRecords: 0,
      databaseSize: '0 MB',
      lastBackup: 'Never',
      connectionStatus: 'healthy' as const,
      activeConnections: 0
    };

    // Get table information
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tables) {
      stats.totalTables = tables.length;
    }

    // Get record counts for main tables
    const { count: postsCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    const { count: usersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: categoriesCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    stats.totalRecords = (postsCount || 0) + (usersCount || 0) + (categoriesCount || 0);

    // Get backup information
    const { data: backups } = await supabase
      .from('database_backups')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1);

    if (backups && backups.length > 0) {
      stats.lastBackup = new Date(backups[0].created_at).toLocaleDateString();
    }

    // Estimate database size (this is a simplified calculation)
    const estimatedSize = Math.round((stats.totalRecords * 0.5) / 1024); // Rough estimate
    stats.databaseSize = `${estimatedSize} KB`;

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 