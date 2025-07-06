'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, ChevronDown, ChevronUp, Star, StarOff, Download, Upload, Eye, EyeOff, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CategoryWithMeta } from '@/lib/services/categoryService';

interface CategoryFormData {
  name: string;
  description: string;
  meta_description: string;
  meta_keywords: string;
  parent_id: string | null;
  is_featured: boolean;
  is_visible: boolean;
}

// Sortable category row component
function SortableCategoryRow({ category, onEdit, onDelete, onToggleFeatured, onToggleVisibility }: {
  category: CategoryWithMeta;
  onEdit: (category: CategoryWithMeta) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-gray-50">
      <td className="px-4 py-4 w-10">
        <div {...attributes} {...listeners} className="cursor-move text-gray-400 hover:text-gray-600">
          <GripVertical className="w-5 h-5" />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 rounded border-gray-300 text-[#ff6b35] focus:ring-[#ff6b35]"
            value={category.id}
            onChange={(e) => {
              // Handle selection for bulk operations
            }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {category.name}
              </span>
              {category.is_featured && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
              {!category.is_visible && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  Hidden
                </span>
              )}
            </div>
            {category.description && (
              <p className="text-sm text-gray-500 mt-1">
                {category.description}
              </p>
            )}
            {category.meta_description && (
              <p className="text-xs text-gray-400 mt-1 italic">
                SEO: {category.meta_description}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <code className="px-2 py-1 bg-gray-100 rounded text-xs">
          {category.slug}
        </code>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 text-center">
        {category.post_count || 0}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {format(new Date(category.created_at), 'MMM d, yyyy')}
      </td>
      <td className="px-6 py-4 text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onToggleFeatured(category.id, !category.is_featured)}
            className={`p-1.5 rounded hover:bg-gray-100 ${
              category.is_featured ? 'text-yellow-600' : 'text-gray-400'
            }`}
            title={category.is_featured ? 'Remove from featured' : 'Add to featured'}
          >
            {category.is_featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onToggleVisibility(category.id, !category.is_visible)}
            className={`p-1.5 rounded hover:bg-gray-100 ${
              category.is_visible ? 'text-gray-600' : 'text-gray-400'
            }`}
            title={category.is_visible ? 'Hide category' : 'Show category'}
          >
            {category.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEdit(category)}
            className="p-1.5 rounded hover:bg-gray-100 text-[#4a90e2] hover:text-[#3a7bc8]"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-1.5 rounded hover:bg-gray-100 text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function EnhancedCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'sort_order'>('sort_order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    meta_description: '',
    meta_keywords: '',
    parent_id: null,
    is_featured: false,
    is_visible: true
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchCategories = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        includePostCount: 'true',
        sortBy,
        sortOrder
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/categories?${params}`);
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories);
      } else {
        console.error('Error fetching categories:', data.error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        meta_keywords: formData.meta_keywords ? formData.meta_keywords.split(',').map(k => k.trim()) : null
      };

      const response = await fetch(
        editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Reset form
        setFormData({
          name: '',
          description: '',
          meta_description: '',
          meta_keywords: '',
          parent_id: null,
          is_featured: false,
          is_visible: true
        });
        setIsAddingNew(false);
        setEditingId(null);
        setShowAdvancedForm(false);
        
        // Refresh categories
        fetchCategories();
      } else {
        alert(data.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleEdit = (category: CategoryWithMeta) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
      meta_description: category.meta_description || '',
      meta_keywords: category.meta_keywords?.join(', ') || '',
      parent_id: category.parent_id || null,
      is_featured: category.is_featured || false,
      is_visible: category.is_visible !== false
    });
    setIsAddingNew(true);
    setShowAdvancedForm(!!(category.meta_description || category.meta_keywords));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCategories();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) {
      alert('Please select categories to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedCategories.length} categories?`)) return;

    try {
      const response = await fetch('/api/admin/categories/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryIds: selectedCategories })
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedCategories([]);
        fetchCategories();
      } else {
        alert(data.error || 'Failed to delete categories');
      }
    } catch (error) {
      console.error('Error deleting categories:', error);
      alert('Failed to delete categories');
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: featured })
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: visible })
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);

      const newCategories = arrayMove(categories, oldIndex, newIndex);
      setCategories(newCategories);

      // Update sort orders
      const categoryOrders = newCategories.map((cat, index) => ({
        id: cat.id,
        sort_order: index
      }));

      try {
        await fetch('/api/admin/categories/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryOrders })
        });
      } catch (error) {
        console.error('Error reordering categories:', error);
        // Revert on error
        fetchCategories();
      }
    }
  };

  const exportCategories = () => {
    const dataStr = JSON.stringify(categories, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `categories_${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <div className="flex gap-3">
          <button
            onClick={exportCategories}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => {
              setIsAddingNew(true);
              setEditingId(null);
              setFormData({
                name: '',
                description: '',
                meta_description: '',
                meta_keywords: '',
                parent_id: null,
                is_featured: false,
                is_visible: true
              });
            }}
            className="flex items-center gap-2 bg-[#ff6b35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
          />
        </div>
        
        {selectedCategories.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected ({selectedCategories.length})
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                  placeholder="e.g., Tax Planning"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>
                <select
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                >
                  <option value="">None (Top Level)</option>
                  {categories
                    .filter(cat => cat.id !== editingId)
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                rows={3}
                placeholder="Brief description of this category..."
              />
            </div>

            {/* Category Settings */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-gray-300 text-[#ff6b35] focus:ring-[#ff6b35]"
                />
                <span className="text-sm text-gray-700">Featured Category</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="rounded border-gray-300 text-[#ff6b35] focus:ring-[#ff6b35]"
                />
                <span className="text-sm text-gray-700">Visible to Public</span>
              </label>
            </div>

            {/* Advanced Options */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvancedForm(!showAdvancedForm)}
                className="flex items-center gap-2 text-sm text-[#4a90e2] hover:text-[#3a7bc8]"
              >
                {showAdvancedForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Advanced SEO Options
              </button>
            </div>

            {showAdvancedForm && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                    rows={2}
                    placeholder="SEO description for this category page (max 160 characters)"
                    maxLength={160}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.meta_description.length}/160 characters
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.meta_keywords}
                    onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                    placeholder="Comma-separated keywords (e.g., tax, planning, uk business)"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#ff6b35] text-white px-4 py-2 rounded-md hover:bg-[#e55a2b] transition-colors"
              >
                {editingId ? 'Update Category' : 'Create Category'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingId(null);
                  setShowAdvancedForm(false);
                  setFormData({
                    name: '',
                    description: '',
                    meta_description: '',
                    meta_keywords: '',
                    parent_id: null,
                    is_featured: false,
                    is_visible: true
                  });
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-10"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posts
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? 'No categories found matching your search.' : 'No categories yet. Create your first one!'}
                </td>
              </tr>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredCategories}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredCategories.map((category) => (
                    <SortableCategoryRow
                      key={category.id}
                      category={category}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleFeatured={handleToggleFeatured}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 