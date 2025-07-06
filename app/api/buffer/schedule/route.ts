import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const BUFFER_ACCESS_TOKEN = process.env.BUFFER_ACCESS_TOKEN;
  
  try {
    const { posts, scheduleTime } = await request.json();
    
    // Buffer API integration
    const bufferPosts = posts.map((post: any) => ({
      profile_ids: [getBufferProfileId(post.platform)],
      text: `${post.content}\n\n${post.hashtags.map((h: string) => `#${h}`).join(' ')}`,
      scheduled_at: scheduleTime || undefined,
      link: 'https://www.ivcaccounting.co.uk/blog/latest' // Dynamic link
    }));

    const response = await fetch('https://api.bufferapp.com/1/updates/create.json', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BUFFER_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ updates: bufferPosts })
    });

    const data = await response.json();
    
    return NextResponse.json({ success: true, buffer_ids: data.updates });
  } catch (error) {
    console.error('Buffer API error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule posts' },
      { status: 500 }
    );
  }
}

function getBufferProfileId(platform: string): string {
  // These would be your actual Buffer profile IDs
  const profiles = {
    linkedin: process.env.BUFFER_LINKEDIN_PROFILE_ID,
    instagram: process.env.BUFFER_INSTAGRAM_PROFILE_ID,
    youtube: process.env.BUFFER_YOUTUBE_PROFILE_ID
  };
  
  return profiles[platform as keyof typeof profiles] || '';
} 