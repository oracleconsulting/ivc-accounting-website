import { NextRequest, NextResponse } from 'next/server';

console.log('Loading /api/test/[id]/route.ts');

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('GET /api/test/[id] called with id:', params.id);
  console.log('Request URL:', request.url);
  
  return NextResponse.json({ 
    message: 'Test route is working', 
    id: params.id,
    url: request.url
  });
} 