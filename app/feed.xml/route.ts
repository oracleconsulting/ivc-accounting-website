import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ivcaccounting.co.uk';
    
    // Get published posts with author and category information
    const { data: posts } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(name, email),
        categories:post_categories(category:categories(name, slug)),
        tags:post_tags(tag:tags(name, slug))
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50);

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title>IVC Accounting Blog</title>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <link>${baseUrl}/blog</link>
    <description>Latest insights, tips, and updates from IVC Accounting - your trusted partner for all things accounting and tax.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en-GB</language>
    <sy:updatePeriod>daily</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    ${(posts || []).map(post => {
      const authorName = post.author?.name || 'IVC Accounting';
      const authorEmail = post.author?.email || 'james@ivcaccounting.co.uk';
      const categories = post.categories?.map((c: any) => c.category?.name).filter(Boolean).join(', ') || '';
      const tags = post.tags?.map((t: any) => t.tag?.name).filter(Boolean).join(', ') || '';
      
      // Clean content for RSS
      const content = post.content_html
        ?.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
        ?.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
        ?.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframes
        || post.content_text || '';
      
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <pubDate>${new Date(post.published_at!).toUTCString()}</pubDate>
      <dc:creator><![CDATA[${authorName}]]></dc:creator>
      <category><![CDATA[${categories}]]></category>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || post.content_text?.substring(0, 200) + '...'}]]></description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      ${post.featured_image ? `<enclosure url="${post.featured_image}" type="image/jpeg" />` : ''}
      ${tags ? `<category><![CDATA[${tags}]]></category>` : ''}
    </item>`;
    }).join('')}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('RSS feed error:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
} 