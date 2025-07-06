'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Download, 
  ExternalLink, 
  Clock,
  CheckCircle,
  X,
  Filter,
  Search
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

interface RSSContentImporterProps {
  items: RSSItem[];
  feeds: RSSFeed[];
  onItemsUpdate: (items: RSSItem[]) => void;
}

export function RSSContentImporter({ items, feeds, onItemsUpdate }: RSSContentImporterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeed, setSelectedFeed] = useState<string>('all');
  const [importStatus, setImportStatus] = useState<string>('all'); // all, imported, not_imported
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFeed = selectedFeed === 'all' || item.feed_id === selectedFeed;
    const matchesStatus = importStatus === 'all' || 
                         (importStatus === 'imported' && item.imported) ||
                         (importStatus === 'not_imported' && !item.imported);
    
    return matchesSearch && matchesFeed && matchesStatus;
  });

  const handleImportItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/admin/rss/items/${itemId}/import`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const updatedItem = await response.json();
        onItemsUpdate(items.map(item => item.id === itemId ? updatedItem : item));
      }
    } catch (error) {
      console.error('Error importing RSS item:', error);
    }
  };

  const handleBulkImport = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const response = await fetch('/api/admin/rss/items/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds: selectedItems })
      });
      
      if (response.ok) {
        const updatedItems = await response.json();
        onItemsUpdate(items.map(item => {
          const updated = updatedItems.find((u: any) => u.id === item.id);
          return updated || item;
        }));
        setSelectedItems([]);
      }
    } catch (error) {
      console.error('Error bulk importing RSS items:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getFeedName = (feedId: string) => {
    const feed = feeds.find(f => f.id === feedId);
    return feed?.name || 'Unknown Feed';
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items..."
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedFeed}
              onChange={(e) => setSelectedFeed(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Feeds</option>
              {feeds.map(feed => (
                <option key={feed.id} value={feed.id}>
                  {feed.name}
                </option>
              ))}
            </select>
            
            <select
              value={importStatus}
              onChange={(e) => setImportStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Items</option>
              <option value="imported">Imported</option>
              <option value="not_imported">Not Imported</option>
            </select>
          </div>
          
          {selectedItems.length > 0 && (
            <Button onClick={handleBulkImport}>
              <Download className="mr-2 h-4 w-4" />
              Import Selected ({selectedItems.length})
            </Button>
          )}
        </div>
      </Card>

      {/* Items List */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            RSS Items ({filteredItems.length})
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedItems.length === filteredItems.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Eye className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No RSS items found</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {new Date(item.pubDate).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {item.author && (
                            <span className="text-sm text-gray-500">
                              by {item.author}
                            </span>
                          )}
                          
                          <Badge variant="outline" className="text-xs">
                            {getFeedName(item.feed_id)}
                          </Badge>
                          
                          {item.category && (
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {item.imported ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Imported
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleImportItem(item.id)}
                          >
                            <Download className="h-4 w-4" />
                            Import
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(item.link, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
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