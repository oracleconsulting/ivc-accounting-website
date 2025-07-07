'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import BlogEditor from '@/components/admin/BlogEditor';
import toast from 'react-hot-toast';
import { Post } from '@/lib/types/blog';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/post-by-id?id=${params.id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Post not found');
          router.push('/admin/posts');
          return;
        }
        if (response.status === 401) {
          toast.error('Authentication required. Please log in.');
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch post');
      }

      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (postData: Partial<Post>) => {
    try {
      const response = await fetch(`/api/admin/post-by-id?id=${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...postData,
          category_ids: postData.category_ids || post?.categories?.map(c => c.category.id),
          tag_ids: postData.tag_ids || post?.tags?.map(t => t.tag.id)
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication required. Please log in.');
          router.push('/login');
          return;
        }
        throw new Error('Failed to save post');
      }

      const updatedPost = await response.json();
      setPost(updatedPost);
      toast.success('Post saved successfully');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
      throw error;
    }
  };

  const handlePublish = async (postData: Partial<Post>) => {
    try {
      const response = await fetch(`/api/admin/post-by-id?id=${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...postData,
          status: 'published',
          published_at: new Date().toISOString(),
          category_ids: postData.category_ids || post?.categories?.map(c => c.category.id),
          tag_ids: postData.tag_ids || post?.tags?.map(t => t.tag.id)
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Authentication required. Please log in.');
          router.push('/login');
          return;
        }
        throw new Error('Failed to publish post');
      }

      toast.success('Post published successfully');
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error('Failed to publish post');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#ff6b35]" />
          <span className="text-lg font-medium text-[#1a2b4a]">Loading post...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1a2b4a] mb-4">Post not found</h2>
          <button
            onClick={() => router.push('/admin/posts')}
            className="px-4 py-2 bg-[#ff6b35] text-white font-bold hover:bg-[#e55a2b] transition-colors"
          >
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/posts')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
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
              <a
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 text-[#1a2b4a] font-medium hover:bg-gray-50 transition-colors"
              >
                View Post
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="p-6">
        <BlogEditor
          post={post}
          onSave={handleSave}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
} 