import { Category } from '@/lib/types/blog';

export interface CategoryWithMeta extends Omit<Category, 'parent_id'> {
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  parent_id?: string | null;
  is_featured?: boolean;
  is_visible?: boolean;
  sort_order?: number;
  image_url?: string | null;
  icon?: string | null;
  color?: string | null;
  post_count?: number;
  view_count?: number;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  meta_description?: string;
  meta_keywords?: string;
  parent_id?: string | null;
  is_featured?: boolean;
  is_visible?: boolean;
  image_url?: string | null;
  icon?: string | null;
  color?: string | null;
}

export interface CategoryFilters {
  search?: string;
  featured?: boolean;
  visible?: boolean;
  parent_id?: string | null;
  sortBy?: 'name' | 'created_at' | 'sort_order' | 'post_count';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

class CategoryService {
  private baseUrl = '/api/admin/categories';

  /**
   * Fetch categories with optional filters
   */
  async getCategories(filters?: CategoryFilters): Promise<CategoryWithMeta[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    params.append('includePostCount', 'true');
    
    const response = await fetch(`${this.baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    return data.categories;
  }

  /**
   * Get a single category by ID
   */
  async getCategory(id: string): Promise<CategoryWithMeta> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error('Failed to fetch category');
    }
    
    const data = await response.json();
    return data.category;
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<CategoryWithMeta> {
    const response = await fetch(`${this.baseUrl}/slug/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Category not found');
      }
      throw new Error('Failed to fetch category');
    }
    
    const data = await response.json();
    return data.category;
  }

  /**
   * Create a new category
   */
  async createCategory(data: CategoryFormData): Promise<CategoryWithMeta> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create category');
    }
    
    const result = await response.json();
    return result.category;
  }

  /**
   * Update an existing category
   */
  async updateCategory(id: string, data: Partial<CategoryFormData>): Promise<CategoryWithMeta> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update category');
    }
    
    const result = await response.json();
    return result.category;
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete category');
    }
  }

  /**
   * Delete multiple categories
   */
  async bulkDeleteCategories(ids: string[]): Promise<{ deletedCount: number }> {
    const response = await fetch(`${this.baseUrl}/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryIds: ids }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete categories');
    }
    
    return response.json();
  }

  /**
   * Reorder categories
   */
  async reorderCategories(orders: { id: string; sort_order: number }[]): Promise<void> {
    const response = await fetch(`${this.baseUrl}/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryOrders: orders }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to reorder categories');
    }
  }

  /**
   * Toggle category featured status
   */
  async toggleFeatured(id: string, featured: boolean): Promise<CategoryWithMeta> {
    return this.updateCategory(id, { is_featured: featured });
  }

  /**
   * Toggle category visibility
   */
  async toggleVisibility(id: string, visible: boolean): Promise<CategoryWithMeta> {
    return this.updateCategory(id, { is_visible: visible });
  }

  /**
   * Get category hierarchy (for nested categories)
   */
  async getCategoryHierarchy(): Promise<CategoryWithMeta[]> {
    const categories = await this.getCategories({ sortBy: 'sort_order' });
    return this.buildHierarchy(categories);
  }

  /**
   * Build hierarchical structure from flat category list
   */
  private buildHierarchy(categories: CategoryWithMeta[]): CategoryWithMeta[] {
    const categoryMap = new Map<string, CategoryWithMeta & { children?: CategoryWithMeta[] }>();
    const rootCategories: (CategoryWithMeta & { children?: CategoryWithMeta[] })[] = [];
    
    // First pass: create map
    categories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });
    
    // Second pass: build hierarchy
    categories.forEach(cat => {
      const categoryWithChildren = categoryMap.get(cat.id)!;
      
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        const parent = categoryMap.get(cat.parent_id)!;
        parent.children!.push(categoryWithChildren);
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });
    
    return rootCategories;
  }

  /**
   * Get featured categories
   */
  async getFeaturedCategories(limit?: number): Promise<CategoryWithMeta[]> {
    return this.getCategories({
      featured: true,
      visible: true,
      sortBy: 'sort_order',
      limit,
    });
  }

  /**
   * Get popular categories (by post count)
   */
  async getPopularCategories(limit = 10): Promise<CategoryWithMeta[]> {
    return this.getCategories({
      visible: true,
      sortBy: 'post_count',
      sortOrder: 'desc',
      limit,
    });
  }

  /**
   * Search categories
   */
  async searchCategories(query: string): Promise<CategoryWithMeta[]> {
    return this.getCategories({
      search: query,
      visible: true,
    });
  }

  /**
   * Import categories from JSON
   */
  async importCategories(data: any[]): Promise<{ imported: number; failed: number }> {
    const response = await fetch(`${this.baseUrl}/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categories: data }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to import categories');
    }
    
    return response.json();
  }

  /**
   * Export categories to JSON
   */
  async exportCategories(): Promise<CategoryWithMeta[]> {
    const categories = await this.getCategories({
      sortBy: 'sort_order',
    });
    
    return categories;
  }

  /**
   * Get category statistics
   */
  async getCategoryStats(): Promise<{
    total: number;
    featured: number;
    visible: number;
    withPosts: number;
  }> {
    const response = await fetch(`${this.baseUrl}/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch category statistics');
    }
    
    return response.json();
  }

  /**
   * Merge categories (move all posts from source to target)
   */
  async mergeCategories(sourceId: string, targetId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sourceId, targetId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to merge categories');
    }
  }
}

// Export singleton instance
export const categoryService = new CategoryService();

// Export type for use in components
export type { CategoryService }; 