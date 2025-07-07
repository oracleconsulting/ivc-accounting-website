import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // CRITICAL: Allow API routes to pass through without authentication checks
  if (req.nextUrl.pathname.startsWith('/api/')) {
    console.log('🔓 Middleware: Allowing API route to pass through:', req.nextUrl.pathname);
    return res;
  }
  
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not signed in and the current path is /admin, redirect to /login
  if (!user && req.nextUrl.pathname.startsWith('/admin')) {
    console.log('🚫 Middleware: Redirecting unauthenticated user from admin route');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  // Updated matcher to be more specific and exclude API routes
  matcher: [
    // Match admin pages but exclude API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Specifically include admin pages
    '/admin/:path*'
  ],
}; 