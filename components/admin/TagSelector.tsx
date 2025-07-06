'use client';

import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { X, Plus } from 'lucide-react';
import { Tag } from '@/lib/types/blog';
import { generateSlug } from '@/lib/utils/blog';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export default function TagSelector({ 
  selectedTags, 
  onChange,
  maxTags = 10
}: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = tags.filter(tag => 
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.includes(tag.id)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, tags, selectedTags]);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = async (tag: Tag) => {
    if (selectedTags.length < maxTags && !selectedTags.includes(tag.id)) {
      onChange([...selectedTags, tag.id]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const createNewTag = async () => {
    if (!inputValue.trim() || selectedTags.length >= maxTags) return;

    try {
      const newTag = {
        name: inputValue.trim(),
        slug: generateSlug(inputValue.trim())
      };

      const { data, error } = await supabase
        .from('tags')
        .insert(newTag)
        .select()
        .single();

      if (error) throw error;

      setTags([...tags, data]);
      addTag(data);
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const removeTag = (tagId: string) => {
    onChange(selectedTags.filter(id => id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (suggestions.length > 0) {
        addTag(suggestions[0]);
      } else if (inputValue.trim()) {
        createNewTag();
      }
    }
  };

  const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag.id));

  return (
    <div>
      <label className="block text-sm font-bold text-[#1a2b4a] mb-2">
        Tags
      </label>
      
      {/* Selected Tags */}
      {selectedTagObjects.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTagObjects.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-[#4a90e2]/10 text-[#4a90e2] text-sm rounded-full"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => removeTag(tag.id)}
                className="hover:text-[#ff6b35] transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      
      {/* Tag Input */}
      {selectedTags.length < maxTags && (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Type to search or create tags..."
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-[#4a90e2]"
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowSuggestions(false)}
              />
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-48 overflow-auto">
                {suggestions.length > 0 ? (
                  suggestions.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                    >
                      {tag.name}
                    </button>
                  ))
                ) : inputValue.trim() ? (
                  <button
                    type="button"
                    onClick={createNewTag}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm flex items-center gap-2 text-[#4a90e2]"
                  >
                    <Plus className="w-4 h-4" />
                    Create "{inputValue.trim()}"
                  </button>
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Start typing to search tags...
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
      
      <p className="mt-1 text-xs text-gray-500">
        {selectedTags.length} of {maxTags} tags
      </p>
    </div>
  );
} 