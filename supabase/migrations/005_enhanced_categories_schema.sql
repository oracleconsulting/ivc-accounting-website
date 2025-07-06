-- Enhanced Categories Schema Migration
-- This migration adds advanced features to the categories table

-- Add new columns to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[],
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_featured ON categories(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_visible ON categories(is_visible);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Add constraints
ALTER TABLE categories 
ADD CONSTRAINT IF NOT EXISTS check_meta_description_length 
CHECK (LENGTH(meta_description) <= 160);

-- Create function to update sort_order automatically
CREATE OR REPLACE FUNCTION update_category_sort_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sort_order IS NULL THEN
    SELECT COALESCE(MAX(sort_order), 0) + 1 INTO NEW.sort_order 
    FROM categories;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic sort_order
DROP TRIGGER IF EXISTS trigger_update_category_sort_order ON categories;
CREATE TRIGGER trigger_update_category_sort_order
  BEFORE INSERT ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_category_sort_order();

-- Create function to update view count
CREATE OR REPLACE FUNCTION increment_category_view_count(category_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE categories 
  SET view_count = view_count + 1 
  WHERE id = category_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get category hierarchy
CREATE OR REPLACE FUNCTION get_category_hierarchy()
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  parent_id UUID,
  level INTEGER,
  path TEXT,
  sort_order INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE category_tree AS (
    -- Base case: root categories
    SELECT 
      c.id,
      c.name,
      c.slug,
      c.description,
      c.parent_id,
      0 as level,
      c.name as path,
      c.sort_order
    FROM categories c
    WHERE c.parent_id IS NULL AND c.is_visible = TRUE
    
    UNION ALL
    
    -- Recursive case: child categories
    SELECT 
      c.id,
      c.name,
      c.slug,
      c.description,
      c.parent_id,
      ct.level + 1,
      ct.path || ' > ' || c.name,
      c.sort_order
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
    WHERE c.is_visible = TRUE
  )
  SELECT * FROM category_tree
  ORDER BY path, sort_order;
END;
$$ LANGUAGE plpgsql;

-- Create function to get category statistics
CREATE OR REPLACE FUNCTION get_category_stats()
RETURNS TABLE (
  total_categories INTEGER,
  featured_categories INTEGER,
  visible_categories INTEGER,
  categories_with_posts INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_categories,
    COUNT(*) FILTER (WHERE is_featured = TRUE)::INTEGER as featured_categories,
    COUNT(*) FILTER (WHERE is_visible = TRUE)::INTEGER as visible_categories,
    COUNT(DISTINCT pc.category_id)::INTEGER as categories_with_posts
  FROM categories c
  LEFT JOIN post_categories pc ON c.id = pc.category_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to merge categories
CREATE OR REPLACE FUNCTION merge_categories(source_id UUID, target_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Update all posts from source category to target category
  UPDATE post_categories 
  SET category_id = target_id 
  WHERE category_id = source_id;
  
  -- Delete the source category
  DELETE FROM categories WHERE id = source_id;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON COLUMN categories.meta_description IS 'SEO meta description for the category page (max 160 characters)';
COMMENT ON COLUMN categories.meta_keywords IS 'SEO meta keywords as an array';
COMMENT ON COLUMN categories.is_featured IS 'Whether this category should be featured/promoted';
COMMENT ON COLUMN categories.is_visible IS 'Whether this category is visible to the public';
COMMENT ON COLUMN categories.sort_order IS 'Custom sort order for category display';
COMMENT ON COLUMN categories.image_url IS 'URL to category image';
COMMENT ON COLUMN categories.icon IS 'Icon identifier for the category';
COMMENT ON COLUMN categories.color IS 'Hex color code for category styling';
COMMENT ON COLUMN categories.view_count IS 'Number of times this category page has been viewed';

-- Update existing categories to have default values
UPDATE categories 
SET 
  is_featured = FALSE,
  is_visible = TRUE,
  sort_order = COALESCE(sort_order, 0),
  view_count = COALESCE(view_count, 0)
WHERE is_featured IS NULL OR is_visible IS NULL OR sort_order IS NULL OR view_count IS NULL;

-- Create a view for public categories (visible only)
CREATE OR REPLACE VIEW public_categories AS
SELECT 
  id,
  name,
  slug,
  description,
  parent_id,
  meta_description,
  meta_keywords,
  is_featured,
  sort_order,
  image_url,
  icon,
  color,
  created_at,
  updated_at
FROM categories
WHERE is_visible = TRUE
ORDER BY sort_order, name;

-- Grant permissions
GRANT SELECT ON public_categories TO anon;
GRANT SELECT ON public_categories TO authenticated;

-- Add RLS policies for enhanced security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to visible categories
CREATE POLICY "Public can view visible categories" ON categories
  FOR SELECT USING (is_visible = TRUE);

-- Policy for admin full access
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_name_search ON categories USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_categories_description_search ON categories USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_categories_created_at ON categories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_updated_at ON categories(updated_at DESC);

-- Add full-text search function
CREATE OR REPLACE FUNCTION search_categories(search_query TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  parent_id UUID,
  is_featured BOOLEAN,
  sort_order INTEGER,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.slug,
    c.description,
    c.parent_id,
    c.is_featured,
    c.sort_order,
    ts_rank(
      to_tsvector('english', COALESCE(c.name, '') || ' ' || COALESCE(c.description, '')),
      plainto_tsquery('english', search_query)
    ) as rank
  FROM categories c
  WHERE 
    c.is_visible = TRUE
    AND (
      to_tsvector('english', COALESCE(c.name, '') || ' ' || COALESCE(c.description, '')) @@ plainto_tsquery('english', search_query)
      OR c.name ILIKE '%' || search_query || '%'
      OR c.description ILIKE '%' || search_query || '%'
    )
  ORDER BY rank DESC, c.sort_order, c.name;
END;
$$ LANGUAGE plpgsql; 