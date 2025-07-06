'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronDown, ChevronUp, ChevronRight, Loader2, Plus, Search } from 'lucide-react';
import { categoryService, CategoryWithMeta } from '@/lib/services/categoryService';

interface CategorySelectorProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  maxSelection?: number;
  allowCreate?: boolean;
  showHierarchy?: boolean;
  required?: boolean;
  primaryCategory?: string;
  onPrimaryChange?: (categoryId: string) => void;
}

interface CategoryOption extends CategoryWithMeta {
  children?: CategoryOption[];
  level?: number;
}

export default function CategorySelector({
  selectedCategories,
  onChange,
  maxSelection,
  allowCreate = false,
  showHierarchy = true,
  required = false,
  primaryCategory,
  onPrimaryChange,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (showHierarchy) {
        const hierarchicalCategories = await categoryService.getCategoryHierarchy();
        setCategories(flattenWithLevel(hierarchicalCategories));
      } else {
        const flatCategories = await categoryService.getCategories({
          visible: true,
          sortBy: 'name',
        });
        setCategories(flatCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const flattenWithLevel = (cats: CategoryOption[], level = 0): CategoryOption[] => {
    const result: CategoryOption[] = [];
    
    cats.forEach(cat => {
      result.push({ ...cat, level });
      if (cat.children && cat.children.length > 0) {
        result.push(...flattenWithLevel(cat.children, level + 1));
      }
    });
    
    return result;
  };

  const toggleCategory = (categoryId: string) => {
    if (maxSelection && selectedCategories.length >= maxSelection && !selectedCategories.includes(categoryId)) {
      return;
    }

    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    onChange(newSelection);

    // If this was the primary category and it's being deselected, clear primary
    if (primaryCategory === categoryId && !newSelection.includes(categoryId) && onPrimaryChange) {
      onPrimaryChange(newSelection[0] || '');
    }
    
    // If no primary is set and we have selections, set the first as primary
    if (!primaryCategory && newSelection.length > 0 && onPrimaryChange) {
      onPrimaryChange(newSelection[0]);
    }
  };

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    
    const query = searchQuery.toLowerCase();
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(query) ||
      (cat.description && cat.description.toLowerCase().includes(query))
    );
  }, [categories, searchQuery]);

  const selectedCategoryNames = useMemo(() => {
    return categories
      .filter(cat => selectedCategories.includes(cat.id))
      .map(cat => cat.name)
      .join(', ');
  }, [categories, selectedCategories]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      setIsCreating(true);
      const newCategory = await categoryService.createCategory({
        name: newCategoryName.trim(),
        is_visible: true,
      });
      
      // Add to local state
      setCategories([...categories, newCategory]);
      
      // Select the new category
      toggleCategory(newCategory.id);
      
      // Reset form
      setNewCategoryName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category');
      setIsCreating(false);
    }
  };

  const renderCategoryOption = (category: CategoryOption) => {
    const hasChildren = showHierarchy && categories.some(c => c.parent_id === category.id);
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategories.includes(category.id);
    const isPrimary = primaryCategory === category.id;
    
    return (
      <div key={category.id}>
        <label
          className={`flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer ${
            category.level ? `pl-${3 + category.level * 4}` : ''
          }`}
          style={{ paddingLeft: category.level ? `${12 + category.level * 16}px` : '12px' }}
        >
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleExpanded(category.id);
              }}
              className="mr-1"
            >
              <ChevronRight
                className={`w-3 h-3 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>
          )}
          
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleCategory(category.id)}
            className="mr-2 text-[#4a90e2] focus:ring-[#4a90e2]"
          />
          
          <div className="flex-1 flex items-center gap-2">
            <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
              {category.name}
            </span>
            
            {category.post_count !== undefined && category.post_count > 0 && (
              <span className="text-xs text-gray-500">({category.post_count})</span>
            )}
            
            {isPrimary && onPrimaryChange && (
              <span className="text-xs bg-[#4a90e2] text-white px-1.5 py-0.5 rounded">
                Primary
              </span>
            )}
            
            {category.is_featured && (
              <span className="text-xs text-yellow-600">★</span>
            )}
          </div>
          
          {isSelected && (
            <Check className="w-4 h-4 ml-2 text-[#4a90e2]" />
          )}
        </label>
        
        {hasChildren && isExpanded && (
          <div>
            {categories
              .filter(c => c.parent_id === category.id)
              .map(child => renderCategoryOption(child))}
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#1a2b4a] mb-2">
          Categories {required && <span className="text-red-500">*</span>}
        </label>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-[#1a2b4a] mb-2">
        Categories {required && <span className="text-red-500">*</span>}
        {maxSelection && (
          <span className="text-xs font-normal text-gray-500 ml-2">
            (Max {maxSelection})
          </span>
        )}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-[#4a90e2] focus:outline-none focus:border-[#4a90e2]"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading categories...
            </span>
          ) : (
            <span className={selectedCategories.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
              {selectedCategories.length > 0 
                ? selectedCategoryNames || `${selectedCategories.length} selected`
                : 'Select categories...'}
            </span>
          )}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isOpen && !isLoading && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* Search bar */}
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4a90e2]"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Categories list */}
            <div className="max-h-60 overflow-y-auto">
              {filteredCategories.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  {searchQuery ? 'No categories found' : 'No categories available'}
                </div>
              ) : (
                <div className="py-1">
                  {filteredCategories
                    .filter(cat => !showHierarchy || !cat.parent_id)
                    .map(category => renderCategoryOption(category))}
                </div>
              )}
            </div>

            {/* Create new category */}
            {allowCreate && (
              <div className="p-2 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name..."
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4a90e2]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={!newCategoryName.trim() || isCreating}
                    className="px-3 py-1 text-sm bg-[#4a90e2] text-white rounded hover:bg-[#3a7bc8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {isCreating ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Primary category selection */}
            {onPrimaryChange && selectedCategories.length > 1 && (
              <div className="p-2 border-t border-gray-200">
                <div className="text-xs text-gray-600 mb-1">Select primary category:</div>
                <select
                  value={primaryCategory || ''}
                  onChange={(e) => onPrimaryChange(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4a90e2]"
                >
                  <option value="">Select primary...</option>
                  {categories
                    .filter(cat => selectedCategories.includes(cat.id))
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected categories chips */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {categories
            .filter(cat => selectedCategories.includes(cat.id))
            .map(category => (
              <span
                key={category.id}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  primaryCategory === category.id
                    ? 'bg-[#4a90e2] text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {category.name}
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="ml-1 hover:bg-black/10 rounded-full p-0.5"
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