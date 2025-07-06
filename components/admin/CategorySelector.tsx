'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Category } from '@/lib/types/blog';

interface CategorySelectorProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export default function CategorySelector({ selectedCategories, onChange }: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    onChange(newSelection);
  };

  const getSelectedNames = () => {
    return categories
      .filter(cat => selectedCategories.includes(cat.id))
      .map(cat => cat.name)
      .join(', ');
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#1a2b4a] mb-2">
          Categories
        </label>
        <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-[#1a2b4a] mb-2">
        Categories
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-[#4a90e2] focus:outline-none focus:border-[#4a90e2]"
        >
          <span className={selectedCategories.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
            {selectedCategories.length > 0 ? getSelectedNames() : 'Select categories...'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {categories.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No categories available
              </div>
            ) : (
              <div className="py-1">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="mr-2 text-[#4a90e2] focus:ring-[#4a90e2]"
                    />
                    <span className="text-sm">{category.name}</span>
                    {selectedCategories.includes(category.id) && (
                      <Check className="w-4 h-4 ml-auto text-[#4a90e2]" />
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {categories
            .filter(cat => selectedCategories.includes(cat.id))
            .map(category => (
              <span
                key={category.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#4a90e2] text-white"
              >
                {category.name}
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="ml-1 hover:bg-[#3a7bc8] rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            ))}
        </div>
      )}
    </div>
  );
} 