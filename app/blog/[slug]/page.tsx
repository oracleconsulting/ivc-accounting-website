import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface BlogPostPageProps {
  params: { slug: string };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  console.log('Loading blog post:', params.slug);
  
  const supabase = createServerComponentClient({ cookies });
  
  // Simple query first
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  console.log('Query result:', { 
    slug: params.slug, 
    found: !!post, 
    error: error?.message 
  });

  if (error || !post) {
    console.error('Post not found or error:', error);
    notFound();
  }

  // Parse content safely
  const renderContent = () => {
    if (!post.content) {
      return <p>No content available</p>;
    }
    
    // If it's HTML
    if (typeof post.content === 'string' && !post.content.startsWith('{')) {
      return <div dangerouslySetInnerHTML={{ __html: post.content }} />;
    }
    
    // If it's JSON string
    if (typeof post.content === 'string' && post.content.startsWith('{')) {
      return <p>{post.excerpt || 'Content preview not available'}</p>;
    }
    
    // If it's already parsed JSON
    if (typeof post.content === 'object') {
      return <p>{post.excerpt || 'Content preview not available'}</p>;
    }
    
    return <p>Content format not recognized</p>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/blog" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to Blog
      </Link>
      
      <article>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="text-gray-600 mb-8">
          Published: {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Date not available'}
        </div>
        
        <div className="prose max-w-none">
          {renderContent()}
        </div>
        
        {/* Debug info - remove in production */}
        <details className="mt-8 p-4 bg-gray-100 rounded">
          <summary className="cursor-pointer font-bold">Debug Info</summary>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify({
              id: post.id,
              slug: post.slug,
              status: post.status,
              contentType: typeof post.content,
              hasContent: !!post.content,
              contentLength: post.content?.length
            }, null, 2)}
          </pre>
        </details>
      </article>
    </div>
  );
} 