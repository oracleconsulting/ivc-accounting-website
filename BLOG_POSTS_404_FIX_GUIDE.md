# Blog Posts 404 Fix Guide

## The Problem
Your blog posts are returning 404 errors because they don't exist in your production Supabase database. The posts were likely created in your development database but never synced to production.

## Quick Diagnosis

### 1. Test Database Connection
Visit: `https://www.ivcaccounting.co.uk/api/debug-db`

This will show you:
- Which Supabase project you're connected to
- How many posts exist in the database
- If the specific post ID exists

### 2. Check Environment Variables
In your Railway dashboard, verify these environment variables are set to your **PRODUCTION** Supabase project:

```
NEXT_PUBLIC_SUPABASE_URL=https://[PRODUCTION-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[PRODUCTION-ANON-KEY]
```

## Solutions

### Solution 1: Create Test Posts (Quick Fix)

#### Option A: Use the Admin Panel
1. Go to `https://www.ivcaccounting.co.uk/admin/posts/new`
2. Create a new post with:
   - Title: "Welcome to IVC Accounting Blog"
   - Slug: "welcome-to-ivc-accounting-blog"
   - Content: Any test content
   - Status: Published
3. Save and publish

#### Option B: Use the Test Script
1. Navigate to the ivc-website directory:
   ```bash
   cd ivc-website
   ```

2. Set your environment variables:
   ```bash
   export NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROD-PROJECT].supabase.co"
   export NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-PROD-ANON-KEY]"
   ```

3. Run the test script:
   ```bash
   node scripts/test-db-connection.js
   ```

### Solution 2: Migrate Data from Development to Production

#### Step 1: Export from Development Database
In your development Supabase SQL editor:

```sql
-- Export posts
COPY (SELECT * FROM posts) TO '/tmp/posts.csv' WITH CSV HEADER;

-- Export categories
COPY (SELECT * FROM categories) TO '/tmp/categories.csv' WITH CSV HEADER;

-- Export tags
COPY (SELECT * FROM tags) TO '/tmp/tags.csv' WITH CSV HEADER;

-- Export relationships
COPY (SELECT * FROM post_categories) TO '/tmp/post_categories.csv' WITH CSV HEADER;
COPY (SELECT * FROM post_tags) TO '/tmp/post_tags.csv' WITH CSV HEADER;
```

#### Step 2: Import to Production Database
In your production Supabase SQL editor:

```sql
-- Import the data
COPY posts FROM '/tmp/posts.csv' WITH CSV HEADER;
COPY categories FROM '/tmp/categories.csv' WITH CSV HEADER;
COPY tags FROM '/tmp/tags.csv' WITH CSV HEADER;
COPY post_categories FROM '/tmp/post_categories.csv' WITH CSV HEADER;
COPY post_tags FROM '/tmp/post_tags.csv' WITH CSV HEADER;
```

### Solution 3: Create Posts via SQL (Manual)

If you know the specific posts you need, create them directly in production:

```sql
-- Create a test post
INSERT INTO posts (
  id,
  title,
  slug,
  content,
  content_text,
  content_html,
  excerpt,
  status,
  published_at,
  created_at,
  updated_at
) VALUES (
  'dc419873-2ec9-41f0-9041-1c17a536aa22',
  'Welcome to IVC Accounting Blog',
  'welcome-to-ivc-accounting-blog',
  '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Welcome to our blog! This is a test post to verify the database connection."}]}]}',
  'Welcome to our blog! This is a test post to verify the database connection.',
  '<p>Welcome to our blog! This is a test post to verify the database connection.</p>',
  'A test post to verify the database connection.',
  'published',
  NOW(),
  NOW(),
  NOW()
);
```

## Verification Steps

### 1. Check the Debug API
Visit: `https://www.ivcaccounting.co.uk/api/debug-db`

Expected response:
```json
{
  "connected": true,
  "postsCount": 1,
  "posts": [
    {
      "id": "dc419873-2ec9-41f0-9041-1c17a536aa22",
      "title": "Welcome to IVC Accounting Blog",
      "slug": "welcome-to-ivc-accounting-blog",
      "status": "published"
    }
  ]
}
```

### 2. Test Blog URLs
After creating posts, test these URLs:
- `https://www.ivcaccounting.co.uk/blog`
- `https://www.ivcaccounting.co.uk/blog/welcome-to-ivc-accounting-blog`

### 3. Check Admin Panel
Visit: `https://www.ivcaccounting.co.uk/admin/posts`

You should see your posts listed there.

## Common Issues

### Issue 1: Wrong Supabase Project
**Symptoms**: Debug API shows 0 posts, but you know posts exist
**Solution**: Check that `NEXT_PUBLIC_SUPABASE_URL` points to your production project

### Issue 2: Missing Database Tables
**Symptoms**: Database connection error
**Solution**: Run the Supabase migrations in your production project

### Issue 3: Authentication Issues
**Symptoms**: 401 errors when accessing admin
**Solution**: Check that your production project has the correct auth settings

## Next Steps

1. **Immediate**: Use Solution 1 to create test posts
2. **Short-term**: Migrate your development posts to production
3. **Long-term**: Set up a proper development/production workflow

## Support

If you continue to have issues:
1. Check the Railway logs for deployment errors
2. Verify your Supabase project settings
3. Test the database connection using the debug API 