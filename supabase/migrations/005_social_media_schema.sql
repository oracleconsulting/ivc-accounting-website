-- Social Media Platform Connections
CREATE TABLE IF NOT EXISTS social_platform_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform_id VARCHAR(50) NOT NULL UNIQUE,
    platform_name VARCHAR(100) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    profile_url TEXT,
    connected BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Posts
CREATE TABLE IF NOT EXISTS social_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    post_id VARCHAR(255), -- External platform post ID
    engagement INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    images JSONB,
    hashtags JSONB,
    status VARCHAR(20) DEFAULT 'published',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled Social Media Posts
CREATE TABLE IF NOT EXISTS social_scheduled_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    platforms JSONB NOT NULL, -- Array of platform IDs
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    images JSONB,
    hashtags JSONB,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, published, failed, cancelled
    published_posts JSONB, -- Array of published post IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Analytics
CREATE TABLE IF NOT EXISTS social_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    posts_count INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    total_reach INTEGER DEFAULT 0,
    average_engagement_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(platform, date)
);

-- Social Media Content Templates
CREATE TABLE IF NOT EXISTS social_content_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    platforms JSONB, -- Array of platform IDs this template is for
    hashtags JSONB,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Campaigns
CREATE TABLE IF NOT EXISTS social_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    platforms JSONB, -- Array of platform IDs
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, completed, paused
    goals JSONB, -- Campaign goals and metrics
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Posts (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS campaign_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES social_campaigns(id) ON DELETE CASCADE,
    post_id UUID REFERENCES social_scheduled_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, post_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_published_at ON social_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_at ON social_scheduled_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON social_scheduled_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_analytics_platform_date ON social_analytics(platform, date);
CREATE INDEX IF NOT EXISTS idx_campaign_posts_campaign_id ON campaign_posts(campaign_id);

-- Insert default platform configurations
INSERT INTO social_platform_connections (platform_id, platform_name, connected) VALUES
    ('linkedin', 'LinkedIn', false),
    ('instagram', 'Instagram', false),
    ('twitter', 'Twitter/X', false),
    ('youtube', 'YouTube', false),
    ('tiktok', 'TikTok', false)
ON CONFLICT (platform_id) DO NOTHING;

-- Insert some default content templates
INSERT INTO social_content_templates (name, description, content, platforms, hashtags, category) VALUES
    ('Tax Tip Tuesday', 'Weekly tax tips for small businesses', '💡 Tax Tip Tuesday: Did you know that small businesses can claim up to £1,000 in trading income allowance? This could save you money on your tax bill! #TaxTipTuesday #SmallBusiness #Accounting', 
     '["linkedin", "twitter"]', '["TaxTipTuesday", "SmallBusiness", "Accounting", "TaxTips"]', 'educational'),
    
    ('Client Success Story', 'Template for sharing client success stories', '🎉 Success Story: We helped [Client Name] save £15,000 on their tax bill this year through strategic planning and proper record keeping. Ready to see how we can help your business? #SuccessStory #TaxSavings #IVCAccounting', 
     '["linkedin", "instagram"]', '["SuccessStory", "TaxSavings", "IVCAccounting", "ClientSuccess"]', 'testimonial'),
    
    ('Making Tax Digital Update', 'Updates about MTD requirements', '📢 Making Tax Digital Update: From April 2024, all VAT-registered businesses must use MTD-compatible software. Are you ready? We can help you transition smoothly. #MakingTaxDigital #MTD #VAT #BusinessCompliance', 
     '["linkedin", "twitter"]', '["MakingTaxDigital", "MTD", "VAT", "BusinessCompliance"]', 'compliance')
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_social_platform_connections_updated_at 
    BEFORE UPDATE ON social_platform_connections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at 
    BEFORE UPDATE ON social_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_scheduled_posts_updated_at 
    BEFORE UPDATE ON social_scheduled_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_content_templates_updated_at 
    BEFORE UPDATE ON social_content_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_campaigns_updated_at 
    BEFORE UPDATE ON social_campaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 