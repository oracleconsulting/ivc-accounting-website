-- AI Usage Tracking
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL(10, 6) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Conversations (for context retention)
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Scheduled Posts
CREATE TABLE IF NOT EXISTS social_scheduled_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  platforms TEXT[] NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  images TEXT[],
  hashtags TEXT[],
  status VARCHAR(20) DEFAULT 'scheduled',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_social_scheduled_posts_scheduled_at ON social_scheduled_posts(scheduled_at);

-- Add RLS policies
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_scheduled_posts ENABLE ROW LEVEL SECURITY;

-- AI Usage policies
CREATE POLICY "Users can view their own AI usage" ON ai_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI usage" ON ai_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI Conversations policies
CREATE POLICY "Users can view their own conversations" ON ai_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON ai_conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- Social Media Scheduled Posts policies
CREATE POLICY "Users can view posts they created" ON social_scheduled_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = social_scheduled_posts.post_id 
      AND posts.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert posts for their content" ON social_scheduled_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = social_scheduled_posts.post_id 
      AND posts.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their scheduled posts" ON social_scheduled_posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = social_scheduled_posts.post_id 
      AND posts.author_id = auth.uid()
    )
  ); 