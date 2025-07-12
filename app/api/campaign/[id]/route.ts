import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { campaignService } from '@/lib/services/campaignService';
import { handleAPIError } from '@/lib/utils/errors';
import { requireAuth } from '@/lib/middleware/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(request);
    const campaignId = params.id;

    const campaign = await campaignService.getCampaign(campaignId);
    
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this campaign
    if (campaign.created_by !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: campaign
    });

  } catch (error) {
    const { status, body } = handleAPIError(error);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(request);
    const campaignId = params.id;
    const updates = await request.json();

    // Get current campaign to check ownership
    const currentCampaign = await campaignService.getCampaign(campaignId);
    if (!currentCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (currentCampaign.created_by !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update campaign
    const { data, error } = await supabase
      .from('campaigns')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update campaign' },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(request);
    const campaignId = params.id;

    // Get current campaign to check ownership
    const currentCampaign = await campaignService.getCampaign(campaignId);
    if (!currentCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (currentCampaign.created_by !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete campaign and related data
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    const { status, body } = handleAPIError(error);
    return NextResponse.json(body, { status });
  }
} 