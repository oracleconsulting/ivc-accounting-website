'use client';

import Link from 'next/link';
import { useAnalytics } from '@/hooks/useAnalytics';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
}

interface BlogPostProps {
  post: BlogPost;
}

export default function BlogPost({ post }: BlogPostProps) {
  const { trackDoc } = useAnalytics();

  const handleClick = () => {
    if (post.date !== 'Coming Soon') {
      trackDoc(`blog_post_${post.slug}`);
    }
  };

  return (
    <article className="relative group">
      {/* Offset Border */}
      <div className="absolute -top-2 -left-2 w-full h-full border-2 border-[#ff6b35] group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
      
      {/* Card Content */}
      <div className="relative bg-white border-2 border-[#1a2b4a] overflow-hidden">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-[#1a2b4a]">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                #ff6b35 20px,
                #ff6b35 21px
              )`
            }} />
          </div>
          <div className="absolute top-4 left-4">
            <span className="bg-[#ff6b35] text-[#f5f1e8] px-3 py-1 text-sm font-bold">
              {post.category}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-center text-sm text-[#1a2b4a]/60 mb-4">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
          
          <h2 className="text-2xl font-black text-[#1a2b4a] mb-4">
            {post.title}
          </h2>
          
          <p className="text-[#1a2b4a]/80 mb-6">
            {post.description}
          </p>
          
          {post.date === 'Coming Soon' ? (
            <span className="text-[#ff6b35] font-bold">Coming Soon →</span>
          ) : (
            <Link 
              href={`/blog/${post.slug}`}
              className="text-[#ff6b35] font-bold hover:text-[#e55a2b]"
              onClick={handleClick}
            >
              Read More →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
} 