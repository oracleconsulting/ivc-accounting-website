import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';

// Dynamically import BlogEditor to avoid SSR issues
const BlogEditor = dynamic(() => import('@/components/admin/BlogEditor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin" />
        <span className="text-lg font-medium text-[#1a2b4a]">Loading editor...</span>
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
  const supabase = createServerComponentClient({ cookies });
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch post data
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id(id, full_name, avatar_url),
      categories:post_categories(category:categories(*)),
      tags:post_tags(tag:tags(*))
    `)
    .eq('id', params.id)
    .single();

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
                Last updated: {new Date(post.updated_at).toLocaleDateString()}
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
        <BlogEditor 
          post={post}
          postId={params.id}
        />
      </div>
    </div>
  );
}