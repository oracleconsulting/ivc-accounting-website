import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, TrendingUp, AlertCircle } from 'lucide-react';

interface CompetitiveAnalysisProps {
  keywords: string[];
  onInsightApply: (insight: string) => void;
}

export function CompetitiveAnalysis({ keywords, onInsightApply }: CompetitiveAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const performAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/competitive-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords })
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Competitive analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Competitive Intelligence</CardTitle>
        <CardDescription>See how top-ranking content performs</CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis ? (
          <Button 
            onClick={performAnalysis} 
            disabled={isAnalyzing || keywords.length === 0}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Competition...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Analyze Competitors
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Content Length</span>
                <span className="font-medium">{analysis.avgWordCount} words avg</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${analysis.contentLengthScore}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Missing Topics</h4>
              {analysis.missingTopics.map((topic: string, i: number) => (
                <Button
                  key={i}
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onInsightApply(`Add section about: ${topic}`)}
                >
                  <AlertCircle className="w-3 h-3 mr-2" />
                  {topic}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Top Performing Elements</h4>
              {analysis.topElements.map((element: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{element.name}</span>
                  <Badge variant="outline">{element.frequency}%</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 