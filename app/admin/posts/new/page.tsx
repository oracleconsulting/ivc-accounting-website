'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import BlogEditor from '@/components/admin/BlogEditor';
import { Post } from '@/lib/types/blog';
import toast from 'react-hot-toast';

export default function NewPostPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSave = async (postData: Partial<Post>) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Extract category and tag IDs
      const { category_ids, tag_ids, ...postFields } = postData;
      
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          ...postFields,
          author_id: user?.id,
          view_count: 0
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Handle category relationships
      if (category_ids && category_ids.length > 0) {
        const categoryRelations = category_ids.map(categoryId => ({
          post_id: data.id,
          category_id: categoryId
        }));
        
        await supabase
          .from('post_categories')
          .insert(categoryRelations);
      }
      
      // Handle tag relationships
      if (tag_ids && tag_ids.length > 0) {
        const tagRelations = tag_ids.map(tagId => ({
          post_id: data.id,
          tag_id: tagId
        }));
        
        await supabase
          .from('post_tags')
          .insert(tagRelations);
      }
      
      toast.success('Draft saved successfully');
      return data;
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save draft');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async (postData: Partial<Post>) => {
    setIsPublishing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Extract category and tag IDs
      const { category_ids, tag_ids, ...postFields } = postData;
      
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          ...postFields,
          author_id: user?.id,
          view_count: 0,
          status: 'published',
          published_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Handle category relationships
      if (category_ids && category_ids.length > 0) {
        const categoryRelations = category_ids.map(categoryId => ({
          post_id: data.id,
          category_id: categoryId
        }));
        
        await supabase
          .from('post_categories')
          .insert(categoryRelations);
      }
      
      // Handle tag relationships
      if (tag_ids && tag_ids.length > 0) {
        const tagRelations = tag_ids.map(tagId => ({
          post_id: data.id,
          tag_id: tagId
        }));
        
        await supabase
          .from('post_tags')
          .insert(tagRelations);
      }
      
      toast.success('Post published successfully!');
      router.push('/admin/posts');
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish post');
      throw error;
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#1a2b4a] mb-2">Create New Post</h1>
        <p className="text-gray-600">Write and publish your next blog post</p>
      </div>

      <BlogEditor
        onSave={handleSave}
        onPublish={handlePublish}
      />

      {(isSaving || isPublishing) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin w-6 h-6 border-2 border-[#ff6b35] border-t-transparent rounded-full" />
              <span className="text-lg font-medium">
                {isSaving ? 'Saving...' : 'Publishing...'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 