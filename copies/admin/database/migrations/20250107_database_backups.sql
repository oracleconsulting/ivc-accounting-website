// FILE: supabase/migrations/20250107_database_backups.sql
// Database backups migration

-- Create database_backups table for Phase 4
CREATE TABLE IF NOT EXISTS database_backups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  size TEXT DEFAULT '0 KB',
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
  type TEXT DEFAULT 'manual' CHECK (type IN ('manual', 'automated')),
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_database_backups_created_at ON database_backups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_database_backups_status ON database_backups(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_database_backups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_database_backups_updated_at
  BEFORE UPDATE ON database_backups
  FOR EACH ROW
  EXECUTE FUNCTION update_database_backups_updated_at();

-- Insert some sample data
INSERT INTO database_backups (filename, size, status, type, created_by) VALUES
  ('backup-20250107-120000.sql', '1.2 MB', 'completed', 'automated', 'system'),
  ('backup-20250107-060000.sql', '1.1 MB', 'completed', 'automated', 'system'),
  ('backup-20250106-120000.sql', '1.0 MB', 'completed', 'automated', 'system')
ON CONFLICT DO NOTHING; 