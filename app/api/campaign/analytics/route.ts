import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { handleAPIError } from '@/lib/utils/errors';
import { requireAuth } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    const timeRange = searchParams.get('timeRange') || '30d';

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Get campaign analytics
    const { data: analytics, error } = await supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', campaignId)
      .single();

    if (error || !analytics) {
      return NextResponse.json(
        { error: 'Analytics not found' },
        { status: 404 }
      );
    }

    // Calculate additional metrics
    const totalReach = analytics.total_reach || 0;
    const totalEngagement = analytics.total_engagement || 0;
    const conversionRate = totalReach > 0 ? (analytics.conversions || 0) / totalReach * 100 : 0;
    const roi = analytics.roi || 0;

    return NextResponse.json({
      success: true,
      data: {
        ...analytics,
        calculated_metrics: {
          total_reach: totalReach,
          total_engagement: totalEngagement,
          conversion_rate: conversionRate,
          roi: roi,
          engagement_rate: totalReach > 0 ? totalEngagement / totalReach * 100 : 0
        }
      }
    });

  } catch (error) {
    const { status, body } = handleAPIError(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const { campaignId, metrics } = await request.json();

    if (!campaignId || !metrics) {
      return NextResponse.json(
        { error: 'Campaign ID and metrics are required' },
        { status: 400 }
      );
    }

    // Update or create analytics
    const { data, error } = await supabase
      .from('campaign_analytics')
      .upsert({
        campaign_id: campaignId,
        ...metrics,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update analytics' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    const { status, body } = handleAPIError(error);
    return NextResponse.json(body, { status });
  }
} 