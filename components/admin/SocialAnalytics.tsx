'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  MessageSquare,
  Share2,
  Calendar
} from 'lucide-react';

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  profileUrl: string;
}

interface SocialAnalyticsProps {
  platforms: SocialPlatform[];
}

export function SocialAnalytics({ platforms }: SocialAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  // Mock analytics data
  const analyticsData = {
    totalPosts: 156,
    totalEngagement: 2847,
    totalReach: 45620,
    averageEngagementRate: 6.2,
    topPosts: [
      {
        id: '1',
        content: 'Tax tips for small businesses in Essex...',
        platform: 'linkedin',
        engagement: 234,
        reach: 1200,
        date: '2024-01-15'
      },
      {
        id: '2',
        content: 'Understanding Making Tax Digital...',
        platform: 'twitter',
        engagement: 189,
        reach: 890,
        date: '2024-01-12'
      }
    ],
    platformStats: {
      linkedin: { posts: 45, engagement: 1200, reach: 15000 },
      instagram: { posts: 38, engagement: 890, reach: 12000 },
      twitter: { posts: 73, engagement: 757, reach: 18620 }
    }
  };

  const getEngagementTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      direction: change >= 0 ? 'up' : 'down',
      color: change >= 0 ? 'text-green-600' : 'text-red-600'
    };
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </Button>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Platforms</option>
            {platforms.filter(p => p.connected).map(platform => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold">{analyticsData.totalPosts}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Engagement</p>
              <p className="text-2xl font-bold">{analyticsData.totalEngagement.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+8.3%</span>
              </div>
            </div>
            <Heart className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reach</p>
              <p className="text-2xl font-bold">{analyticsData.totalReach.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+15.2%</span>
              </div>
            </div>
            <Eye className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Engagement Rate</p>
              <p className="text-2xl font-bold">{analyticsData.averageEngagementRate}%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+2.1%</span>
              </div>
            </div>
            <MessageSquare className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(analyticsData.platformStats).map(([platform, stats]) => (
            <div key={platform} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Share2 className="h-4 w-4" />
                </div>
                <h4 className="font-medium capitalize">{platform}</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Posts</span>
                  <span className="font-medium">{stats.posts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Engagement</span>
                  <span className="font-medium">{stats.engagement.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reach</span>
                  <span className="font-medium">{stats.reach.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg. Rate</span>
                  <span className="font-medium">{((stats.engagement / stats.reach) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Performing Posts */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Posts</h3>
        <div className="space-y-4">
          {analyticsData.topPosts.map((post, index) => (
            <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium">{post.content}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {post.platform}
                    </Badge>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="font-medium">{post.engagement}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Reach</p>
                  <p className="font-medium">{post.reach.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Rate</p>
                  <p className="font-medium">{((post.engagement / post.reach) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Best Posting Times */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Best Posting Times</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">LinkedIn</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Tuesday</span>
                <span className="text-sm font-medium">9:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Wednesday</span>
                <span className="text-sm font-medium">10:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Thursday</span>
                <span className="text-sm font-medium">8:00 AM</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Instagram</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Monday</span>
                <span className="text-sm font-medium">7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Wednesday</span>
                <span className="text-sm font-medium">6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Friday</span>
                <span className="text-sm font-medium">8:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 