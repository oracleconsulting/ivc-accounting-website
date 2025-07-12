import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Edit3, Sparkles, FileText, Search, TrendingUp, AlertCircle } from 'lucide-react';
// Simple toast implementation
const useToast = () => {
  return {
    toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
      console.log(`Toast: ${title} - ${description}`);
      // You can implement a proper toast system later
    }
  };
};

interface ReviewSuggestion {
  id: string;
  type: 'grammar' | 'style' | 'seo' | 'clarity' | 'brand' | 'factual';
  severity: 'low' | 'medium' | 'high';
  original: string;
  suggested: string;
  explanation: string;
  location: {
    start: number;
    end: number;
    paragraph?: number;
  };
}

interface ComprehensiveReview {
  overallScore: number;
  readabilityScore: number;
  seoScore: number;
  brandAlignmentScore: number;
  suggestions: ReviewSuggestion[];
  summary: string;
  strengths: string[];
  improvements: string[];
  keywordAnalysis: {
    keyword: string;
    count: number;
    density: number;
    optimal: boolean;
  }[];
}

interface AIReviewPanelProps {
  content: string;
  onContentUpdate: (newContent: string) => void;
  keywords?: string[];
  previousSuggestions?: {
    research?: string;
    improvements?: string;
  };
  aiMode?: string;
}

export function AIReviewPanel({ content, onContentUpdate, keywords = [], previousSuggestions }: AIReviewPanelProps) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [review, setReview] = useState<ComprehensiveReview | null>(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const performComprehensiveReview = async () => {
    setIsReviewing(true);
    try {
      const response = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          keywords,
          previousSuggestions,
          reviewType: 'comprehensive'
        }),
      });

      if (!response.ok) throw new Error('Review failed');
      
      const data = await response.json();
      setReview(data.review);
      toast({
        title: "Review Complete",
        description: `Found ${data.review.suggestions.length} suggestions for improvement`,
      });
    } catch (error) {
      toast({
        title: "Review Failed",
        description: "Unable to complete the review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const applySuggestion = (suggestion: ReviewSuggestion) => {
    // Apply the suggestion to the content
    const before = content.substring(0, suggestion.location.start);
    const after = content.substring(suggestion.location.end);
    const newContent = before + suggestion.suggested + after;
    
    onContentUpdate(newContent);
    setAppliedSuggestions(new Set([...appliedSuggestions, suggestion.id]));
    
    toast({
      title: "Change Applied",
      description: "The suggested change has been applied to your content.",
    });
  };

  const applyAllSuggestions = () => {
    if (!review) return;
    
    // Sort suggestions by location (reverse order to maintain positions)
    const sortedSuggestions = [...review.suggestions]
      .filter(s => !appliedSuggestions.has(s.id))
      .sort((a, b) => b.location.start - a.location.start);
    
    let updatedContent = content;
    for (const suggestion of sortedSuggestions) {
      const before = updatedContent.substring(0, suggestion.location.start);
      const after = updatedContent.substring(suggestion.location.end);
      updatedContent = before + suggestion.suggested + after;
    }
    
    onContentUpdate(updatedContent);
    setAppliedSuggestions(new Set(review.suggestions.map(s => s.id)));
    
    toast({
      title: "All Changes Applied",
      description: `Applied ${sortedSuggestions.length} suggestions to your content.`,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'grammar': return <Edit3 className="w-4 h-4" />;
      case 'seo': return <Search className="w-4 h-4" />;
      case 'style': return <Sparkles className="w-4 h-4" />;
      case 'clarity': return <FileText className="w-4 h-4" />;
      case 'brand': return <TrendingUp className="w-4 h-4" />;
      case 'factual': return <AlertCircle className="w-4 h-4" />;
      default: return <Edit3 className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Comprehensive Review
        </CardTitle>
        <CardDescription>
          Get a complete analysis of your content with actionable suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!review ? (
          <div className="text-center py-8">
            <Button 
              onClick={performComprehensiveReview} 
              disabled={isReviewing || !content}
              size="lg"
              className="gap-2"
            >
              {isReviewing ? (
                <>
                  <Loader2 className="animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Sparkles />
                  Perform Comprehensive Review
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Using Claude Opus 4 for advanced analysis
            </p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
              <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{review.overallScore}/100</div>
                    <p className="text-xs text-muted-foreground">Overall Score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{review.readabilityScore}/100</div>
                    <p className="text-xs text-muted-foreground">Readability</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{review.seoScore}/100</div>
                    <p className="text-xs text-muted-foreground">SEO Score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{review.brandAlignmentScore}/100</div>
                    <p className="text-xs text-muted-foreground">Brand Voice</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{review.summary}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {review.strengths.map((strength, i) => (
                        <li key={i} className="text-sm">{strength}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                      {review.improvements.map((improvement, i) => (
                        <li key={i} className="text-sm">{improvement}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                  {review.suggestions.filter(s => !appliedSuggestions.has(s.id)).length} suggestions remaining
                </p>
                <Button 
                  onClick={applyAllSuggestions}
                  disabled={review.suggestions.every(s => appliedSuggestions.has(s.id))}
                  size="sm"
                >
                  Apply All Suggestions
                </Button>
              </div>

              {review.suggestions.map((suggestion) => (
                <Card 
                  key={suggestion.id} 
                  className={appliedSuggestions.has(suggestion.id) ? 'opacity-50' : ''}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(suggestion.type)}
                        <span className="font-medium capitalize">{suggestion.type}</span>
                        <Badge className={getSeverityColor(suggestion.severity)}>
                          {suggestion.severity}
                        </Badge>
                      </div>
                      {!appliedSuggestions.has(suggestion.id) && (
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(suggestion)}
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid gap-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Original:</p>
                        <p className="text-sm line-through">{suggestion.original}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Suggested:</p>
                        <p className="text-sm font-medium">{suggestion.suggested}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Why:</p>
                        <p className="text-sm text-muted-foreground">{suggestion.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keyword Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {review.keywordAnalysis.map((kw) => (
                      <div key={kw.keyword} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{kw.keyword}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {kw.count} times ({kw.density.toFixed(1)}%)
                          </span>
                          {kw.optimal ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {/* Generate meta description */}}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate SEO Meta Description
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {/* Generate social media */}}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Create Social Media Posts
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {/* Simplify language */}}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Simplify Complex Sentences
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {/* Add internal links */}}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Suggest Internal Links
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
} 