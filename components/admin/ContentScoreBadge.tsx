import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface ContentScoreBadgeProps {
  score: number;
  isAnalyzing?: boolean;
}

export function ContentScoreBadge({ score, isAnalyzing }: ContentScoreBadgeProps) {
  const getScoreColor = () => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };

  if (isAnalyzing) {
    return (
      <Badge variant="outline" className="gap-1">
        <Loader2 className="w-3 h-3 animate-spin" />
        Analyzing...
      </Badge>
    );
  }

  return (
    <Badge className={`${getScoreColor()} text-white`}>
      Score: {score}/100 - {getScoreLabel()}
    </Badge>
  );
} 