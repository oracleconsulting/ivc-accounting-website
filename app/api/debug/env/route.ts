import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow in development or with secret header
  const secret = request.headers.get('x-debug-secret');
  if (process.env.NODE_ENV === 'production' && secret !== process.env.DEBUG_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    keyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 10) + '...',
    railwayEnvironment: process.env.RAILWAY_ENVIRONMENT,
    nodeVersion: process.version,
    // Check all AI-related env vars
    envVars: {
      OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      DATABASE_URL: !!process.env.DATABASE_URL,
    }
  });
} 