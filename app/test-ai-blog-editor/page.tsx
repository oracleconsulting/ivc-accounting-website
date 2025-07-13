'use client';

import { AIBlogEditor } from '@/components/admin/AIBlogEditor';

export default function TestAIBlogEditorPage() {
  const handleSave = (content: string, metadata: any) => {
    console.log('Saving content:', { content, metadata });
    alert('Content saved! Check console for details.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Blog Editor Test</h1>
          <p className="text-gray-600 mt-2">
            This is a test page for the comprehensive AI Blog Editor. No authentication required.
          </p>
        </div>
        
        <AIBlogEditor
          initialContent="This is a test blog post about AI-powered content creation. The AI Blog Editor provides comprehensive tools for writing, reviewing, and optimizing content for maximum impact."
          postId="test-post-123"
          userId="test-user-456"
          onSave={handleSave}
        />
      </div>
    </div>
  );
} 