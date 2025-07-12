-- Campaign Database Schema for IVC Accounting
-- Run this in your Supabase SQL editor

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  topic TEXT NOT NULL,
  description TEXT,
  blog_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  newsletter_id UUID,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'ready', 'publishing', 'published', 'failed')),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  target_audience TEXT,
  goals TEXT[],
  tone VARCHAR(50) DEFAULT 'professional',
  keywords TEXT[]
);

-- Campaign social series table
CREATE TABLE IF NOT EXISTS campaign_social_series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'twitter', 'facebook', 'instagram')),
  content JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  external_post_ids JSONB,
  engagement_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign downloads table
CREATE TABLE IF NOT EXISTS campaign_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('pdf', 'video_script', 'infographic')),
  title VARCHAR(255) NOT NULL,
  file_url TEXT,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign analytics table
CREATE TABLE IF NOT EXISTS campaign_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  total_reach INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  best_performing_channel VARCHAR(50),
  roi DECIMAL(10,2) DEFAULT 0,
  channel_breakdown JSONB,
  date_range_start DATE,
  date_range_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign timeline table
CREATE TABLE IF NOT EXISTS campaign_timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  executed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media posts table
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'twitter', 'facebook', 'instagram', 'youtube')),
  content TEXT NOT NULL,
  media_urls TEXT[],
  hashtags TEXT[],
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  external_post_id VARCHAR(255),
  engagement_metrics JSONB,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform connections table
CREATE TABLE IF NOT EXISTS platform_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'twitter', 'facebook', 'instagram', 'youtube')),
  platform_user_id VARCHAR(255),
  platform_username VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  profile_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Campaign templates table
CREATE TABLE IF NOT EXISTS campaign_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_campaign_social_series_campaign_id ON campaign_social_series(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_social_series_platform ON campaign_social_series(platform);
CREATE INDEX IF NOT EXISTS idx_campaign_social_series_status ON campaign_social_series(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_campaign_id ON social_posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_platform_connections_user_id ON platform_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_connections_platform ON platform_connections(platform);

-- Create RLS policies
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_social_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_templates ENABLE ROW LEVEL SECURITY;

-- Campaigns policies
CREATE POLICY "Users can view their own campaigns" ON campaigns
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own campaigns" ON campaigns
  FOR DELETE USING (auth.uid() = created_by);

-- Campaign social series policies
CREATE POLICY "Users can view their campaign social series" ON campaign_social_series
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = campaign_social_series.campaign_id 
      AND campaigns.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can insert their campaign social series" ON campaign_social_series
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = campaign_social_series.campaign_id 
      AND campaigns.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update their campaign social series" ON campaign_social_series
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM campaigns 
      WHERE campaigns.id = campaign_social_series.campaign_id 
      AND campaigns.created_by = auth.uid()
    )
  );

-- Social posts policies
CREATE POLICY "Users can view their own social posts" ON social_posts
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own social posts" ON social_posts
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own social posts" ON social_posts
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own social posts" ON social_posts
  FOR DELETE USING (auth.uid() = created_by);

-- Platform connections policies
CREATE POLICY "Users can view their own platform connections" ON platform_connections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own platform connections" ON platform_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own platform connections" ON platform_connections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own platform connections" ON platform_connections
  FOR DELETE USING (auth.uid() = user_id);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_social_series_updated_at BEFORE UPDATE ON campaign_social_series
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_downloads_updated_at BEFORE UPDATE ON campaign_downloads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_analytics_updated_at BEFORE UPDATE ON campaign_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON social_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_connections_updated_at BEFORE UPDATE ON platform_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_templates_updated_at BEFORE UPDATE ON campaign_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default campaign template
INSERT INTO campaign_templates (name, description, template_data, is_default, created_by)
VALUES (
  'Default Campaign Template',
  'Standard template for IVC Accounting campaigns',
  '{
    "linkedin": {
      "seriesLength": 5,
      "postStructure": ["hook", "problem", "solution", "example", "cta"]
    },
    "twitter": {
      "threadLength": 10,
      "threadStructure": ["opener", "problem", "solution", "examples", "takeaways", "cta"]
    },
    "facebook": {
      "postCount": 3,
      "postTypes": ["educational", "engagement", "promotional"]
    },
    "instagram": {
      "slideCount": 5,
      "slideStructure": ["hook", "tips", "tips", "example", "cta"]
    }
  }',
  true,
  NULL
) ON CONFLICT DO NOTHING; 