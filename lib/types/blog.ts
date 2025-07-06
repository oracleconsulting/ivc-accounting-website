export interface Post {
  id: string;
  title: string;
  slug: string;
  content: any; // TipTap JSON
  content_text: string;
  content_html: string;
  excerpt: string;
  featured_image?: string;
  author_id: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  og_image?: string;
  published_at?: string;
  scheduled_for?: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  read_time: number;
  categories?: Category[];
  tags?: Tag[];
  category_ids?: string[];
  tag_ids?: string[];
  author?: {
    name: string;
    email: string;
  };
  post_categories?: Array<{
    category: Category;
  }>;
  post_tags?: Array<{
    tag: Tag;
  }>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
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