// FILE: components/admin/KnowledgeBase.tsx
// Knowledge base component

'use client';

import { useState, useEffect } from 'react';
import { Search, BookOpen, FileText, MessageSquare, Filter, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface KnowledgeItem {
  id: string;
  score?: number;
  metadata: {
    title: string;
    type: string;
    content: string;
    category?: string;
    tags?: string[];
  };
}

export default function KnowledgeBase() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadKnowledgeBase();
  }, [selectedType]);

  const loadKnowledgeBase = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedType) params.append('type', selectedType);
      params.append('limit', '50');

      const response = await fetch(`/api/embeddings/search?${params}`);
      if (!response.ok) throw new Error('Failed to load knowledge base');
      
      const data = await response.json();
      setKnowledgeItems(data.results || []);
    } catch (error) {
      console.error('Error loading knowledge base:', error);
      toast.error('Failed to load knowledge base');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadKnowledgeBase();
      return;
    }

    try {
      setSearching(true);
      const response = await fetch('/api/embeddings/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          type: selectedType || undefined,
          limit: 20
        })
      });

      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setKnowledgeItems(data.results || []);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className="w-4 h-4" />;
      case 'knowledge':
        return <BookOpen className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'bg-blue-100 text-blue-800';
      case 'knowledge':
        return 'bg-green-100 text-green-800';
      case 'document':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatContent = (content: string) => {
    if (content.length > 200) {
      return content.substring(0, 200) + '...';
    }
    return content;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading knowledge base...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Knowledge Base</h2>
          <p className="text-sm text-gray-600 mt-1">
            Browse and search indexed documents and knowledge
          </p>
        </div>
        
        <button
          onClick={loadKnowledgeBase}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Types</option>
                <option value="blog">Blog Posts</option>
                <option value="knowledge">Knowledge Base</option>
                <option value="document">Documents</option>
              </select>
            </div>
            
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-6 py-2 bg-[#ff6b35] text-white rounded-lg hover:bg-[#e55a2b] disabled:opacity-50 transition-colors"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            {searchQuery ? 'Search Results' : 'Knowledge Base Items'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {knowledgeItems.length} {knowledgeItems.length === 1 ? 'item' : 'items'} found
          </p>
        </div>

        {knowledgeItems.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No results found' : 'No knowledge base items'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Try adjusting your search terms or filters.'
                : 'Knowledge base items will appear here once indexed.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {knowledgeItems.map((item, index) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(item.metadata.type)}
                      <h4 className="font-medium text-gray-900">
                        {item.metadata.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(item.metadata.type)}`}>
                        {item.metadata.type}
                      </span>
                      {item.score && (
                        <span className="text-xs text-gray-500">
                          Score: {item.score.toFixed(3)}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {formatContent(item.metadata.content)}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {item.metadata.category && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {item.metadata.category}
                        </span>
                      )}
                      {item.metadata.tags && item.metadata.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 ml-4">
                    ID: {item.id.substring(0, 8)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Total Items</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {knowledgeItems.length}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-900">Blog Posts</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {knowledgeItems.filter(item => item.metadata.type === 'blog').length}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-900">Knowledge</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {knowledgeItems.filter(item => item.metadata.type === 'knowledge').length}
          </p>
        </div>
      </div>
    </div>
  );
} 