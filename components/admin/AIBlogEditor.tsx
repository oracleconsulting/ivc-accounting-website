'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { 
  Sparkles, 
  Zap, 
  Trophy, 
  Gem,
  FileText,
  TrendingUp,
  Search,
  Link,
  Quote,
  Layout,
  History,
  Eye,
  Save,
  Download,
  Mail,
  Share2,
  Video,
  Loader2,
  Brain,
  Shield,
  Lightbulb,
  Wand2
} from 'lucide-react';

// Import all our AI components
import { AIReviewPanel } from './AIReviewPanel';
import { ContentScoreBadge } from './ContentScoreBadge';
import { BeforeAfterPreview } from './BeforeAfterPreview';
import { BlogToCampaignBridge } from './BlogToCampaignBridge';

// AI Writing Modes
const AI_MODES = {
  speed: {
    name: 'Speed Mode',
    icon: Zap,
    model: 'anthropic/claude-3-haiku',
    description: 'Quick drafts and rapid content generation',
    color: 'text-blue-600'
  },
  quality: {
    name: 'Quality Mode',
    icon: Trophy,
    model: 'anthropic/claude-3-sonnet',
    description: 'Balanced writing with good quality',
    color: 'text-purple-600'
  },
  excellence: {
    name: 'Excellence Mode',
    icon: Gem,
    model: 'anthropic/claude-3-opus',
    description: 'Premium content with deep analysis',
    color: 'text-amber-600'
  }
};

interface AIBlogEditorProps {
  initialContent?: string;
  postId?: string;
  userId?: string; // Add this
  onSave: (content: string, metadata: any) => void;
}

export function AIBlogEditor({ initialContent = '', postId, userId = 'current-user-id', onSave }: AIBlogEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [aiMode, setAiMode] = useState<keyof typeof AI_MODES>('quality');
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isAutoEnhanceEnabled, setIsAutoEnhanceEnabled] = useState(true);
  const [contentScore, setContentScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const { toast } = useToast();

  // Real-time content scoring
  useEffect(() => {
    const analyzeContent = async () => {
      if (!content || content.length < 100) return;
      
      setIsAnalyzing(true);
      try {
        const response = await fetch('/api/ai/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, keywords })
        });
        
        const data = await response.json();
        setContentScore(data.score);
      } catch (error) {
        console.error('Failed to analyze content:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const debounceTimer = setTimeout(analyzeContent, 1000);
    return () => clearTimeout(debounceTimer);
  }, [content, keywords]);

  // Auto-save with history
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (content !== initialContent) {
        const historyEntry = {
          id: Date.now(),
          content,
          timestamp: new Date().toISOString(),
          score: contentScore,
          aiMode
        };
        setHistory(prev => [...prev.slice(-9), historyEntry]);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(saveTimer);
  }, [content, contentScore, aiMode, initialContent]);

  const handleContentUpdate = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleAIModeChange = (mode: keyof typeof AI_MODES) => {
    setAiMode(mode);
    toast({
      title: `Switched to ${AI_MODES[mode].name}`,
      description: AI_MODES[mode].description,
    });
  };

  const CurrentModeIcon = AI_MODES[aiMode].icon;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      {/* Header with AI Mode Selector and Content Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">AI Blog Editor</h1>
          <ContentScoreBadge score={contentScore} isAnalyzing={isAnalyzing} />
        </div>
        
        <div className="flex items-center gap-4">
          {/* AI Mode Selector */}
          <Select value={aiMode} onValueChange={handleAIModeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <CurrentModeIcon className="w-4 h-4" />
                  {AI_MODES[aiMode].name}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AI_MODES).map(([key, mode]) => {
                const Icon = mode.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${mode.color}`} />
                      <div>
                        <div className="font-medium">{mode.name}</div>
                        <div className="text-xs text-muted-foreground">{mode.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Auto-Enhance Toggle */}
          <div className="flex items-center gap-2">
            <Switch
              checked={isAutoEnhanceEnabled}
              onCheckedChange={setIsAutoEnhanceEnabled}
            />
            <label className="text-sm">Auto-Enhance</label>
          </div>
        </div>
      </div>

      {/* Main Editor Layout with Tabs */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold border-none outline-none w-full"
            />
            <input
              type="text"
              placeholder="Keywords (comma-separated)"
              value={keywords.join(', ')}
              onChange={(e) => setKeywords(e.target.value.split(',').map(k => k.trim()))}
              className="text-sm text-muted-foreground border-none outline-none w-full"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="write" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="write" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Write
              </TabsTrigger>
              <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="ai-review" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                AI Review
              </TabsTrigger>
              <TabsTrigger value="social-media" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Social Media
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="mt-6">
              <div className="space-y-4">
                <textarea
                  value={content}
                  onChange={(e) => handleContentUpdate(e.target.value)}
                  className="w-full min-h-[400px] p-4 border rounded-md resize-none"
                  placeholder="Start writing your blog post..."
                />
                
                {/* Before/After Preview */}
                {initialContent && content !== initialContent && (
                  <BeforeAfterPreview
                    originalContent={initialContent}
                    currentContent={content}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="ai-assistant" className="mt-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-muted/50">
                  <h3 className="text-lg font-semibold mb-2">AI Writing Assistant</h3>
                  <p className="text-muted-foreground mb-4">
                    Get AI-powered suggestions, research, and content enhancement.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                      <Search className="w-5 h-5 mb-2" />
                      <span className="font-medium">Research Topic</span>
                      <span className="text-xs text-muted-foreground">Find relevant information</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                      <Lightbulb className="w-5 h-5 mb-2" />
                      <span className="font-medium">Generate Ideas</span>
                      <span className="text-xs text-muted-foreground">Get content suggestions</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                      <Wand2 className="w-5 h-5 mb-2" />
                      <span className="font-medium">Improve Writing</span>
                      <span className="text-xs text-muted-foreground">Enhance your content</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                      <Quote className="w-5 h-5 mb-2" />
                      <span className="font-medium">Add Citations</span>
                      <span className="text-xs text-muted-foreground">Include references</span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-review" className="mt-6">
              <AIReviewPanel
                content={content}
                onContentUpdate={handleContentUpdate}
                keywords={keywords}
                aiMode={aiMode}
                title={title}
              />
            </TabsContent>

            <TabsContent value="social-media" className="mt-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-muted/50">
                  <h3 className="text-lg font-semibold mb-2">Social Media Campaign</h3>
                  <p className="text-muted-foreground mb-4">
                    Create social media content from your blog post.
                  </p>
                  {contentScore >= 70 ? (
                    <BlogToCampaignBridge
                      blogId={postId || ''}
                      blogTitle={title}
                      blogContent={content}
                      blogScore={contentScore}
                      keywords={keywords}
                      userId={userId}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground mb-2">
                        Content score: {contentScore}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Improve your content quality to unlock social media campaign creation.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Floating Action Bar */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-background border rounded-lg p-2 shadow-lg">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {/* Save draft */}}
        >
          <Save className="w-4 h-4 mr-1" />
          Save Draft
        </Button>
        <Button
          size="sm"
          onClick={() => onSave(content, { title, keywords, score: contentScore })}
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Publish
        </Button>
        
        {/* Add the BlogToCampaignBridge here */}
        {postId && contentScore >= 70 && (
          <BlogToCampaignBridge
            blogId={postId}
            blogTitle={title}
            blogContent={content}
            blogScore={contentScore}
            keywords={keywords}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
} 