# Offline Blog Editor & AI Integration Guide

## 🛫 Offline Capability Setup

### 1. Install Required Dependencies
```bash
npm install idb workbox-webpack-plugin
npm install --save-dev @types/serviceworker
```

### 2. Create Service Worker File
Create `public/sw.js`:
```javascript
// Import Workbox libraries (or implement manually)
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Precache static assets
workbox.precaching.precacheAndRoute([
  { url: '/admin', revision: '1' },
  { url: '/admin/posts/new', revision: '1' },
  { url: '/offline.html', revision: '1' },
  // Add your CSS and JS files
]);

// Cache API responses
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3,
  })
);

// Offline fallback
workbox.routing.setDefaultHandler(
  new workbox.strategies.NetworkFirst()
);

// Background sync for post uploads
self.addEventListener('sync', event => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});
```

### 3. Update BlogEditor for Offline Support
```typescript
// components/admin/BlogEditor.tsx
import { useEffect, useState } from 'react';
import { offlineStorage, SyncManager } from '@/lib/offline/offlineStorage';

export default function BlogEditor() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const syncManager = new SyncManager();

  useEffect(() => {
    // Register service worker
    registerServiceWorker();
    
    // Start auto-sync
    syncManager.startAutoSync();
    
    // Monitor online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSave = async (content: any) => {
    if (isOffline) {
      // Save to IndexedDB
      await offlineStorage.savePost({
        ...content,
        id: content.id || crypto.randomUUID(),
        synced: false
      });
      
      // Register sync when back online
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-posts');
      }
    } else {
      // Normal save to Supabase
      await saveToSupabase(content);
    }
  };

  return (
    <div>
      {isOffline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            You're working offline. Your changes will sync when you're back online.
          </p>
        </div>
      )}
      {/* Rest of your editor */}
    </div>
  );
}
```

### 4. Create Offline HTML Fallback
Create `public/offline.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <title>IVC Blog - Offline</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #f5f1e8;
    }
    .offline-message {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 { color: #1a2b4a; }
    p { color: #666; }
  </style>
</head>
<body>
  <div class="offline-message">
    <h1>You're Offline</h1>
    <p>Don't worry, you can still write! Your work will sync when you're back online.</p>
    <p><a href="/admin/posts/new">Continue Writing</a></p>
  </div>
</body>
</html>
```

## 🤖 AI Integration Setup

### 1. Environment Variables
Add to your `.env.local`:
```bash
# OpenRouter for AI
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Buffer for Social Media
BUFFER_ACCESS_TOKEN=your-buffer-token
BUFFER_LINKEDIN_PROFILE_ID=your-linkedin-profile
BUFFER_INSTAGRAM_PROFILE_ID=your-instagram-profile
BUFFER_YOUTUBE_PROFILE_ID=your-youtube-profile

# Optional: Specific AI models
OPENROUTER_RESEARCH_MODEL=anthropic/claude-3-haiku
OPENROUTER_WRITING_MODEL=anthropic/claude-3-sonnet
OPENROUTER_SOCIAL_MODEL=anthropic/claude-3-haiku
```

### 2. Integrate AI Assistant into Blog Editor
```typescript
// app/admin/posts/new/page.tsx
import BlogEditor from '@/components/admin/BlogEditor';
import AIBlogAssistant from '@/components/admin/AIBlogAssistant';

export default function NewPostPage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const handleResearchComplete = (results: any[]) => {
    // Store research results for reference
    setAiSuggestions(results);
  };

  const handleContentGenerated = (newContent: string) => {
    // Insert or replace content in editor
    setContent(newContent);
  };

  const handleSocialPostsGenerated = async (posts: any[]) => {
    // Save social posts to database
    // Optionally auto-schedule with Buffer
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <BlogEditor 
          content={content}
          onContentChange={setContent}
          title={title}
          onTitleChange={setTitle}
        />
      </div>
      
      <div className="lg:col-span-1">
        <AIBlogAssistant
          onResearchComplete={handleResearchComplete}
          onContentGenerated={handleContentGenerated}
          onSocialPostsGenerated={handleSocialPostsGenerated}
          currentContent={content}
          postTitle={title}
        />
      </div>
    </div>
  );
}
```

## 🚀 Buffer Integration

### 1. Get Buffer API Access
1. Sign up for Buffer (buffer.com)
2. Go to Account → Apps → Create New App
3. Get your Access Token
4. Find your profile IDs in Buffer dashboard

### 2. Create Buffer Integration Service
```typescript
// lib/services/bufferService.ts
export class BufferService {
  private accessToken: string;
  
  constructor() {
    this.accessToken = process.env.BUFFER_ACCESS_TOKEN!;
  }

  async schedulePost(
    platform: string,
    content: string,
    hashtags: string[],
    scheduledTime?: Date
  ) {
    const profileId = this.getProfileId(platform);
    const text = `${content}\n\n${hashtags.map(h => `#${h}`).join(' ')}`;
    
    const response = await fetch('https://api.bufferapp.com/1/updates/create.json', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        profile_ids: [profileId],
        text,
        scheduled_at: scheduledTime?.toISOString(),
        link: 'https://www.ivcaccounting.co.uk/blog/latest'
      })
    });
    
    return response.json();
  }

  private getProfileId(platform: string): string {
    const profiles = {
      linkedin: process.env.BUFFER_LINKEDIN_PROFILE_ID!,
      instagram: process.env.BUFFER_INSTAGRAM_PROFILE_ID!,
      youtube: process.env.BUFFER_YOUTUBE_PROFILE_ID!
    };
    return profiles[platform as keyof typeof profiles];
  }
}
```

## 📱 Testing Offline Functionality

1. **Chrome DevTools**:
   - Open DevTools → Application → Service Workers
   - Check "Offline" to simulate offline mode
   - Test creating and editing posts

2. **Real Device Testing**:
   - Deploy to Railway
   - Access on mobile device
   - Turn on airplane mode
   - Verify offline functionality

## 🎯 Complete Workflow

1. **Research Phase** (Online):
   - Use AI Research to find trending topics
   - Save research results for offline reference

2. **Writing Phase** (Offline Capable):
   - Write content with auto-save to IndexedDB
   - Basic formatting and structure work offline
   - AI assistance requires connection

3. **Publishing Phase** (Online):
   - Sync offline changes
   - Generate social media posts
   - Schedule to Buffer
   - Publish to blog

## 🔧 Troubleshooting

### Service Worker Not Registering
```javascript
// Check if running on HTTPS (required for SW)
if (location.protocol === 'https:' || location.hostname === 'localhost') {
  registerServiceWorker();
}
```

### IndexedDB Storage Limits
- Chrome: ~60% of free disk space
- Firefox: 50MB initial, can request more
- Safari: 1GB initial

### Buffer API Rate Limits
- 60 requests per minute per access token
- Implement queue for bulk scheduling

## 📚 Additional Resources

- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Buffer API Docs](https://buffer.com/developers/api)
- [OpenRouter API](https://openrouter.ai/docs)
- [IndexedDB Guide](https://web.dev/indexeddb/)

---

This setup gives you a powerful offline-capable blog editor with AI assistance that can work on your flight to Greece! 🇬🇷✈️ 