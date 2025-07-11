import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { blogAIService } from '@/lib/services/blogAIService';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { industry, targetMarket, timeframe } = await request.json();

    const results = await blogAIService.researchTrendingTopics(
      industry || 'accounting',
      timeframe || 'current'
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Research error:', error);
    return NextResponse.json(
      { error: 'Failed to perform research' },
      { status: 500 }
    );
  }
} 