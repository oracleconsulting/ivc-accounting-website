// /components/admin/CampaignCreator.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { campaignService } from '@/lib/services/campaignService';
import {
  Sparkles,
  FileText,
  Target,
  Lightbulb,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Brain,
  Wand2,
  Rocket,
  TrendingUp,
  Users,
  BarChart
} from 'lucide-react';

interface CampaignCreatorProps {
  existingBlogId?: string;
}

export function CampaignCreator({ existingBlogId }: CampaignCreatorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('topic');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // Campaign details
  const [campaignData, setCampaignData] = useState({
    topic: '',
    description: '',
    keywords: [] as string[],
    targetAudience: '',
    goals: [] as string[],
    tone: 'professional',
    blogLength: 'medium',
    includeData: true,
    includeCaseStudy: false,
    contentPillars: [] as string[]
  });

  const [currentKeyword, setCurrentKeyword] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  const contentTones = [
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'conversational', label: 'Conversational', icon: '💬' },
    { value: 'educational', label: 'Educational', icon: '🎓' },
    { value: 'inspiring', label: 'Inspiring', icon: '✨' }
  ];

  const campaignGoals = [
    { value: 'lead-generation', label: 'Lead Generation', icon: <Users className="w-4 h-4" /> },
    { value: 'brand-awareness', label: 'Brand Awareness', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'thought-leadership', label: 'Thought Leadership', icon: <Brain className="w-4 h-4" /> },
    { value: 'education', label: 'Client Education', icon: <Lightbulb className="w-4 h-4" /> },
    { value: 'engagement', label: 'Social Engagement', icon: <BarChart className="w-4 h-4" /> }
  ];

  const blogLengths = [
    { value: 'short', label: 'Short (500-800 words)', time: '5 min read' },
    { value: 'medium', label: 'Medium (800-1500 words)', time: '7 min read' },
    { value: 'long', label: 'Long (1500-2500 words)', time: '12 min read' },
    { value: 'comprehensive', label: 'Comprehensive (2500+ words)', time: '15+ min read' }
  ];

  const addKeyword = () => {
    if (currentKeyword.trim() && !campaignData.keywords.includes(currentKeyword.trim())) {
      setCampaignData(prev => ({
        ...prev,
        keywords: [...prev.keywords, currentKeyword.trim()]
      }));
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setCampaignData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const toggleGoal = (goal: string) => {
    setCampaignData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const generateCampaign = async () => {
    if (!campaignData.topic || campaignData.keywords.length === 0) {
      console.error('Please provide a topic and at least one keyword');
      return;
    }

    setGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 1000);

      // Generate campaign
      const response = await fetch('/api/campaign/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...campaignData,
          mode: 'complete', // Generate everything
          aiMode: 'excellence' // Use Opus 4 for best quality
        })
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (!response.ok) {
        throw new Error('Failed to generate campaign');
      }

      const campaign = await response.json();
      
      console.log('Campaign created successfully!');
      
      // Navigate to campaign dashboard
      setTimeout(() => {
        router.push(`/admin/social/campaigns/${campaign.id}`);
      }, 1000);

    } catch (error) {
      console.error('Error generating campaign:', error);
      console.error('Failed to generate campaign');
    } finally {
      setGenerating(false);
    }
  };

  const suggestKeywords = async () => {
    if (!campaignData.topic) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: campaignData.topic })
      });

      const data = await response.json();
      setCampaignData(prev => ({
        ...prev,
        keywords: [...new Set([...prev.keywords, ...data.keywords])]
      }));
      
      console.log('Keywords suggested!');
    } catch (error) {
      console.error('Failed to suggest keywords');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-600" />
          Create Content Campaign
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transform a single idea into a complete multi-channel content campaign with AI-powered generation
        </p>
      </div>

      {!generating ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="topic">Topic & Keywords</TabsTrigger>
            <TabsTrigger value="audience">Audience & Goals</TabsTrigger>
            <TabsTrigger value="style">Style & Format</TabsTrigger>
          </TabsList>

          <TabsContent value="topic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Campaign Topic
                </CardTitle>
                <CardDescription>
                  What's the main topic or theme for your content campaign?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Tax Savings Strategies for Small Businesses"
                    value={campaignData.topic}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, topic: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of what you want to cover..."
                    rows={3}
                    value={campaignData.description}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Keywords</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={suggestKeywords}
                      disabled={loading || !campaignData.topic}
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Suggest Keywords
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add keyword..."
                      value={currentKeyword}
                      onChange={(e) => setCurrentKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    />
                    <Button onClick={addKeyword} variant="secondary">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {campaignData.keywords.map(keyword => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeKeyword(keyword)}
                      >
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Target Audience
                </CardTitle>
                <CardDescription>
                  Who is this campaign for and what do you want to achieve?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Textarea
                    id="audience"
                    placeholder="e.g., Small business owners with 10-50 employees looking to optimize their tax strategy..."
                    rows={3}
                    value={campaignData.targetAudience}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Campaign Goals</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {campaignGoals.map(goal => (
                      <label
                        key={goal.value}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          campaignData.goals.includes(goal.value)
                            ? 'bg-purple-50 border-purple-300'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={campaignData.goals.includes(goal.value)}
                          onChange={() => toggleGoal(goal.value)}
                          className="sr-only"
                        />
                        {goal.icon}
                        <span className="font-medium">{goal.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="style" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Style & Format
                </CardTitle>
                <CardDescription>
                  Customize the tone and format of your content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Content Tone</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {contentTones.map(tone => (
                      <label
                        key={tone.value}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          campaignData.tone === tone.value
                            ? 'bg-purple-50 border-purple-300'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="tone"
                          value={tone.value}
                          checked={campaignData.tone === tone.value}
                          onChange={(e) => setCampaignData(prev => ({ ...prev, tone: e.target.value }))}
                          className="sr-only"
                        />
                        <span className="text-2xl">{tone.icon}</span>
                        <span className="font-medium">{tone.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Blog Length</Label>
                  <div className="space-y-2">
                    {blogLengths.map(length => (
                      <label
                        key={length.value}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                          campaignData.blogLength === length.value
                            ? 'bg-purple-50 border-purple-300'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="length"
                            value={length.value}
                            checked={campaignData.blogLength === length.value}
                            onChange={(e) => setCampaignData(prev => ({ ...prev, blogLength: e.target.value }))}
                            className="sr-only"
                          />
                          <span className="font-medium">{length.label}</span>
                        </div>
                        <span className="text-sm text-gray-500">{length.time}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Content Elements</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BarChart className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="font-medium">Include Data & Statistics</p>
                          <p className="text-sm text-gray-500">Add relevant data points and research</p>
                        </div>
                      </div>
                      <Switch
                        checked={campaignData.includeData}
                        onCheckedChange={(checked) => 
                          setCampaignData(prev => ({ ...prev, includeData: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="font-medium">Include Case Study</p>
                          <p className="text-sm text-gray-500">Add a relevant client success story</p>
                        </div>
                      </div>
                      <Switch
                        checked={campaignData.includeCaseStudy}
                        onCheckedChange={(checked) => 
                          setCampaignData(prev => ({ ...prev, includeCaseStudy: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-6">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Generating Your Campaign</h3>
                <p className="text-gray-600">
                  Creating blog, newsletter, social series, and downloads...
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <Progress value={generationProgress} className="h-2" />
                <p className="text-sm text-gray-500 mt-2">{generationProgress}% complete</p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto text-sm">
                <div className="flex items-center gap-2">
                  {generationProgress >= 20 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                  <span>Blog post</span>
                </div>
                <div className="flex items-center gap-2">
                  {generationProgress >= 40 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                  <span>Newsletter</span>
                </div>
                <div className="flex items-center gap-2">
                  {generationProgress >= 60 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                  <span>Social series</span>
                </div>
                <div className="flex items-center gap-2">
                  {generationProgress >= 80 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                  <span>Downloads</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Bar */}
      {!generating && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Ready to Create?
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Generate a complete campaign with one click
              </p>
            </div>
            <Button
              size="lg"
              onClick={generateCampaign}
              disabled={!campaignData.topic || campaignData.keywords.length === 0}
              className="gap-2"
            >
              Generate Campaign
              <ArrowRight className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}