import { NextResponse } from 'next/server';

export async function GET() {
  // Simple check that doesn't require auth
  return NextResponse.json({
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    railwayEnv: process.env.RAILWAY_ENVIRONMENT,
    // Check if the key format is correct
    keyFormat: process.env.OPENROUTER_API_KEY?.startsWith('sk-or-') ? 'correct' : 'incorrect',
    // Count environment variables (Railway usually has many)
    envCount: Object.keys(process.env).length,
    // Check for common Railway vars
    hasRailwayVars: {
      RAILWAY_ENVIRONMENT: !!process.env.RAILWAY_ENVIRONMENT,
      RAILWAY_PROJECT_ID: !!process.env.RAILWAY_PROJECT_ID,
      RAILWAY_SERVICE_ID: !!process.env.RAILWAY_SERVICE_ID,
    }
  });
} 