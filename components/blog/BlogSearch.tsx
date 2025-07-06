'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface BlogSearchProps {
  initialSearch?: string;
}

export default function BlogSearch({ initialSearch }: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSearchTerm(initialSearch || '');
  }, [initialSearch]);

  const handleSearch = (term: string) => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams.toString());
    
    if (term.trim()) {
      params.set('search', term.trim());
    } else {
      params.delete('search');
    }
    
    // Reset pagination when searching
    params.delete('page');
    
    const url = `/blog${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url);
    
    // Small delay to show loading state
    setTimeout(() => setIsSearching(false), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('page');
    router.push(`/blog${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search articles..."
          className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-oracle-orange focus:border-transparent"
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {isSearching && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-oracle-orange border-t-transparent rounded-full" />
        </div>
      )}
    </form>
  );
} 