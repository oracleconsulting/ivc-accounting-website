-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  content_text TEXT,
  content_html TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  seo_title VARCHAR(60),
  seo_description VARCHAR(160),
  seo_keywords TEXT[],
  og_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  read_time INTEGER, -- in minutes
  embedding vector(1536) -- for Pinecone sync
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction tables
CREATE TABLE post_categories (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Version history
CREATE TABLE post_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- AI chat history
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  messages JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_author ON posts(author_id);

-- Create RLS policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admins can manage posts" ON posts
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Public can read published posts
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (status = 'published' AND published_at <= NOW());

-- Similar policies for other tables
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tags" ON tags
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Public can view tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage post versions" ON post_versions
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage AI conversations" ON ai_conversations
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insert some default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Tax Strategy', 'tax-strategy', 'Tax planning and optimization strategies'),
  ('Business Strategy', 'business-strategy', 'Business growth and development insights'),
  ('Industry Insights', 'industry-insights', 'Accounting industry analysis and trends'),
  ('Company Culture', 'company-culture', 'Behind the scenes at IVC Accounting'),
  ('R&D Tax Credits', 'rd-tax-credits', 'Research and Development tax credit guidance');

-- Insert some default tags
INSERT INTO tags (name, slug) VALUES
  ('accountant', 'accountant'),
  ('halstead', 'halstead'),
  ('essex', 'essex'),
  ('tax', 'tax'),
  ('business', 'business'),
  ('accounting', 'accounting'),
  ('UK', 'uk'),
  ('startup', 'startup'),
  ('SME', 'sme'),
  ('tax planning', 'tax-planning'); 