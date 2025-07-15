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

// Diagnostic Panel Component
function DiagnosticPanel({ post, postId }: { post: any; postId: string }) {
  return (
    <div className="bg-red-50 border-4 border-red-500 p-6 m-4 rounded-lg">
      <h2 className="text-2xl font-bold text-red-700 mb-4">🚨 DIAGNOSTIC PANEL</h2>
      
      <div className="space-y-4">
        {/* Check if post exists */}
        <div className="bg-white p-4 rounded border-2 border-red-300">
          <h3 className="font-bold text-red-600">Post exists?</h3>
          <p className="text-2xl">{post ? '✅ YES' : '❌ NO'}</p>
        </div>

        {/* Check post content */}
        {post && (
          <>
            <div className="bg-white p-4 rounded border-2 border-red-300">
              <h3 className="font-bold text-red-600">Post Title:</h3>
              <p className="text-lg">{post.title || '❌ NO TITLE'}</p>
            </div>

            <div className="bg-white p-4 rounded border-2 border-red-300">
              <h3 className="font-bold text-red-600">Post Content Type:</h3>
              <p className="text-lg font-mono">{typeof post.content}</p>
            </div>

            <div className="bg-white p-4 rounded border-2 border-red-300">
              <h3 className="font-bold text-red-600">Post Content Preview:</h3>
              <p className="text-sm font-mono bg-gray-100 p-2 overflow-auto">
                {post.content ? String(post.content).substring(0, 200) + '...' : '❌ NO CONTENT'}
              </p>
            </div>

            <div className="bg-white p-4 rounded border-2 border-red-300">
              <h3 className="font-bold text-red-600">Post Structure:</h3>
              <pre className="text-xs bg-gray-100 p-2 overflow-auto max-h-40">
                {JSON.stringify(post, null, 2)}
              </pre>
            </div>
          </>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              console.log('=== DIAGNOSTIC OUTPUT ===');
              console.log('Post ID:', postId);
              console.log('Post:', post);
              console.log('Post content:', post?.content);
              console.log('Post content type:', typeof post?.content);
              console.log('========================');
              alert('Check browser console for diagnostic output');
            }}
            className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700"
          >
            Log to Console
          </button>
          
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(post, null, 2));
              alert('Post data copied to clipboard!');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
          >
            Copy Post Data
          </button>
        </div>
      </div>
    </div>
  );
}

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
        {/* Diagnostic Panel - Remove this once content is working */}
        <DiagnosticPanel post={post} postId={postId as string} />
        
        <ErrorBoundary>
          <AIBlogEditor 
            initialContent={post.content || ''}
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