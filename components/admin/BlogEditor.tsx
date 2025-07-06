'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import EditorToolbar from './EditorToolbar';
import SEOPanel from './SEOPanel';
import AIAssistant from './AIAssistant';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { generateSlug, calculateReadTime } from '@/lib/utils/blog';
import { uploadImage } from '@/lib/utils/storage';
import toast from 'react-hot-toast';
import { Post } from '@/lib/types/blog';

const lowlight = createLowlight(common);

interface BlogEditorProps {
  post?: Post;
  onSave: (post: Partial<Post>) => Promise<void>;
  onPublish: (post: Partial<Post>) => Promise<void>;
}

export default function BlogEditor({ post, onSave, onPublish }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '');
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [seoData, setSeoData] = useState({
    seo_title: post?.seo_title || '',
    seo_description: post?.seo_description || '',
    seo_keywords: post?.seo_keywords || []
  });
  const [showAI, setShowAI] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  
  const supabase = createClientComponentClient();

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
          class: 'rounded-lg shadow-lg',
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
    ],
    content: post?.content || '',
    onUpdate: ({ editor }) => {
      debouncedAutoSave();
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px]',
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
    if (!editor || !title) return;
    
    setAutoSaveStatus('saving');
    
    try {
      const content = editor.getJSON();
      const content_text = editor.getText();
      const content_html = editor.getHTML();
      const read_time = calculateReadTime(content_text);
      
      await onSave({
        title,
        slug,
        content,
        content_text,
        content_html,
        excerpt,
        featured_image: featuredImage,
        read_time,
        ...seoData,
        status: 'draft'
      });
      
      setAutoSaveStatus('saved');
    } catch (error) {
      setAutoSaveStatus('error');
      console.error('Auto-save failed:', error);
    }
  }, [editor, title, slug, excerpt, featuredImage, seoData, onSave]);

  const debouncedAutoSave = useCallback(
    debounce(autoSave, 30000), // Auto-save every 30 seconds
    [autoSave]
  );

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

  // Handle publish
  const handlePublish = async () => {
    if (!editor || !title || !slug) {
      toast.error('Please fill in all required fields');
      return;
    }

    const content = editor.getJSON();
    const content_text = editor.getText();
    const content_html = editor.getHTML();
    const read_time = calculateReadTime(content_text);
    
    // Auto-generate SEO data if not provided
    const finalSeoData = {
      seo_title: seoData.seo_title || title.substring(0, 60),
      seo_description: seoData.seo_description || excerpt.substring(0, 160) || content_text.substring(0, 160),
      seo_keywords: seoData.seo_keywords.length > 0 ? seoData.seo_keywords : []
    };

    await onPublish({
      title,
      slug,
      content,
      content_text,
      content_html,
      excerpt,
      featured_image: featuredImage,
      read_time,
      ...finalSeoData,
      status: 'published',
      published_at: new Date().toISOString()
    });
  };

  return (
    <div className="flex gap-6">
      {/* Main Editor */}
      <div className="flex-1 bg-white p-6 shadow-lg">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title..."
          className="w-full text-4xl font-black text-[#1a2b4a] border-none outline-none mb-4 placeholder-gray-400"
        />
        
        {/* Slug */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Slug:</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="flex-1 text-sm px-2 py-1 border border-gray-300"
          />
        </div>

        {/* Excerpt */}
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief description..."
          className="w-full p-2 border border-gray-300 mb-4 resize-none"
          rows={2}
        />

        {/* Editor Toolbar */}
        <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />
        
        {/* Editor Content */}
        <div className="border border-gray-300 p-4 min-h-[500px]">
          <EditorContent editor={editor} />
        </div>

        {/* Auto-save status */}
        <div className="mt-4 text-sm text-gray-600">
          {autoSaveStatus === 'saving' && 'Saving...'}
          {autoSaveStatus === 'saved' && 'All changes saved'}
          {autoSaveStatus === 'error' && 'Error saving changes'}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-96 space-y-6">
        {/* Publish Controls */}
        <div className="bg-white p-6 shadow-lg">
          <h3 className="font-bold text-[#1a2b4a] mb-4">Publish</h3>
          
          <div className="space-y-4">
            <button
              onClick={() => autoSave()}
              className="w-full px-4 py-2 bg-gray-200 text-[#1a2b4a] font-bold hover:bg-gray-300 transition-colors"
            >
              Save Draft
            </button>
            
            <button
              onClick={handlePublish}
              className="w-full px-4 py-2 bg-[#ff6b35] text-white font-bold hover:bg-[#e55a2b] transition-colors"
            >
              Publish Now
            </button>
          </div>

          {/* Categories & Tags */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#1a2b4a] mb-2">
                Categories
              </label>
              {/* Category selector component */}
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#1a2b4a] mb-2">
                Tags
              </label>
              {/* Tag selector component */}
            </div>
          </div>

          {/* Featured Image */}
          <div className="mt-6">
            <label className="block text-sm font-bold text-[#1a2b4a] mb-2">
              Featured Image
            </label>
            {/* Image upload component */}
          </div>
        </div>

        {/* SEO Panel */}
        <SEOPanel
          data={seoData}
          onChange={setSeoData}
          content={editor?.getText() || ''}
          title={title}
        />

        {/* AI Assistant Toggle */}
        <button
          onClick={() => setShowAI(!showAI)}
          className="w-full px-4 py-3 bg-[#4a90e2] text-white font-bold hover:bg-[#3a7bc8] transition-colors"
        >
          {showAI ? 'Hide' : 'Show'} AI Assistant
        </button>
      </div>

      {/* AI Assistant Sidebar */}
      {showAI && (
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
      )}
    </div>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 