import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // TEMPORARY: Completely bypass auth for testing
  console.log('⚠️ AUTH BYPASSED FOR TESTING - REMOVE IN PRODUCTION')
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
} 