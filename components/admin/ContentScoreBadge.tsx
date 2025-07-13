'use client';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';

interface ContentScoreBadgeProps {
  score: number;
  isAnalyzing?: boolean;
  showProgress?: boolean;
  previousScore?: number;
}

export function ContentScoreBadge({ 
  score, 
  isAnalyzing = false,
  showProgress = true,
  previousScore
}: ContentScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return 'bg-green-600';
    if (score >= 70) return 'bg-yellow-600';
    if (score >= 50) return 'bg-orange-600';
    return 'bg-red-600';
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

  const scoreDiff = previousScore ? score - previousScore : 0;

  return (
    <div className="flex items-center gap-3">
      <Badge 
        variant="outline" 
        className={`text-lg px-4 py-2 ${getScoreColor(score)}`}
      >
        {isAnalyzing ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <>
            {getGrade(score)} · {score}%
            {scoreDiff !== 0 && (
              <span className="ml-2 text-sm">
                {scoreDiff > 0 ? (
                  <TrendingUp className="w-3 h-3 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 inline" />
                )}
                {Math.abs(scoreDiff)}
              </span>
            )}
          </>
        )}
      </Badge>
      
      {showProgress && !isAnalyzing && (
        <div className="w-32">
          <Progress 
            value={score} 
            className="h-2"
          />
        </div>
      )}
    </div>
  );
} 