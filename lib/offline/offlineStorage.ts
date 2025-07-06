import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published';
  categories: string[];
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  synced: boolean;
}

interface OfflineDB extends DBSchema {
  posts: {
    key: string;
    value: BlogPost;
    indexes: { 'by-sync': number };
  };
  drafts: {
    key: string;
    value: {
      postId: string;
      content: string;
      timestamp: number;
    };
  };
}

class OfflineStorage {
  private db: IDBPDatabase<OfflineDB> | null = null;

  async init() {
    this.db = await openDB<OfflineDB>('ivc-blog-offline', 1, {
      upgrade(db: IDBPDatabase<OfflineDB>) {
        // Create posts store
        const postStore = db.createObjectStore('posts', { keyPath: 'id' });
        postStore.createIndex('by-sync', 'synced');

        // Create drafts store for auto-save
        db.createObjectStore('drafts', { keyPath: 'postId' });
      },
    });
  }

  async savePost(post: BlogPost) {
    if (!this.db) await this.init();
    await this.db!.put('posts', { ...post, synced: false });
  }

  async getPost(id: string): Promise<BlogPost | undefined> {
    if (!this.db) await this.init();
    return await this.db!.get('posts', id);
  }

  async getAllPosts(): Promise<BlogPost[]> {
    if (!this.db) await this.init();
    return await this.db!.getAll('posts');
  }

  async getUnsyncedPosts(): Promise<BlogPost[]> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction('posts', 'readonly');
    const index = tx.store.index('by-sync');
    return await index.getAll(0);
  }

  async markAsSynced(id: string) {
    if (!this.db) await this.init();
    const post = await this.getPost(id);
    if (post) {
      await this.db!.put('posts', { ...post, synced: true });
    }
  }

  async saveDraft(postId: string, content: string) {
    if (!this.db) await this.init();
    await this.db!.put('drafts', {
      postId,
      content,
      timestamp: Date.now(),
    });
  }

  async getDraft(postId: string) {
    if (!this.db) await this.init();
    return await this.db!.get('drafts', postId);
  }

  async deleteDraft(postId: string) {
    if (!this.db) await this.init();
    await this.db!.delete('drafts', postId);
  }
}

export const offlineStorage = new OfflineStorage();

// Service Worker Registration
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available
            if (confirm('New version available! Reload to update?')) {
              window.location.reload();
            }
          }
        });
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// Sync Manager
export class SyncManager {
  private syncInProgress = false;

  async syncPosts() {
    if (this.syncInProgress || !navigator.onLine) return;
    
    this.syncInProgress = true;
    try {
      const unsyncedPosts = await offlineStorage.getUnsyncedPosts();
      
      for (const post of unsyncedPosts) {
        try {
          // Upload to Supabase
          const response = await fetch('/api/posts/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
          });
          
          if (response.ok) {
            await offlineStorage.markAsSynced(post.id);
          }
        } catch (error) {
          console.error('Failed to sync post:', post.id, error);
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  startAutoSync() {
    // Sync when coming online
    window.addEventListener('online', () => this.syncPosts());
    
    // Periodic sync every 5 minutes when online
    setInterval(() => {
      if (navigator.onLine) {
        this.syncPosts();
      }
    }, 5 * 60 * 1000);
  }
} 