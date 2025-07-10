'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

export default function BlogPostContent({ post }: { post: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 animate-pulse" />;
  }

  const renderContent = () => {
    if (!post.content) {
      return <p>No content available</p>;
    }
    
    if (typeof post.content === 'string' && !post.content.startsWith('{')) {
      return <div dangerouslySetInnerHTML={{ __html: post.content }} />;
    }
    
    if (post.content_html) {
      return <div dangerouslySetInnerHTML={{ __html: post.content_html }} />;
    }
    
    return <p>{post.excerpt || 'Content preview not available'}</p>;
  };

  return (
    <article className="min-h-screen bg-[#f5f1e8]">
      <div className="bg-[#1a2b4a] text-white">
        <div className="container mx-auto px-4 py-12">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-[#f5f1e8]/60 hover:text-[#f5f1e8] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <h1 className="text-4xl md:text-5xl font-black mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-[#f5f1e8]/80">
            {post.author && (
              <span>{post.author.full_name || 'IVC Team'}</span>
            )}
            
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.published_at).toLocaleDateString()}
              </span>
            )}
            
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.read_time || 5} min read
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {renderContent()}
          </div>
        </div>
      </div>
    </article>
  );
} 