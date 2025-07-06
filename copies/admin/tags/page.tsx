// FILE: app/admin/tags/page.tsx
// Tags management page

'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Plus, X, Tag as TagIcon, Search } from 'lucide-react';
import { format } from 'date-fns';

interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  post_count?: number;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      // Fetch tags with post count
      const { data, error } = await supabase
        .from('tags')
        .select(`
          *,
          post_tags (
            count
          )
        `)
        .order('name');

      if (error) throw error;

      // Transform data to include post count
      const tagsWithCount = data?.map(tag => ({
        ...tag,
        post_count: tag.post_tags?.length || 0
      })) || [];

      setTags(tagsWithCount);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTagName.trim()) return;
    
    const slug = generateSlug(newTagName);
    
    try {
      const { error } = await supabase
        .from('tags')
        .insert({
          name: newTagName.trim(),
          slug
        });

      if (error) throw error;

      setNewTagName('');
      setIsAddingNew(false);
      fetchTags();
    } catch (error) {
      console.error('Error adding tag:', error);
      alert('Error adding tag. Please try again.');
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert('Error deleting tag. Please try again.');
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tags...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 bg-[#ff6b35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Tag
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
        />
      </div>

      {/* Add New Tag Form */}
      {isAddingNew && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Add New Tag</h2>
          <form onSubmit={handleAddTag} className="flex gap-3">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#ff6b35] text-white px-4 py-2 rounded-md hover:bg-[#e55a2b] transition-colors"
            >
              Add Tag
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setNewTagName('');
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Tags Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {filteredTags.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No tags found matching your search.' : 'No tags yet. Create your first one!'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTags.map((tag) => (
              <div
                key={tag.id}
                className="group relative bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-[#ff6b35] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <TagIcon className="w-4 h-4 text-[#ff6b35]" />
                      <h3 className="font-medium text-gray-900">{tag.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {tag.post_count || 0} {tag.post_count === 1 ? 'post' : 'posts'}
                    </p>
                    <p className="text-xs text-gray-400">
                      Created {format(new Date(tag.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tag Cloud Preview */}
      {tags.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Tag Cloud Preview</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              // Calculate relative size based on post count
              const maxCount = Math.max(...tags.map(t => t.post_count || 0));
              const relativeSize = tag.post_count ? (tag.post_count / maxCount) : 0;
              const fontSize = 0.875 + (relativeSize * 0.75); // 0.875rem to 1.625rem
              
              return (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-gray-700 bg-gray-100 hover:bg-[#ff6b35] hover:text-white transition-colors cursor-pointer"
                  style={{ fontSize: `${fontSize}rem` }}
                >
                  {tag.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 