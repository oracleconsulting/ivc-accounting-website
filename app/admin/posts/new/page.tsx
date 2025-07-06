'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import BlogEditor from '@/components/admin/BlogEditor';
import toast from 'react-hot-toast';
import { Post } from '@/lib/types/blog';

export default function NewPostPage() {
  const router = useRouter();

  const handleSave = async (postData: Partial<Post>) => {
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postData,
          status: 'draft'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save post');
      }

      const savedPost = await response.json();
      toast.success('Post saved as draft');
      
      // Redirect to edit page
      router.push(`/admin/posts/${savedPost.post.id}/edit`);
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save post');
      throw error;
    }
  };

  const handlePublish = async (postData: Partial<Post>) => {
    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postData,
          status: 'published',
          published_at: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to publish post');
      }

      toast.success('Post published successfully');
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to publish post');
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/posts')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-2xl font-black text-[#1a2b4a]">Create New Post</h1>
            <p className="text-sm text-gray-600 mt-1">
              Write and publish your next blog post
            </p>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="p-6">
        <BlogEditor
          onSave={handleSave}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
} 