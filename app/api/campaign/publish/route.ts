import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { campaignService } from '@/lib/services/campaignService';
import { handleAPIError } from '@/lib/utils/errors';
import { requireAuth } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const { campaignId, platforms = ['linkedin', 'twitter', 'facebook'], schedule = false } = await request.json();

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Get campaign details
    const campaign = await campaignService.getCampaign(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Check if user owns the campaign
    if (campaign.created_by !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update campaign status to publishing
    await supabase
      .from('campaigns')
      .update({ status: 'publishing' })
      .eq('id', campaignId);

    const results = {
      success: [] as string[],
      failed: [] as string[],
      scheduled: [] as string[]
    };

    // For now, just mark as published since social posting needs Ayrshare integration
    // TODO: Implement actual social media posting when Ayrshare is configured
    results.success.push('Campaign marked as ready for publishing');

    // Update campaign status
    const finalStatus = 'ready';
    
    await supabase
      .from('campaigns')
      .update({ 
        status: finalStatus,
        published_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    return NextResponse.json({
      success: true,
      results,
      status: finalStatus,
      message: 'Campaign is ready for publishing. Social media integration will be available once Ayrshare is configured.'
    });

  } catch (error) {
    const { status, body } = handleAPIError(error);
    return NextResponse.json(body, { status });
  }
} 