-- AI Settings table for configurable prompts
CREATE TABLE ai_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  research_system_prompt TEXT DEFAULT 'You are an expert UK accounting and tax research assistant specializing in finding timely, relevant topics for accounting blog content. Your expertise includes UK tax law and HMRC regulations, small business accounting challenges, regional business trends in Essex and East of England, and financial planning and strategy.',
  research_temperature FLOAT DEFAULT 0.7,
  research_model TEXT DEFAULT 'anthropic/claude-3-haiku',
  writing_system_prompt TEXT DEFAULT 'You are an expert blog writer for IVC Accounting, a chartered accounting firm in Halstead, Essex. Your writing style is professional, educational, SEO-optimized without being keyword-stuffed, practical and actionable for UK small businesses, and compliant with UK financial regulations. Brand voice: "OTHER ACCOUNTANTS FILE. WE FIGHT." - We''re proactive, protective, and passionate about our clients'' success.',
  writing_temperature FLOAT DEFAULT 0.8,
  writing_model TEXT DEFAULT 'anthropic/claude-3-sonnet',
  social_system_prompt TEXT DEFAULT 'You are a social media expert for IVC Accounting. Create engaging, platform-specific content that maintains professional credibility while being approachable, uses platform best practices, includes relevant hashtags, drives traffic back to the blog, and reflects the brand: "OTHER ACCOUNTANTS FILE. WE FIGHT."',
  social_temperature FLOAT DEFAULT 0.9,
  social_model TEXT DEFAULT 'anthropic/claude-3-haiku',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT ensure_single_row CHECK (id = 1)
);

-- Social Media Posts table
CREATE TABLE social_media_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'instagram', 'youtube', 'twitter')),
  content TEXT NOT NULL,
  hashtags TEXT[],
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  buffer_id TEXT, -- Buffer API response ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Base table for embeddings
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('blog', 'knowledge', 'document', 'faq')),
  category TEXT,
  tags TEXT[],
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS featured_image_alt TEXT;

-- Create indexes
CREATE INDEX idx_social_media_posts_platform ON social_media_posts(platform);
CREATE INDEX idx_social_media_posts_status ON social_media_posts(status);
CREATE INDEX idx_social_media_posts_scheduled_at ON social_media_posts(scheduled_at);
CREATE INDEX idx_knowledge_base_type ON knowledge_base(type);
CREATE INDEX idx_knowledge_base_category ON knowledge_base(category);

-- Enable RLS
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage AI settings" ON ai_settings
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Public can read AI settings" ON ai_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage social media posts" ON social_media_posts
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage knowledge base" ON knowledge_base
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Public can read knowledge base" ON knowledge_base
  FOR SELECT USING (true);

-- Insert default AI settings
INSERT INTO ai_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Insert some sample knowledge base entries
INSERT INTO knowledge_base (title, content, type, category, tags) VALUES
(
  'UK Tax Year 2024-25 Changes',
  'Key changes for the 2024-25 tax year include new dividend tax thresholds, updated R&D tax credit rates, and Making Tax Digital phase 2 preparation requirements. Small businesses need to be aware of these changes to optimize their tax position.',
  'knowledge',
  'tax-updates',
  ARRAY['tax-year', 'dividends', 'R&D', 'MTD']
),
(
  'Essex Business Support Schemes',
  'Various government and local authority schemes available to Essex businesses including grants, loans, and advisory services. These can help with growth, innovation, and recovery from economic challenges.',
  'knowledge',
  'business-support',
  ARRAY['grants', 'loans', 'essex', 'government-support']
),
(
  'Making Tax Digital ITSA Guide',
  'Making Tax Digital for Income Tax Self Assessment (MTD ITSA) will be mandatory from April 2026 for self-employed individuals and landlords with income over £10,000. This guide covers preparation steps and compliance requirements.',
  'knowledge',
  'digital-tax',
  ARRAY['MTD', 'ITSA', 'digital-tax', 'compliance']
); 