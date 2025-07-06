#!/bin/bash

# Script to copy all admin files with headers
echo "Copying admin files..."

# Function to copy file with header
copy_with_header() {
    local source_file="$1"
    local target_file="$2"
    local description="$3"
    
    if [ -f "$source_file" ]; then
        echo "Copying: $source_file"
        mkdir -p "$(dirname "$target_file")"
        
        # Create header
        local filename=$(basename "$source_file")
        local filepath=$(echo "$source_file" | sed 's|^ivc-website/||')
        
        echo "// FILE: $filepath" > "$target_file"
        echo "// $description" >> "$target_file"
        echo "" >> "$target_file"
        
        # Copy content
        cat "$source_file" >> "$target_file"
    else
        echo "Warning: $source_file not found"
    fi
}

# Copy categories page
copy_with_header \
    "ivc-website/app/admin/categories/page.tsx" \
    "copies/admin/categories/page.tsx" \
    "Categories management page"

# Copy tags page
copy_with_header \
    "ivc-website/app/admin/tags/page.tsx" \
    "copies/admin/tags/page.tsx" \
    "Tags management page"

# Copy users page
copy_with_header \
    "ivc-website/app/admin/users/page.tsx" \
    "copies/admin/users/page.tsx" \
    "Users management page"

# Copy social media page
copy_with_header \
    "ivc-website/app/admin/social/page.tsx" \
    "copies/admin/social/page.tsx" \
    "Social media management page"

# Copy RSS/News page
copy_with_header \
    "ivc-website/app/admin/news/page.tsx" \
    "copies/admin/rss/page.tsx" \
    "RSS/News management page"

# Copy analytics page
copy_with_header \
    "ivc-website/app/admin/analytics/page.tsx" \
    "copies/admin/analytics/page.tsx" \
    "Analytics dashboard page"

# Copy database page
copy_with_header \
    "ivc-website/app/admin/database/page.tsx" \
    "copies/admin/database/page.tsx" \
    "Database management page"

# Copy settings pages
copy_with_header \
    "ivc-website/app/admin/settings/page.tsx" \
    "copies/admin/settings/page.tsx" \
    "Main settings page"

copy_with_header \
    "ivc-website/app/admin/settings/email/page.tsx" \
    "copies/admin/settings/email/page.tsx" \
    "Email settings page"

copy_with_header \
    "ivc-website/app/admin/settings/api-keys/page.tsx" \
    "copies/admin/settings/api-keys/page.tsx" \
    "API keys settings page"

copy_with_header \
    "ivc-website/app/admin/settings/media/page.tsx" \
    "copies/admin/settings/media/page.tsx" \
    "Media settings page"

# Copy admin components
copy_with_header \
    "ivc-website/components/admin/BlogEditor.tsx" \
    "copies/admin/posts/BlogEditor.tsx" \
    "Blog editor component"

copy_with_header \
    "ivc-website/components/admin/EditorToolbar.tsx" \
    "copies/admin/posts/EditorToolbar.tsx" \
    "Editor toolbar component"

copy_with_header \
    "ivc-website/components/admin/ImageUpload.tsx" \
    "copies/admin/posts/ImageUpload.tsx" \
    "Image upload component"

copy_with_header \
    "ivc-website/components/admin/SEOPanel.tsx" \
    "copies/admin/posts/SEOPanel.tsx" \
    "SEO panel component"

copy_with_header \
    "ivc-website/components/admin/CategorySelector.tsx" \
    "copies/admin/categories/CategorySelector.tsx" \
    "Category selector component"

copy_with_header \
    "ivc-website/components/admin/TagSelector.tsx" \
    "copies/admin/tags/TagSelector.tsx" \
    "Tag selector component"

copy_with_header \
    "ivc-website/components/admin/SocialAnalytics.tsx" \
    "copies/admin/social/SocialAnalytics.tsx" \
    "Social analytics component"

copy_with_header \
    "ivc-website/components/admin/SocialCalendar.tsx" \
    "copies/admin/social/SocialCalendar.tsx" \
    "Social calendar component"

copy_with_header \
    "ivc-website/components/admin/SocialPostComposer.tsx" \
    "copies/admin/social/SocialPostComposer.tsx" \
    "Social post composer component"

copy_with_header \
    "ivc-website/components/admin/PlatformConnector.tsx" \
    "copies/admin/social/PlatformConnector.tsx" \
    "Platform connector component"

copy_with_header \
    "ivc-website/components/admin/RSSAnalytics.tsx" \
    "copies/admin/rss/RSSAnalytics.tsx" \
    "RSS analytics component"

copy_with_header \
    "ivc-website/components/admin/RSSContentImporter.tsx" \
    "copies/admin/rss/RSSContentImporter.tsx" \
    "RSS content importer component"

copy_with_header \
    "ivc-website/components/admin/RSSFeedManager.tsx" \
    "copies/admin/rss/RSSFeedManager.tsx" \
    "RSS feed manager component"

copy_with_header \
    "ivc-website/components/admin/AIAssistant.tsx" \
    "copies/admin/settings/AIAssistant.tsx" \
    "AI assistant component"

copy_with_header \
    "ivc-website/components/admin/AIBlogAssistant.tsx" \
    "copies/admin/settings/AIBlogAssistant.tsx" \
    "AI blog assistant component"

copy_with_header \
    "ivc-website/components/admin/AIPromptSettings.tsx" \
    "copies/admin/settings/AIPromptSettings.tsx" \
    "AI prompt settings component"

copy_with_header \
    "ivc-website/components/admin/KnowledgeBase.tsx" \
    "copies/admin/settings/KnowledgeBase.tsx" \
    "Knowledge base component"

# Copy API routes
copy_with_header \
    "ivc-website/app/api/admin/analytics/route.ts" \
    "copies/admin/analytics/api/route.ts" \
    "Analytics API route"

copy_with_header \
    "ivc-website/app/api/admin/database/backups/route.ts" \
    "copies/admin/database/api/backups/route.ts" \
    "Database backups API route"

copy_with_header \
    "ivc-website/app/api/admin/database/stats/route.ts" \
    "copies/admin/database/api/stats/route.ts" \
    "Database stats API route"

copy_with_header \
    "ivc-website/app/api/admin/database/tables/route.ts" \
    "copies/admin/database/api/tables/route.ts" \
    "Database tables API route"

copy_with_header \
    "ivc-website/app/api/admin/social/analytics/route.ts" \
    "copies/admin/social/api/analytics/route.ts" \
    "Social analytics API route"

copy_with_header \
    "ivc-website/app/api/admin/social/platforms/route.ts" \
    "copies/admin/social/api/platforms/route.ts" \
    "Social platforms API route"

copy_with_header \
    "ivc-website/app/api/admin/social/scheduled/route.ts" \
    "copies/admin/social/api/scheduled/route.ts" \
    "Social scheduled posts API route"

copy_with_header \
    "ivc-website/app/api/ai/settings/route.ts" \
    "copies/admin/settings/api/ai-settings/route.ts" \
    "AI settings API route"

copy_with_header \
    "ivc-website/app/api/ai/social/route.ts" \
    "copies/admin/social/api/ai-social/route.ts" \
    "AI social API route"

# Copy database migrations
copy_with_header \
    "ivc-website/supabase/migrations/001_blog_system.sql" \
    "copies/admin/database/migrations/001_blog_system.sql" \
    "Blog system migration"

copy_with_header \
    "ivc-website/supabase/migrations/002_ai_settings_social_media.sql" \
    "copies/admin/database/migrations/002_ai_settings_social_media.sql" \
    "AI settings and social media migration"

copy_with_header \
    "ivc-website/supabase/migrations/003_enhanced_ai_settings.sql" \
    "copies/admin/database/migrations/003_enhanced_ai_settings.sql" \
    "Enhanced AI settings migration"

copy_with_header \
    "ivc-website/supabase/migrations/004_email_templates.sql" \
    "copies/admin/database/migrations/004_email_templates.sql" \
    "Email templates migration"

copy_with_header \
    "ivc-website/supabase/migrations/005_social_media_schema.sql" \
    "copies/admin/database/migrations/005_social_media_schema.sql" \
    "Social media schema migration"

copy_with_header \
    "ivc-website/supabase/migrations/006_rss_feed_schema.sql" \
    "copies/admin/database/migrations/006_rss_feed_schema.sql" \
    "RSS feed schema migration"

copy_with_header \
    "ivc-website/supabase/migrations/007_newsletter_schema.sql" \
    "copies/admin/database/migrations/007_newsletter_schema.sql" \
    "Newsletter schema migration"

copy_with_header \
    "ivc-website/supabase/migrations/20250107_database_backups.sql" \
    "copies/admin/database/migrations/20250107_database_backups.sql" \
    "Database backups migration"

echo "✅ All admin files copied successfully!"
