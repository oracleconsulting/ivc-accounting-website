'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Rss, 
  Plus, 
  RefreshCw, 
  Settings, 
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { RSSFeedManager } from '@/components/admin/RSSFeedManager';
import { RSSContentImporter } from '@/components/admin/RSSContentImporter';
import { RSSAnalytics } from '@/components/admin/RSSAnalytics';

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  is_active: boolean;
  last_fetch: string;
  fetch_interval: number; // minutes
  auto_import: boolean;
  created_at: string;
}

interface RSSItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author?: string;
  category?: string;
  feed_id: string;
  imported: boolean;
  created_at: string;
}

export default function RSSManagement() {
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [items, setItems] = useState<RSSItem[]>([]);
  const [activeTab, setActiveTab] = useState<'feeds' | 'content' | 'analytics'>('feeds');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeeds();
    loadItems();
  }, []);

  const loadFeeds = async () => {
    try {
      const response = await fetch('/api/admin/rss/feeds');
      if (response.ok) {
        const data = await response.json();
        setFeeds(data);
      }
    } catch (error) {
      console.error('Failed to load RSS feeds:', error);
    }
  };

  const loadItems = async () => {
    try {
      const response = await fetch('/api/admin/rss/items');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to load RSS items:', error);
    }
  };

  const handleFeedUpdate = (updatedFeeds: RSSFeed[]) => {
    setFeeds(updatedFeeds);
  };

  const handleItemsUpdate = (updatedItems: RSSItem[]) => {
    setItems(updatedItems);
  };

  const refreshAllFeeds = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/rss/refresh', { method: 'POST' });
      if (response.ok) {
        await loadFeeds();
        await loadItems();
      }
    } catch (error) {
      console.error('Failed to refresh feeds:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">RSS Feed Management</h1>
          <p className="text-gray-600 mt-1">Monitor and import content from external RSS feeds</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={refreshAllFeeds} 
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh All Feeds
          </Button>
          <Button onClick={() => setActiveTab('feeds')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Feed
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Feeds</p>
              <p className="text-2xl font-bold">{feeds.filter(f => f.is_active).length}</p>
            </div>
            <Rss className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Imported Items</p>
              <p className="text-2xl font-bold">{items.filter(i => i.imported).length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-2xl font-bold">
                {feeds.length > 0 ? 
                  new Date(Math.max(...feeds.map(f => new Date(f.last_fetch).getTime()))).toLocaleDateString() : 
                  'Never'
                }
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'feeds' ? 'default' : 'outline'}
          onClick={() => setActiveTab('feeds')}
        >
          <Rss className="mr-2 h-4 w-4" />
          Feed Management
        </Button>
        <Button
          variant={activeTab === 'content' ? 'default' : 'outline'}
          onClick={() => setActiveTab('content')}
        >
          <Eye className="mr-2 h-4 w-4" />
          Content Import
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'outline'}
          onClick={() => setActiveTab('analytics')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Analytics
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'feeds' && (
        <RSSFeedManager 
          feeds={feeds} 
          onFeedsUpdate={handleFeedUpdate} 
        />
      )}
      
      {activeTab === 'content' && (
        <RSSContentImporter 
          items={items} 
          feeds={feeds}
          onItemsUpdate={handleItemsUpdate} 
        />
      )}
      
      {activeTab === 'analytics' && (
        <RSSAnalytics 
          feeds={feeds} 
          items={items} 
        />
      )}
    </div>
  );
} 