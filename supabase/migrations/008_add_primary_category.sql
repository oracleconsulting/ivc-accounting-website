-- Add is_primary field to post_categories table
ALTER TABLE post_categories 
ADD COLUMN is_primary BOOLEAN DEFAULT false;

-- Create index for better performance
CREATE INDEX idx_post_categories_primary ON post_categories(post_id, is_primary);

-- Add constraint to ensure only one primary category per post
CREATE UNIQUE INDEX idx_post_categories_one_primary 
ON post_categories(post_id) 
WHERE is_primary = true;

-- Update existing records to set the first category as primary for each post
UPDATE post_categories 
SET is_primary = true 
WHERE (post_id, category_id) IN (
  SELECT DISTINCT ON (post_id) post_id, category_id
  FROM post_categories
  ORDER BY post_id, category_id
); 