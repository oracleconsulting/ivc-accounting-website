import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

// Client-only component to avoid hydration issues
const BlogPostContent = dynamic(() => import('./BlogPostContent'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded"></div>
});

interface BlogPostPageProps {
  params: { slug: string };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  console.log('BlogPostPage: Starting to fetch post with slug:', params.slug);
  const supabase = createServerComponentClient({ cookies });
  
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (error || !post) {
    console.log('BlogPostPage: Post not found or error:', { error, post: !!post });
    notFound();
  }

  console.log('BlogPostPage: Successfully fetched post:', { title: post.title, status: post.status });

  // Pass serializable data only
  const postData = {
    ...post,
    published_at: post.published_at ? new Date(post.published_at).toISOString() : null,
    updated_at: post.updated_at ? new Date(post.updated_at).toISOString() : null,
  };

  return <BlogPostContent post={postData} />;
} 