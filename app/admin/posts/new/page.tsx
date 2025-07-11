'use client';

import dynamic from 'next/dynamic';

const BlogEditor = dynamic(
  () => import('@/components/admin/BlogEditor'),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-screen">Loading editor...</div>
  }
);

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BlogEditor />
    </div>
  );
} 