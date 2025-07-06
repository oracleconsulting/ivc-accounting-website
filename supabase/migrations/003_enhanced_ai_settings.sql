-- Enhanced AI Settings with Multi-Provider Support
-- Add provider configuration to ai_settings
ALTER TABLE ai_settings ADD COLUMN IF NOT EXISTS provider_config JSONB DEFAULT '{
  "research": {"provider": "openrouter", "model": "anthropic/claude-3-opus"},
  "writing": {"provider": "openrouter", "model": "openai/gpt-4-turbo"},
  "social": {"provider": "openrouter", "model": "anthropic/claude-3-haiku"}
}';

-- Add API keys table for secure storage
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider)
);

-- Add usage tracking table
CREATE TABLE IF NOT EXISTS ai_usage_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_type TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  cost NUMERIC(10,6) NOT NULL,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_log_created_at ON ai_usage_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_log_provider ON ai_usage_log(provider);
CREATE INDEX IF NOT EXISTS idx_ai_usage_log_agent_type ON ai_usage_log(agent_type);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage API keys" ON api_keys
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view usage logs" ON ai_usage_log
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "System can insert usage logs" ON ai_usage_log
  FOR INSERT WITH CHECK (true);

-- Update existing ai_settings with provider config if not exists
UPDATE ai_settings 
SET provider_config = '{
  "research": {"provider": "openrouter", "model": "anthropic/claude-3-opus"},
  "writing": {"provider": "openrouter", "model": "openai/gpt-4-turbo"},
  "social": {"provider": "openrouter", "model": "anthropic/claude-3-haiku"}
}'
WHERE provider_config IS NULL; 