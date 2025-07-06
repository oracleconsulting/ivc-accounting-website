'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FolderOpen, Tag } from 'lucide-react';
import { Category as CategoryType, Tag as TagType } from '@/lib/types/blog';

interface BlogFiltersProps {
  categories: CategoryType[];
  tags: TagType[];
  selectedCategory?: string;
  selectedTag?: string;
  totalPosts: number;
}

export default function BlogFilters({ 
  categories, 
  tags, 
  selectedCategory, 
  selectedTag, 
  totalPosts 
}: BlogFiltersProps) {
  const searchParams = useSearchParams();

  const createFilterUrl = (type: 'category' | 'tag', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (type === 'category') {
      params.delete('tag');
      params.delete('page');
      if (value === selectedCategory) {
        params.delete('category');
      } else {
        params.set('category', value);
      }
    } else {
      params.delete('category');
      params.delete('page');
      if (value === selectedTag) {
        params.delete('tag');
      } else {
        params.set('tag', value);
      }
    }
    
    return `/blog${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('tag');
    params.delete('page');
    return `/blog${params.toString() ? `?${params.toString()}` : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-bold text-oracle-navy mb-2">Blog Overview</h3>
        <p className="text-sm text-gray-600">
          {totalPosts} post{totalPosts !== 1 ? 's' : ''} available
        </p>
        {(selectedCategory || selectedTag) && (
          <Link
            href={clearFilters()}
            className="inline-block mt-2 text-sm text-oracle-orange hover:text-oracle-orange/80 font-medium"
          >
            Clear all filters
          </Link>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen className="w-5 h-5 text-oracle-orange" />
          <h3 className="font-bold text-oracle-navy">Categories</h3>
        </div>
        
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories available</p>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={createFilterUrl('category', category.slug)}
                className={`block text-sm transition-colors ${
                  selectedCategory === category.slug
                    ? 'text-oracle-orange font-medium'
                    : 'text-gray-600 hover:text-oracle-navy'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-oracle-blue" />
          <h3 className="font-bold text-oracle-navy">Popular Tags</h3>
        </div>
        
        {tags.length === 0 ? (
          <p className="text-sm text-gray-500">No tags available</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 10).map((tag) => (
              <Link
                key={tag.id}
                href={createFilterUrl('tag', tag.slug)}
                className={`inline-block px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedTag === tag.slug
                    ? 'bg-oracle-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-oracle-blue hover:text-white'
                }`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-oracle-navy to-oracle-blue text-white p-4 rounded-lg">
        <h3 className="font-bold mb-2">Stay Updated</h3>
        <p className="text-sm text-oracle-cream/90 mb-4">
          Get the latest insights delivered to your inbox
        </p>
        <Link
          href="/newsletter"
          className="inline-block w-full text-center bg-oracle-orange text-white px-4 py-2 rounded-lg font-bold hover:bg-oracle-orange/90 transition-colors"
        >
          Subscribe
        </Link>
      </div>
    </div>
  );
} 