import { NextResponse } from 'next/server';

export async function GET() {
  // Get client count from environment variable, default to 42 if not set
  const clientCount = parseInt(process.env.IVC_CLIENT_COUNT || '42', 10);
  
  return NextResponse.json({
    current_clients: clientCount,
    max_clients: 50,
    available_spots: 50 - clientCount
  });
} 