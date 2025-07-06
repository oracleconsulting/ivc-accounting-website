// FILE: components/admin/RSSAnalytics.tsx
// RSS analytics component

'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Rss,
  Clock,
  Download,
  Eye
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

interface RSSAnalyticsProps {
  feeds: RSSFeed[];
  items: RSSItem[];
}

export function RSSAnalytics({ feeds, items }: RSSAnalyticsProps) {
  // Calculate analytics
  const totalFeeds = feeds.length;
  const activeFeeds = feeds.filter(f => f.is_active).length;
  const totalItems = items.length;
  const importedItems = items.filter(i => i.imported).length;
  const importRate = totalItems > 0 ? (importedItems / totalItems) * 100 : 0;

  // Items by feed
  const itemsByFeed = feeds.map(feed => ({
    feed: feed.name,
    total: items.filter(item => item.feed_id === feed.id).length,
    imported: items.filter(item => item.feed_id === feed.id && item.imported).length
  }));

  // Items by date (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentItems = items.filter(item => new Date(item.created_at) >= thirtyDaysAgo);
  const itemsByDate = recentItems.reduce((acc, item) => {
    const date = new Date(item.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top categories
  const categoryStats = feeds.reduce((acc, feed) => {
    if (feed.category) {
      acc[feed.category] = (acc[feed.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Feeds</p>
              <p className="text-2xl font-bold">{totalFeeds}</p>
            </div>
            <Rss className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Feeds</p>
              <p className="text-2xl font-bold">{activeFeeds}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
            <Eye className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Import Rate</p>
              <p className="text-2xl font-bold">{importRate.toFixed(1)}%</p>
            </div>
            <Download className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Feed Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Feed Performance</h3>
        <div className="space-y-4">
          {itemsByFeed.map(({ feed, total, imported }) => (
            <div key={feed} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Rss className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">{feed}</h4>
                  <p className="text-sm text-gray-600">
                    {total} items • {imported} imported
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600">Import Rate</div>
                <div className="font-medium">
                  {total > 0 ? ((imported / total) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity (Last 30 Days)</h3>
        <div className="space-y-4">
          {Object.entries(itemsByDate).length > 0 ? (
            Object.entries(itemsByDate)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .slice(0, 10)
              .map(([date, count]) => (
                <div key={date} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{date}</span>
                  </div>
                  <Badge variant="outline">
                    {count} items
                  </Badge>
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No recent activity</p>
            </div>
          )}
        </div>
      </Card>

      {/* Top Categories */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
        <div className="space-y-3">
          {topCategories.length > 0 ? (
            topCategories.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {category.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{category}</span>
                </div>
                <Badge variant="outline">
                  {count} feeds
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No categories configured</p>
            </div>
          )}
        </div>
      </Card>

      {/* Feed Health */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Feed Health</h3>
        <div className="space-y-4">
          {feeds.map(feed => {
            const lastFetch = new Date(feed.last_fetch);
            const now = new Date();
            const hoursSinceLastFetch = (now.getTime() - lastFetch.getTime()) / (1000 * 60 * 60);
            const isHealthy = hoursSinceLastFetch < 24; // Consider healthy if fetched within 24 hours
            
            return (
              <div key={feed.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <h4 className="font-medium">{feed.name}</h4>
                    <p className="text-sm text-gray-600">
                      Last fetch: {lastFetch.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge variant={isHealthy ? 'default' : 'destructive'}>
                    {isHealthy ? 'Healthy' : 'Stale'}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    {Math.round(hoursSinceLastFetch)}h ago
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
} 