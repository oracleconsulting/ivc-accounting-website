# IVC Blog & Knowledge Management System

A comprehensive blog and knowledge management system for IVC Accounting website with AI assistance, SEO optimization, and seamless publishing.

## 🚀 Features

### ✅ Implemented
- **Private Admin Portal** - Secure authentication with role-based access
- **Rich Text Editor** - TipTap-based editor with formatting, images, and code blocks
- **AI Writing Assistant** - OpenRouter integration for content creation help
- **SEO Optimization** - Real-time SEO analysis and meta tag generation
- **Auto-save** - Automatic draft saving every 30 seconds
- **Version History** - Track changes and revert if needed
- **Database Integration** - Supabase with proper RLS policies
- **Public Blog** - Dynamic blog listing and individual post pages
- **Structured Data** - Schema.org markup for rich snippets
- **Oracle Design System** - Consistent branding throughout

### 🔄 In Progress
- **Semantic Search** - Pinecone integration for related content
- **Image Optimization** - Automatic image compression and optimization
- **Newsletter Integration** - Email capture and automation
- **Analytics Dashboard** - Post performance tracking
- **Scheduling** - Future post publishing
- **Categories & Tags** - Full taxonomy management

## 🏗️ Architecture

### Database Schema
```
posts/
├── id (UUID)
├── title (TEXT)
├── slug (TEXT, UNIQUE)
├── content (JSONB) - TipTap content
├── content_text (TEXT) - Plain text for search
├── content_html (TEXT) - Rendered HTML
├── excerpt (TEXT)
├── featured_image (TEXT)
├── author_id (UUID) - References auth.users
├── status (ENUM: draft, published, scheduled, archived)
├── seo_title (VARCHAR(60))
├── seo_description (VARCHAR(160))
├── seo_keywords (TEXT[])
├── og_image (TEXT)
├── published_at (TIMESTAMP)
├── scheduled_for (TIMESTAMP)
├── view_count (INTEGER)
├── read_time (INTEGER)
└── embedding (VECTOR(1536)) - For semantic search

categories/
├── id (UUID)
├── name (TEXT)
├── slug (TEXT, UNIQUE)
├── description (TEXT)
└── parent_id (UUID) - Self-reference for hierarchy

tags/
├── id (UUID)
├── name (TEXT)
└── slug (TEXT, UNIQUE)

post_categories/ (Junction table)
├── post_id (UUID)
└── category_id (UUID)

post_tags/ (Junction table)
├── post_id (UUID)
└── tag_id (UUID)

post_versions/ (Version history)
├── id (UUID)
├── post_id (UUID)
├── title (TEXT)
├── content (JSONB)
├── created_at (TIMESTAMP)
└── created_by (UUID)

ai_conversations/ (AI chat history)
├── id (UUID)
├── post_id (UUID)
├── messages (JSONB)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### File Structure
```
ivc-website/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout with auth
│   │   ├── page.tsx            # Admin dashboard
│   │   └── posts/
│   │       ├── page.tsx        # Posts listing
│   │       └── new/
│   │           └── page.tsx    # New post editor
│   ├── blog/
│   │   ├── page.tsx            # Public blog listing
│   │   └── [slug]/
│   │       └── page.tsx        # Individual post page
│   └── login/
│       └── page.tsx            # Admin login
├── components/
│   ├── admin/
│   │   ├── AdminHeader.tsx     # Admin navigation header
│   │   ├── AdminSidebar.tsx    # Admin sidebar navigation
│   │   ├── BlogEditor.tsx      # Main editor component
│   │   ├── EditorToolbar.tsx   # TipTap toolbar
│   │   ├── SEOPanel.tsx        # SEO optimization panel
│   │   └── AIAssistant.tsx     # AI writing assistant
│   └── blog/                   # Existing blog components
├── lib/
│   ├── types/
│   │   └── blog.ts             # TypeScript interfaces
│   └── utils/
│       ├── blog.ts             # Blog utility functions
│       ├── seo.ts              # SEO analysis functions
│       ├── openrouter.ts       # AI integration
│       └── storage.ts          # Image upload utilities
└── supabase/
    └── migrations/
        └── 001_blog_system.sql # Database schema
```

## 🛠️ Setup Instructions

### 1. Environment Variables
Copy `env.template` to `.env.local` and configure:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter (for AI assistance)
OPENROUTER_API_KEY=your_openrouter_api_key

# Pinecone (for semantic search)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=ivc-blog-embeddings

# Site URL
NEXT_PUBLIC_SITE_URL=https://ivcaccounting.co.uk
```

### 2. Database Setup
Run the migration in Supabase SQL editor:

```sql
-- Run the contents of supabase/migrations/001_blog_system.sql
```

### 3. Storage Setup
Create a storage bucket in Supabase:
- Bucket name: `blog-images`
- Public bucket for image uploads
- Configure CORS if needed

### 4. Admin User Setup
Create an admin user in Supabase:

```sql
-- Insert admin profile
INSERT INTO profiles (id, role, name) 
VALUES ('user-uuid', 'admin', 'James Howard');
```

### 5. Install Dependencies
```bash
npm install
```

### 6. Run Development Server
```bash
npm run dev
```

## 📝 Usage

### Admin Access
1. Navigate to `/login`
2. Sign in with admin credentials
3. Access admin panel at `/admin`

### Creating Posts
1. Go to `/admin/posts/new`
2. Write content using the rich text editor
3. Configure SEO settings in the sidebar
4. Use AI assistant for content help
5. Save as draft or publish immediately

### AI Assistant
- Click "Show AI Assistant" in the editor
- Use quick prompts for common tasks
- Ask for writing help, SEO suggestions, or content ideas
- Copy AI responses directly into the editor

### SEO Optimization
- Real-time SEO score analysis
- Auto-generate meta descriptions
- Keyword suggestions
- Google preview of search results
- Character count validation

## 🎨 Design System

The blog system uses the Oracle design system:

- **Primary Navy**: `#1a2b4a`
- **Accent Orange**: `#ff6b35`
- **Background Cream**: `#f5f1e8`
- **Link Blue**: `#4a90e2`

All components maintain consistent styling and branding.

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- **Admin-only access** to admin panel
- **Public read-only** access to published posts
- **Secure image uploads** with file validation
- **JWT-based authentication** with Supabase

## 📊 Performance

- **Server-side rendering** for SEO
- **Image optimization** with Next.js Image component
- **Auto-save** prevents data loss
- **Lazy loading** for admin components
- **Optimized database queries** with proper indexing

## 🚀 Deployment

### Railway Deployment
1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Supabase Setup
1. Create new Supabase project
2. Run database migrations
3. Configure storage buckets
4. Set up authentication providers

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] **Semantic Search** - Find related content using AI embeddings
- [ ] **Newsletter Integration** - Email marketing automation
- [ ] **Analytics Dashboard** - Post performance metrics
- [ ] **Scheduling System** - Future post publishing
- [ ] **Comment System** - Reader engagement
- [ ] **Social Sharing** - Automatic social media posts
- [ ] **Content Calendar** - Editorial planning
- [ ] **Multi-author Support** - Team collaboration
- [ ] **Content Templates** - Reusable post structures
- [ ] **Advanced SEO** - Schema markup automation

### Phase 3 Features
- [ ] **AI Content Generation** - Automated post creation
- [ ] **Voice-to-Text** - Audio content transcription
- [ ] **Video Integration** - Embedded video content
- [ ] **Podcast Support** - Audio content management
- [ ] **E-commerce Integration** - Product showcase
- [ ] **Lead Generation** - Content-based lead capture
- [ ] **A/B Testing** - Content optimization
- [ ] **Internationalization** - Multi-language support

## 🐛 Troubleshooting

### Common Issues

**Editor not loading:**
- Check TipTap dependencies are installed
- Verify browser console for errors

**AI Assistant not working:**
- Verify OpenRouter API key is set
- Check network requests in browser dev tools

**Image uploads failing:**
- Ensure Supabase storage bucket exists
- Check storage permissions and CORS settings

**Database connection errors:**
- Verify Supabase URL and API key
- Check RLS policies are correctly configured

### Debug Mode
Enable debug logging by setting:
```bash
NEXT_PUBLIC_DEBUG=true
```

## 📞 Support

For technical support or feature requests:
- Create an issue in the GitHub repository
- Contact James Howard directly
- Check the Supabase documentation for database issues

## 📄 License

This blog system is proprietary to IVC Accounting and not for public distribution. 