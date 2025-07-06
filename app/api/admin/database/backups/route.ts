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

    // Get backup history
    const { data: backups, error } = await supabase
      .from('database_backups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching backups:', error);
      return NextResponse.json({ error: 'Failed to fetch backups' }, { status: 500 });
    }

    return NextResponse.json(backups || []);
  } catch (error) {
    console.error('Error fetching backups:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create a new backup record
    const backupData = {
      filename: `backup-${Date.now()}.sql`,
      size: '0 KB',
      status: 'in_progress',
      type: 'manual',
      created_by: user.email
    };

    const { data: backup, error } = await supabase
      .from('database_backups')
      .insert(backupData)
      .select()
      .single();

    if (error) {
      console.error('Error creating backup:', error);
      return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
    }

    // In a real implementation, you would trigger an actual database backup here
    // For now, we'll simulate the backup process
    setTimeout(async () => {
      await supabase
        .from('database_backups')
        .update({ 
          status: 'completed',
          size: '1.2 MB'
        })
        .eq('id', backup.id);
    }, 2000);

    return NextResponse.json(backup);
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 