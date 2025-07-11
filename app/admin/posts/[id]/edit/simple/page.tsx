import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import { SafeDate } from '@/components/ui/SafeDate';
import ErrorBoundary from '@/components/ErrorBoundary';

// Dynamically import simple BlogEditor
const BlogEditorSimple = dynamic(() => import('@/components/admin/BlogEditorSimple'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin" />
        <span className="text-lg font-medium text-[#1a2b4a]">Loading simple editor...</span>
      </div>
    </div>
  )
});

interface SimpleEditPostPageProps {
  params: {
    id: string;
  };
}

export default async function SimpleEditPostPage({ params }: SimpleEditPostPageProps) {
  console.log('SimpleEditPostPage: Loading with ID:', params.id);
  
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

  console.log('SimpleEditPostPage: Post query result:', { post: post?.id, error });

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
              <h1 className="text-2xl font-black text-[#1a2b4a]">Simple Editor Test</h1>
              <p className="text-sm text-gray-600 mt-1">
                Testing simplified editor - Last updated: <SafeDate date={post.updated_at} />
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
            
            <Link
              href={`/admin/posts/${params.id}/edit`}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition-colors"
            >
              Full Editor
            </Link>
          </div>
        </div>
      </div>

      {/* Simple Editor */}
      <ErrorBoundary>
        <BlogEditorSimple 
          post={post}
          postId={params.id}
        />
      </ErrorBoundary>
    </div>
  );
} 