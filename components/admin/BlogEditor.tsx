'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import { common, createLowlight } from 'lowlight';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EditorToolbar from './EditorToolbar';
import SEOPanel from './SEOPanel';
import AIAssistant from '@/components/admin/AIAssistant';
import CategorySelector from '@/components/admin/CategorySelector';
import TagSelector from '@/components/admin/TagSelector';
import ImageUpload from './ImageUpload';
import SocialMediaGenerator from '@/components/admin/SocialMediaGenerator';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { generateSlug, calculateReadTime } from '@/lib/utils/blog';
import { uploadImage } from '@/lib/utils/storage';
import toast from 'react-hot-toast';
import { Post } from '@/lib/types/blog';
import { extractCategoryIds, extractTagIds } from '@/lib/utils/blog-helpers';
import CharacterCount from '@tiptap/extension-character-count';

const lowlight = createLowlight(common);

interface BlogEditorProps {
  post?: Post;
  postId?: string;
  onSave?: (post: Partial<Post>) => Promise<void>;
  onPublish?: (post: Partial<Post>) => Promise<void>;
}

export default function BlogEditor({ post, postId, onSave, onPublish }: BlogEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '');
  const [categories, setCategories] = useState<string[]>(() => extractCategoryIds(post || {}));
  const [tags, setTags] = useState<string[]>(() => extractTagIds(post || {}));
  const [seoData, setSeoData] = useState({
    seo_title: post?.seo_title || '',
    seo_description: post?.seo_description || '',
    seo_keywords: post?.seo_keywords || []
  });
  const [showAI, setShowAI] = useState(false);
  const [showSocialGenerator, setShowSocialGenerator] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(postId);
  
  const supabase = createClientComponentClient();

  // Create a new post if none exists
  useEffect(() => {
    const initializePost = async () => {
      // If we have a postId from props, use it
      if (postId) {
        setCurrentPostId(postId);
        return;
      }
      
      // If we already created a post, don't create another
      if (currentPostId || isCreatingPost) {
        return;
      }
      
      // Create a new post
      setIsCreatingPost(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('Please log in to create posts');
          router.push('/auth');
          return;
        }

        const newSlug = `draft-${Date.now()}`;
        const { data, error } = await supabase
          .from('posts')
          .insert({
            title: 'Untitled Post',
            slug: newSlug,
            content: { type: 'doc', content: [] },
            content_text: '',
            content_html: '',
            excerpt: '',
            status: 'draft',
            author_id: user.id,
            read_time: 0
          })
          .select()
          .single();

        if (error) throw error;

        setCurrentPostId(data.id);
        // Update the URL without full page reload
        window.history.replaceState({}, '', `/admin/posts/${data.id}/edit`);
        
      } catch (error) {
        console.error('Error creating new post:', error);
        toast.error('Failed to create new post');
      } finally {
        setIsCreatingPost(false);
      }
    };

    initializePost();
  }, [postId, currentPostId, isCreatingPost, supabase, router]);

  // Internal save function that directly updates Supabase
  const handleInternalSave = useCallback(async (postData: Partial<Post>) => {
    console.log('handleInternalSave called with:', { currentPostId, postData });
    
    if (!currentPostId) {
      console.log('No post ID available for saving');
      return;
    }
    
    try {
      setAutoSaveStatus('saving');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Extract category_ids and tag_ids from postData
      const { category_ids, tag_ids, ...postDataWithoutRelations } = postData as any;

      const updateData = {
        ...postDataWithoutRelations,
        updated_at: new Date().toISOString(),
      };

      console.log('Updating post with:', updateData);

      // Update the post
      const { data, error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', currentPostId)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Post updated successfully:', data);

      // Update post_categories relationship
      if (category_ids !== undefined) {
        // Delete existing relationships
        const { error: deleteError } = await supabase
          .from('post_categories')
          .delete()
          .eq('post_id', currentPostId);
        
        if (deleteError) console.error('Error deleting categories:', deleteError);

        // Insert new relationships
        if (category_ids.length > 0) {
          const { error: insertError } = await supabase
            .from('post_categories')
            .insert(
              category_ids.map((categoryId: string, index: number) => ({
                post_id: currentPostId,
                category_id: categoryId,
                is_primary: index === 0
              }))
            );
          
          if (insertError) console.error('Error inserting categories:', insertError);
        }
      }

      // Update post_tags relationship
      if (tag_ids !== undefined) {
        // Delete existing relationships
        const { error: deleteError } = await supabase
          .from('post_tags')
          .delete()
          .eq('post_id', currentPostId);
        
        if (deleteError) console.error('Error deleting tags:', deleteError);

        // Insert new relationships
        if (tag_ids.length > 0) {
          const { error: insertError } = await supabase
            .from('post_tags')
            .insert(
              tag_ids.map((tagId: string) => ({
                post_id: currentPostId,
                tag_id: tagId
              }))
            );
          
          if (insertError) console.error('Error inserting tags:', insertError);
        }
      }

      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      return data;
    } catch (error) {
      console.error('Error in handleInternalSave:', error);
      setAutoSaveStatus('error');
      toast.error('Failed to save post');
      throw error;
    }
  }, [currentPostId, supabase]);

  // Internal publish function
  const handleInternalPublish = useCallback(async (postData: Partial<Post>) => {
    if (!currentPostId) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Extract category_ids and tag_ids from postData
      const { category_ids, tag_ids, ...postDataWithoutRelations } = postData as any;

      const updateData = {
        ...postDataWithoutRelations,
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', currentPostId)
        .select()
        .single();

      if (error) throw error;

      // Update categories (same as save)
      if (category_ids !== undefined) {
        await supabase
          .from('post_categories')
          .delete()
          .eq('post_id', currentPostId);

        if (category_ids.length > 0) {
          await supabase
            .from('post_categories')
            .insert(
              category_ids.map((categoryId: string, index: number) => ({
                post_id: currentPostId,
                category_id: categoryId,
                is_primary: index === 0
              }))
            );
        }
      }

      // Update tags (same as save)
      if (tag_ids !== undefined) {
        await supabase
          .from('post_tags')
          .delete()
          .eq('post_id', currentPostId);

        if (tag_ids.length > 0) {
          await supabase
            .from('post_tags')
            .insert(
              tag_ids.map((tagId: string) => ({
                post_id: currentPostId,
                tag_id: tagId
              }))
            );
        }
      }

      toast.success('Post published successfully');
      router.push('/admin/posts');
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error('Failed to publish post');
      throw error;
    }
  }, [currentPostId, supabase, router]);

  // Use provided handlers or fall back to internal ones
  const saveHandler = onSave || handleInternalSave;
  const publishHandler = onPublish || handleInternalPublish;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Highlight,
      Typography,
      Underline,
      Strike,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg shadow-lg max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#4a90e2] hover:text-[#ff6b35] transition-colors',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-[#1a2b4a] text-[#f5f1e8] p-4 rounded-none my-4 overflow-x-auto',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      // Add CharacterCount extension here
      CharacterCount.configure({
        limit: null, // No limit, just counting
      }),
    ],
    content: post?.content || '',
    onUpdate: ({ editor }) => {
      triggerAutoSave();
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none',
      },
      handlePaste: (view, event, slice) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find(item => item.type.startsWith('image/'));
        
        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          if (file) {
            handleEditorImageUpload(file);
          }
          return true;
        }
        return false;
      },
    },
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && title) {
      setSlug(generateSlug(title));
    }
  }, [title, post]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!editor || !title || !currentPostId) {
      if (!currentPostId) {
        console.log('Waiting for post to be created before auto-saving');
      }
      return;
    }
    
    try {
      const content = editor.getJSON();
      const content_text = editor.getText();
      const content_html = editor.getHTML();
      const read_time = calculateReadTime(content_text);
      
      await saveHandler({
        title,
        slug,
        content,
        content_text,
        content_html,
        excerpt,
        featured_image: featuredImage,
        read_time,
        ...seoData,
        status: 'draft',
        category_ids: categories,
        tag_ids: tags
      });
      
      console.log('Auto-save successful');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [editor, title, slug, excerpt, featuredImage, seoData, saveHandler, categories, tags, currentPostId]);

  // Trigger auto-save with debounce
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 5000); // Auto-save after 5 seconds of inactivity
  }, [autoSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImage(file, 'blog-images');
      editor?.chain().focus().setImage({ src: url }).run();
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  // Handle image upload from editor toolbar
  const handleEditorImageUpload = async (file: File) => {
    try {
      const url = await uploadImage(file, 'blog-images');
      editor?.chain().focus().setImage({ src: url }).run();
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  // Handle publish
  const handlePublish = async () => {
    if (!editor || !title || !slug || !currentPostId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const content = editor.getJSON();
    const content_text = editor.getText();
    const content_html = editor.getHTML();
    const read_time = calculateReadTime(content_text);
    
    const finalSeoData = {
      seo_title: seoData.seo_title || title.substring(0, 60),
      seo_description: seoData.seo_description || excerpt.substring(0, 160) || content_text.substring(0, 160),
      seo_keywords: seoData.seo_keywords.length > 0 ? seoData.seo_keywords : []
    };

    await publishHandler({
      title,
      slug,
      content,
      content_text,
      content_html,
      excerpt,
      featured_image: featuredImage,
      read_time,
      ...finalSeoData,
      category_ids: categories,
      tag_ids: tags
    });
  };

  // Manual save
  const handleManualSave = async () => {
    console.log('Manual save triggered');
    console.log('Current state:', {
      currentPostId,
      title,
      slug,
      hasEditor: !!editor,
      autoSaveStatus
    });

    if (!editor || !title) {
      toast.error('Please add a title');
      return;
    }
    
    // Wait for post to be created if it doesn't exist yet
    if (!currentPostId) {
      toast.error('Please wait for the post to be created');
      return;
    }
    
    try {
      const content = editor.getJSON();
      const content_text = editor.getText();
      const content_html = editor.getHTML();
      const read_time = calculateReadTime(content_text);
      
      const saveData = {
        title,
        slug,
        content,
        content_text,
        content_html,
        excerpt,
        featured_image: featuredImage,
        read_time,
        ...seoData,
        status: 'draft' as const,
        category_ids: categories,
        tag_ids: tags
      };
      
      console.log('Saving with data:', saveData);
      
      await saveHandler(saveData);
      
      toast.success('Draft saved successfully');
    } catch (error) {
      console.error('Manual save failed:', error);
      toast.error('Failed to save draft');
    }
  };

  // Test database connection function
  const testDatabaseConnection = async () => {
    console.log('Testing database connection...');
    
    try {
      // Test 1: Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth test:', { user: user?.email, error: authError });
      
      if (!user) {
        console.error('Not authenticated');
        return;
      }
      
      // Test 2: Try to read posts
      const { data: posts, error: readError } = await supabase
        .from('posts')
        .select('id, title, status')
        .limit(5);
      console.log('Read test:', { count: posts?.length, error: readError });
      
      // Test 3: Try to create a test post
      const testPost = {
        title: 'Test Post ' + new Date().toISOString(),
        slug: 'test-' + Date.now(),
        content: { type: 'doc', content: [] },
        status: 'draft',
        author_id: user.id
      };
      
      const { data: created, error: createError } = await supabase
        .from('posts')
        .insert(testPost)
        .select()
        .single();
      console.log('Create test:', { created: created?.id, error: createError });
      
      // Test 4: Try to update the test post
      if (created) {
        const { data: updated, error: updateError } = await supabase
          .from('posts')
          .update({ title: 'Updated Test Post' })
          .eq('id', created.id)
          .select()
          .single();
        console.log('Update test:', { updated: updated?.title, error: updateError });
        
        // Clean up - delete the test post
        const { error: deleteError } = await supabase
          .from('posts')
          .delete()
          .eq('id', created.id);
        console.log('Delete test:', { error: deleteError });
      }
      
    } catch (error) {
      console.error('Database test failed:', error);
    }
  };

  // Show loading state while creating post
  if (isCreatingPost) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a90e2] mx-auto mb-4"></div>
          <p className="text-gray-600">Creating new post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] bg-[#f5f1e8]">
      {/* Main Editor - Fixed Layout */}
      <div className="flex-1 flex flex-col bg-white shadow-lg overflow-hidden">
        {/* Header Section - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              triggerAutoSave();
            }}
            placeholder="Enter post title..."
            className="w-full text-4xl font-black text-[#1a2b4a] border-none outline-none mb-4 placeholder-gray-400"
          />
          
          {/* Slug */}
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Slug:</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                triggerAutoSave();
              }}
              className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#4a90e2]"
            />
          </div>

          {/* Excerpt */}
          <textarea
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value);
              triggerAutoSave();
            }}
            placeholder="Brief description..."
            className="w-full p-2 border border-gray-300 rounded mb-4 resize-none focus:outline-none focus:border-[#4a90e2]"
            rows={2}
          />
        </div>

        {/* Toolbar - Sticky */}
        <div className="flex-shrink-0 sticky top-0 z-10 bg-white border-b border-gray-200">
          <EditorToolbar editor={editor} onImageUpload={handleEditorImageUpload} />
        </div>
        
        {/* Editor Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div 
            className="min-h-full p-6"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('bg-oracle-orange/5');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('bg-oracle-orange/5');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('bg-oracle-orange/5');
              
              const files = Array.from(e.dataTransfer.files);
              const imageFile = files.find(file => file.type.startsWith('image/'));
              
              if (imageFile) {
                handleEditorImageUpload(imageFile);
              }
            }}
          >
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Status Bar - Fixed */}
        <div className="flex-shrink-0 px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className={`flex items-center gap-2 ${
              autoSaveStatus === 'saving' ? 'text-blue-600' : 
              autoSaveStatus === 'saved' ? 'text-green-600' : 
              'text-red-600'
            }`}>
              {autoSaveStatus === 'saving' && (
                <>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  Saving...
                </>
              )}
              {autoSaveStatus === 'saved' && (
                <>
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  Saved
                </>
              )}
              {autoSaveStatus === 'error' && (
                <>
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  Error saving
                </>
              )}
            </span>
            {lastSaved && (
              <span className="text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="text-gray-500">
            {editor?.storage.characterCount.characters()} characters • {editor?.storage.characterCount.words()} words
          </div>
        </div>
      </div>

      {/* Sidebar - Scrollable */}
      <div className="w-96 flex-shrink-0 overflow-y-auto bg-[#f5f1e8] p-6 space-y-6">
        {/* Publish Controls */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-bold text-[#1a2b4a] mb-4">Publish</h3>
          
          <div className="space-y-4">
            <button
              onClick={handleManualSave}
              disabled={!currentPostId || autoSaveStatus === 'saving'}
              className="w-full px-4 py-2 bg-gray-200 text-[#1a2b4a] font-bold rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {autoSaveStatus === 'saving' ? 'Saving...' : 'Save Draft'}
            </button>
            
            <button
              onClick={handlePublish}
              disabled={!currentPostId || !title || !slug}
              className="w-full px-4 py-2 bg-[#ff6b35] text-white font-bold rounded hover:bg-[#e55a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish Now
            </button>
          </div>

          {/* Show save status */}
          {autoSaveStatus === 'saved' && lastSaved && (
            <p className="text-sm text-green-600 mt-2">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
          
          {autoSaveStatus === 'error' && (
            <p className="text-sm text-red-600 mt-2">
              Error saving draft
            </p>
          )}

          {/* Categories & Tags */}
          <div className="mt-6 space-y-4">
            <CategorySelector
              selectedCategories={categories}
              onChange={(newCategories) => {
                setCategories(newCategories);
                triggerAutoSave();
              }}
            />
            
            <TagSelector
              selectedTags={tags}
              onChange={(newTags) => {
                setTags(newTags);
                triggerAutoSave();
              }}
            />
          </div>

          {/* Featured Image */}
          <div className="mt-6">
            <ImageUpload
              value={featuredImage}
              onChange={(url) => {
                setFeaturedImage(url);
                triggerAutoSave();
              }}
              onRemove={() => {
                setFeaturedImage('');
                triggerAutoSave();
              }}
            />
          </div>
        </div>

        {/* SEO Panel */}
        <SEOPanel
          data={seoData}
          onChange={(newData) => {
            setSeoData(newData);
            triggerAutoSave();
          }}
          content={editor?.getText() || ''}
          title={title}
        />

        {/* AI Assistant Toggle */}
        <button
          onClick={() => setShowAI(!showAI)}
          className="w-full px-4 py-3 bg-[#4a90e2] text-white font-bold rounded hover:bg-[#3a7bc8] transition-colors"
        >
          {showAI ? 'Hide' : 'Show'} AI Assistant
        </button>

        {/* Social Media Generator Toggle */}
        <button
          onClick={() => setShowSocialGenerator(!showSocialGenerator)}
          className="w-full px-4 py-3 bg-[#ff6b35] text-white font-bold rounded hover:bg-[#e55a2b] transition-colors"
        >
          Generate Social Posts
        </button>

        {/* Test Database Connection - Temporary */}
        <button
          onClick={testDatabaseConnection}
          className="w-full px-4 py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors"
        >
          Test Database
        </button>
      </div>

      {/* AI Assistant Sidebar */}
      {showAI && (
        <div className="absolute right-0 top-0 h-full z-50">
          <AIAssistant
            onClose={() => setShowAI(false)}
            onInsert={(text) => {
              editor?.chain().focus().insertContent(text).run();
            }}
            context={{
              title,
              content: editor?.getText() || '',
              excerpt
            }}
          />
        </div>
      )}

      {/* Social Media Generator Modal */}
      {showSocialGenerator && post && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <SocialMediaGenerator
              postTitle={title}
              postContent={editor?.getText() || ''}
              postUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`}
              onClose={() => setShowSocialGenerator(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 