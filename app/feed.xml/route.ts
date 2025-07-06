import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Fetch published blog posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        content,
        excerpt,
        published_at,
        updated_at,
        author_id,
        featured_image,
        post_categories (
          categories (
            name,
            slug
          )
        ),
        post_tags (
          tags (
            name,
            slug
          )
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching posts for RSS:', error);
      return new Response('Error generating RSS feed', { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ivcaccounting.co.uk';
    const siteName = 'IVC Accounting';
    const siteDescription = 'Expert chartered accountants serving Essex businesses. Specializing in tax planning, business growth, and financial strategy.';

    // Generate RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title>${siteName} Blog</title>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <link>${baseUrl}/blog</link>
    <description>${siteDescription}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en-GB</language>
    <sy:updatePeriod>daily</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>${siteName}</title>
      <link>${baseUrl}</link>
    </image>
    ${posts?.map(post => {
      const categories = post.post_categories?.map((pc: any) => pc.categories.name).join(', ') || '';
      const tags = post.post_tags?.map((pt: any) => pt.tags.name).join(', ') || '';
      const pubDate = new Date(post.published_at).toUTCString();
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[IVC Accounting Team]]></dc:creator>
      <category><![CDATA[${categories}]]></category>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      ${post.featured_image ? `<enclosure url="${post.featured_image}" type="image/jpeg" />` : ''}
      <slash:comments>0</slash:comments>
    </item>`;
    }).join('') || ''}
  </channel>
</rss>`;

    return new Response(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
} 