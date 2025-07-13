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
  Loader2
} from 'lucide-react';

// Import all our AI components
import { AIReviewPanel } from './AIReviewPanel';
import { ContentScoreBadge } from './ContentScoreBadge';
import { InlineSuggestions } from './InlineSuggestions';
import { ContentTemplates } from './ContentTemplates';
import { CompetitiveAnalysis } from './CompetitiveAnalysis';
import { AutoEnhancements } from './AutoEnhancements';
import { ContentExporter } from './ContentExporter';
import { SuggestionHistory } from './SuggestionHistory';
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

      {/* Main Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Panel - Templates and Tools */}
        <div className="lg:col-span-1 space-y-4">
          <ContentTemplates 
            onSelectTemplate={(template) => {
              setContent(template.content);
              setTitle(template.title);
              setKeywords(template.keywords);
            }}
          />
          
          <CompetitiveAnalysis 
            keywords={keywords}
            onInsightApply={(insight) => {
              toast({
                title: "Competitive Insight Applied",
                description: insight,
              });
            }}
          />

          <SuggestionHistory 
            history={history}
            onRestore={(entry) => {
              setContent(entry.content);
              toast({
                title: "Content Restored",
                description: `Restored to version from ${new Date(entry.timestamp).toLocaleString()}`,
              });
            }}
          />
        </div>

        {/* Center Panel - Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
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
            </CardHeader>
            <CardContent>
              {isAutoEnhanceEnabled ? (
                <InlineSuggestions
                  content={content}
                  onChange={handleContentUpdate}
                  aiMode={aiMode}
                  suggestions={suggestions}
                />
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => handleContentUpdate(e.target.value)}
                  className="w-full min-h-[400px] p-4 border rounded-md"
                  placeholder="Start writing your blog post..."
                />
              )}
            </CardContent>
          </Card>

          {/* Auto-Enhancement Tools */}
          <AutoEnhancements
            content={content}
            onEnhance={handleContentUpdate}
            isEnabled={isAutoEnhanceEnabled}
            aiMode={aiMode}
          />

          {/* AI Review Panel */}
          <AIReviewPanel
            content={content}
            onContentUpdate={handleContentUpdate}
            keywords={keywords}
            aiMode={aiMode}
          />

          {/* Before/After Preview */}
          <BeforeAfterPreview
            originalContent={initialContent}
            currentContent={content}
          />

          {/* Export Options */}
          <ContentExporter
            content={content}
            title={title}
            keywords={keywords}
            onExport={(format, exportedContent) => {
              toast({
                title: `Exported as ${format}`,
                description: "Content has been prepared for export",
              });
            }}
          />
        </div>
      </div>

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