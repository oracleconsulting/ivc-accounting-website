import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Get platform connections from database
    const { data: platforms, error } = await supabase
      .from('social_platform_connections')
      .select('*')
      .order('platform_name');
    
    if (error) {
      console.error('Error fetching platforms:', error);
      return NextResponse.json({ error: 'Failed to fetch platforms' }, { status: 500 });
    }
    
    return NextResponse.json(platforms || []);
  } catch (error) {
    console.error('Error in platforms API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { platform_id, access_token, refresh_token, expires_at, profile_url } = body;
    
    // Upsert platform connection
    const { data, error } = await supabase
      .from('social_platform_connections')
      .upsert({
        platform_id,
        access_token,
        refresh_token,
        expires_at,
        profile_url,
        connected: true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving platform connection:', error);
      return NextResponse.json({ error: 'Failed to save platform connection' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in platform connection API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 