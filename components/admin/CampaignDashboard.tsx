// /components/admin/CampaignDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { campaignService, Campaign } from '@/lib/services/campaignService';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
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
  FileDown
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
      const data = await campaignService.getAllCampaigns();
      setCampaigns(data);
      if (data.length > 0 && !campaignId) {
        setSelectedCampaign(data[0]);
        loadCampaignAnalytics(data[0].id);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const loadCampaignAnalytics = async (id: string) => {
    try {
      const data = await campaignService.getCampaignAnalytics(id);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const refreshAnalytics = async () => {
    if (!selectedCampaign) return;
    
    setRefreshing(true);
    try {
      await loadCampaignAnalytics(selectedCampaign.id);
      toast.success('Analytics refreshed');
    } catch (error) {
      toast.error('Failed to refresh analytics');
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
            size="sm"
            onClick={() => router.push('/admin/social/compose')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {selectedCampaign && (
        <>
          {/* Campaign Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedCampaign.topic}</CardTitle>
                  <CardDescription>
                    Created {format(new Date(selectedCampaign.created_at), 'MMM d, yyyy')}
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(selectedCampaign.status)} text-white`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(selectedCampaign.status)}
                    {selectedCampaign.status}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{analytics?.total_reach || 0}</div>
                  <div className="text-sm text-gray-500">Total Reach</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{analytics?.total_engagement || 0}</div>
                  <div className="text-sm text-gray-500">Engagements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {analytics?.conversion_rate || 0}%
                  </div>
                  <div className="text-sm text-gray-500">Conversion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics?.roi || 0}%
                  </div>
                  <div className="text-sm text-gray-500">ROI</div>
                </div>
              </div>

              {/* Channel Status Grid */}
              <div className="grid grid-cols-4 gap-4">
                {/* Blog */}
                <Card className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      {getChannelIcon('blog')}
                      <Badge variant="outline" className="text-xs">
                        {selectedCampaign.components.blog ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="font-medium">Blog Post</div>
                    {selectedCampaign.components.blog && (
                      <div className="text-sm text-gray-500 mt-1">
                        Score: {selectedCampaign.components.blog.score}/100
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      {getChannelIcon('newsletter')}
                      <Badge variant="outline" className="text-xs">
                        {selectedCampaign.components.newsletter?.sent_at ? 'Sent' : 'Ready'}
                      </Badge>
                    </div>
                    <div className="font-medium">Newsletter</div>
                    {selectedCampaign.components.newsletter?.recipient_count && (
                      <div className="text-sm text-gray-500 mt-1">
                        {selectedCampaign.components.newsletter.recipient_count} recipients
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Social Media */}
                <Card className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Share2 className="w-5 h-5" />
                      <Badge variant="outline" className="text-xs">
                        {Object.keys(selectedCampaign.components.socialSeries || {}).length} platforms
                      </Badge>
                    </div>
                    <div className="font-medium">Social Series</div>
                    <div className="flex gap-1 mt-2">
                      {selectedCampaign.components.socialSeries?.linkedin && <Linkedin className="w-4 h-4" />}
                      {selectedCampaign.components.socialSeries?.twitter && <Twitter className="w-4 h-4" />}
                      {selectedCampaign.components.socialSeries?.facebook && <Facebook className="w-4 h-4" />}
                      {selectedCampaign.components.socialSeries?.instagram && <Instagram className="w-4 h-4" />}
                    </div>
                  </CardContent>
                </Card>

                {/* Downloads */}
                <Card className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Download className="w-5 h-5" />
                      <Badge variant="outline" className="text-xs">
                        {Object.keys(selectedCampaign.components.downloads || {}).length} files
                      </Badge>
                    </div>
                    <div className="font-medium">Downloads</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {(selectedCampaign.components.downloads?.pdf?.download_count || 0) +
                        (selectedCampaign.components.downloads?.videoScript?.download_count || 0)} total
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.performance_over_time || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="reach" 
                        stroke="#8884d8" 
                        name="Reach"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="engagement" 
                        stroke="#82ca9d" 
                        name="Engagement"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Best Performing Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.top_content?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getChannelIcon(item.channel)}
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.channel}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{item.engagement}</div>
                          <div className="text-sm text-gray-500">engagements</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="channels" className="space-y-4">
              {/* Channel Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Channel Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.channel_performance || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="channel" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="reach" fill="#8884d8" name="Reach" />
                      <Bar dataKey="engagement" fill="#82ca9d" name="Engagement" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Engagement by Channel */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics?.engagement_by_channel || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {(analytics?.engagement_by_channel || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={channelColors[index % channelColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              {/* Content Details */}
              <div className="grid grid-cols-2 gap-4">
                {/* Blog Performance */}
                {selectedCampaign.components.blog && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Blog Post
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Title</span>
                          <span className="font-medium text-right">
                            {selectedCampaign.components.blog.title}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Score</span>
                          <span className="font-medium">
                            {selectedCampaign.components.blog.score}/100
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Views</span>
                          <span className="font-medium">
                            {analytics?.channel_breakdown?.blog?.views || 0}
                          </span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-4"
                          onClick={() => router.push(`/admin/posts/${selectedCampaign.blog_post_id}`)}
                        >
                          View Post
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Social Series Performance */}
                {selectedCampaign.components.socialSeries && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Share2 className="w-5 h-5" />
                        Social Series
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(selectedCampaign.components.socialSeries).map(([platform, series]) => (
                          <div key={platform} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getChannelIcon(platform)}
                              <span className="capitalize">{platform}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {(series as any).posts?.length || 0} posts
                              </div>
                              <div className="text-sm text-gray-500">
                                {analytics?.channel_breakdown?.social?.[platform]?.engagement || 0} eng.
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-4"
                          onClick={() => router.push(`/admin/social/campaigns/${selectedCampaign.id}/series`)}
                        >
                          Manage Series
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Downloads Performance */}
              {selectedCampaign.components.downloads && (
                <Card>
                  <CardHeader>
                    <CardTitle>Downloads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(selectedCampaign.components.downloads).map(([type, download]) => (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileDown className="w-5 h-5" />
                            <span className="capitalize">{type.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              {(download as any).download_count} downloads
                            </span>
                            <Button size="sm" variant="outline">
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              {/* Publishing Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Publishing Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.timeline?.map((event: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${event.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                          {index < analytics.timeline.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {getChannelIcon(event.channel)}
                                {event.title}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {format(new Date(event.date), 'MMM d, yyyy h:mm a')}
                              </div>
                            </div>
                            {event.metrics && (
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {event.metrics.reach} reach
                                </div>
                                <div className="text-sm text-gray-500">
                                  {event.metrics.engagement} engagements
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          {selectedCampaign.status === 'ready' && (
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-semibold">Ready to Publish</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Your campaign is ready to be published across all channels
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={async () => {
                    try {
                      await campaignService.publishCampaign(selectedCampaign.id);
                      toast.success('Campaign published successfully!');
                      loadCampaigns();
                    } catch (error) {
                      toast.error('Failed to publish campaign');
                    }
                  }}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Publish Campaign
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}