'use client';

import { useState, useEffect } from 'react';
import AIBlogEditor from '@/components/admin/AIBlogEditor';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SafeDate } from '@/components/ui/SafeDate';
import ErrorBoundary from '@/components/ErrorBoundary';

// Move type definition above the component
type PostWithFlexibleContent = { [key: string]: any; content?: string | object };

// Helper to extract plain text from TipTap/editor JSON
const extractTextFromJSON = (doc: any): string => {
  if (!doc || !doc.content) return '';
  let text = '';
  const extractFromNode = (node: any) => {
    if (node.type === 'text') {
      text += node.text || '';
    } else if (node.content && Array.isArray(node.content)) {
      node.content.forEach(extractFromNode);
    }
    if (node.type === 'paragraph') {
      text += '\n\n';
    } else if (node.type === 'heading') {
      const level = node.attrs?.level || 1;
      text = text.trim() + '\n\n' + '#'.repeat(level) + ' ';
    }
  };
  if (Array.isArray(doc.content)) {
    doc.content.forEach(extractFromNode);
  } else {
    extractFromNode(doc);
  }
  return text.trim();
};



export default function EditPostPage() {
  const { id: postId } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [post, setPost] = useState<PostWithFlexibleContent | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication and fetch post data
    const initializePage = async () => {
      try {
        // Check authentication
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);

        // Fetch the post data
        const { data: postData, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();
        
        if (error || !postData) {
          console.log('Post not found:', postId, error);
          router.push('/admin/posts');
          return;
        }
        // Debug logs
        console.log('Post data:', postData);
        console.log('Content type:', typeof postData?.content);
        console.log('Content value:', postData?.content);
        // Parse content for display
        let tiptapContent: string | object = '';
        let plainTextContent = '';
        if (postData.content) {
          try {
            if (typeof postData.content === 'string' && postData.content.trim().startsWith('{')) {
              const parsed = JSON.parse(postData.content);
              tiptapContent = parsed;
              plainTextContent = extractTextFromJSON(parsed);
            } else {
              tiptapContent = postData.content;
              plainTextContent = postData.content;
            }
          } catch (error) {
            console.error('Error parsing content:', error);
            tiptapContent = postData.content;
            plainTextContent = postData.content;
          }
        }
        // Debug logs
        console.log('Parsed content:', plainTextContent);
        console.log('Content length:', plainTextContent.length);
        setPost({
          ...postData,
          content: tiptapContent,
          plainTextContent
        });
      } catch (error) {
        console.error('Error initializing page:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializePage();
  }, [postId, router, supabase]);

  const handleSave = async (content: string, metadata: any) => {
    try {
      // Save as JSON doc format
      const contentToSave = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: { textAlign: null },
            content: [{ type: 'text', text: content }]
          }
        ]
      };
      const { error } = await supabase
        .from('posts')
        .update({
          content: JSON.stringify(contentToSave),
          title: metadata.title,
          keywords: metadata.keywords,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);
      if (!error) {
        console.log('Post saved successfully');
        // You could show a success toast here
      } else {
        console.error('Error saving post:', error);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-medium text-[#1a2b4a]">Loading editor...</span>
        </div>
      </div>
    );
  }

  if (!post || !user) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1a2b4a] mb-4">Post not found</h1>
          <Link
            href="/admin/posts"
            className="px-4 py-2 bg-[#ff6b35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
          >
            Back to Posts
          </Link>
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
            initialContent={post.plainTextContent || ''}
            postId={postId}
            userId={user.id}
            post={post}
            onSave={handleSave}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}