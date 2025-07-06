'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Settings, 
  Plus,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageSquare
} from 'lucide-react';
import { SocialPostComposer } from '@/components/admin/SocialPostComposer';
import { SocialCalendar } from '@/components/admin/SocialCalendar';
import { SocialAnalytics } from '@/components/admin/SocialAnalytics';
import { PlatformConnector } from '@/components/admin/PlatformConnector';

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  profileUrl: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export default function SocialMediaDashboard() {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: <Linkedin className="h-5 w-5" />,
      connected: false, 
      profileUrl: '' 
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: <Instagram className="h-5 w-5" />,
      connected: false, 
      profileUrl: '' 
    },
    { 
      id: 'twitter', 
      name: 'Twitter/X', 
      icon: <Twitter className="h-5 w-5" />,
      connected: false, 
      profileUrl: '' 
    },
    { 
      id: 'youtube', 
      name: 'YouTube', 
      icon: <Youtube className="h-5 w-5" />,
      connected: false, 
      profileUrl: '' 
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: <MessageSquare className="h-5 w-5" />,
      connected: false, 
      profileUrl: '' 
    }
  ]);

  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalPosts: 0,
    totalEngagement: 0,
    totalReach: 0,
    averageEngagementRate: 0
  });

  useEffect(() => {
    loadPlatformStatus();
    loadScheduledPosts();
    loadAnalytics();
  }, []);

  const loadPlatformStatus = async () => {
    try {
      const response = await fetch('/api/admin/social/platforms');
      if (response.ok) {
        const platformData = await response.json();
        setPlatforms(prev => prev.map(platform => ({
          ...platform,
          ...platformData.find((p: any) => p.id === platform.id)
        })));
      }
    } catch (error) {
      console.error('Failed to load platform status:', error);
    }
  };

  const loadScheduledPosts = async () => {
    try {
      const response = await fetch('/api/admin/social/scheduled');
      if (response.ok) {
        const posts = await response.json();
        setScheduledPosts(posts);
      }
    } catch (error) {
      console.error('Failed to load scheduled posts:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/social/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handlePlatformUpdate = (updatedPlatforms: SocialPlatform[]) => {
    setPlatforms(updatedPlatforms);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Social Media Management</h1>
          <p className="text-gray-600 mt-1">Create, schedule, and analyze your social media content</p>
        </div>
        <Button onClick={() => window.location.href = '/admin/social/compose'}>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold">{analytics.totalPosts}</p>
            </div>
            <Share2 className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Engagement</p>
              <p className="text-2xl font-bold">{analytics.totalEngagement.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reach</p>
              <p className="text-2xl font-bold">{analytics.totalReach.toLocaleString()}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Engagement Rate</p>
              <p className="text-2xl font-bold">{analytics.averageEngagementRate.toFixed(1)}%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Platform Status */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Platform Connections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map(platform => (
            <div key={platform.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${platform.connected ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {platform.icon}
                </div>
                <div>
                  <p className="font-medium">{platform.name}</p>
                  <p className="text-sm text-gray-600">
                    {platform.connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Badge variant={platform.connected ? 'default' : 'secondary'}>
                {platform.connected ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compose">
            <Share2 className="mr-2 h-4 w-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Platform Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose">
          <SocialPostComposer platforms={platforms} />
        </TabsContent>
        
        <TabsContent value="calendar">
          <SocialCalendar scheduledPosts={scheduledPosts} />
        </TabsContent>
        
        <TabsContent value="analytics">
          <SocialAnalytics platforms={platforms} />
        </TabsContent>
        
        <TabsContent value="settings">
          <PlatformConnector 
            platforms={platforms} 
            onPlatformsUpdate={handlePlatformUpdate} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 