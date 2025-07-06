import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Get basic statistics
    const { count: totalPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get posts with view counts
    const { data: posts } = await supabase
      .from('posts')
      .select('id, title, view_count, created_at')
      .order('view_count', { ascending: false })
      .limit(10);

    // Calculate total views
    const totalViews = posts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

    // Generate mock traffic data
    const generateTrafficData = (days: number) => {
      const data = [];
      const now = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          views: Math.floor(Math.random() * 1000) + 100
        });
      }
      return data;
    };

    const analytics = {
      overview: {
        totalPosts: totalPosts || 0,
        totalViews,
        totalUsers: totalUsers || 0,
        totalEngagement: Math.floor(totalViews * 0.15),
        growthRate: 12
      },
      traffic: {
        daily: generateTrafficData(7),
        weekly: generateTrafficData(30),
        monthly: generateTrafficData(365)
      },
      topPosts: posts?.map(post => ({
        id: post.id,
        title: post.title,
        views: post.view_count || 0,
        engagement: Math.floor((post.view_count || 0) * 0.15),
        publishedAt: post.created_at
      })) || [],
      userBehavior: {
        averageSessionDuration: 180, // seconds
        bounceRate: 45,
        pagesPerSession: 2.3,
        returningUsers: 35
      },
      deviceStats: {
        desktop: 65,
        mobile: 30,
        tablet: 5
      },
      geographicData: [
        { country: 'United Kingdom', views: 4500, percentage: 75 },
        { country: 'United States', views: 800, percentage: 13 },
        { country: 'Canada', views: 400, percentage: 7 },
        { country: 'Australia', views: 200, percentage: 3 },
        { country: 'Other', views: 100, percentage: 2 }
      ],
      socialMedia: [
        { platform: 'LinkedIn', clicks: 1200, shares: 450, engagement: 1650 },
        { platform: 'Twitter', clicks: 800, shares: 300, engagement: 1100 },
        { platform: 'Facebook', clicks: 600, shares: 200, engagement: 800 },
        { platform: 'Instagram', clicks: 400, shares: 150, engagement: 550 }
      ]
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 