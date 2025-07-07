import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('✅ Dynamic test route called with id:', params.id);
  return NextResponse.json({ 
    working: true, 
    id: params.id,
    url: request.url,
    message: 'Dynamic API route is working'
  });
} 