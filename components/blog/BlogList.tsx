'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Clock, User, Tag } from 'lucide-react';
import { Post } from '@/lib/types/blog';
import { getPrimaryCategory, hasTags, getTagNames } from '@/lib/utils/blog-helpers';

interface BlogListProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  searchParams: {
    category?: string;
    tag?: string;
    search?: string;
    page?: string;
  };
}

export default function BlogList({ posts, currentPage, totalPages, searchParams }: BlogListProps) {
  const [isLoading, setIsLoading] = useState(false);

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchParams.category) params.set('category', searchParams.category);
    if (searchParams.tag) params.set('tag', searchParams.tag);
    if (searchParams.search) params.set('search', searchParams.search);
    if (page > 1) params.set('page', page.toString());
    return `/blog${params.toString() ? `?${params.toString()}` : ''}`;
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-oracle-navy mb-4">No posts found</h3>
          <p className="text-gray-600 mb-6">
            {searchParams.search 
              ? `No posts found for "${searchParams.search}". Try a different search term.`
              : 'No posts available in this category yet. Check back soon!'
            }
          </p>
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-oracle-orange text-white font-bold rounded-lg hover:bg-oracle-orange/90 transition-colors"
          >
            View All Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Featured Image */}
            <div className="relative h-48 bg-gray-200">
              {post.featured_image ? (
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-oracle-navy to-oracle-blue flex items-center justify-center">
                  <span className="text-white text-lg font-bold">IVC</span>
                </div>
              )}
              
              {/* Category Badge */}
              {(() => {
                const primaryCategory = getPrimaryCategory(post);
                return primaryCategory ? (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-oracle-orange text-white text-xs font-bold rounded-full">
                      {primaryCategory.name}
                    </span>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-oracle-navy mb-3 line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-oracle-orange transition-colors">
                  {post.title}
                </Link>
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt || post.content_text?.substring(0, 150) + '...'}
              </p>

              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author?.full_name || 'IVC Accounting'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.read_time || 5} min read</span>
                  </div>
                </div>
                <time dateTime={post.published_at || undefined}>
                  {post.published_at ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true }) : 'Recently'}
                </time>
              </div>

              {/* Tags */}
              {(() => {
                const tagNames = getTagNames(post);
                return tagNames.length > 0 ? (
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {tagNames.slice(0, 3).map((tagName, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tagName}
                        </span>
                      ))}
                      {tagNames.length > 3 && (
                        <span className="text-xs text-gray-400">+{tagNames.length - 3} more</span>
                      )}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Read More Button */}
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-oracle-orange font-bold hover:text-oracle-orange/80 transition-colors"
              >
                Read More →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={createPageUrl(currentPage - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </Link>
          )}
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (page > totalPages) return null;
              
              return (
                <Link
                  key={page}
                  href={createPageUrl(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    page === currentPage
                      ? 'bg-oracle-orange text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </Link>
              );
            })}
          </div>
          
          {currentPage < totalPages && (
            <Link
              href={createPageUrl(currentPage + 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
} 