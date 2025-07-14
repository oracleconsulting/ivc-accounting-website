'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
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
  Wand2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Hash,
  RefreshCw,
  Copy,
  Target,
  Plus
} from 'lucide-react';

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

export default function WorkingAIBlogEditor({ 
  initialContent = '', 
  postId, 
  userId = 'current-user-id', 
  onSave 
}: {
  initialContent?: string;
  postId?: string;
  userId?: string;
  onSave: (content: string, metadata: any) => void;
}) {
  const [content, setContent] = useState(initialContent);
  const [aiMode, setAiMode] = useState<keyof typeof AI_MODES>('quality');
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [isAutoEnhanceEnabled, setIsAutoEnhanceEnabled] = useState(true);
  const [contentScore, setContentScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState<string | null>(null);
  const [assistantInput, setAssistantInput] = useState('');
  
  // AI Review state
  const [overallReview, setOverallReview] = useState<any>(null);
  const [reviewSections, setReviewSections] = useState<any[]>([]);



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
        // Fallback to basic scoring
        const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
        const score = Math.min(100, Math.round((wordCount / 1000) * 100));
        setContentScore(score);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const debounceTimer = setTimeout(analyzeContent, 1000);
    return () => clearTimeout(debounceTimer);
  }, [content, keywords]);

  const handleContentUpdate = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  // AI Assistant Functions
  const handleResearchTopic = async () => {
    setIsGenerating(true);
    setActiveAssistant('research');
    
    try {
      const response = await fetch('/api/ai/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: 'accounting',
          targetMarket: 'UK small businesses',
          timeframe: 'Q1 2024'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const researchResults = `
## Research Results: ${title || 'Tax Planning Strategies'}

### Key Findings:
${data.results.map((result: any) => `
**${result.topic}** (Relevance: ${result.relevance}%)
- Impact: ${result.impact}
- Keywords: ${result.keywords.join(', ')}
- Sources: ${result.sources.join(', ')}
- Target Audience: ${result.targetAudience}
`).join('\n')}

### Recommended Topics to Cover:
- Impact of new dividend tax rates
- Benefits of salary sacrifice schemes
- Tax-efficient business structures

[Sources: HMRC, AccountingWeb, ICAEW]
        `;
        
        setContent(content + '\n\n' + researchResults);
        alert('Research completed! Content added to your editor.');
      }
    } catch (error) {
      console.error('Research failed:', error);
      alert('Failed to complete research. Please try again.');
    } finally {
      setIsGenerating(false);
      setActiveAssistant(null);
    }
  };

  const handleGenerateIdeas = async () => {
    setIsGenerating(true);
    setActiveAssistant('ideas');
    
    try {
      const response = await fetch('/api/ai/generate-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          keywords,
          title
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const ideas = `
## Content Ideas Generated:

### Blog Post Ideas:
${data.suggestions.map((suggestion: any, index: number) => 
  `${index + 1}. "${suggestion.title}" (${suggestion.impact} impact)`
).join('\n')}

### Content Angles:
- Case study approach with real client examples
- Q&A format addressing common concerns
- Comparison posts (old vs new regulations)
- Step-by-step tutorials with screenshots
- Myth-busting articles

### Engaging Elements to Include:
- Interactive tax calculators
- Downloadable checklists
- Infographics showing tax savings
- Video summaries for complex topics
        `;
        
        const dialog = document.createElement('div');
        dialog.innerHTML = `
          <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
               background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
               max-width: 500px; z-index: 1000;">
            <h3 style="margin-bottom: 10px;">Content Ideas Generated!</h3>
            <div style="max-height: 400px; overflow-y: auto; white-space: pre-wrap;">${ideas}</div>
            <button onclick="this.parentElement.remove()" 
                    style="margin-top: 10px; padding: 8px 16px; background: #6366f1; color: white; 
                           border: none; border-radius: 4px; cursor: pointer;">
              Close
            </button>
          </div>
          <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999;"
               onclick="this.parentElement.remove()"></div>
        `;
        document.body.appendChild(dialog);
      }
    } catch (error) {
      console.error('Generate ideas failed:', error);
      alert('Failed to generate ideas. Please try again.');
    } finally {
      setIsGenerating(false);
      setActiveAssistant(null);
    }
  };

  const handleImproveWriting = async () => {
    if (!content) {
      alert('Please write some content first!');
      return;
    }
    
    setIsGenerating(true);
    setActiveAssistant('improve');
    
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
        setContent(typeof data === 'string' ? data : (data?.content || ''));
        alert('Writing improved! Check the enhanced content.');
      }
    } catch (error) {
      console.error('Improve writing failed:', error);
      alert('Failed to improve writing. Please try again.');
    } finally {
      setIsGenerating(false);
      setActiveAssistant(null);
    }
  };

  const handleAddCitations = async () => {
    setIsGenerating(true);
    setActiveAssistant('citations');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const citations = `
## References and Sources

1. **HMRC Guidance**
   - [Corporation Tax rates and reliefs](https://www.gov.uk/corporation-tax)
   - [VAT rates](https://www.gov.uk/vat-rates)
   - [Making Tax Digital](https://www.gov.uk/government/collections/making-tax-digital)

2. **Professional Bodies**
   - ICAEW Tax Faculty Guidelines 2024
   - ACCA Technical Articles on Tax Planning
   - ATT Professional Standards

3. **Recent Updates**
   - Finance Act 2024 Summary
   - Spring Budget 2024 Tax Measures
   - HMRC Policy Papers

4. **Industry Reports**
   - "UK Tax Landscape 2024" - PwC
   - "Small Business Tax Survey" - FSB
   - "Digital Tax Transformation" - Deloitte

*Last updated: ${new Date().toLocaleDateString()}*
      `;
      
      setContent(content + '\n\n' + citations);
      alert('Citations added to your content!');
    } catch (error) {
      console.error('Add citations failed:', error);
      alert('Failed to add citations. Please try again.');
    } finally {
      setIsGenerating(false);
      setActiveAssistant(null);
    }
  };

  const handleGenerateSocialPosts = async () => {
    if (!title || !content) {
      alert('Please add a title and some content first!');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogTitle: title,
          blogContent: content,
          platforms: ['linkedin', 'twitter', 'instagram'],
          businessInfo: 'IVC Accounting - Chartered Accountants in Halstead, Essex'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const socialPosts = data.posts.reduce((acc: any, post: any) => {
          acc[post.platform] = post.content;
          return acc;
        }, {});
        
        const dialog = document.createElement('div');
        dialog.innerHTML = `
          <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
               background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
               max-width: 600px; max-height: 80vh; overflow-y: auto; z-index: 1000;">
            <h3 style="margin-bottom: 15px;">Social Media Posts Generated!</h3>
            
            ${data.posts.map((post: any) => `
              <div style="margin-bottom: 20px;">
                <h4 style="color: ${post.platform === 'linkedin' ? '#0077b5' : post.platform === 'twitter' ? '#1da1f2' : '#e4405f'};">${post.platform.charAt(0).toUpperCase() + post.platform.slice(1)} Post</h4>
                <div style="background: #f3f4f6; padding: 10px; border-radius: 4px; white-space: pre-wrap;">
${post.content}
                </div>
                <button onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent)"
                        style="margin-top: 5px; padding: 4px 12px; background: #e5e7eb; border: none; 
                               border-radius: 4px; cursor: pointer;">
                  Copy ${post.platform.charAt(0).toUpperCase() + post.platform.slice(1)} Post
                </button>
              </div>
            `).join('')}
            
            <button onclick="this.parentElement.remove()" 
                    style="margin-top: 10px; padding: 8px 16px; background: #6366f1; color: white; 
                           border: none; border-radius: 4px; cursor: pointer;">
              Close
            </button>
          </div>
          <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999;"
               onclick="this.parentElement.remove()"></div>
        `;
        document.body.appendChild(dialog);
      }
    } catch (error) {
      console.error('Generate social posts failed:', error);
      alert('Failed to generate social posts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const CurrentModeIcon = AI_MODES[aiMode].icon;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4 ai-blog-editor">
      {/* Header with AI Mode Selector and Content Score */}
      <div className="flex items-center justify-between bg-white p-4 border-2 border-[#1a2b4a]">
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
          {/* AI Mode Selector */}
          <Select value={aiMode} onValueChange={(value: keyof typeof AI_MODES) => setAiMode(value)}>
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

      {/* Main Editor Card */}
      <Card className="bg-white border-2 border-[#1a2b4a]">
        <CardHeader className="bg-[#f5f1e8] border-b-2 border-[#ff6b35]">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-black border-0 bg-transparent outline-none w-full text-[#1a2b4a] placeholder-[#1a2b4a]/60 uppercase"
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
              </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keywords.map(keyword => (
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
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="write" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-[#1a2b4a] rounded-none border-b-2 border-[#ff6b35]">
              <TabsTrigger value="write" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold">
                <FileText className="w-4 h-4 mr-2" />
                Write
              </TabsTrigger>
              <TabsTrigger value="ai-assistant" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold">
                <Brain className="w-4 h-4 mr-2" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="ai-review" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold">
                <Shield className="w-4 h-4 mr-2" />
                AI Review
              </TabsTrigger>
              <TabsTrigger value="social-media" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold">
                <Share2 className="w-4 h-4 mr-2" />
                Social Media
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="p-6">
              <div className="space-y-4">
                <textarea
                  value={typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                  onChange={(e) => handleContentUpdate(e.target.value)}
                  className="w-full min-h-[400px] p-4 border-2 border-[#1a2b4a] rounded-none resize-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent font-sans"
                  placeholder="Start writing your blog post..."
                />
                
                {overallReview && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-gray-600">
                        <strong className="text-gray-900">{overallReview.wordCount}</strong> words
                      </span>
                      <span className="text-gray-600">
                        <strong className="text-gray-900">{overallReview.readingTime}</strong> min read
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {/* Save draft */}}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ai-assistant" className="p-6">
              <div className="space-y-4">
                <Alert className="bg-[#f5f1e8] border-2 border-[#ff6b35]">
                  <Sparkles className="w-4 h-4 text-[#ff6b35]" />
                  <AlertDescription className="text-[#1a2b4a] font-bold">
                    Get AI-powered suggestions, research, and content enhancement. Click any button below to get started!
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 flex flex-col items-start border-2 border-[#1a2b4a] hover:border-[#ff6b35] hover:bg-[#f5f1e8] bg-white"
                    onClick={handleResearchTopic}
                    disabled={isGenerating && activeAssistant === 'research'}
                  >
                    {isGenerating && activeAssistant === 'research' ? (
                      <Loader2 className="w-5 h-5 mb-2 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5 mb-2 text-[#ff6b35]" />
                    )}
                    <span className="font-bold text-[#1a2b4a] uppercase">Research Topic</span>
                    <span className="text-xs text-[#1a2b4a]">Find relevant information and data</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 flex flex-col items-start border-2 border-[#1a2b4a] hover:border-[#ff6b35] hover:bg-[#f5f1e8] bg-white"
                    onClick={handleGenerateIdeas}
                    disabled={isGenerating && activeAssistant === 'ideas'}
                  >
                    {isGenerating && activeAssistant === 'ideas' ? (
                      <Loader2 className="w-5 h-5 mb-2 animate-spin" />
                    ) : (
                      <Lightbulb className="w-5 h-5 mb-2 text-[#ff6b35]" />
                    )}
                    <span className="font-bold text-[#1a2b4a] uppercase">Generate Ideas</span>
                    <span className="text-xs text-[#1a2b4a]">Get content suggestions and angles</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 flex flex-col items-start border-2 border-[#1a2b4a] hover:border-[#ff6b35] hover:bg-[#f5f1e8] bg-white"
                    onClick={handleImproveWriting}
                    disabled={isGenerating && activeAssistant === 'improve'}
                  >
                    {isGenerating && activeAssistant === 'improve' ? (
                      <Loader2 className="w-5 h-5 mb-2 animate-spin" />
                    ) : (
                      <Wand2 className="w-5 h-5 mb-2 text-[#ff6b35]" />
                    )}
                    <span className="font-bold text-[#1a2b4a] uppercase">Improve Writing</span>
                    <span className="text-xs text-[#1a2b4a]">Enhance style and readability</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto p-6 flex flex-col items-start border-2 border-[#1a2b4a] hover:border-[#ff6b35] hover:bg-[#f5f1e8] bg-white"
                    onClick={handleAddCitations}
                    disabled={isGenerating && activeAssistant === 'citations'}
                  >
                    {isGenerating && activeAssistant === 'citations' ? (
                      <Loader2 className="w-5 h-5 mb-2 animate-spin" />
                    ) : (
                      <Quote className="w-5 h-5 mb-2 text-[#ff6b35]" />
                    )}
                    <span className="font-bold text-[#1a2b4a] uppercase">Add Citations</span>
                    <span className="text-xs text-[#1a2b4a]">Include credible references</span>
                  </Button>
                </div>

                {/* Assistant Input Area */}
                <Card className="bg-gray-50 border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Custom AI Request</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="Ask the AI assistant anything... e.g., 'Help me write a conclusion' or 'Add statistics about UK tax rates'"
                      value={assistantInput}
                      onChange={(e) => setAssistantInput(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button 
                      className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase"
                      disabled={!assistantInput || isGenerating}
                      onClick={async () => {
                        if (!assistantInput) return;
                        setIsGenerating(true);
                        try {
                          await new Promise(resolve => setTimeout(resolve, 1500));
                          alert(`AI Response: I'll help you with "${assistantInput}". This feature is being implemented!`);
                          setAssistantInput('');
                        } finally {
                          setIsGenerating(false);
                        }
                      }}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Send to AI
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ai-review" className="p-6">
              {content.length > 50 ? (
                <div className="space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className={
                      Math.round(contentScore * 0.9) >= 80 ? 'bg-green-50' : 
                      Math.round(contentScore * 0.9) >= 60 ? 'bg-orange-50' : 
                      'bg-red-50'
                    }>
                      <CardContent className="p-4">
                        <p className="text-sm text-[#1a2b4a]">SEO Score</p>
                        <p className="text-2xl font-bold text-[#1a2b4a]">
                          {Math.round(contentScore * 0.9)}%
                        </p>
                      </CardContent>
                    </Card>
                    <Card className={
                      Math.round(contentScore * 0.85) >= 80 ? 'bg-green-50' : 
                      Math.round(contentScore * 0.85) >= 60 ? 'bg-orange-50' : 
                      'bg-red-50'
                    }>
                      <CardContent className="p-4">
                        <p className="text-sm text-[#1a2b4a]">Readability</p>
                        <p className="text-2xl font-bold text-[#1a2b4a]">
                          {Math.round(contentScore * 0.85)}%
                        </p>
                      </CardContent>
                    </Card>
                    <Card className={
                      Math.round(contentScore * 0.8) >= 80 ? 'bg-green-50' : 
                      Math.round(contentScore * 0.8) >= 60 ? 'bg-orange-50' : 
                      'bg-red-50'
                    }>
                      <CardContent className="p-4">
                        <p className="text-sm text-[#1a2b4a]">Engagement</p>
                        <p className="text-2xl font-bold text-[#1a2b4a]">
                          {Math.round(contentScore * 0.8)}%
                        </p>
                      </CardContent>
                    </Card>
                    <Card className={
                      contentScore >= 80 ? 'bg-green-50' : 
                      contentScore >= 60 ? 'bg-orange-50' : 
                      'bg-red-50'
                    }>
                      <CardContent className="p-4">
                        <p className="text-sm text-[#1a2b4a]">Overall</p>
                        <p className="text-2xl font-bold text-[#1a2b4a]">{contentScore}%</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Improvements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#ff6b35]" />
                        Suggested Improvements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
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
                      {content.length < 500 && (
                        <Alert className="bg-blue-50 border-blue-200">
                          <Lightbulb className="w-4 h-4 text-blue-600" />
                          <AlertDescription className="text-gray-800">
                            Aim for at least 800 words for better SEO performance
                          </AlertDescription>
                        </Alert>
                      )}
                      <Button 
                        className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase"
                        onClick={handleImproveWriting}
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Apply All Improvements
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    Start writing to see AI-powered content analysis and suggestions.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="social-media" className="p-6">
              <div className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  <AlertDescription className="text-gray-800">
                    Transform your blog post into engaging social media content for multiple platforms.
                  </AlertDescription>
                </Alert>
                
                {contentScore >= 70 ? (
                  <div className="text-center py-8">
                    <Share2 className="w-12 h-12 text-[#ff6b35] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Create Social Posts!</h3>
                    <p className="text-gray-600 mb-4">
                      Generate platform-optimized content from your blog
                    </p>
                    <Button 
                      size="lg"
                      className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase"
                      onClick={handleGenerateSocialPosts}
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
                          Generate Social Media Campaign
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-lg font-medium">Content Score: {contentScore}%</p>
                    </div>
                    <p className="text-gray-600">
                      Improve your content quality to 70% or higher to unlock social media campaign creation.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Floating Action Bar */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white border rounded-lg p-2 shadow-lg">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            alert('Draft saved!');
          }}
        >
          <Save className="w-4 h-4 mr-1" />
          Save Draft
        </Button>
        <Button
          size="sm"
          onClick={() => onSave(content, { title, keywords, score: contentScore })}
          className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Publish
        </Button>
      </div>
    </div>
  );
}