'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Check, ChevronDown, Plus } from 'lucide-react';
import { Category } from '@/lib/types/blog';

interface CategorySelectorProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  maxSelections?: number;
}

export default function CategorySelector({ 
  selectedCategories, 
  onChange,
  maxSelections = 3
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else if (selectedCategories.length < maxSelections) {
      onChange([...selectedCategories, categoryId]);
    }
  };

  const selectedCategoryNames = categories
    .filter(cat => selectedCategories.includes(cat.id))
    .map(cat => cat.name)
    .join(', ');

  return (
    <div className="relative">
      <label className="block text-sm font-bold text-[#1a2b4a] mb-2">
        Categories
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left border border-gray-300 bg-white hover:border-[#4a90e2] focus:outline-none focus:border-[#4a90e2] transition-colors flex items-center justify-between"
      >
        <span className="text-sm">
          {selectedCategories.length === 0 ? (
            <span className="text-gray-500">Select categories...</span>
          ) : (
            <span className="text-[#1a2b4a]">
              {selectedCategoryNames || 'Select categories...'}
            </span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-60 overflow-auto">
            {loading ? (
              <div className="p-3 text-center text-gray-500">Loading...</div>
            ) : categories.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                No categories found
              </div>
            ) : (
              categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  disabled={!selectedCategories.includes(category.id) && selectedCategories.length >= maxSelections}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div>
                    <div className="text-sm font-medium text-[#1a2b4a]">
                      {category.name}
                    </div>
                    {category.description && (
                      <div className="text-xs text-gray-500">
                        {category.description}
                      </div>
                    )}
                  </div>
                  {selectedCategories.includes(category.id) && (
                    <Check className="w-4 h-4 text-[#ff6b35]" />
                  )}
                </button>
              ))
            )}
            
            <div className="border-t border-gray-200 p-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to categories management
                  window.open('/admin/categories', '_blank');
                }}
                className="w-full px-3 py-2 text-sm text-[#4a90e2] hover:bg-gray-50 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Manage Categories
              </button>
            </div>
          </div>
        </>
      )}
      
      {selectedCategories.length > 0 && (
        <p className="mt-1 text-xs text-gray-500">
          {selectedCategories.length} of {maxSelections} selected
        </p>
      )}
    </div>
  );
} 