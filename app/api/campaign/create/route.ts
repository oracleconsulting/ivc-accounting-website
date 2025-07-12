// /app/api/campaign/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { campaignService } from '@/lib/services/campaignService';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      topic, 
      description, 
      keywords, 
      targetAudience,
      goals,
      tone,
      blogLength,
      includeData,
      includeCaseStudy,
      mode = 'complete',
      aiMode = 'excellence'
    } = body;

    // First, generate the blog post
    const blogResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/writing`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      },
      body: JSON.stringify({
        topic,
        description,
        keywords,
        targetAudience,
        tone,
        length: blogLength,
        includeData,
        includeCaseStudy,
        mode: aiMode
      })
    });

    if (!blogResponse.ok) {
      throw new Error('Failed to generate blog post');
    }

    const blogData = await blogResponse.json();
    
    // Save the blog post
    const { data: savedBlog } = await supabase
      .from('posts')
      .insert({
        title: blogData.title,
        content: blogData.content,
        excerpt: blogData.excerpt,
        slug: blogData.slug,
        keywords: keywords,
        meta_description: blogData.metaDescription,
        status: 'draft',
        author_id: userId,
        score: blogData.score || 85
      })
      .select()
      .single();

    if (!savedBlog) {
      throw new Error('Failed to save blog post');
    }

    // Create the campaign with all components
    const campaign = await campaignService.createFromBlog({
      blogId: savedBlog.id,
      blogTitle: savedBlog.title,
      blogContent: savedBlog.content,
      keywords: keywords,
      userId: userId
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

// /app/api/campaign/publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { campaignService } from '@/lib/services/campaignService';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { campaignId } = await request.json();

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    // Verify ownership
    const campaign = await campaignService.getCampaign(campaignId);
    if (campaign.created_by !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Publish the campaign
    await campaignService.publishCampaign(campaignId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Campaign publish error:', error);
    return NextResponse.json(
      { error: 'Failed to publish campaign' },
      { status: 500 }
    );
  }
}

// /app/api/campaign/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { campaignService } from '@/lib/services/campaignService';
import { ayrshareService } from '@/lib/services/ayrshareService';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    // Update analytics from Ayrshare
    await ayrshareService.updateCampaignAnalytics(campaignId);

    // Get fresh analytics
    const analytics = await campaignService.getCampaignAnalytics(campaignId);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// /app/api/campaign/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { campaignService } from '@/lib/services/campaignService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaign = await campaignService.getCampaign(params.id);
    
    // Verify ownership or team access
    if (campaign.created_by !== userId) {
      // Check if user has team access
      const { data: teamMember } = await supabase
        .from('team_members')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (!teamMember || !['admin', 'editor'].includes(teamMember.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Campaign fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    
    // Update campaign
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', params.id)
      .eq('created_by', userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Campaign update error:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete campaign (will cascade to related tables)
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', params.id)
      .eq('created_by', userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Campaign delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}