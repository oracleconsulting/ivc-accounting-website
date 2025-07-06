import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    const platform = searchParams.get('platform') || 'all';
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    // Build query
    let query = supabase
      .from('social_posts')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString());
    
    if (platform !== 'all') {
      query = query.eq('platform', platform);
    }
    
    const { data: posts, error } = await query;
    
    if (error) {
      console.error('Error fetching analytics data:', error);
      return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
    }
    
    // Calculate analytics
    const analytics = {
      totalPosts: posts?.length || 0,
      totalEngagement: posts?.reduce((sum, post) => sum + (post.engagement || 0), 0) || 0,
      totalReach: posts?.reduce((sum, post) => sum + (post.reach || 0), 0) || 0,
      averageEngagementRate: posts?.length ? 
        (posts.reduce((sum, post) => sum + (post.engagement || 0), 0) / posts.reduce((sum, post) => sum + (post.reach || 0), 0)) * 100 : 0,
      topPosts: posts?.slice(0, 5).map(post => ({
        id: post.id,
        content: post.content,
        platform: post.platform,
        engagement: post.engagement || 0,
        reach: post.reach || 0,
        date: post.created_at
      })) || [],
      platformStats: {}
    };
    
    // Calculate platform-specific stats
    if (posts) {
      const platformStats: Record<string, any> = {};
      
      posts.forEach(post => {
        if (!platformStats[post.platform]) {
          platformStats[post.platform] = { posts: 0, engagement: 0, reach: 0 };
        }
        platformStats[post.platform].posts++;
        platformStats[post.platform].engagement += post.engagement || 0;
        platformStats[post.platform].reach += post.reach || 0;
      });
      
      analytics.platformStats = platformStats;
    }
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 