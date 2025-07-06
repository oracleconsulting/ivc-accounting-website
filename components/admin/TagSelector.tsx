'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, X, Search } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Tag } from '@/lib/types/blog';
import toast from 'react-hot-toast';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = tags.filter(tag => 
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.includes(tag.id)
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags([]);
    }
  }, [inputValue, tags, selectedTags]);

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTag = async (name: string) => {
    if (!name.trim()) return;
    
    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([{ name: name.trim() }])
        .select()
        .single();

      if (error) throw error;
      
      setTags(prev => [...prev, data]);
      addTag(data.id);
      setInputValue('');
      toast.success('Tag created successfully');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
    } finally {
      setIsCreating(false);
    }
  };

  const addTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      onChange([...selectedTags, tagId]);
    }
  };

  const removeTag = (tagId: string) => {
    onChange(selectedTags.filter(id => id !== tagId));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTags.length > 0) {
        addTag(filteredTags[0].id);
        setInputValue('');
      } else if (inputValue.trim()) {
        createTag(inputValue);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getSelectedTagNames = () => {
    return tags
      .filter(tag => selectedTags.includes(tag.id))
      .map(tag => tag.name);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#1a2b4a] mb-2">
          Tags
        </label>
        <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-[#1a2b4a] mb-2">
        Tags
      </label>
      
      <div className="relative">
        <div className="flex items-center border border-gray-300 rounded-lg bg-white focus-within:border-[#4a90e2]">
          <Search className="w-4 h-4 text-gray-400 ml-3" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search or create tags..."
            className="flex-1 px-3 py-2 border-none outline-none text-sm"
            disabled={isCreating}
          />
          {isCreating && (
            <div className="animate-spin w-4 h-4 border-2 border-[#4a90e2] border-t-transparent rounded-full mr-3" />
          )}
        </div>

        {isOpen && (inputValue.trim() || filteredTags.length > 0) && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="py-1">
              {filteredTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    addTag(tag.id);
                    setInputValue('');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2 text-[#4a90e2]" />
                  {tag.name}
                </button>
              ))}
              
              {inputValue.trim() && filteredTags.length === 0 && (
                <button
                  onClick={() => createTag(inputValue)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm flex items-center text-[#4a90e2]"
                  disabled={isCreating}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create "{inputValue.trim()}"
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {getSelectedTagNames().map((tagName, index) => {
            const tagId = tags.find(t => t.name === tagName)?.id;
            return (
              <span
                key={tagId || index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#ff6b35] text-white"
              >
                {tagName}
                <button
                  type="button"
                  onClick={() => tagId && removeTag(tagId)}
                  className="ml-1 hover:bg-[#e55a2b] rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
} 