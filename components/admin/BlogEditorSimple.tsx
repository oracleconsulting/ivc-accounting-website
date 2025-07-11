'use client';

import { useState } from 'react';

interface BlogEditorSimpleProps {
  post?: any;
  postId?: string;
}

export default function BlogEditorSimple({ post, postId }: BlogEditorSimpleProps) {
  const [title, setTitle] = useState(post?.title || '');

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            className="w-full text-4xl font-black text-[#1a2b4a] border-none outline-none mb-4 placeholder-gray-400"
          />
          
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Slug:</span>
            <input
              type="text"
              value={post?.slug || ''}
              className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#4a90e2]"
              readOnly
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <textarea
            placeholder="Start writing your blog post..."
            className="w-full h-full p-4 border border-gray-300 rounded resize-none focus:outline-none focus:border-[#4a90e2]"
            rows={20}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-96 flex-shrink-0 bg-[#f5f1e8] p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-bold text-[#1a2b4a] mb-4">Post Info</h3>
          <p className="text-sm text-gray-600">Post ID: {postId}</p>
          <p className="text-sm text-gray-600">Status: {post?.status || 'draft'}</p>
          <p className="text-sm text-gray-600">Created: {post?.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
} 