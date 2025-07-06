// FILE: supabase/migrations/006_rss_feed_schema.sql
// RSS feed schema migration

-- RSS Feed Management
CREATE TABLE IF NOT EXISTS rss_feeds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL UNIQUE,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_fetch TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fetch_interval INTEGER DEFAULT 60, -- minutes
    auto_import BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSS Feed Items
CREATE TABLE IF NOT EXISTS rss_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    link TEXT NOT NULL,
    pub_date TIMESTAMP WITH TIME ZONE,
    author VARCHAR(255),
    category VARCHAR(100),
    guid VARCHAR(500), -- Unique identifier from RSS feed
    imported BOOLEAN DEFAULT false,
    imported_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(feed_id, guid)
);

-- RSS Import History
CREATE TABLE IF NOT EXISTS rss_import_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    item_id UUID REFERENCES rss_items(id) ON DELETE CASCADE,
    import_type VARCHAR(50) NOT NULL, -- 'manual', 'auto', 'bulk'
    status VARCHAR(50) NOT NULL, -- 'success', 'failed', 'skipped'
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSS Feed Analytics
CREATE TABLE IF NOT EXISTS rss_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    items_fetched INTEGER DEFAULT 0,
    items_imported INTEGER DEFAULT 0,
    fetch_duration_ms INTEGER, -- Time taken to fetch feed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(feed_id, date)
);

-- RSS Content Templates (for auto-import)
CREATE TABLE IF NOT EXISTS rss_content_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_content TEXT NOT NULL,
    feed_categories JSONB, -- Array of categories this template applies to
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rss_feeds_active ON rss_feeds(is_active);
CREATE INDEX IF NOT EXISTS idx_rss_feeds_category ON rss_feeds(category);
CREATE INDEX IF NOT EXISTS idx_rss_items_feed_id ON rss_items(feed_id);
CREATE INDEX IF NOT EXISTS idx_rss_items_imported ON rss_items(imported);
CREATE INDEX IF NOT EXISTS idx_rss_items_pub_date ON rss_items(pub_date);
CREATE INDEX IF NOT EXISTS idx_rss_items_guid ON rss_items(guid);
CREATE INDEX IF NOT EXISTS idx_rss_import_history_feed_id ON rss_import_history(feed_id);
CREATE INDEX IF NOT EXISTS idx_rss_import_history_date ON rss_import_history(created_at);
CREATE INDEX IF NOT EXISTS idx_rss_analytics_feed_date ON rss_analytics(feed_id, date);

-- Insert some default RSS feeds for accounting/tax content
INSERT INTO rss_feeds (name, url, category, is_active, fetch_interval, auto_import) VALUES
    ('HMRC News', 'https://www.gov.uk/government/organisations/hm-revenue-customs.atom', 'Tax', true, 120, false),
    ('ICAEW Insights', 'https://www.icaew.com/insights/rss', 'Accounting', true, 180, false),
    ('Accounting Today', 'https://www.accountingtoday.com/rss.xml', 'Accounting', true, 240, false),
    ('Tax Notes', 'https://www.taxnotes.com/rss', 'Tax', true, 300, false),
    ('Small Business UK', 'https://smallbusiness.co.uk/feed/', 'Business', true, 360, false)
ON CONFLICT (url) DO NOTHING;

-- Insert default content templates for RSS imports
INSERT INTO rss_content_templates (name, description, template_content, feed_categories) VALUES
    ('Tax Update Summary', 'Template for summarizing tax-related RSS content', 
     '📢 **Tax Update**: {title}\n\n{description}\n\n*Source: {source}*\n\n#TaxUpdate #HMRC #UKTax', 
     '["Tax"]'),
    
    ('Accounting Insight', 'Template for accounting-related content', 
     '💡 **Accounting Insight**: {title}\n\n{description}\n\n*Source: {source}*\n\n#Accounting #BusinessInsight #UKAccounting', 
     '["Accounting"]'),
    
    ('Business News Summary', 'Template for general business news', 
     '📈 **Business Update**: {title}\n\n{description}\n\n*Source: {source}*\n\n#BusinessNews #UKBusiness #SmallBusiness', 
     '["Business"]')
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_rss_feeds_updated_at 
    BEFORE UPDATE ON rss_feeds 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rss_items_updated_at 
    BEFORE UPDATE ON rss_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rss_content_templates_updated_at 
    BEFORE UPDATE ON rss_content_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to fetch and parse RSS feeds
CREATE OR REPLACE FUNCTION fetch_rss_feed(feed_url TEXT)
RETURNS TABLE(
    title TEXT,
    description TEXT,
    link TEXT,
    pub_date TIMESTAMP WITH TIME ZONE,
    author TEXT,
    category TEXT,
    guid TEXT
) AS $$
BEGIN
    -- This would be implemented with actual RSS parsing logic
    -- For now, return empty result
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- Function to update feed last_fetch timestamp
CREATE OR REPLACE FUNCTION update_feed_last_fetch(feed_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE rss_feeds 
    SET last_fetch = NOW() 
    WHERE id = feed_uuid;
END;
$$ LANGUAGE plpgsql; 