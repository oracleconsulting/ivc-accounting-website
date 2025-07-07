// RSS Feed Validation API endpoint
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Validation schema
const validateSchema = z.object({
  url: z.string().url()
});

// Helper to check if user is admin
async function isAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', user.email)
    .single();
    
  return !!adminUser;
}

// Helper to validate RSS feed URL
async function validateRssUrl(url: string) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS-Validator/1.0)'
      }
    });
    
    if (!response.ok) {
      return {
        isValid: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType) {
      return {
        isValid: false,
        error: 'No content type header found'
      };
    }
    
    // Check if it's XML or RSS
    const isXml = contentType.includes('xml') || 
                  contentType.includes('rss') || 
                  contentType.includes('atom');
    
    if (!isXml) {
      return {
        isValid: false,
        error: 'Content type is not XML/RSS/Atom'
      };
    }
    
    // Try to parse the content
    const text = await response.text();
    
    // Basic XML validation
    if (!text.includes('<rss') && !text.includes('<feed') && !text.includes('<rdf')) {
      return {
        isValid: false,
        error: 'Content does not appear to be a valid RSS/Atom feed'
      };
    }
    
    // Extract basic feed information
    const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descriptionMatch = text.match(/<description[^>]*>([^<]+)<\/description>/i);
    const itemCount = (text.match(/<item/g) || []).length;
    const entryCount = (text.match(/<entry/g) || []).length;
    
    return {
      isValid: true,
      feedInfo: {
        title: titleMatch ? titleMatch[1].trim() : 'Unknown',
        description: descriptionMatch ? descriptionMatch[1].trim() : '',
        itemCount: itemCount + entryCount,
        contentType
      }
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// POST /api/admin/rss/validate
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    if (!await isAdmin(supabase)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validatedData = validateSchema.parse(body);
    
    const { url } = validatedData;
    
    // Check if URL already exists
    const { data: existingFeed } = await supabase
      .from('rss_feeds')
      .select('id, name')
      .eq('url', url)
      .single();
    
    if (existingFeed) {
      return NextResponse.json({
        isValid: false,
        error: 'RSS feed with this URL already exists',
        existingFeed
      });
    }
    
    // Validate the RSS feed
    const validationResult = await validateRssUrl(url);
    
    return NextResponse.json({
      url,
      ...validationResult
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error validating RSS feed:', error);
    return NextResponse.json(
      { error: 'Failed to validate RSS feed' },
      { status: 500 }
    );
  }
} 