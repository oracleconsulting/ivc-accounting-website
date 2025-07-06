import { NextRequest, NextResponse } from 'next/server';
import { pineconeService } from '@/lib/services/pineconeService';

export async function POST(request: NextRequest) {
  try {
    const { query, type, limit = 10 } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' }, 
        { status: 400 }
      );
    }
    
    if (limit && (typeof limit !== 'number' || limit < 1 || limit > 100)) {
      return NextResponse.json(
        { error: 'Limit must be a number between 1 and 100' }, 
        { status: 400 }
      );
    }
    
    const filter = type ? { type } : undefined;
    const results = await pineconeService.searchSimilar(query, limit, filter);
    
    return NextResponse.json({ 
      results,
      query,
      type,
      limit 
    });
  } catch (error) {
    console.error('Error in embeddings search:', error);
    return NextResponse.json(
      { error: 'Failed to search embeddings' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
      return NextResponse.json(
        { error: 'Limit must be a number between 1 and 100' }, 
        { status: 400 }
      );
    }
    
    const results = await pineconeService.getKnowledgeBase(type || undefined);
    
    return NextResponse.json({ 
      results,
      type,
      limit 
    });
  } catch (error) {
    console.error('Error in embeddings GET:', error);
    return NextResponse.json(
      { error: 'Failed to get knowledge base' }, 
      { status: 500 }
    );
  }
} 