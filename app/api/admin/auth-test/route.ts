import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ 
    cookies: () => cookieStore 
  });
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  return NextResponse.json({
    authenticated: !!user,
    user: user ? { email: user.email, id: user.id } : null,
    error: error?.message,
    cookies: cookieStore.getAll().map(c => ({ name: c.name, hasValue: !!c.value })),
    timestamp: new Date().toISOString()
  });
} 