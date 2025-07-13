'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sparkles,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  BarChart3,
  Search,
  Link,
  Quote,
  Image,
  Hash,
  FileText,
  Loader2,
  RefreshCw,
  Wand2,
  Brain,
  Shield,
  Zap
} from 'lucide-react';

interface AIReviewPanelProps {
  content: string;
  onContentUpdate: (content: string) => void;
  keywords: string[];
  aiMode: string;
  title?: string;
}

interface ReviewSection {
  category: string;
  score: number;
  status: 'good' | 'warning' | 'error';
  issues: string[];
  suggestions: string[];
  autoFix?: () => void;
}

interface OverallReview {
  score: number;
  grade: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  readingTime: number;
  wordCount: number;
  sentimentScore: number;
  readabilityScore: number;
}

export default function ImprovedAIReviewPanel({ 
  content, 
  onContentUpdate, 
  keywords, 
  aiMode,
  title = ''
}: AIReviewPanelProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [autoFixing, setAutoFixing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [overallReview, setOverallReview] = useState<OverallReview | null>(null);
  const [reviewSections, setReviewSections] = useState<ReviewSection[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  // Analyze content whenever it changes
  useEffect(() => {
    if (content.length > 100) {
      const debounceTimer = setTimeout(() => {
        analyzeContent();
      }, 1500);
      return () => clearTimeout(debounceTimer);
    }
  }, [content, keywords]);

  const analyzeContent = async () => {
    setAnalyzing(true);
    try {
      // For now, use the existing logic, but we'll add real API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
      const readingTime = Math.ceil(wordCount / 200);
      const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      const avgWordsPerSentence = wordCount / sentenceCount;
      
      const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence * 2)));
      
      const seoScore = calculateSEOScore();
      const structureScore = calculateStructureScore();
      const engagementScore = calculateEngagementScore();
      const technicalScore = calculateTechnicalScore();

      const overallScore = Math.round(
        (seoScore * 0.3 + 
         structureScore * 0.25 + 
         engagementScore * 0.25 + 
         technicalScore * 0.2)
      );

      setOverallReview({
        score: overallScore,
        grade: getGrade(overallScore),
        summary: generateSummary(overallScore),
        strengths: generateStrengths(),
        improvements: generateImprovements(),
        readingTime,
        wordCount,
        sentimentScore: 75,
        readabilityScore
      });

      setReviewSections([
        {
          category: 'SEO Optimization',
          score: seoScore,
          status: seoScore >= 80 ? 'good' : seoScore >= 60 ? 'warning' : 'error',
          issues: generateSEOIssues(),
          suggestions: generateSEOSuggestions(),
          autoFix: () => autoFixSEO()
        },
        {
          category: 'Content Structure',
          score: structureScore,
          status: structureScore >= 80 ? 'good' : structureScore >= 60 ? 'warning' : 'error',
          issues: generateStructureIssues(),
          suggestions: generateStructureSuggestions(),
          autoFix: () => autoFixStructure()
        },
        {
          category: 'Engagement & Readability',
          score: engagementScore,
          status: engagementScore >= 80 ? 'good' : engagementScore >= 60 ? 'warning' : 'error',
          issues: generateEngagementIssues(),
          suggestions: generateEngagementSuggestions(),
          autoFix: () => autoFixEngagement()
        },
        {
          category: 'Technical Quality',
          score: technicalScore,
          status: technicalScore >= 80 ? 'good' : technicalScore >= 60 ? 'warning' : 'error',
          issues: generateTechnicalIssues(),
          suggestions: generateTechnicalSuggestions(),
          autoFix: () => autoFixTechnical()
        }
      ]);

      generateAISuggestions();

    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const calculateSEOScore = () => {
    let score = 100;
    const keywordDensity = keywords.reduce((acc, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex);
      return acc + (matches ? matches.length : 0);
    }, 0) / content.split(/\s+/).length * 100;
    
    if (keywordDensity < 1) score -= 20;
    if (keywordDensity > 3) score -= 10;
    if (!title) score -= 15;
    if (title && !keywords.some(k => title.toLowerCase().includes(k.toLowerCase()))) score -= 10;
    if (content.length < 1500) score -= 10;
    if (content.length > 5000) score -= 5;
    const headingCount = (content.match(/#{1,6}\s/g) || []).length;
    if (headingCount < 3) score -= 15;
    
    return Math.max(0, score);
  };

  const calculateStructureScore = () => {
    let score = 100;
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    if (paragraphs.length < 5) score -= 20;
    const avgParagraphLength = paragraphs.reduce((acc, p) => acc + p.split(/\s+/).length, 0) / paragraphs.length;
    if (avgParagraphLength > 150) score -= 15;
    const hasBulletPoints = content.includes('•') || content.includes('-') || content.includes('*');
    if (!hasBulletPoints) score -= 10;
    const hasHeadings = content.includes('#');
    if (!hasHeadings) score -= 20;
    
    return Math.max(0, score);
  };

  const calculateEngagementScore = () => {
    let score = 100;
    const questionCount = (content.match(/\?/g) || []).length;
    if (questionCount < 2) score -= 15;
    const ctaKeywords = ['learn more', 'contact us', 'get started', 'discover', 'find out'];
    const hasCTA = ctaKeywords.some(cta => content.toLowerCase().includes(cta));
    if (!hasCTA) score -= 20;
    const hasNumbers = /\d+/.test(content);
    if (!hasNumbers) score -= 10;
    const opening = content.substring(0, 100);
    if (!opening.includes('?') && !opening.includes('!')) score -= 10;
    
    return Math.max(0, score);
  };

  const calculateTechnicalScore = () => {
    let score = 100;
    const commonMisspellings = ['teh', 'recieve', 'occured', 'seperate'];
    commonMisspellings.forEach(word => {
      if (content.toLowerCase().includes(word)) score -= 5;
    });
    const sentences = content.split(/[.!?]+/);
    const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(/\s+/).length, 0) / sentences.length;
    if (avgSentenceLength > 25) score -= 15;
    if (avgSentenceLength < 10) score -= 10;
    const passiveIndicators = ['was', 'were', 'been', 'being'];
    const passiveCount = passiveIndicators.reduce((acc, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      return acc + (content.match(regex) || []).length;
    }, 0);
    if (passiveCount > sentences.length * 0.3) score -= 15;
    
    return Math.max(0, score);
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const generateSummary = (score: number) => {
    if (score >= 85) return "Excellent content! Your blog post is well-optimized and engaging.";
    if (score >= 70) return "Good content with room for improvement. Focus on the suggested enhancements.";
    if (score >= 60) return "Decent foundation, but needs work. Apply the recommendations to boost quality.";
    return "Significant improvements needed. Use the AI assistance to enhance your content.";
  };

  const generateStrengths = () => {
    const strengths = [];
    if (overallReview?.wordCount && overallReview.wordCount > 800) {
      strengths.push("Comprehensive content length");
    }
    if (keywords.length > 3) {
      strengths.push("Good keyword coverage");
    }
    if (content.includes('?')) {
      strengths.push("Engaging questions included");
    }
    if (content.split('\n\n').length > 5) {
      strengths.push("Well-structured paragraphs");
    }
    return strengths;
  };

  const generateImprovements = () => {
    const improvements = [];
    if (!title || title.length < 30) {
      improvements.push("Create a compelling, keyword-rich title");
    }
    if (!content.includes('#')) {
      improvements.push("Add section headings for better structure");
    }
    if ((content.match(/\?/g) || []).length < 2) {
      improvements.push("Include more engaging questions");
    }
    if (!content.match(/\d+/)) {
      improvements.push("Add statistics or data points");
    }
    return improvements;
  };

  const generateSEOIssues = () => {
    const issues = [];
    if (!keywords.some(k => content.toLowerCase().includes(k.toLowerCase()))) {
      issues.push("Primary keywords not found in content");
    }
    if (!title) {
      issues.push("Missing page title");
    }
    if (content.length < 300) {
      issues.push("Content too short for SEO");
    }
    return issues;
  };

  const generateSEOSuggestions = () => {
    return [
      "Include primary keyword in the first paragraph",
      "Add keyword variations throughout the content",
      "Create a compelling meta description",
      "Include internal and external links"
    ];
  };

  const generateStructureIssues = () => {
    const issues = [];
    const paragraphs = content.split('\n\n');
    if (paragraphs.some(p => p.split(/\s+/).length > 150)) {
      issues.push("Some paragraphs are too long");
    }
    if (!content.includes('#')) {
      issues.push("No section headings found");
    }
    return issues;
  };

  const generateStructureSuggestions = () => {
    return [
      "Break long paragraphs into shorter ones",
      "Add subheadings every 300-400 words",
      "Include bullet points or numbered lists",
      "Create a clear introduction and conclusion"
    ];
  };

  const generateEngagementIssues = () => {
    const issues = [];
    if (!content.match(/\?/)) {
      issues.push("No questions to engage readers");
    }
    const ctaKeywords = ['learn more', 'contact us', 'get started'];
    if (!ctaKeywords.some(cta => content.toLowerCase().includes(cta))) {
      issues.push("Missing call-to-action");
    }
    return issues;
  };

  const generateEngagementSuggestions = () => {
    return [
      "Start with a compelling hook or question",
      "Include a clear call-to-action",
      "Add personal anecdotes or examples",
      "Use conversational tone where appropriate"
    ];
  };

  const generateTechnicalIssues = () => {
    const issues = [];
    const sentences = content.split(/[.!?]+/);
    const longSentences = sentences.filter(s => s.split(/\s+/).length > 25);
    if (longSentences.length > sentences.length * 0.3) {
      issues.push("Too many long sentences");
    }
    return issues;
  };

  const generateTechnicalSuggestions = () => {
    return [
      "Vary sentence length for better flow",
      "Use active voice instead of passive",
      "Check for spelling and grammar errors",
      "Ensure consistent tone throughout"
    ];
  };

  const generateAISuggestions = async () => {
    const suggestions = [
      {
        id: 1,
        type: 'hook',
        title: 'Improve Opening Hook',
        description: 'Your opening could be more engaging',
        suggestion: 'Start with a surprising statistic or thought-provoking question',
        impact: 'high'
      },
      {
        id: 2,
        type: 'keywords',
        title: 'Optimize Keyword Usage',
        description: 'Better distribute keywords throughout content',
        suggestion: `Include "${keywords[0]}" in your first paragraph and conclusion`,
        impact: 'medium'
      },
      {
        id: 3,
        type: 'cta',
        title: 'Add Clear Call-to-Action',
        description: 'Guide readers on next steps',
        suggestion: 'End with a specific action readers should take',
        impact: 'high'
      }
    ];
    
    setAiSuggestions(suggestions);
  };

  const autoFixSEO = async () => {
    setAutoFixing(true);
    try {
      // Make API call to fix SEO
      const response = await fetch('/api/ai/fix-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, keywords, title })
      });
      
      if (response.ok) {
        const data = await response.json();
        onContentUpdate(data.improvedContent);
        alert('SEO improvements applied!');
      }
    } catch (error) {
      console.error('SEO fix failed:', error);
      // Fallback to simple fix
      let updatedContent = content;
      if (!keywords.some(k => content.toLowerCase().includes(k.toLowerCase()))) {
        updatedContent = `${keywords[0]} ${content}`;
      }
      onContentUpdate(updatedContent);
    } finally {
      setAutoFixing(false);
    }
  };

  const autoFixStructure = async () => {
    setAutoFixing(true);
    try {
      const response = await fetch('/api/ai/fix-structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        const data = await response.json();
        onContentUpdate(data.improvedContent);
        alert('Structure improvements applied!');
      }
    } catch (error) {
      console.error('Structure fix failed:', error);
      let updatedContent = content;
      if (!content.includes('#')) {
        const paragraphs = content.split('\n\n');
        updatedContent = paragraphs.map((p, i) => {
          if (i % 3 === 0 && i > 0) {
            return `## Section ${Math.floor(i/3) + 1}\n\n${p}`;
          }
          return p;
        }).join('\n\n');
      }
      onContentUpdate(updatedContent);
    } finally {
      setAutoFixing(false);
    }
  };

  const autoFixEngagement = async () => {
    setAutoFixing(true);
    try {
      const response = await fetch('/api/ai/fix-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        const data = await response.json();
        onContentUpdate(data.improvedContent);
        alert('Engagement improvements applied!');
      }
    } catch (error) {
      console.error('Engagement fix failed:', error);
      let updatedContent = content;
      if (!content.includes('?')) {
        updatedContent = content.replace(
          /\.$/, 
          '. Have you considered how this impacts your business?'
        );
      }
      onContentUpdate(updatedContent);
    } finally {
      setAutoFixing(false);
    }
  };

  const autoFixTechnical = async () => {
    setAutoFixing(true);
    try {
      const response = await fetch('/api/ai/fix-technical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        const data = await response.json();
        onContentUpdate(data.improvedContent);
        alert('Technical improvements applied!');
      }
    } catch (error) {
      console.error('Technical fix failed:', error);
      let updatedContent = content;
      updatedContent = updatedContent
        .replace(/\bteh\b/gi, 'the')
        .replace(/\brecieve\b/gi, 'receive')
        .replace(/\boccured\b/gi, 'occurred');
      onContentUpdate(updatedContent);
    } finally {
      setAutoFixing(false);
    }
  };

  const applyAllSuggestions = async () => {
    setAutoFixing(true);
    
    try {
      const response = await fetch('/api/ai/apply-all-fixes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, keywords, title })
      });
      
      if (response.ok) {
        const data = await response.json();
        onContentUpdate(data.improvedContent);
        alert('All improvements applied successfully!');
        analyzeContent();
      }
    } catch (error) {
      console.error('Apply all fixes failed:', error);
      // Apply fixes sequentially
      await autoFixSEO();
      await new Promise(resolve => setTimeout(resolve, 500));
      await autoFixStructure();
      await new Promise(resolve => setTimeout(resolve, 500));
      await autoFixEngagement();
      await new Promise(resolve => setTimeout(resolve, 500));
      await autoFixTechnical();
    } finally {
      setAutoFixing(false);
    }
  };

  const applySuggestion = async (suggestion: any) => {
    try {
      const response = await fetch('/api/ai/apply-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, suggestion })
      });
      
      if (response.ok) {
        const data = await response.json();
        onContentUpdate(data.improvedContent);
        alert(`Applied: ${suggestion.title}`);
      }
    } catch (error) {
      console.error('Apply suggestion failed:', error);
      alert('Failed to apply suggestion. Please try again.');
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Content Review
            </CardTitle>
            <CardDescription className="text-gray-600">
              Comprehensive analysis and optimization suggestions
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={analyzeContent}
              disabled={analyzing}
              className="border-gray-300 hover:bg-gray-100"
            >
              {analyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
            {overallReview && (
              <Badge 
                variant={overallReview.score >= 80 ? 'default' : overallReview.score >= 60 ? 'secondary' : 'destructive'}
                className={`text-lg px-3 py-1 ${
                  overallReview.score >= 80 ? 'bg-green-100 text-green-800 border-green-300' : 
                  overallReview.score >= 60 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 
                  'bg-red-100 text-red-800 border-red-300'
                }`}
              >
                {overallReview.grade} · {overallReview.score}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">Overview</TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-white">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-white">AI Suggestions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-6">
            {overallReview && (
              <>
                {/* Summary Card */}
                <Alert className={`${
                  overallReview.score >= 70 ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
                }`}>
                  <AlertDescription className="text-base text-gray-800">
                    {overallReview.summary}
                  </AlertDescription>
                </Alert>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Word Count</p>
                    <p className="text-2xl font-bold text-gray-900">{overallReview.wordCount}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Reading Time</p>
                    <p className="text-2xl font-bold text-gray-900">{overallReview.readingTime} min</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Readability</p>
                    <p className="text-2xl font-bold text-gray-900">{overallReview.readabilityScore}%</p>
                  </div>
                  <div className={`${
                    overallReview.score >= 80 ? 'bg-green-50' : 
                    overallReview.score >= 60 ? 'bg-yellow-50' : 
                    'bg-red-50'
                  } p-4 rounded-lg`}>
                    <p className="text-sm text-gray-600">Overall Score</p>
                    <p className="text-2xl font-bold text-gray-900">{overallReview.score}%</p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Score Breakdown</h4>
                  {reviewSections.map((section) => (
                    <div key={section.category} className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {section.status === 'good' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        {section.status === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                        {section.status === 'error' && <XCircle className="w-4 h-4 text-red-600" />}
                        <span className="text-sm text-gray-700">{section.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={section.score} 
                          className="w-24 h-2" 
                          style={{
                            '--progress-background': section.status === 'good' ? '#10b981' : 
                              section.status === 'warning' ? '#f59e0b' : '#ef4444'
                          } as any}
                        />
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">{section.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Strengths & Improvements */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium flex items-center gap-2 text-gray-900 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {overallReview.strengths.map((strength, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium flex items-center gap-2 text-gray-900 mb-3">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {overallReview.improvements.map((improvement, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-yellow-600 mt-0.5">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Quick Action */}
                <div className="pt-4">
                  <Button 
                    onClick={applyAllSuggestions}
                    disabled={autoFixing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {autoFixing ? (
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
                </div>
              </>
            )}
          </TabsContent>

          {/* Detailed Analysis Tab */}
          <TabsContent value="details" className="space-y-4 mt-6">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {reviewSections.map((section) => (
                  <Card key={section.category} className="bg-white border-gray-200">
                    <CardHeader className={`pb-3 ${
                      section.status === 'good' ? 'bg-green-50' : 
                      section.status === 'warning' ? 'bg-yellow-50' : 
                      'bg-red-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                          {section.status === 'good' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                          {section.status === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                          {section.status === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
                          {section.category}
                        </CardTitle>
                        <Badge className={
                          section.status === 'good' ? 'bg-green-100 text-green-800' : 
                          section.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }>
                          {section.score}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      {/* Issues */}
                      {section.issues.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Issues Found:</h5>
                          <ul className="space-y-1">
                            {section.issues.map((issue, i) => (
                              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                <XCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Suggestions */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Suggestions:</h5>
                        <ul className="space-y-1">
                          {section.suggestions.map((suggestion, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Auto-fix button */}
                      {section.autoFix && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={section.autoFix}
                          disabled={autoFixing}
                          className="mt-3 border-purple-300 text-purple-700 hover:bg-purple-50"
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          Auto-fix {section.category}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* AI Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4 mt-6">
            <div className="space-y-3">
              {aiSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="hover:shadow-md transition-shadow bg-white border-gray-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                          <Badge className={
                            suggestion.impact === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }>
                            {suggestion.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {suggestion.description}
                        </p>
                        <p className="text-sm text-gray-800">
                          <strong>Suggestion:</strong> {suggestion.suggestion}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applySuggestion(suggestion)}
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Generate More Suggestions */}
              <Card className="border-dashed border-gray-300 bg-gray-50">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <Sparkles className="w-8 h-8 text-purple-600 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Need More Ideas?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Get advanced AI suggestions based on your content
                  </p>
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/ai/generate-suggestions', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ content, keywords, title })
                        });
                        
                        if (response.ok) {
                          const data = await response.json();
                          setAiSuggestions(prev => [...prev, ...data.suggestions]);
                          alert('New suggestions generated!');
                        }
                      } catch (error) {
                        console.error('Generate suggestions failed:', error);
                        alert('Failed to generate suggestions. Please try again.');
                      }
                    }}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Advanced Suggestions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}