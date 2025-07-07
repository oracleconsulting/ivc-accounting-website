export interface Author {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface PostCategory {
  category: Category;
}

export interface PostTag {
  tag: Tag;
}

// Join table relations for many-to-many relationships
export interface PostCategoryRelation {
  category: Category;
}

export interface PostTagRelation {
  tag: Tag;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: any; // JSON content from Tiptap
  content_text: string; // Plain text version
  content_html: string; // HTML version
  excerpt: string | null;
  featured_image: string | null;
  status: 'draft' | 'published' | 'scheduled';
  author_id: string;
  author?: Author;
  published_at: string | null;
  scheduled_for: string | null;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  read_time: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  
  // Support both data structures:
  // 1. Simple arrays (for editing)
  category_ids?: string[];
  tag_ids?: string[];
  
  // 2. Join table relations (for display)
  post_categories?: PostCategoryRelation[];
  post_tags?: PostTagRelation[];
  
  // Legacy support
  categories?: PostCategory[];
  tags?: PostTag[];
}

export interface PostFilters {
  search?: string;
  status?: 'all' | 'published' | 'draft' | 'scheduled';
  category?: string;
  tag?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PostStats {
  total: number;
  published: number;
  draft: number;
  scheduled: number;
}

export interface PaginationInfo {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PostsResponse {
  posts: Post[];
  pagination: PaginationInfo;
  stats: PostStats;
}

export interface PostVersion {
  id: string;
  post_id: string;
  title: string;
  content: any;
  created_at: string;
  created_by: string;
}

export interface AIConversation {
  id: string;
  post_id: string;
  messages: any;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
}

// Database table types for authentication
export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
} 