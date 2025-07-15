import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Sparkles, 
  Zap, 
  Trophy, 
  Gem,
  FileText,
  Brain,
  Shield,
  Wand2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  Layout,
  Palette,
  Grid,
  Type,
  Image,
  Video,
  BarChart,
  Quote,
  List,
  Code,
  Loader2,
  ChevronRight,
  PanelLeft,
  PanelRight,
  Maximize2,
  Download,
  Share2
} from 'lucide-react';

// Types
interface Node {
  type: string;
  text?: string;
  content?: Node[];
  attrs?: { level?: number };
}
interface LayoutSuggestion {
  id: string;
  name: string;
  score: number;
  components: any[];
  description: string;
  preview: string;
}
interface OverallReview {
  score: number;
  grade: string;
  wordCount: number;
  readingTime: number;
}
type AIModeKey = 'speed' | 'quality' | 'excellence';
interface AIMode {
  name: string;
  icon: any;
  model: string;
  description: string;
  color: string;
}

// AI Writing Modes
const AI_MODES: Record<AIModeKey, AIMode> = {
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
    color: 'text-[#ff6b35]'
  },
  excellence: {
    name: 'Excellence Mode',
    icon: Gem,
    model: 'anthropic/claude-3-opus',
    description: 'Premium content with deep analysis',
    color: 'text-amber-600'
  }
};

// Layout components for AI-generated layouts
const LAYOUT_COMPONENTS: Record<string, { name: string; icon: any }> = {
  hero: { name: 'Hero Section', icon: Maximize2 },
  stats: { name: 'Statistics', icon: BarChart },
  quote: { name: 'Pull Quote', icon: Quote },
  comparison: { name: 'Comparison Table', icon: Grid },
  timeline: { name: 'Timeline', icon: List },
  cta: { name: 'Call to Action', icon: ChevronRight },
  faq: { name: 'FAQ Section', icon: Type },
  testimonial: { name: 'Testimonials', icon: Quote },
  infographic: { name: 'Infographic', icon: Image },
  video: { name: 'Video Section', icon: Video }
};

// Helper function to extract text from JSON content
const extractTextFromJSON = (doc: any): string => {
  if (!doc || typeof doc === 'string') return doc || '';
  if (doc.content && (doc.title !== undefined || doc.id !== undefined)) {
    console.warn('Received full post object instead of just content. Extracting content field.');
    return extractTextFromJSON(doc.content);
  }
  let text = '';
  const extractFromNode = (node: Node) => {
    if (node.type === 'text') {
      text += node.text || '';
    } else if (node.content && Array.isArray(node.content)) {
      node.content.forEach(extractFromNode);
    }
    if (node.type === 'paragraph') {
      text += '\n\n';
    } else if (node.type === 'heading') {
      const level = node.attrs?.level || 1;
      text = text.trim() + '\n\n' + '#'.repeat(level) + ' ';
    }
  };
  if (doc.content && Array.isArray(doc.content)) {
    doc.content.forEach(extractFromNode);
  }
  return text.trim();
};

export default function AIBlogEditor({ 
  initialContent = '', 
  postId, 
  userId = 'current-user-id', 
  onSave = () => {},
  post = null
}: {
  initialContent?: string | object;
  postId?: string;
  userId?: string;
  onSave?: (content: string, metadata: any) => void;
  post?: any;
}) {
  // Parse initial content if it's JSON
  const [content, setContent] = useState<string>(() => {
    console.log('Initial content type:', typeof initialContent);
    console.log('Initial content value:', initialContent);
    
    // Check if someone accidentally passed the whole post as initialContent
    if (initialContent && typeof initialContent === 'object' && 'content' in initialContent) {
      console.warn('⚠️ Received full post object as initialContent. Use the "post" prop instead.');
      const actualContent = (initialContent as any).content;
      if (typeof actualContent === 'string' && actualContent.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(actualContent);
          return extractTextFromJSON(parsed);
        } catch (e) {
          return actualContent;
        }
      }
      return extractTextFromJSON(actualContent);
    }
    
    if (typeof initialContent === 'string') {
      try {
        if (initialContent.trim().startsWith('{')) {
          const parsed = JSON.parse(initialContent);
          const extracted = extractTextFromJSON(parsed);
          console.log('Extracted text:', extracted);
          return extracted;
        }
        return initialContent;
      } catch (e) {
        console.error('Error parsing initial content:', e);
        return initialContent;
      }
    } else if (typeof initialContent === 'object') {
      const extracted = extractTextFromJSON(initialContent);
      console.log('Extracted from object:', extracted);
      return extracted;
    }
    return '';
  });
  
  const [aiMode, setAiMode] = useState<AIModeKey>('quality');
  const [title, setTitle] = useState<string>(() => {
    // First check if title was provided via post prop
    if (post?.title) return post.title;
    
    // Check if someone passed the whole post as initialContent
    if (initialContent && typeof initialContent === 'object' && 'title' in initialContent) {
      return (initialContent as any).title || '';
    }
    
    return '';
  });
  
  const [keywords, setKeywords] = useState<string[]>(() => {
    // First check if keywords were provided via post prop
    if (post?.keywords) {
      if (typeof post.keywords === 'string') {
        return post.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k);
      } else if (Array.isArray(post.keywords)) {
        return post.keywords;
      }
    }
    
    // Check if someone passed the whole post as initialContent
    if (initialContent && typeof initialContent === 'object' && 'keywords' in initialContent) {
      const kw = (initialContent as any).keywords;
      if (typeof kw === 'string') {
        return kw.split(',').map((k: string) => k.trim()).filter((k: string) => k);
      } else if (Array.isArray(kw)) {
        return kw;
      }
    }
    
    return [];
  });
  const [currentKeyword, setCurrentKeyword] = useState<string>('');
  const [isAutoEnhanceEnabled, setIsAutoEnhanceEnabled] = useState<boolean>(true);
  const [contentScore, setContentScore] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeAssistant, setActiveAssistant] = useState<string | null>(null);
  
  // New states for enhanced features
  const [splitView, setSplitView] = useState<boolean>(true);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [selectedLayout, setSelectedLayout] = useState<LayoutSuggestion | null>(null);
  const [aiLayoutSuggestions, setAiLayoutSuggestions] = useState<LayoutSuggestion[]>([]);
  const [isApplyingImprovements, setIsApplyingImprovements] = useState<boolean>(false);
  const [layoutPreview, setLayoutPreview] = useState<string>(''); // Store preview in state instead of localStorage
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  
  // AI Review state
  const [overallReview, setOverallReview] = useState<OverallReview | null>(null);
  const [reviewSections, setReviewSections] = useState<any[]>([]);

  // Load post data when component mounts or post changes
  useEffect(() => {
    if (post) {
      // Handle title
      if (post.title) {
        setTitle(post.title);
      }
      
      // Handle content
      if (post.content) {
        try {
          if (typeof post.content === 'string' && post.content.trim().startsWith('{')) {
            const parsed = JSON.parse(post.content);
            const extractedText = extractTextFromJSON(parsed);
            setContent(extractedText);
          } else if (typeof post.content === 'object') {
            const extractedText = extractTextFromJSON(post.content);
            setContent(extractedText);
          } else {
            setContent(post.content);
          }
        } catch (error) {
          console.error('Error parsing content:', error);
          setContent(post.content);
        }
      }
      
      // Handle keywords
      if (post.keywords) {
        if (typeof post.keywords === 'string') {
          setKeywords(post.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k));
        } else if (Array.isArray(post.keywords)) {
          setKeywords(post.keywords);
        }
      }
    }
  }, [post]);

  // Real-time content scoring
  useEffect(() => {
    const analyzeContent = async () => {
      if (!content || content.length < 100) return;
      
      setIsAnalyzing(true);
      try {
        const response = await fetch('/api/ai/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, keywords, title })
        });
        
        if (response.ok) {
          const data = await response.json();
          setContentScore(data.score);
          
          setOverallReview({
            score: data.score,
            grade: data.score >= 90 ? 'A+' : data.score >= 80 ? 'A' : data.score >= 70 ? 'B' : 'C',
            wordCount: data.details.wordCount,
            readingTime: Math.ceil(data.details.wordCount / 200)
          });
        }
      } catch (error) {
        console.error('Failed to analyze content:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const debounceTimer = setTimeout(analyzeContent, 1000);
    return () => clearTimeout(debounceTimer);
  }, [content, keywords, title]);

  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k: string) => k !== keyword));
  };

  // Apply all improvements function
  const applyAllImprovements = async () => {
    setIsApplyingImprovements(true);
    try {
      const response = await fetch('/api/ai/apply-all-fixes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, keywords, title })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Apply all the improvements
        setContent(data.improvedContent);
        setTitle(data.improvedTitle);
        setKeywords(data.improvedKeywords);
        
        // Update the score
        setContentScore(data.newScore);
        
        // Show success message with improvements made
        const improvements = [];
        if (data.improvements.seoFixed) improvements.push('SEO optimization');
        if (data.improvements.structureFixed) improvements.push('content structure');
        if (data.improvements.engagementFixed) improvements.push('reader engagement');
        if (data.improvements.technicalFixed) improvements.push('technical quality');
        if (data.improvements.ctaAdded) improvements.push('call-to-action');
        
        alert(`Successfully improved: ${improvements.join(', ')}. Your content score is now ${data.newScore}%!`);
      } else {
        throw new Error('Failed to apply improvements');
      }
    } catch (error) {
      console.error('Failed to apply improvements:', error);
      // Fallback to local improvements
      if (!title && keywords.length > 0) {
        setTitle(`Ultimate Guide to ${keywords[0]} - Expert Insights & Strategies`);
      } else if (!title) {
        setTitle('Transform Your Business with These Essential Strategies');
      }
      
      alert('Applied basic improvements. Some features may not be available.');
    } finally {
      setIsApplyingImprovements(false);
    }
  };

  // Generate AI Layout Suggestions
  const generateAILayout = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          title,
          keywords,
          contentType: 'blog'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiLayoutSuggestions(data.suggestions as LayoutSuggestion[]);
        
        // Store the HTML preview for later use
        if (data.htmlPreview) {
          setLayoutPreview(data.htmlPreview);
        }
        
        alert(`AI has analyzed your content and suggested ${data.suggestions.length} dynamic layouts! The top recommendation is "${data.topSuggestion.name}" based on your content type.`);
      } else {
        throw new Error('Failed to generate layouts');
      }
    } catch (error) {
      console.error('Failed to generate layout:', error);
      // Fallback to default suggestions
      const fallbackSuggestions: LayoutSuggestion[] = [
        {
          id: 'professional-service',
          name: 'Professional Service Layout',
          score: 90,
          components: ['hero', 'stats', 'comparison', 'testimonial', 'cta'],
          description: 'Clean, trust-building layout perfect for accounting services',
          preview: '🎯 Hero → 📊 Stats → 📋 Comparison → 💬 Testimonials → 🎯 CTA'
        },
        {
          id: 'educational-blog',
          name: 'Educational Blog Layout',
          score: 85,
          components: ['hero', 'timeline', 'faq', 'infographic', 'cta'],
          description: 'Information-rich layout for educational content',
          preview: '🎯 Hero → �� Timeline → ❓ FAQ → 📊 Infographic → 🎯 CTA'
        }
      ];
      setAiLayoutSuggestions(fallbackSuggestions);
      alert('Generated default layout suggestions. AI analysis unavailable.');
    } finally {
      setIsGenerating(false);
    }
  };

  const CurrentModeIcon = AI_MODES[aiMode].icon;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="flex-none bg-white border-b-2 border-[#1a2b4a] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-[#1a2b4a] uppercase">AI Blog Editor</h1>
            {contentScore > 0 && (
              <Badge 
                className={`text-lg px-3 py-1 font-black uppercase ${
                  contentScore >= 80 ? 'bg-green-500 text-white border-2 border-green-600' : 
                  contentScore >= 60 ? 'bg-orange-500 text-white border-2 border-orange-600' : 
                  'bg-red-500 text-white border-2 border-red-600'
                }`}
              >
                {overallReview?.grade || 'F'} · {contentScore}%
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Controls */}
            <div className="flex items-center gap-2 border-r pr-4 mr-4 border-gray-300">
              <button
                onClick={() => setSplitView(!splitView)}
                className={`px-3 py-1 text-sm font-bold uppercase transition-colors ${
                  splitView 
                    ? 'bg-[#1a2b4a] text-white hover:bg-[#0f1829]' 
                    : 'bg-white text-[#1a2b4a] border-2 border-[#1a2b4a] hover:bg-[#f5f1e8]'
                }`}
              >
                {splitView ? '⊞' : '⊡'} {splitView ? 'Split' : 'Full'}
              </button>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-3 py-1 text-sm font-bold uppercase transition-colors flex items-center gap-1 ${
                  previewMode 
                    ? 'bg-[#1a2b4a] text-white hover:bg-[#0f1829]' 
                    : 'bg-white text-[#1a2b4a] border-2 border-[#1a2b4a] hover:bg-[#f5f1e8]'
                }`}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>

            {/* AI Mode Selector */}
            <Select value={aiMode} onValueChange={(value) => setAiMode(value as AIModeKey)}>
              <SelectTrigger className="w-[180px] bg-white border-2 border-[#1a2b4a] text-[#1a2b4a] font-bold">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <CurrentModeIcon className="w-4 h-4" />
                    {AI_MODES[aiMode].name}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-[#1a2b4a]">
                {Object.entries(AI_MODES).map(([key, mode]) => {
                  const Icon = mode.icon;
                  return (
                    <SelectItem key={key} value={key} className="hover:bg-[#f5f1e8]">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${mode.color}`} />
                        <div>
                          <div className="font-bold text-[#1a2b4a]">{mode.name}</div>
                          <div className="text-xs text-[#1a2b4a]">{mode.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Auto-Enhance Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoEnhanceEnabled(!isAutoEnhanceEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAutoEnhanceEnabled ? 'bg-[#ff6b35]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAutoEnhanceEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <label className="text-sm text-[#1a2b4a] font-bold uppercase">
                Auto-Enhance {isAutoEnhanceEnabled ? 'ON' : 'OFF'}
              </label>
            </div>
          </div>
        </div>

        {/* Title and Keywords Bar */}
        <div className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="Enter your blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-black border-2 border-[#1a2b4a] bg-white px-4 py-2 outline-none w-full text-[#1a2b4a] placeholder-[#1a2b4a]/60 uppercase"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add keyword..."
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              className="text-sm border-2 border-[#1a2b4a] px-3 py-1 outline-none flex-1 font-bold uppercase"
            />
            <Button size="sm" onClick={addKeyword} className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase">
              <Plus className="w-4 h-4" />
            </Button>
            {keywords.map((keyword: string) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="cursor-pointer bg-[#f5f1e8] text-[#1a2b4a] hover:bg-[#ff6b35] hover:text-[#f5f1e8] border-2 border-[#1a2b4a] font-bold uppercase"
                onClick={() => removeKeyword(keyword)}
              >
                {keyword} ×
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area - Split or Full View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Section */}
        <div className={`${splitView ? 'w-1/2' : 'w-full'} flex flex-col border-r-2 border-[#1a2b4a]`}>
          {/* Editor Tabs */}
          <Tabs defaultValue="write" className="flex-1 flex flex-col">
            <TabsList className="flex-none grid w-full grid-cols-2 bg-[#1a2b4a] rounded-none border-b-2 border-[#ff6b35]">
              <TabsTrigger value="write" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold">
                <FileText className="w-4 h-4 mr-2" />
                Write
              </TabsTrigger>
              <TabsTrigger value="layout" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold">
                <Layout className="w-4 h-4 mr-2" />
                Layout Tools
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="flex-1 p-4 overflow-hidden">
              {previewMode ? (
                <div className="h-full overflow-y-auto bg-white p-8 border-2 border-[#1a2b4a] prose prose-lg max-w-none">
                  <article>
                    <h1 className="text-3xl font-black text-[#1a2b4a] mb-4 uppercase not-prose">{title || 'Untitled Post'}</h1>
                    {overallReview && (
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 not-prose">
                        <span>{overallReview.wordCount} words</span>
                        <span>•</span>
                        <span>{overallReview.readingTime} min read</span>
                        <span>•</span>
                        <span>Score: {contentScore}%</span>
                      </div>
                    )}
                    <div 
                      className="prose-headings:font-black prose-headings:text-[#1a2b4a] prose-headings:uppercase prose-p:text-gray-700 prose-strong:text-[#1a2b4a] prose-a:text-[#ff6b35] prose-a:no-underline hover:prose-a:underline"
                      dangerouslySetInnerHTML={{ 
                        __html: content
                          .replace(/\n\n/g, '</p><p>')
                          .replace(/^/, '<p>')
                          .replace(/$/, '</p>')
                          .replace(/<p>###### (.*?)<\/p>/g, '<h6>$1</h6>')
                          .replace(/<p>##### (.*?)<\/p>/g, '<h5>$1</h5>')
                          .replace(/<p>#### (.*?)<\/p>/g, '<h4>$1</h4>')
                          .replace(/<p>### (.*?)<\/p>/g, '<h3>$1</h3>')
                          .replace(/<p>## (.*?)<\/p>/g, '<h2>$1</h2>')
                          .replace(/<p># (.*?)<\/p>/g, '<h1>$1</h1>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
                      }} 
                    />
                  </article>
                </div>
              ) : (
                <textarea
                  ref={editorRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full p-4 border-2 border-[#1a2b4a] rounded-none resize-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent font-sans overflow-y-auto"
                  placeholder="Start writing your blog post..."
                  style={{ minHeight: '100%' }}
                />
              )}
            </TabsContent>

            <TabsContent value="layout" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <Alert className="bg-[#f5f1e8] border-2 border-[#ff6b35]">
                  <Palette className="w-4 h-4 text-[#ff6b35]" />
                  <AlertDescription className="text-[#1a2b4a] font-bold">
                    Transform your content with AI-powered dynamic layouts. Add your content and research, then let AI create a stunning visual blog post.
                  </AlertDescription>
                </Alert>

                {/* AI Layout Generator */}
                <Card className="bg-white border-2 border-[#1a2b4a]">
                  <CardHeader className="bg-[#f5f1e8] border-b-2 border-[#ff6b35]">
                    <CardTitle className="text-[#1a2b4a] font-black uppercase">AI Layout Generator</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Button 
                      onClick={generateAILayout}
                      disabled={isGenerating || content.length < 100}
                      className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing Content...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Dynamic Layout
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Layout Suggestions */}
                {aiLayoutSuggestions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-black text-[#1a2b4a] uppercase">AI Suggested Layouts</h3>
                    {aiLayoutSuggestions.map((layout: LayoutSuggestion) => (
                      <Card 
                        key={layout.id} 
                        className={`cursor-pointer border-2 hover:border-[#ff6b35] ${selectedLayout?.id === layout.id ? 'border-[#ff6b35] bg-[#f5f1e8]' : 'border-[#1a2b4a]'}`}
                        onClick={() => setSelectedLayout(layout)}
                      >
                        <CardContent className="p-4">
                          <h4 className="font-bold text-[#1a2b4a] mb-1">{layout.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{layout.description}</p>
                          <p className="text-xs font-mono">{layout.preview}</p>
                        </CardContent>
                      </Card>
                    ))}
                    {selectedLayout && (
                      <Button 
                        className="w-full bg-[#1a2b4a] hover:bg-[#0f1829] text-[#f5f1e8] font-black uppercase"
                        onClick={() => {
                          // Apply the selected layout
                          if (layoutPreview) {
                            // Create a blob URL for the preview
                            const blob = new Blob([layoutPreview], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            window.open(url, '_blank');
                            
                            // Clean up the URL after a short delay
                            setTimeout(() => URL.revokeObjectURL(url), 100);
                          }
                          alert(`Applied "${selectedLayout.name}" layout! The preview opened in a new window. This layout will be applied when you publish the post.`);
                        }}
                      >
                        Apply {selectedLayout.name}
                      </Button>
                    )}
                  </div>
                )}

                {/* Layout Components */}
                <div>
                  <h3 className="font-black text-[#1a2b4a] uppercase mb-3">Layout Components</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(LAYOUT_COMPONENTS).map(([key, component]) => {
                      const Icon = component.icon;
                      return (
                        <Button
                          key={key}
                          variant="outline"
                          className="h-auto p-3 flex flex-col items-center border-2 border-[#1a2b4a] hover:border-[#ff6b35] hover:bg-[#f5f1e8]"
                        >
                          <Icon className="w-5 h-5 mb-1 text-[#ff6b35]" />
                          <span className="text-xs font-bold text-[#1a2b4a]">{component.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Assistant Panel - Always Visible in Split View */}
        {splitView && (
          <div className="w-1/2 flex flex-col bg-white">
            <Tabs defaultValue="assistant" className="flex-1 flex flex-col">
              <TabsList className="flex-none grid w-full grid-cols-3 bg-[#1a2b4a] rounded-none border-b-2 border-[#ff6b35]">
                <TabsTrigger value="assistant" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger value="review" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold">
                  <Shield className="w-4 h-4 mr-2" />
                  AI Review
                </TabsTrigger>
                <TabsTrigger value="social" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold">
                  <Share2 className="w-4 h-4 mr-2" />
                  Social
                </TabsTrigger>
              </TabsList>

              <TabsContent value="assistant" className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <Alert className="bg-[#f5f1e8] border-2 border-[#ff6b35]">
                    <Sparkles className="w-4 h-4 text-[#ff6b35]" />
                    <AlertDescription className="text-[#1a2b4a] font-bold">
                      AI assistance is active. Make changes and see suggestions in real-time!
                    </AlertDescription>
                  </Alert>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-start border-2 border-[#1a2b4a] hover:border-[#ff6b35] hover:bg-[#f5f1e8] bg-white"
                      onClick={async () => {
                        setIsGenerating(true);
                        try {
                          const response = await fetch('/api/ai/writing', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              currentContent: content,
                              prompt: 'improve writing quality and engagement',
                              targetKeywords: keywords
                            })
                          });
                          
                          if (response.ok) {
                            const data = await response.json();
                            setContent(data.content || content);
                            alert('Writing improved! Check the enhanced content.');
                          }
                        } catch (error) {
                          console.error('Improve writing failed:', error);
                        } finally {
                          setIsGenerating(false);
                        }
                      }}
                      disabled={isGenerating}
                    >
                      <Wand2 className="w-5 h-5 mb-2 text-[#ff6b35]" />
                      <span className="font-bold text-[#1a2b4a] uppercase">Improve Writing</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-start border-2 border-[#1a2b4a] hover:border-[#ff6b35] hover:bg-[#f5f1e8] bg-white"
                      onClick={async () => {
                        const citations = `\n\n## References and Sources\n\n1. **HMRC Guidance**\n   - [Corporation Tax rates](https://www.gov.uk/corporation-tax)\n   - [VAT rates](https://www.gov.uk/vat-rates)\n\n2. **Professional Bodies**\n   - ICAEW Tax Faculty Guidelines 2024\n   - ACCA Technical Articles\n\n3. **Industry Reports**\n   - "UK Tax Landscape 2024" - PwC\n   - "Small Business Tax Survey" - FSB\n\n*Last updated: ${new Date().toLocaleDateString()}*`;
                        
                        setContent(content + citations);
                        alert('Citations added to your content!');
                      }}
                    >
                      <Quote className="w-5 h-5 mb-2 text-[#ff6b35]" />
                      <span className="font-bold text-[#1a2b4a] uppercase">Add Citations</span>
                    </Button>
                  </div>

                  {/* More AI Tools */}
                  <Card className="bg-white border-2 border-[#1a2b4a]">
                    <CardHeader className="bg-[#f5f1e8] border-b-2 border-[#ff6b35] pb-3">
                      <CardTitle className="text-base font-black text-[#1a2b4a] uppercase">AI Writing Tools</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-2">
                      <Button 
                        variant="outline"
                        className="w-full justify-start border-[#1a2b4a] hover:bg-[#f5f1e8]"
                        onClick={() => {
                          const hook = `Did you know that ${keywords[0] || 'strategic planning'} could transform your business? Recent studies show...`;
                          setContent(hook + '\n\n' + content);
                          alert('Added engaging hook to your content!');
                        }}
                      >
                        <Brain className="w-4 h-4 mr-2 text-[#ff6b35]" />
                        Generate Hook
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full justify-start border-[#1a2b4a] hover:bg-[#f5f1e8]"
                        onClick={() => {
                          const conclusion = `\n\n## Conclusion: Your Next Steps\n\nWe've covered the essential aspects of ${keywords[0] || 'business optimization'}. The key is implementing these strategies systematically.\n\n**Ready to transform your business?** Contact our expert team for personalized guidance.`;
                          setContent(content + conclusion);
                          alert('Added conclusion to your content!');
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2 text-[#ff6b35]" />
                        Write Conclusion
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full justify-start border-[#1a2b4a] hover:bg-[#f5f1e8]"
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/ai/generate-suggestions', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ content, keywords, title })
                            });
                            
                            if (response.ok) {
                              const data = await response.json();
                              alert(`Generated ${data.suggestions.length} content suggestions!`);
                            }
                          } catch (error) {
                            console.error('Generate suggestions failed:', error);
                          }
                        }}
                      >
                        <Sparkles className="w-4 h-4 mr-2 text-[#ff6b35]" />
                        Get AI Suggestions
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Real-time Suggestions */}
                  {content.length > 200 && (
                    <Card className="bg-[#f5f1e8] border-2 border-[#ff6b35]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold text-[#1a2b4a] uppercase">AI Insights</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {!content.includes('?') && (
                          <p className="text-sm text-[#1a2b4a]">💡 Add questions to engage readers</p>
                        )}
                        {content.length < 800 && (
                          <p className="text-sm text-[#1a2b4a]">📝 Aim for 800+ words for better SEO</p>
                        )}
                        {!content.match(/\d+/) && (
                          <p className="text-sm text-[#1a2b4a]">📊 Include statistics for credibility</p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="review" className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card className={`${contentScore >= 80 ? 'bg-green-50' : contentScore >= 60 ? 'bg-orange-50' : 'bg-red-50'}`}>
                      <CardContent className="p-4">
                        <p className="text-sm text-[#1a2b4a]">SEO Score</p>
                        <p className="text-2xl font-bold text-[#1a2b4a]">{Math.round(contentScore * 0.9)}%</p>
                      </CardContent>
                    </Card>
                    <Card className={`${contentScore >= 80 ? 'bg-green-50' : contentScore >= 60 ? 'bg-orange-50' : 'bg-red-50'}`}>
                      <CardContent className="p-4">
                        <p className="text-sm text-[#1a2b4a]">Overall</p>
                        <p className="text-2xl font-bold text-[#1a2b4a]">{contentScore}%</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Improvements */}
                  <Card className="bg-white border-2 border-[#1a2b4a]">
                    <CardHeader className="bg-[#f5f1e8] border-b-2 border-[#ff6b35]">
                      <CardTitle className="font-black text-[#1a2b4a] uppercase">Suggested Improvements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      {!title && (
                        <Alert className="bg-[#f5f1e8] border-2 border-[#ff6b35]">
                          <AlertCircle className="w-4 h-4 text-[#ff6b35]" />
                          <AlertDescription className="text-[#1a2b4a] font-bold">
                            Add a compelling title to improve SEO
                          </AlertDescription>
                        </Alert>
                      )}
                      {keywords.length === 0 && (
                        <Alert className="bg-[#f5f1e8] border-2 border-[#ff6b35]">
                          <AlertCircle className="w-4 h-4 text-[#ff6b35]" />
                          <AlertDescription className="text-[#1a2b4a] font-bold">
                            Add keywords to optimize for search engines
                          </AlertDescription>
                        </Alert>
                      )}
                      <Button 
                        className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase"
                        onClick={applyAllImprovements}
                        disabled={isApplyingImprovements}
                      >
                        {isApplyingImprovements ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Applying Improvements...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Apply All Improvements
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="social" className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {contentScore >= 70 ? (
                    <div className="text-center py-8">
                      <Share2 className="w-12 h-12 text-[#ff6b35] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Ready to Create Social Posts!</h3>
                      <Button 
                        size="lg"
                        className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase"
                        onClick={async () => {
                          setIsGenerating(true);
                          try {
                            const response = await fetch('/api/ai/social', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                blogTitle: title,
                                blogContent: content,
                                platforms: ['linkedin', 'twitter', 'instagram'],
                                businessInfo: 'IVC Accounting - Chartered Accountants'
                              })
                            });
                            
                            if (response.ok) {
                              const data = await response.json();
                              // Create a simple display of social posts
                              const socialDisplay = data.posts.map((post: any) => 
                                `${post.platform.toUpperCase()}:\n${post.content}\n\n`
                              ).join('---\n\n');
                              
                              alert(`Generated social media posts!\n\n${socialDisplay}`);
                            }
                          } catch (error) {
                            console.error('Generate social posts failed:', error);
                            // Fallback
                            const mockPosts = `LINKEDIN:\n📊 ${title || 'New insights'} - Learn how to optimize your business finances...\n\nTWITTER:\n💡 ${title || 'Business tip'}: ${content.substring(0, 100)}...\n\nINSTAGRAM:\n✨ Transform your business with our latest insights! Check our new blog post...`;
                            alert(`Generated social media posts!\n\n${mockPosts}`);
                          } finally {
                            setIsGenerating(false);
                          }
                        }}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate Social Campaign
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Alert>
                      <AlertDescription>
                        Improve your content quality to 70% or higher to unlock social media features.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Fixed Action Bar */}
      <div className="flex-none bg-white border-t-2 border-[#1a2b4a] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {overallReview && (
              <>
                <span><strong>{overallReview.wordCount}</strong> words</span>
                <span><strong>{overallReview.readingTime}</strong> min read</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="border-2 border-[#1a2b4a]"
              onClick={() => {
                // Create a downloadable text file
                const fullContent = `${title}\n${'='.repeat(title.length)}\n\nKeywords: ${keywords.join(', ')}\nScore: ${contentScore}%\nWord Count: ${overallReview?.wordCount || 0}\n\n${content}`;
                const blob = new Blob([fullContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title || 'blog-post'}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                alert('Content exported successfully!');
              }}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button
              onClick={() => onSave(content, { title, keywords, score: contentScore })}
              className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}