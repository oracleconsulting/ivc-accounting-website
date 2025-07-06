// FILE: components/admin/RSSFeedManager.tsx
// RSS feed manager component

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Rss, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  is_active: boolean;
  last_fetch: string;
  fetch_interval: number;
  auto_import: boolean;
  created_at: string;
}

interface RSSFeedManagerProps {
  feeds: RSSFeed[];
  onFeedsUpdate: (feeds: RSSFeed[]) => void;
}

export function RSSFeedManager({ feeds, onFeedsUpdate }: RSSFeedManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFeed, setEditingFeed] = useState<RSSFeed | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: '',
    fetch_interval: 60,
    auto_import: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingFeed ? `/api/admin/rss/feeds/${editingFeed.id}` : '/api/admin/rss/feeds';
      const method = editingFeed ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedFeed = await response.json();
        
        if (editingFeed) {
          onFeedsUpdate(feeds.map(f => f.id === editingFeed.id ? updatedFeed : f));
        } else {
          onFeedsUpdate([...feeds, updatedFeed]);
        }
        
        resetForm();
      }
    } catch (error) {
      console.error('Error saving RSS feed:', error);
    }
  };

  const handleDelete = async (feedId: string) => {
    if (!confirm('Are you sure you want to delete this feed?')) return;
    
    try {
      const response = await fetch(`/api/admin/rss/feeds/${feedId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        onFeedsUpdate(feeds.filter(f => f.id !== feedId));
      }
    } catch (error) {
      console.error('Error deleting RSS feed:', error);
    }
  };

  const handleRefresh = async (feedId: string) => {
    try {
      const response = await fetch(`/api/admin/rss/feeds/${feedId}/refresh`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const updatedFeed = await response.json();
        onFeedsUpdate(feeds.map(f => f.id === feedId ? updatedFeed : f));
      }
    } catch (error) {
      console.error('Error refreshing RSS feed:', error);
    }
  };

  const handleToggleActive = async (feedId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/rss/feeds/${feedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive })
      });
      
      if (response.ok) {
        const updatedFeed = await response.json();
        onFeedsUpdate(feeds.map(f => f.id === feedId ? updatedFeed : f));
      }
    } catch (error) {
      console.error('Error updating RSS feed:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      category: '',
      fetch_interval: 60,
      auto_import: false
    });
    setShowAddForm(false);
    setEditingFeed(null);
  };

  const startEdit = (feed: RSSFeed) => {
    setEditingFeed(feed);
    setFormData({
      name: feed.name,
      url: feed.url,
      category: feed.category,
      fetch_interval: feed.fetch_interval,
      auto_import: feed.auto_import
    });
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingFeed ? 'Edit RSS Feed' : 'Add New RSS Feed'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feed Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter feed name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feed URL
                </label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/feed.xml"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Accounting, Tax"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fetch Interval (minutes)
                </label>
                <Input
                  type="number"
                  value={formData.fetch_interval}
                  onChange={(e) => setFormData({ ...formData, fetch_interval: parseInt(e.target.value) })}
                  min="15"
                  max="1440"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto_import"
                  checked={formData.auto_import}
                  onChange={(e) => setFormData({ ...formData, auto_import: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="auto_import" className="text-sm font-medium text-gray-700">
                  Auto Import
                </label>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">
                {editingFeed ? 'Update Feed' : 'Add Feed'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Feed List */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">RSS Feeds</h3>
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Feed
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          {feeds.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Rss className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No RSS feeds configured</p>
              <Button onClick={() => setShowAddForm(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Feed
              </Button>
            </div>
          ) : (
            feeds.map(feed => (
              <div key={feed.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${feed.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Rss className={`h-5 w-5 ${feed.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{feed.name}</h4>
                      <p className="text-sm text-gray-600">{feed.url}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {feed.category && (
                          <Badge variant="outline" className="text-xs">
                            {feed.category}
                          </Badge>
                        )}
                        <Badge variant={feed.is_active ? 'default' : 'secondary'}>
                          {feed.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {feed.auto_import && (
                          <Badge variant="outline" className="text-xs">
                            Auto Import
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm text-gray-500">
                      <p>Last fetch: {new Date(feed.last_fetch).toLocaleString()}</p>
                      <p>Interval: {feed.fetch_interval} min</p>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRefresh(feed.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(feed.id, feed.is_active)}
                      >
                        {feed.is_active ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(feed)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(feed.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
} 