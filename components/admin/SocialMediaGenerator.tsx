// /components/admin/SocialMediaGenerator.tsx (Enhanced Version)
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { SeriesPreview } from './SeriesPreview';
import { aiSeriesGenerator } from '@/lib/services/aiSeriesGenerator';
import { campaignService } from '@/lib/services/campaignService';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Wand2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Calendar,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Brain,
  Zap,
  ArrowRight,
  Settings2,
  RefreshCw
} from 'lucide-react';

interface SocialMediaGeneratorProps {
  postTitle: string;
  postContent: string;
  postUrl?: string;
  postId?: string;
  keywords?: string[];
}

export function SocialMediaGenerator({
  postTitle,
  postContent,
  postUrl,
  postId,
  keywords = []
}: SocialMediaGeneratorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('settings');
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedSeries, setGeneratedSeries] = useState<any>(null);
  
  // Generation settings
  const [settings, setSettings] = useState({
    platforms: {
      linkedin: true,
      twitter: true,
      facebook: true,
      instagram: true
    },
    seriesType: 'educational', // educational, promotional, storytelling, tips
    tone: 'professional-friendly',
    includeHashtags: true,
    includeCallToAction: true,
    optimizeForEngagement: true,
    includeVisuals: true,
    scheduleOptimally: true
  });

  const seriesTypes = [
    { value: 'educational', label: 'Educational Series', icon: <Brain className="w-4 h-4" /> },
    { value: 'promotional', label: 'Promotional Campaign', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'storytelling', label: 'Story-Based Series', icon: <Users className="w-4 h-4" /> },
    { value: 'tips', label: 'Tips & Tricks', icon: <Sparkles className="w-4 h-4" /> }
  ];

  const generateSeries = async () => {
    setGenerating(true);
    setGenerationProgress(0);
    setActiveTab('preview');

    try {
      // Calculate total steps
      const selectedPlatforms = Object.entries(settings.platforms)
        .filter(([_, enabled]) => enabled)
        .map(([platform]) => platform);
      
      const totalSteps = selectedPlatforms.length + 2; // +2 for analysis and optimization
      let currentStep = 0;

      // Step 1: Analyze content
      setGenerationProgress((++currentStep / totalSteps) * 100);
      
      // Step 2: Generate series for each platform
      const series = await aiSeriesGenerator.generateCompleteSeries({
        title: postTitle,
        content: postContent,
        keywords,
        platforms: selectedPlatforms,
        seriesLength: {
          linkedin: 5,
          twitter: 10,
          facebook: 3,
          instagram: 5
        }
      });

      // Update progress for each platform
      selectedPlatforms.forEach(() => {
        setGenerationProgress((++currentStep / totalSteps) * 100);
      });

      // Step 3: Optimize for engagement
      if (settings.optimizeForEngagement) {
        // Analyze competitor content and optimize
        for (const platform of selectedPlatforms) {
          const insights = await aiSeriesGenerator.analyzeCompetitorContent(platform, postTitle);
          if (insights) {
            // Apply optimizations based on insights
            series[platform] = await aiSeriesGenerator.optimizeForAlgorithm(platform, series[platform]);
          }
        }
      }

      setGenerationProgress(100);
      setGeneratedSeries(series);
      
      console.log('Social media series generated successfully!');
    } catch (error) {
      console.error('Error generating series:', error);
      console.error('Failed to generate social media series');
    } finally {
      setGenerating(false);
    }
  };

  const createFullCampaign = async () => {
    if (!generatedSeries) return;

    try {
      // If we have a blog post ID, create campaign from it
      if (postId) {
        const campaign = await campaignService.createFromBlog({
          blogId: postId,
          blogTitle: postTitle,
          blogContent: postContent,
          keywords,
          userId: 'current-user-id' // Get from auth context
        });
        
        router.push(`/admin/social/campaigns/${campaign.id}`);
      } else {
        // Create new campaign without blog post
        console.error('Please save the blog post first');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      console.error('Failed to create campaign');
    }
  };

  const regeneratePlatform = async (platform: string) => {
    if (!generatedSeries) return;
    
    setGenerating(true);
    try {
      const newSeries = await aiSeriesGenerator.generateCompleteSeries({
        title: postTitle,
        content: postContent,
        keywords,
        platforms: [platform],
        seriesLength: {
          linkedin: 5,
          twitter: 10,
          facebook: 3,
          instagram: 5
        }
      });

      setGeneratedSeries({
        ...generatedSeries,
        [platform]: newSeries[platform]
      });
      
      console.log(`${platform} series regenerated`);
    } catch (error) {
      console.error(`Failed to regenerate ${platform} series`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            AI Social Media Series Generator
          </CardTitle>
          <CardDescription>
            Transform your blog post into engaging social media series across multiple platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="preview" disabled={!generatedSeries}>Preview</TabsTrigger>
              <TabsTrigger value="schedule" disabled={!generatedSeries}>Schedule</TabsTrigger>
            </TabsList>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              {/* Platform Selection */}
              <div className="space-y-4">
                <Label>Select Platforms</Label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(settings.platforms).map(([platform, enabled]) => (
                    <label
                      key={platform}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        enabled ? 'bg-purple-50 border-purple-300' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({
                            ...prev,
                            platforms: { ...prev.platforms, [platform]: checked }
                          }))
                        }
                      />
                      <div className="flex items-center gap-2">
                        {platform === 'linkedin' && <Linkedin className="w-5 h-5" />}
                        {platform === 'twitter' && <Twitter className="w-5 h-5" />}
                        {platform === 'facebook' && <Facebook className="w-5 h-5" />}
                        {platform === 'instagram' && <Instagram className="w-5 h-5" />}
                        <span className="font-medium capitalize">{platform}</span>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">
                        {platform === 'linkedin' && '5 posts'}
                        {platform === 'twitter' && '10 tweets'}
                        {platform === 'facebook' && '3 posts'}
                        {platform === 'instagram' && '5 slides'}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Series Type */}
              <div className="space-y-4">
                <Label>Series Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {seriesTypes.map(type => (
                    <label
                      key={type.value}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        settings.seriesType === type.value
                          ? 'bg-purple-50 border-purple-300'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="seriesType"
                        value={type.value}
                        checked={settings.seriesType === type.value}
                        onChange={(e) =>
                          setSettings(prev => ({ ...prev, seriesType: e.target.value }))
                        }
                        className="sr-only"
                      />
                      {type.icon}
                      <span className="font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <Label>Advanced Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="font-medium">Optimize for Engagement</p>
                        <p className="text-sm text-gray-500">Use AI to maximize likes and shares</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.optimizeForEngagement}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, optimizeForEngagement: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="font-medium">Schedule Optimally</p>
                        <p className="text-sm text-gray-500">Post at best times for each platform</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.scheduleOptimally}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, scheduleOptimally: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-end">
                <Button
                  size="lg"
                  onClick={generateSeries}
                  disabled={generating || !Object.values(settings.platforms).some(v => v)}
                  className="gap-2"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Series
                    </>
                  )}
                </Button>
              </div>

              {/* Generation Progress */}
              {generating && (
                <div className="space-y-2">
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-sm text-center text-gray-600">
                    Generating your social media series... {Math.round(generationProgress)}%
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview">
              {generatedSeries && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Generated Series Preview</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('settings')}
                      className="gap-2"
                    >
                      <Settings2 className="w-4 h-4" />
                      Adjust Settings
                    </Button>
                  </div>

                  <SeriesPreview
                    campaignId="preview"
                    socialSeries={generatedSeries}
                    onUpdate={(platform, updatedSeries) => {
                      setGeneratedSeries({
                        ...generatedSeries,
                        [platform]: updatedSeries
                      });
                    }}
                  />

                  {/* Platform Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.keys(generatedSeries).map(platform => (
                          <div
                            key={platform}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              {platform === 'linkedin' && <Linkedin className="w-4 h-4" />}
                              {platform === 'twitter' && <Twitter className="w-4 h-4" />}
                              {platform === 'facebook' && <Facebook className="w-4 h-4" />}
                              {platform === 'instagram' && <Instagram className="w-4 h-4" />}
                              <span className="font-medium capitalize">{platform}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => regeneratePlatform(platform)}
                              disabled={generating}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setGeneratedSeries(null)}
                    >
                      Start Over
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('schedule')}
                      >
                        Schedule Posts
                      </Button>
                      <Button
                        onClick={createFullCampaign}
                        className="gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Create Full Campaign
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              {generatedSeries && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scheduling Options</CardTitle>
                      <CardDescription>
                        Choose when to publish your social media series
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline" className="justify-start gap-2">
                            <Zap className="w-4 h-4" />
                            Publish Now
                          </Button>
                          <Button variant="outline" className="justify-start gap-2">
                            <Calendar className="w-4 h-4" />
                            Schedule for Later
                          </Button>
                        </div>
                        
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Optimal Posting Times
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>LinkedIn:</span>
                              <span className="font-medium">Tue-Thu, 9am & 5pm</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Twitter:</span>
                              <span className="font-medium">Weekdays, 9am & 1pm</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Facebook:</span>
                              <span className="font-medium">Wed & Fri, 1pm</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Instagram:</span>
                              <span className="font-medium">Mon & Wed, 11am</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button size="lg" className="gap-2">
                      <Calendar className="w-5 h-5" />
                      Schedule All Posts
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}