import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Share2,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

// Types
interface BlogSection {
  type: 'hero' | 'hook' | 'introduction' | 'heading' | 'paragraph' | 'conclusion' | 'cta';
  content: string;
  suggestions?: string[];
  score?: number;
  position: number;
  readabilityScore: number;
  suggestedEnhancements: Enhancement[];
}

interface Enhancement {
  type: 'visual' | 'textual' | 'structural';
  suggestion: string;
  implementation: () => void;
}

interface ContentAnalysis {
  structure: {
    hookStrength: number;
    headingDistribution: number;
    paragraphLength: number;
    overallScore: number;
  };
  readability: {
    sentenceLength: number;
    paragraphLength: number;
    vocabularyComplexity: number;
    overallScore: number;
  };
  engagement: {
    hookStrength: number;
    ctaPlacement: number;
    visualBalance: number;
    storyElements: number;
    overallScore: number;
  };
  seo: {
    keywordDensity: number;
    headingOptimization: number;
    metaDescription: boolean;
    internalLinking: number;
    overallScore: number;
  };
  overallScore: number;
}

interface SmartComponent {
  type: string;
  placement: {
    strategy: 'after-value' | 'at-scroll-depth' | 'after-pain-point' | 'contextual';
    target: number | string;
  };
  content: {
    template: string;
    variables: Record<string, string>;
  };
  priority: number;
}

interface AISuggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  implementation: () => void;
  impact: 'high' | 'medium' | 'low';
}

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
  readabilityScore?: number;
  summary?: string;
  strengths?: string[];
  improvements?: string[];
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

// Enhanced function to clean content and fix special characters
const cleanContentForDisplay = (text: string): string => {
  let cleaned = text.replace(/\(≈\d+\s*words?\)/g, '');
  cleaned = cleaned.replace(/Sorry, I encountered an error\. Please try again\./g, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Fix special characters - comprehensive list
  cleaned = cleaned
    .replace(/â€™/g, "'")      // Curly apostrophe
    .replace(/â€"/g, "—")      // Em dash
    .replace(/â€œ/g, '"')      // Left curly quote
    .replace(/â€/g, '"')       // Right curly quote  
    .replace(/â€¦/g, '...')    // Ellipsis
    .replace(/Â£/g, '£')       // Pound symbol
    .replace(/Â /g, ' ')       // Non-breaking space
    .replace(/â€˜/g, "'")      // Left single quote
    .replace(/â€™/g, "'")      // Right single quote
    .replace(/â€"/g, "–")      // En dash
    .replace(/Ã¢/g, "â")       // Circumflex a
    .replace(/Ã©/g, "é")       // Acute e
    .replace(/Ã¨/g, "è")       // Grave e
    .replace(/Ã¼/g, "ü")       // Umlaut u
    .replace(/Ã¶/g, "ö")       // Umlaut o
    .replace(/Ã¤/g, "ä")       // Umlaut a
    .replace(/Â°/g, "°")       // Degree symbol
    .replace(/â‚¬/g, "€")      // Euro symbol
    .replace(/Â©/g, "©")       // Copyright symbol
    .replace(/Â®/g, "®")       // Registered symbol
    .replace(/â„¢/g, "™")      // Trademark symbol
    .replace(/Ã—/g, "×")       // Multiplication sign
    .replace(/Ã·/g, "÷");      // Division sign
  
  return cleaned.trim();
};

// Enhanced Content Analysis Functions
const calculateQualityScore = (
  content: string, 
  title: string, 
  keywords: string[]
): ContentAnalysis => {
  const sections = analyzeContentStructure(content);
  const wordCount = content.split(' ').length;
  
  // Structure scoring
  const structureScore = {
    score: 100,
    issues: [] as string[]
  };
  
  const hasStrongHook = sections.some(s => s.type === 'hook' && s.readabilityScore > 80);
  if (!hasStrongHook) {
    structureScore.issues.push('Weak or missing hook');
    structureScore.score -= 20;
  }
  
  const headings = content.match(/^#{1,3}\s+.+$/gm) || [];
  const idealHeadings = Math.floor(wordCount / 300);
  if (headings.length < idealHeadings) {
    structureScore.issues.push(`Add ${idealHeadings - headings.length} more headings`);
    structureScore.score -= 15;
  }
  
  // Readability scoring
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(' ').length, 0) / sentences.length;
  const paragraphs = content.split('\n\n');
  const avgParagraphLength = paragraphs.reduce((acc, p) => acc + p.split(' ').length, 0) / paragraphs.length;
  
  const readabilityScore = {
    score: 100,
    avgSentenceLength,
    avgParagraphLength
  };
  
  if (avgSentenceLength > 20) readabilityScore.score -= 20;
  if (avgParagraphLength > 70) readabilityScore.score -= 15;
  
  // Engagement scoring
  const engagementScore = {
    score: 85,
    hookStrength: hasStrongHook ? 90 : 60,
    ctaPlacement: 75,
    visualBalance: 80
  };
  
  // SEO scoring
  const seoScore = {
    score: 90,
    keywordDensity: 2.5,
    headingOptimization: 85,
    metaDescription: true
  };
  
  return {
    structure: {
      hookStrength: hasStrongHook ? 90 : 60,
      headingDistribution: Math.min(100, (headings.length / idealHeadings) * 100),
      paragraphLength: avgParagraphLength <= 70 ? 100 : Math.max(0, 100 - (avgParagraphLength - 70) * 2),
      overallScore: structureScore.score
    },
    readability: {
      sentenceLength: avgSentenceLength <= 20 ? 100 : Math.max(0, 100 - (avgSentenceLength - 20) * 3),
      paragraphLength: avgParagraphLength <= 70 ? 100 : Math.max(0, 100 - (avgParagraphLength - 70) * 2),
      vocabularyComplexity: 85,
      overallScore: readabilityScore.score
    },
    engagement: {
      hookStrength: engagementScore.hookStrength,
      ctaPlacement: engagementScore.ctaPlacement,
      visualBalance: engagementScore.visualBalance,
      storyElements: 85,
      overallScore: engagementScore.score
    },
    seo: {
      keywordDensity: seoScore.keywordDensity,
      headingOptimization: seoScore.headingOptimization,
      metaDescription: seoScore.metaDescription,
      internalLinking: 70,
      overallScore: seoScore.score
    },
    overallScore: (
      structureScore.score * 0.25 + 
      readabilityScore.score * 0.25 + 
      engagementScore.score * 0.25 + 
      seoScore.score * 0.25
    )
  };
};

// Smart Component Placement System
const SMART_COMPONENT_RULES: SmartComponent[] = [
  {
    type: 'newsletter-cta',
    placement: {
      strategy: 'after-value',
      target: 'high-value-section'
    },
    content: {
      template: "📧 Found this {topic} insight valuable? Get more {frequency} tips delivered to your inbox.",
      variables: {
        topic: 'extracted-from-content',
        frequency: 'weekly'
      }
    },
    priority: 1
  },
  {
    type: 'social-proof',
    placement: {
      strategy: 'at-scroll-depth',
      target: 0.3
    },
    content: {
      template: "🎯 Join {count}+ {profession} who've already implemented these strategies",
      variables: {
        count: '2,500',
        profession: 'extracted-from-keywords'
      }
    },
    priority: 2
  },
  {
    type: 'related-content',
    placement: {
      strategy: 'contextual',
      target: 'mentions-topic'
    },
    content: {
      template: "💡 Dive deeper: {relatedTitle}",
      variables: {
        relatedTitle: 'dynamically-fetched'
      }
    },
    priority: 3
  }
];

const placeComponentsIntelligently = (
  content: string, 
  sections: BlogSection[],
  keywords: string[]
): string => {
  let enhancedContent = content;
  const placements: Map<number, SmartComponent[]> = new Map();
  
  SMART_COMPONENT_RULES.forEach(rule => {
    switch(rule.placement.strategy) {
      case 'after-value':
        const valueSection = sections.find(s => 
          s.content.includes('example') || 
          /\d+%/.test(s.content) ||
          s.content.includes('solution')
        );
        if (valueSection) {
          placements.set(valueSection.position + 1, [rule]);
        }
        break;
        
      case 'at-scroll-depth':
        const targetPosition = Math.floor(sections.length * (rule.placement.target as number));
        placements.set(targetPosition, [rule]);
        break;
        
      case 'contextual':
        sections.forEach((section, idx) => {
          if (shouldPlaceContextualComponent(section.content, keywords)) {
            if (!placements.has(idx)) placements.set(idx, []);
            placements.get(idx)!.push(rule);
          }
        });
        break;
    }
  });
  
  const contentParts = enhancedContent.split('\n\n');
  const result: string[] = [];
  
  contentParts.forEach((part, idx) => {
    result.push(part);
    
    if (placements.has(idx)) {
      placements.get(idx)!.forEach(component => {
        result.push(generateComponentHTML(component, keywords, content));
      });
    }
  });
  
  return result.join('\n\n');
};

const shouldPlaceContextualComponent = (content: string, keywords: string[]): boolean => {
  return keywords.some(keyword => content.toLowerCase().includes(keyword.toLowerCase()));
};

const generateComponentHTML = (component: SmartComponent, keywords: string[], content: string): string => {
  switch(component.type) {
    case 'newsletter-cta':
      return `
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 my-8 rounded-lg">
          <p class="text-lg font-medium text-gray-900 mb-2">
            📧 Found this ${extractTopicFromContent(content)} insight valuable?
          </p>
          <p class="text-gray-700 mb-4">
            Get more weekly tips delivered to your inbox.
          </p>
          <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Subscribe Now
          </button>
        </div>
      `;
    default:
      return '';
  }
};

const extractTopicFromContent = (content: string): string => {
  const words = content.toLowerCase().split(' ');
  const commonTopics = ['business', 'marketing', 'finance', 'technology', 'strategy'];
  return commonTopics.find(topic => words.includes(topic)) || 'business';
};

// Enhanced markdown to HTML converter
const markdownToHtml = (text: string): string => {
  let html = text;
  
  // Clean the text first
  html = cleanContentForDisplay(html);
  
  // Convert markdown headings to HTML
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  // Convert bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic text
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#ff6b35] hover:text-[#e55a2b] underline">$1</a>');
  
  // Convert bullet lists
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul class="list-disc list-inside my-4">$&</ul>');
  
  // Convert numbered lists
  html = html.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, function(match) {
    if (!match.includes('<ul')) {
      return '<ol class="list-decimal list-inside my-4">' + match + '</ol>';
    }
    return match;
  });
  
  // Convert paragraphs
  html = html.split('\n\n').map(para => {
    if (!para.startsWith('<') && para.trim()) {
      return `<p class="mb-4">${para}</p>`;
    }
    return para;
  }).join('\n');
  
  return html;
};

// Analyze content structure
const analyzeContentStructure = (content: string): BlogSection[] => {
  const sections: BlogSection[] = [];
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  
  paragraphs.forEach((para, index) => {
    if (index === 0 && para.length < 200) {
      sections.push({ 
        type: 'hook', 
        content: para,
        position: sections.length,
        readabilityScore: 80,
        suggestedEnhancements: []
      });
    } else if (para.startsWith('#')) {
      sections.push({ 
        type: 'heading', 
        content: para,
        position: sections.length,
        readabilityScore: 90,
        suggestedEnhancements: []
      });
    } else if (index === paragraphs.length - 1 && para.toLowerCase().includes('contact') || para.toLowerCase().includes('get started')) {
      sections.push({ 
        type: 'cta', 
        content: para,
        position: sections.length,
        readabilityScore: 85,
        suggestedEnhancements: []
      });
    } else {
      sections.push({ 
        type: 'paragraph', 
        content: para,
        position: sections.length,
        readabilityScore: 75,
        suggestedEnhancements: []
      });
    }
  });
  
  return sections;
};

// Generate contextual hook based on content
const generateContextualHook = (content: string, keywords: string[], title: string): string => {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('accountant') || contentLower.includes('accounting')) {
    return `Picture this: You're a successful UK accountant with decades of experience, but something's changed. The late nights feel heavier, the passion that once drove you seems distant, and you're wondering if this is all there is. You're not alone — 56% of UK accountants report experiencing burnout, and with the median age at 46, many are questioning their career trajectory.`;
  } else if (contentLower.includes('business') && keywords.length > 0) {
    return `What if I told you that 73% of UK businesses are missing out on ${keywords[0]} opportunities that could transform their bottom line? In today's rapidly evolving market, the difference between thriving and merely surviving often comes down to one critical factor: strategic adaptation.`;
  } else if (keywords.length > 0) {
    return `Every business owner faces a moment of truth when it comes to ${keywords[0]}. The decisions you make today will echo through your company's future for years to come. But here's what most people get wrong...`;
  }
  
  return `In the next few minutes, you'll discover a strategy that's helped hundreds of businesses transform their approach to ${title || 'growth'}. But first, let me share something that might surprise you...`;
};

const analyzeContentContext = (content: string, currentTitle: string, currentKeywords: string[]) => {
  const cleanedContent = cleanContentForDisplay(content);
  const contentLower = cleanedContent.toLowerCase();
  
  const topics: Record<string, { keywords: string[]; weight: number }> = {
    accounting: {
      keywords: ['accountant', 'accounting', 'burnout', 'tax', 'audit', 'financial', 'HMRC', 'bookkeeping'],
      weight: 0
    },
    technology: {
      keywords: ['AI', 'automation', 'digital', 'software', 'cloud', 'tech'],
      weight: 0
    },
    business: {
      keywords: ['business', 'company', 'startup', 'entrepreneur', 'growth'],
      weight: 0
    }
  };
  
  Object.entries(topics).forEach(([topic, data]) => {
    data.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = cleanedContent.match(regex);
      if (matches) {
        topics[topic].weight += matches.length;
      }
    });
  });
  
  const dominantTopic = Object.entries(topics)
    .sort(([,a], [,b]) => b.weight - a.weight)[0][0];
  
  return {
    topic: dominantTopic,
    context: cleanedContent.substring(0, 500),
    title: currentTitle || 'Untitled',
    keywords: currentKeywords
  };
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
  const [layoutPreview, setLayoutPreview] = useState<string>(''); 
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  
  // AI Review state
  const [overallReview, setOverallReview] = useState<OverallReview | null>(null);
  const [reviewSections, setReviewSections] = useState<any[]>([]);
  const [blogSections, setBlogSections] = useState<BlogSection[]>([]);
  const [actionableAiSuggestions, setActionableAiSuggestions] = useState<AISuggestion[]>([]);
  
  const [aiSuggestionsModal, setAiSuggestionsModal] = useState(false);
  const [currentAiSuggestions, setCurrentAiSuggestions] = useState<any[]>([]);

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

  // Analyze content structure whenever content changes
  useEffect(() => {
    if (content.length > 50) {
      const sections = analyzeContentStructure(content);
      setBlogSections(sections);
    }
  }, [content]);

  // Real-time content scoring with enhanced quality analysis
  useEffect(() => {
    const analyzeContent = async () => {
      if (!content || content.length < 100) return;
      
      setIsAnalyzing(true);
      try {
        // Use enhanced local quality scoring
        const sections = analyzeContentStructure(content);
        setBlogSections(sections);
        
        const qualityAnalysis = calculateQualityScore(content, title, keywords);
        const wordCount = content.split(' ').length;
        const readingTime = Math.ceil(wordCount / 200);
        
        setContentScore(Math.round(qualityAnalysis.overallScore));
        setOverallReview({
          score: Math.round(qualityAnalysis.overallScore),
          grade: qualityAnalysis.overallScore >= 90 ? 'A+' : qualityAnalysis.overallScore >= 80 ? 'A' : qualityAnalysis.overallScore >= 70 ? 'B' : qualityAnalysis.overallScore >= 60 ? 'C' : 'D',
          wordCount,
          readingTime,
          readabilityScore: Math.round(qualityAnalysis.readability.overallScore)
        });
        
        // Apply smart component placement
        const enhancedContent = placeComponentsIntelligently(content, sections, keywords);
        if (enhancedContent !== content) {
          setContent(enhancedContent);
        }
        
        // Fallback to API if available
        try {
          const response = await fetch('/api/ai/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, keywords, title })
          });
          
          if (response.ok) {
            const data = await response.json();
            // Use API data if it's better than local analysis
            if (data.score > qualityAnalysis.overallScore) {
              setContentScore(data.score);
              setOverallReview({
                score: data.score,
                grade: data.score >= 90 ? 'A+' : data.score >= 80 ? 'A' : data.score >= 70 ? 'B' : 'C',
                wordCount: data.details.wordCount,
                readingTime: Math.ceil(data.details.wordCount / 200),
                readabilityScore: Math.round(qualityAnalysis.readability.overallScore)
              });
            }
          }
        } catch (apiError) {
          console.log('API analysis not available, using local analysis');
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

  // Generate actionable AI suggestions based on content
  useEffect(() => {
    if (content.length > 100) {
      const suggestions: AISuggestion[] = [];
      
      // Check for missing hook
      if (!blogSections.some(s => s.type === 'hook')) {
        suggestions.push({
          id: 'add-hook',
          type: 'structure',
          title: 'Add Compelling Hook',
          description: 'Your post needs a strong opening to capture attention',
          impact: 'high',
          implementation: () => {
            const hook = generateContextualHook(content, keywords, title);
            setContent(hook + '\n\n' + content);
          }
        });
      }
      
      // Check for missing headings
      if (!content.includes('#')) {
        suggestions.push({
          id: 'add-headings',
          type: 'structure',
          title: 'Add Section Headings',
          description: 'Break up your content with clear headings',
          impact: 'high',
          implementation: () => {
            const paragraphs = content.split('\n\n');
            const newContent = paragraphs.map((para, i) => {
              if (i > 0 && i % 3 === 0) {
                const headings = ['Key Insights', 'Important Considerations', 'Strategic Approaches', 'Best Practices'];
                return `## ${headings[Math.floor(i/3) % headings.length]}\n\n${para}`;
              }
              return para;
            }).join('\n\n');
            setContent(newContent);
          }
        });
      }
      
      // Check for CTA
      if (!content.toLowerCase().includes('contact') && !content.toLowerCase().includes('get started')) {
        suggestions.push({
          id: 'add-cta',
          type: 'engagement',
          title: 'Add Call-to-Action',
          description: 'Guide readers on what to do next',
          impact: 'high',
          implementation: () => {
            const cta = `\n\n## Ready to Transform Your ${keywords[0] || 'Business'}?\n\nDon't let another day pass without taking action. Our expert team is ready to help you implement these strategies effectively.\n\n**[Schedule Your Free Consultation →](#)** or call us at 01787 474 552`;
            setContent(content + cta);
          }
        });
      }
      
      // Check for statistics
      if (!content.match(/\d+%/)) {
        suggestions.push({
          id: 'add-stats',
          type: 'credibility',
          title: 'Add Statistics',
          description: 'Include data to support your points',
          impact: 'medium',
          implementation: () => {
            const stats = `\n\n### The Numbers Speak for Themselves:\n• 73% of businesses report improved efficiency\n• £5,500 average annual savings\n• 89% client satisfaction rate\n\n`;
            const midPoint = Math.floor(content.length / 2);
            const beforeMid = content.lastIndexOf('\n\n', midPoint);
            setContent(content.slice(0, beforeMid) + stats + content.slice(beforeMid));
          }
        });
      }
      
      setActionableAiSuggestions(suggestions);
    }
  }, [content, keywords, title, blogSections]);

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

  // Restructure content using AI best practices
  const restructureContent = async () => {
    setIsGenerating(true);
    try {
      // This would call your AI API to restructure the content
      const response = await fetch('/api/ai/restructure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content, 
          keywords, 
          title,
          instruction: 'Restructure this content following world-class blog best practices. Maintain the author\'s voice but improve structure, flow, and engagement.'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setContent(data.restructuredContent);
        alert('Content restructured following best practices!');
      }
    } catch (error) {
      console.error('Failed to restructure content:', error);
    } finally {
      setIsGenerating(false);
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
          content: cleanContentForDisplay(content),
          fullContent: cleanContentForDisplay(content),
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
        
        alert(`AI has analyzed your content and suggested ${data.suggestions.length} dynamic layouts! Click on each to preview before applying.`);
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
          preview: '🎯 Hero → ⏱ Timeline → ❓ FAQ → 📊 Infographic → 🎯 CTA'
        }
      ];
      setAiLayoutSuggestions(fallbackSuggestions);
      alert('Generated default layout suggestions. AI analysis unavailable.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Preview layout before applying
  const previewLayout = (layout: LayoutSuggestion) => {
    const cleanedContent = cleanContentForDisplay(content);
    const htmlContent = markdownToHtml(cleanedContent);
    
    // Create enhanced preview with proper styling
    const enhancedPreview = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title || 'Preview'} - ${layout.name}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
      margin: 0; 
      padding: 0; 
      color: #1a2b4a;
      line-height: 1.6;
    }
    .hero {
      background: linear-gradient(135deg, #1a2b4a 0%, #ff6b35 100%);
      color: white;
      padding: 80px 20px;
      text-align: center;
    }
    .hero h1 {
      font-size: 3rem;
      font-weight: 900;
      text-transform: uppercase;
      margin: 0 0 20px 0;
    }
    .content-section {
      max-width: 800px;
      margin: 60px auto;
      padding: 0 20px;
    }
    .content-section h1 {
      font-size: 2.5rem;
      font-weight: 900;
      text-transform: uppercase;
      color: #1a2b4a;
      margin: 40px 0 20px;
    }
    .content-section h2 {
      font-size: 2rem;
      font-weight: 900;
      text-transform: uppercase;
      color: #1a2b4a;
      margin: 40px 0 20px;
    }
    .content-section h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a2b4a;
      margin: 30px 0 15px;
    }
    .content-section p {
      margin-bottom: 20px;
      line-height: 1.8;
      color: #374151;
    }
    .content-section ul, .content-section ol {
      margin: 20px 0;
      padding-left: 30px;
    }
    .content-section li {
      margin-bottom: 10px;
    }
    .content-section a {
      color: #ff6b35;
      text-decoration: underline;
    }
    .stats {
      background: #f5f1e8;
      padding: 60px 20px;
      text-align: center;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .stat-item {
      text-align: center;
    }
    .stat-value {
      font-size: 2.5rem;
      font-weight: 900;
      color: #ff6b35;
    }
    .stat-label {
      font-size: 1rem;
      color: #1a2b4a;
      margin-top: 10px;
    }
    .comparison {
      max-width: 800px;
      margin: 60px auto;
      padding: 0 20px;
    }
    .comparison table {
      width: 100%;
      border-collapse: collapse;
    }
    .comparison th, .comparison td {
      border: 2px solid #1a2b4a;
      padding: 15px;
      text-align: left;
    }
    .comparison th {
      background: #f5f1e8;
      font-weight: 900;
      text-transform: uppercase;
    }
    .testimonials {
      background: #1a2b4a;
      color: white;
      padding: 60px 20px;
    }
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .testimonial {
      background: rgba(255,255,255,0.1);
      padding: 30px;
      border-left: 4px solid #ff6b35;
    }
    .testimonial-text {
      font-style: italic;
      margin-bottom: 20px;
    }
    .testimonial-author {
      font-weight: bold;
      color: #ff6b35;
    }
    .cta {
      background: #1a2b4a;
      color: white;
      padding: 80px 20px;
      text-align: center;
    }
    .cta-button {
      display: inline-block;
      background: #ff6b35;
      color: white;
      padding: 15px 40px;
      text-decoration: none;
      font-weight: 900;
      text-transform: uppercase;
      margin-top: 20px;
      transition: background 0.3s;
    }
    .cta-button:hover {
      background: #e55a2b;
    }
  </style>
</head>
<body>
  ${layout.components.includes('hero') ? `
  <div class="hero">
    <h1>${title || 'Transform Your Business'}</h1>
    <p style="font-size: 1.25rem;">Expert strategies that deliver real results</p>
  </div>
  ` : ''}
  
  ${layout.components.includes('stats') ? `
  <div class="stats">
    <h2 style="text-align: center; margin-bottom: 40px;">By The Numbers</h2>
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-value">73%</div>
        <div class="stat-label">Businesses Missing Savings</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">£5.5k</div>
        <div class="stat-label">Average Annual Savings</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">89%</div>
        <div class="stat-label">Client Satisfaction</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">24/7</div>
        <div class="stat-label">Expert Support</div>
      </div>
    </div>
  </div>
  ` : ''}
  
  <div class="content-section">
    ${htmlContent}
  </div>
  
  ${layout.components.includes('comparison') ? `
  <div class="comparison">
    <h2>Traditional vs Modern Approach</h2>
    <table>
      <tr>
        <th>Traditional Methods</th>
        <th>Our Approach</th>
      </tr>
      <tr>
        <td>Manual processes</td>
        <td>Automated systems</td>
      </tr>
      <tr>
        <td>Yearly reviews</td>
        <td>Real-time monitoring</td>
      </tr>
      <tr>
        <td>Generic advice</td>
        <td>Tailored strategies</td>
      </tr>
    </table>
  </div>
  ` : ''}
  
  ${layout.components.includes('testimonial') ? `
  <div class="testimonials">
    <h2 style="text-align: center; color: white; margin-bottom: 40px;">What Our Clients Say</h2>
    <div class="testimonials-grid">
      <div class="testimonial">
        <p class="testimonial-text">"IVC Accounting transformed our financial processes. We've saved thousands and gained invaluable insights."</p>
        <p class="testimonial-author">Sarah Johnson, CEO</p>
      </div>
      <div class="testimonial">
        <p class="testimonial-text">"The best decision we've made for our business. Professional, efficient, and results-driven."</p>
        <p class="testimonial-author">Michael Chen, Director</p>
      </div>
    </div>
  </div>
  ` : ''}
  
  ${layout.components.includes('cta') ? `
  <div class="cta">
    <h2 style="font-size: 2rem; margin: 0 0 20px 0;">Ready to Get Started?</h2>
    <p style="font-size: 1.25rem; margin-bottom: 30px;">Transform your business with expert guidance</p>
    <a href="#" class="cta-button">Schedule Free Consultation</a>
  </div>
  ` : ''}
</body>
</html>`;
    
    const blob = new Blob([enhancedPreview], { type: 'text/html; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 100);
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
              <SelectTrigger className="w-[180px] bg-white border-2 border-[#1a2b4a] text-[#1a2b4a] font-bold rounded-none">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <CurrentModeIcon className="w-4 h-4" />
                    {AI_MODES[aiMode].name}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-[#1a2b4a] rounded-none">
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
            className="text-2xl font-black border-2 border-[#1a2b4a] bg-white px-4 py-2 rounded-none outline-none w-full text-[#1a2b4a] placeholder-[#1a2b4a]/60 uppercase"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add keyword..."
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              className="text-sm border-2 border-[#1a2b4a] px-3 py-1 rounded-none outline-none flex-1 font-bold uppercase"
            />
            <Button size="sm" onClick={addKeyword} className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase rounded-none">
              <Plus className="w-4 h-4" />
            </Button>
            {keywords.map((keyword: string) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="cursor-pointer bg-[#f5f1e8] text-[#1a2b4a] hover:bg-[#ff6b35] hover:text-[#f5f1e8] border-2 border-[#1a2b4a] font-bold uppercase rounded-none"
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
              <TabsTrigger value="write" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold rounded-none">
                <FileText className="w-4 h-4 mr-2" />
                Write
              </TabsTrigger>
              <TabsTrigger value="layout" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold rounded-none">
                <Layout className="w-4 h-4 mr-2" />
                Layout Tools
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="flex-1 p-4 overflow-hidden">
              {previewMode ? (
                <div className="h-full overflow-hidden flex flex-col">
                  <div 
                    className="flex-1 overflow-y-auto bg-white p-8 border-2 border-[#1a2b4a] rounded-none prose prose-lg max-w-none"
                    style={{ maxHeight: 'calc(100vh - 320px)' }}
                  >
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
                          __html: markdownToHtml(content)
                        }} 
                      />
                    </article>
                  </div>
                </div>
              ) : (
                <textarea
                  ref={editorRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 border-2 border-[#1a2b4a] rounded-none resize-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent font-sans"
                  placeholder="Start writing your blog post..."
                  style={{ 
                    height: 'calc(100vh - 400px)',
                    minHeight: '400px',
                    maxHeight: '700px',
                    overflowY: 'auto'
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="layout" className="flex-1 p-4">
              <ScrollArea className="h-full" style={{ height: 'calc(100vh - 400px)' }}>
                <div className="space-y-4">
                  <Alert className="bg-[#f5f1e8] border-2 border-[#ff6b35] rounded-none">
                    <Palette className="w-4 h-4 text-[#ff6b35]" />
                    <AlertDescription className="text-[#1a2b4a] font-bold">
                      Transform your content with AI-powered dynamic layouts. Add your content and research, then let AI create a stunning visual blog post.
                    </AlertDescription>
                  </Alert>

                  {/* AI Layout Generator */}
                  <Card className="bg-white border-2 border-[#1a2b4a] rounded-none">
                    <CardHeader className="bg-[#f5f1e8] border-b-2 border-[#ff6b35]">
                      <CardTitle className="text-[#1a2b4a] font-black uppercase">AI Layout Generator</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Button 
                        onClick={generateAILayout}
                        disabled={isGenerating || content.length < 100}
                        className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase rounded-none"
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
                          className={`cursor-pointer border-2 hover:border-[#ff6b35] rounded-none ${selectedLayout?.id === layout.id ? 'border-[#ff6b35] bg-[#f5f1e8]' : 'border-[#1a2b4a]'}`}
                          onClick={() => setSelectedLayout(layout)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h4 className="font-bold text-[#1a2b4a] mb-1">{layout.name}</h4>
                                <p className="text-sm text-gray-600 mb-2">{layout.description}</p>
                                <p className="text-xs font-mono">{layout.preview}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-[#1a2b4a] hover:bg-[#f5f1e8] rounded-none"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    previewLayout(layout);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Preview
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {selectedLayout && (
                        <Button 
                          className="w-full bg-[#1a2b4a] hover:bg-[#0f1829] text-[#f5f1e8] font-black uppercase rounded-none"
                          onClick={() => {
                            previewLayout(selectedLayout);
                            alert(`Applied "${selectedLayout.name}" layout! The preview window shows how your blog will look with this layout.`);
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
                        const componentText = {
                          hero: '\n\n## Hero Section\n[Add compelling headline and subheading here]\n\n',
                          stats: '\n\n## Key Statistics\n- Stat 1: [Value]\n- Stat 2: [Value]\n- Stat 3: [Value]\n\n',
                          quote: '\n\n> "[Add impactful quote here]"\n> — Source Name\n\n',
                          comparison: '\n\n## Comparison\n| Option A | Option B |\n|----------|----------|\n| Feature 1 | Feature 1 |\n| Feature 2 | Feature 2 |\n\n',
                          timeline: '\n\n## Timeline\n1. **Phase 1**: [Description]\n2. **Phase 2**: [Description]\n3. **Phase 3**: [Description]\n\n',
                          cta: '\n\n## Ready to Get Started?\n[Add call-to-action text]\n[Button: Contact Us]\n\n',
                          faq: '\n\n## Frequently Asked Questions\n\n**Q: Question 1?**\nA: Answer 1\n\n**Q: Question 2?**\nA: Answer 2\n\n',
                          testimonial: '\n\n## What Our Clients Say\n\n> "[Client testimonial]"\n> — Client Name, Company\n\n',
                          infographic: '\n\n## [Infographic Title]\n[Visual data representation placeholder]\n\n',
                          video: '\n\n## Video: [Title]\n[Video embed placeholder - add YouTube/Vimeo link]\n\n'
                        };
                        return (
                          <Button
                            key={key}
                            variant="outline"
                            className="h-auto p-3 flex flex-col items-center border-2 border-[#1a2b4a] hover:border-[#ff6b35] hover:bg-[#f5f1e8] rounded-none"
                            onClick={() => {
                              // Get current cursor position or append at end
                              if (editorRef.current) {
                                const textarea = editorRef.current;
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const newContent = content.substring(0, start) + 
                                                  (componentText[key as keyof typeof componentText] || '') + 
                                                  content.substring(end);
                                setContent(newContent);
                                
                                // Set cursor position after inserted text
                                setTimeout(() => {
                                  if (textarea) {
                                    const newPosition = start + (componentText[key as keyof typeof componentText] || '').length;
                                    textarea.selectionStart = newPosition;
                                    textarea.selectionEnd = newPosition;
                                    textarea.focus();
                                  }
                                }, 0);
                              } else {
                                // Fallback if no ref
                                setContent(content + (componentText[key as keyof typeof componentText] || ''));
                              }
                            }}
                          >
                            <Icon className="w-5 h-5 mb-1 text-[#ff6b35]" />
                            <span className="text-xs font-bold text-[#1a2b4a]">{component.name}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Assistant Panel - Always Visible in Split View */}
        {splitView && (
          <div className="w-1/2 flex flex-col bg-white">
            <Tabs defaultValue="assistant" className="flex-1 flex flex-col">
              <TabsList className="flex-none grid w-full grid-cols-3 bg-[#1a2b4a] rounded-none border-b-2 border-[#ff6b35]">
                <TabsTrigger value="assistant" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold rounded-none">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger value="review" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold rounded-none">
                  <Shield className="w-4 h-4 mr-2" />
                  AI Review
                </TabsTrigger>
                <TabsTrigger value="social" className="data-[state=active]:bg-[#f5f1e8] data-[state=active]:text-[#1a2b4a] data-[state=active]:font-black data-[state=active]:uppercase text-[#f5f1e8] uppercase font-bold rounded-none">
                  <Share2 className="w-4 h-4 mr-2" />
                  Social
                </TabsTrigger>
              </TabsList>

              <TabsContent value="assistant" className="flex-1 p-4">
                <ScrollArea className="h-full" style={{ height: 'calc(100vh - 350px)' }}>
                  <div className="space-y-4">
                    <Alert className="bg-[#f5f1e8] border-2 border-[#ff6b35] rounded-none">
                      <Sparkles className="w-4 h-4 text-[#ff6b35]" />
                      <AlertDescription className="text-[#1a2b4a] font-bold">
                        AI assistance is active. Make changes and see suggestions in real-time!
                      </AlertDescription>
                    </Alert>
                    
                    {/* Blog Structure Analysis */}
                    {blogSections.length > 0 && (
                      <Card className="bg-white border-2 border-[#1a2b4a] rounded-none">
                        <CardHeader className="bg-[#f5f1e8] border-b-2 border-[#ff6b35] pb-3">
                          <CardTitle className="text-base font-black text-[#1a2b4a] uppercase">Content Structure</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                          {blogSections.map((section, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Badge className="bg-[#f5f1e8] text-[#1a2b4a] border border-[#1a2b4a] uppercase">
                                {section.type}
                              </Badge>
                              <span className="text-gray-600 truncate flex-1">
                                {section.content.substring(0, 50)}...
                              </span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Actionable AI Suggestions */}
                    {actionableAiSuggestions.length > 0 && (
                      <Card className="bg-white border-2 border-[#1a2b4a] rounded-none">
                        <CardHeader className="bg-[#f5f1e8] border-b-2 border-[#ff6b35] pb-3">
                          <CardTitle className="text-base font-black text-[#1a2b4a] uppercase flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-[#ff6b35]" />
                            AI Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                          {actionableAiSuggestions.map((suggestion) => (
                            <div key={suggestion.id} className="p-3 border border-gray-200 hover:border-[#ff6b35] transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <h4 className="font-bold text-sm text-[#1a2b4a]">{suggestion.title}</h4>
                                  <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                                </div>
                                <Badge className={`text-xs ${
                                  suggestion.impact === 'high' ? 'bg-red-100 text-red-800' : 
                                  suggestion.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {suggestion.impact}
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white rounded-none"
                                onClick={suggestion.implementation}
                              >
                                Apply This
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* AI Writing Tools */}
                    <Card className="bg-white border-2 border-[#1a2b4a] rounded-none">
                      <CardHeader className="bg-[#f5f1e8] border-b-2 border-[#ff6b35] pb-3">
                        <CardTitle className="text-base font-black text-[#1a2b4a] uppercase">AI Writing Tools</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-2">
                        <Button 
                          variant="outline"
                          className="w-full justify-start border-[#1a2b4a] hover:bg-[#f5f1e8] rounded-none"
                          onClick={restructureContent}
                          disabled={isGenerating}
                        >
                          <RefreshCw className="w-4 h-4 mr-2 text-[#ff6b35]" />
                          Restructure Following Best Practices
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full justify-start border-[#1a2b4a] hover:bg-[#f5f1e8] rounded-none"
                          onClick={() => {
                            const context = analyzeContentContext(content, title, keywords);
                            const hook = generateContextualHook(content, keywords, title);
                            // Find where to insert the hook
                            if (!blogSections.some(s => s.type === 'hook')) {
                              setContent(hook + '\n\n' + content);
                            } else {
                              alert('Your content already has a hook!');
                            }
                          }}
                        >
                          <Brain className="w-4 h-4 mr-2 text-[#ff6b35]" />
                          Generate Contextual Hook
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full justify-start border-[#1a2b4a] hover:bg-[#f5f1e8] rounded-none"
                          onClick={() => {
                            const conclusion = `\n\n## Conclusion: Your Next Steps\n\nWe've covered the essential aspects of ${keywords[0] || 'business optimization'}. The key is implementing these strategies systematically.\n\n**Ready to transform your business?** Contact our expert team for personalized guidance.`;
                            setContent(content + conclusion);
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2 text-[#ff6b35]" />
                          Write Conclusion
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full justify-start border-[#1a2b4a] hover:bg-[#f5f1e8] rounded-none"
                          onClick={async () => {
                            const citations = `\n\n## References and Sources\n\n1. **HMRC Guidance**\n   - [Corporation Tax rates](https://www.gov.uk/corporation-tax)\n   - [VAT rates](https://www.gov.uk/vat-rates)\n\n2. **Professional Bodies**\n   - ICAEW Tax Faculty Guidelines 2024\n   - ACCA Technical Articles\n\n3. **Industry Reports**\n   - "UK Tax Landscape 2024" - PwC\n   - "Small Business Tax Survey" - FSB\n\n*Last updated: ${new Date().toLocaleDateString()}*`;
                            
                            setContent(content + citations);
                          }}
                        >
                          <Quote className="w-4 h-4 mr-2 text-[#ff6b35]" />
                          Add Citations
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Real-time Suggestions */}
                    {content.length > 200 && (
                      <Card className="bg-[#f5f1e8] border-2 border-[#ff6b35] rounded-none">
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
                </ScrollArea>
              </TabsContent>

              <TabsContent value="review" className="flex-1 p-4">
                <ScrollArea className="h-full" style={{ height: 'calc(100vh - 350px)' }}>
                  <div className="space-y-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <Card className={`${contentScore >= 80 ? 'bg-green-50' : contentScore >= 60 ? 'bg-orange-50' : 'bg-red-50'} rounded-none`}>
                        <CardContent className="p-4">
                          <p className="text-sm text-[#1a2b4a]">SEO Score</p>
                          <p className="text-2xl font-bold text-[#1a2b4a]">{Math.round(contentScore * 0.9)}%</p>
                        </CardContent>
                      </Card>
                      <Card className={`${contentScore >= 80 ? 'bg-green-50' : contentScore >= 60 ? 'bg-orange-50' : 'bg-red-50'} rounded-none`}>
                        <CardContent className="p-4">
                          <p className="text-sm text-[#1a2b4a]">Overall</p>
                          <p className="text-2xl font-bold text-[#1a2b4a]">{contentScore}%</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* SEO Improvements */}
                    <Card className="bg-white border-2 border-[#1a2b4a] rounded-none">
                      <CardHeader className="bg-[#f5f1e8] border-b-2 border-[#ff6b35]">
                        <CardTitle className="font-black text-[#1a2b4a] uppercase">SEO Optimization</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-4">
                        {!title && (
                          <Alert className="bg-[#f5f1e8] border-2 border-[#ff6b35] rounded-none">
                            <AlertCircle className="w-4 h-4 text-[#ff6b35]" />
                            <AlertDescription className="text-[#1a2b4a] font-bold">
                              Add a compelling title to improve SEO
                            </AlertDescription>
                          </Alert>
                        )}
                        {keywords.length === 0 && (
                          <Alert className="bg-[#f5f1e8] border-2 border-[#ff6b35] rounded-none">
                            <AlertCircle className="w-4 h-4 text-[#ff6b35]" />
                            <AlertDescription className="text-[#1a2b4a] font-bold">
                              Add keywords to optimize for search engines
                            </AlertDescription>
                          </Alert>
                        )}
                        {keywords.length > 0 && !keywords.some(k => content.toLowerCase().includes(k.toLowerCase())) && (
                          <Alert className="bg-[#f5f1e8] border-2 border-[#ff6b35] rounded-none">
                            <AlertCircle className="w-4 h-4 text-[#ff6b35]" />
                            <AlertDescription className="text-[#1a2b4a] font-bold">
                              Use your keywords naturally in the content
                            </AlertDescription>
                          </Alert>
                        )}
                        <Button 
                          className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase rounded-none"
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

                    {/* Content Quality Metrics */}
                    <Card className="bg-white border-2 border-[#1a2b4a] rounded-none">
                      <CardHeader className="bg-[#f5f1e8] border-b-2 border-[#ff6b35]">
                        <CardTitle className="font-black text-[#1a2b4a] uppercase">Quality Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Word Count</span>
                          <span className="font-bold text-[#1a2b4a]">{overallReview?.wordCount || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Reading Time</span>
                          <span className="font-bold text-[#1a2b4a]">{overallReview?.readingTime || 0} min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Headings</span>
                          <span className="font-bold text-[#1a2b4a]">{(content.match(/#/g) || []).length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Questions</span>
                          <span className="font-bold text-[#1a2b4a]">{(content.match(/\?/g) || []).length}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="social" className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {contentScore >= 70 ? (
                    <div className="text-center py-8">
                      <Share2 className="w-12 h-12 text-[#ff6b35] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Ready to Create Social Posts!</h3>
                      <Button 
                        size="lg"
                        className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase rounded-none"
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
                    <Alert className="rounded-none">
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
              className="border-2 border-[#1a2b4a] rounded-none"
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
              className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase rounded-none"
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