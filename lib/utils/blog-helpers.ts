import { Post } from '@/lib/types/blog';

/**
 * Extract category IDs from a post, supporting multiple data structures
 */
export function extractCategoryIds(post: Partial<Post>): string[] {
  if (!post) return [];
  
  // Support multiple data structures
  if (post.category_ids) return post.category_ids;
  if ((post as any).post_categories?.length > 0) {
    return (post as any).post_categories.map((rel: any) => rel.category.id);
  }
  if ((post as any).categories?.length > 0) {
    return (post as any).categories.map((c: any) => c.id);
  }
  return [];
}

/**
 * Extract tag IDs from a post, supporting multiple data structures
 */
export function extractTagIds(post: Partial<Post>): string[] {
  if (!post) return [];
  
  // Support multiple data structures
  if (post.tag_ids) return post.tag_ids;
  if ((post as any).post_tags?.length > 0) {
    return (post as any).post_tags.map((rel: any) => rel.tag.id);
  }
  if ((post as any).tags?.length > 0) {
    return (post as any).tags.map((t: any) => t.id);
  }
  return [];
}

/**
 * Get category names from a post, supporting multiple data structures
 */
export function getCategoryNames(post: Partial<Post>): string[] {
  if (!post) return [];
  
  if ((post as any).post_categories?.length > 0) {
    return (post as any).post_categories.map((rel: any) => rel.category.name);
  }
  if ((post as any).categories?.length > 0) {
    return (post as any).categories.map((c: any) => c.name);
  }
  return [];
}

/**
 * Get tag names from a post, supporting multiple data structures
 */
export function getTagNames(post: Partial<Post>): string[] {
  if (!post) return [];
  
  if ((post as any).post_tags?.length > 0) {
    return (post as any).post_tags.map((rel: any) => rel.tag.name);
  }
  if ((post as any).tags?.length > 0) {
    return (post as any).tags.map((t: any) => t.name);
  }
  return [];
}

/**
 * Get the primary category from a post
 */
export function getPrimaryCategory(post: Partial<Post>): { id: string; name: string; slug: string } | null {
  if (!post) return null;
  
  if ((post as any).post_categories?.length > 0) {
    const category = (post as any).post_categories[0].category;
    return { id: category.id, name: category.name, slug: category.slug };
  }
  if ((post as any).categories?.length > 0) {
    const category = (post as any).categories[0];
    return { id: category.id, name: category.name, slug: category.slug };
  }
  return null;
}

/**
 * Check if a post has categories
 */
export function hasCategories(post: Partial<Post>): boolean {
  return extractCategoryIds(post).length > 0;
}

/**
 * Check if a post has tags
 */
export function hasTags(post: Partial<Post>): boolean {
  return extractTagIds(post).length > 0;
} 