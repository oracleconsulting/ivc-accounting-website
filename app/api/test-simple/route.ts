import { NextResponse } from 'next/server';

export async function GET() {
  console.log('✅ Simple test route called');
  return NextResponse.json({ 
    working: true, 
    time: new Date().toISOString(),
    message: 'Simple API route is working'
  });
} 