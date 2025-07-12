import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HistoryEntry {
  id: number;
  content: string;
  timestamp: string;
  score: number;
  aiMode: string;
}

interface SuggestionHistoryProps {
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
}

export function SuggestionHistory({ history, onRestore }: SuggestionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Version History</CardTitle>
        <CardDescription>Recent auto-saved versions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No history yet
            </p>
          ) : (
            history.slice(-5).reverse().map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <History className="w-3 h-3" />
                    <span className="text-xs">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Score: {entry.score}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {entry.content.substring(0, 50)}...
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRestore(entry)}
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 