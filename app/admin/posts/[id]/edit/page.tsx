import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import { SafeDate } from '@/components/ui/SafeDate';
import ErrorBoundary from '@/components/ErrorBoundary';

// Dynamically import AIBlogEditor to avoid SSR issues
const AIBlogEditor = dynamic(() => import('@/components/admin/AIBlogEditor').then(mod => ({ default: mod.AIBlogEditor })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin" />
        <span className="text-lg font-medium text-[#1a2b4a]">Loading AI editor...</span>
      </div>
    </div>
  )
});

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  console.log('EditPostPage: Loading with ID:', params.id);
  
  const supabase = createServerComponentClient({ cookies });
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch post data - SIMPLIFIED QUERY
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')  // Just get the post without joins
    .eq('id', params.id)
    .single();

  console.log('EditPostPage: Post query result:', { post: post?.id, error });

  if (error || !post) {
    console.log('Post not found:', params.id, error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/posts"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <div>
              <h1 className="text-2xl font-black text-[#1a2b4a]">Edit Post</h1>
              <p className="text-sm text-gray-600 mt-1">
                Last updated: <SafeDate date={post.updated_at} />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              post.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : post.status === 'scheduled'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {post.status}
            </span>
            
            {post.status === 'published' && (
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 text-[#1a2b4a] font-medium hover:bg-gray-50 transition-colors"
              >
                View Post
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="p-6">
        <ErrorBoundary>
          <AIBlogEditor 
            initialContent={post.content || ''}
            postId={params.id}
            userId={user.id}
            onSave={async (content: string, metadata: any) => {
              // Handle save logic here
              console.log('Saving content:', { content, metadata });
              // You can implement the actual save logic here
            }}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}