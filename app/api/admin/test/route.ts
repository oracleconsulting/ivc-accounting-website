import { NextResponse } from 'next/server';

export async function GET() {
  console.log('✅ Admin test route called');
  return NextResponse.json({ 
    adminRoute: true,
    working: true,
    time: new Date().toISOString(),
    message: 'Admin API route is working'
  });
} 