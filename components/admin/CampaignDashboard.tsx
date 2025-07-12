// /components/admin/CampaignDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Campaign } from '@/lib/services/campaignService';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Share2, 
  MessageSquare, 
  Download,
  Calendar,
  Zap,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  ArrowRight,
  Sparkles,
  FileText,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Video,
  FileDown,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface CampaignDashboardProps {
  campaignId?: string;
}

export function CampaignDashboard({ campaignId }: CampaignDashboardProps) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    if (campaignId && campaigns.length > 0) {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (campaign) {
        setSelectedCampaign(campaign);
        loadCampaignAnalytics(campaign.id);
      }
    }
  }, [campaignId, campaigns]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      // For now, use mock data until the service is properly connected
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          name: 'Sample Campaign',
          topic: 'Tax Planning for Small Businesses',
          status: 'ready',
          created_at: new Date().toISOString(),
          created_by: 'user-1',
          analytics: {
            total_reach: 1250,
            total_engagement: 89,
            conversion_rate: 7.1,
            best_performing_channel: 'linkedin',
            roi: 340
          },
          components: {
            blog: {
              id: 'blog-1',
              title: 'Tax Planning for Small Businesses',
              content: 'Sample content...',
              score: 85,
              published_at: new Date().toISOString()
            },
            newsletter: {
              id: 'newsletter-1',
              subject: 'Tax Planning Newsletter',
              content: 'Newsletter content...',
              sent_at: new Date().toISOString(),
              recipient_count: 500
            },
            socialSeries: {
              linkedin: {
                posts: [
                  { content: 'Sample LinkedIn post', hashtags: ['tax', 'business'] }
                ],
                theme: 'Professional',
                hook: 'Tax planning hook'
              }
            }
          }
        }
      ];
      setCampaigns(mockCampaigns);
      if (mockCampaigns.length > 0 && !campaignId) {
        setSelectedCampaign(mockCampaigns[0]);
        loadCampaignAnalytics(mockCampaigns[0].id);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaignAnalytics = async (id: string) => {
    try {
      // Mock analytics data
      const mockAnalytics = {
        total_reach: 1250,
        total_engagement: 89,
        conversion_rate: 7.1,
        best_performing_channel: 'linkedin',
        roi: 340,
        channel_breakdown: {
          linkedin: { reach: 450, engagement: 34, clicks: 12 },
          twitter: { reach: 300, engagement: 23, clicks: 8 },
          facebook: { reach: 250, engagement: 18, clicks: 6 },
          newsletter: { reach: 250, engagement: 14, clicks: 4 }
        }
      };
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const refreshAnalytics = async () => {
    if (!selectedCampaign) return;
    
    setRefreshing(true);
    try {
      await loadCampaignAnalytics(selectedCampaign.id);
    } catch (error) {
      console.error('Failed to refresh analytics');
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-500',
      generating: 'bg-blue-500',
      ready: 'bg-yellow-500',
      publishing: 'bg-purple-500',
      published: 'bg-green-500',
      failed: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: <Clock className="w-4 h-4" />,
      generating: <RefreshCw className="w-4 h-4 animate-spin" />,
      ready: <AlertCircle className="w-4 h-4" />,
      publishing: <Zap className="w-4 h-4" />,
      published: <CheckCircle2 className="w-4 h-4" />,
      failed: <AlertCircle className="w-4 h-4" />
    };
    return icons[status as keyof typeof icons] || <Clock className="w-4 h-4" />;
  };

  const getChannelIcon = (channel: string) => {
    const icons = {
      blog: <FileText className="w-5 h-5" />,
      newsletter: <Mail className="w-5 h-5" />,
      linkedin: <Linkedin className="w-5 h-5" />,
      twitter: <Twitter className="w-5 h-5" />,
      facebook: <Facebook className="w-5 h-5" />,
      instagram: <Instagram className="w-5 h-5" />,
      youtube: <Video className="w-5 h-5" />,
      pdf: <FileDown className="w-5 h-5" />
    };
    return icons[channel as keyof typeof icons] || <Share2 className="w-5 h-5" />;
  };

  const channelColors = ['#0077B5', '#1DA1F2', '#4267B2', '#E4405F', '#FF0000', '#00A86B'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campaign Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Campaign Dashboard</h2>
          {campaigns.length > 0 && (
            <select
              value={selectedCampaign?.id || ''}
              onChange={(e) => {
                const campaign = campaigns.find(c => c.id === e.target.value);
                if (campaign) {
                  setSelectedCampaign(campaign);
                  loadCampaignAnalytics(campaign.id);
                }
              }}
              className="px-4 py-2 border rounded-lg"
            >
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAnalytics}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => router.push('/admin/social/compose')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {selectedCampaign && (
        <>
          {/* Campaign Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.total_reach?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.total_engagement?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.conversion_rate?.toFixed(1) || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.roi?.toFixed(0) || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  +15.3% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Campaign Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge className={`${getStatusColor(selectedCampaign.status)} text-white`}>
                  {getStatusIcon(selectedCampaign.status)}
                  <span className="ml-2 capitalize">{selectedCampaign.status}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created {format(new Date(selectedCampaign.created_at), 'MMM dd, yyyy')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Channel Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>
                Performance breakdown across all channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.channel_breakdown && Object.entries(analytics.channel_breakdown).map(([channel, data]: [string, any], index) => (
                  <div key={channel} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getChannelIcon(channel)}
                      <div>
                        <h4 className="font-medium capitalize">{channel}</h4>
                        <p className="text-sm text-muted-foreground">
                          {data.reach?.toLocaleString()} reach • {data.engagement?.toLocaleString()} engagement
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{data.clicks?.toLocaleString() || 0} clicks</div>
                      <div className="text-sm text-muted-foreground">
                        {data.reach ? ((data.clicks / data.reach) * 100).toFixed(1) : 0}% CTR
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!selectedCampaign && campaigns.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first campaign to get started
            </p>
            <Button onClick={() => router.push('/admin/social/compose')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}