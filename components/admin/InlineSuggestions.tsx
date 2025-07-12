import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles } from 'lucide-react';

interface Suggestion {
  id: string;
  start: number;
  end: number;
  original: string;
  suggested: string;
  reason: string;
  type: string;
}

interface InlineSuggestionsProps {
  content: string;
  onChange: (content: string) => void;
  aiMode: string;
  suggestions: Suggestion[];
}

export function InlineSuggestions({ content, onChange, aiMode, suggestions: propSuggestions }: InlineSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(propSuggestions);
  const [highlightedSuggestion, setHighlightedSuggestion] = useState<string | null>(null);

  useEffect(() => {
    // Fetch inline suggestions when content changes
    const fetchSuggestions = async () => {
      if (content.length < 50) return;

      try {
        const response = await fetch('/api/ai/inline-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, aiMode })
        });

        const data = await response.json();
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 2000);
    return () => clearTimeout(debounceTimer);
  }, [content, aiMode]);

  const applySuggestion = (suggestion: Suggestion) => {
    const before = content.substring(0, suggestion.start);
    const after = content.substring(suggestion.end);
    onChange(before + suggestion.suggested + after);
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(suggestions.filter(s => s.id !== suggestionId));
  };

  // Create content with highlighted suggestions
  const renderContentWithSuggestions = () => {
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];

    suggestions
      .sort((a, b) => a.start - b.start)
      .forEach((suggestion, index) => {
        // Add text before suggestion
        if (suggestion.start > lastIndex) {
          elements.push(
            <span key={`text-${index}`}>
              {content.substring(lastIndex, suggestion.start)}
            </span>
          );
        }

        // Add suggestion
        elements.push(
          <Popover key={`suggestion-${suggestion.id}`}>
            <PopoverTrigger asChild>
              <span
                className={`underline decoration-wavy decoration-amber-400 cursor-pointer ${
                  highlightedSuggestion === suggestion.id ? 'bg-amber-100' : ''
                }`}
                onMouseEnter={() => setHighlightedSuggestion(suggestion.id)}
                onMouseLeave={() => setHighlightedSuggestion(null)}
              >
                {suggestion.original}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">AI Suggestion</p>
                    <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                  </div>
                </div>
                <div className="bg-muted p-2 rounded text-sm">
                  <p className="line-through text-muted-foreground">{suggestion.original}</p>
                  <p className="font-medium">{suggestion.suggested}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => applySuggestion(suggestion)}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => dismissSuggestion(suggestion.id)}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Dismiss
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );

        lastIndex = suggestion.end;
      });

    // Add remaining text
    if (lastIndex < content.length) {
      elements.push(
        <span key="text-final">{content.substring(lastIndex)}</span>
      );
    }

    return elements;
  };

  return (
    <div className="w-full min-h-[400px] p-4 border rounded-md whitespace-pre-wrap">
      {suggestions.length > 0 ? renderContentWithSuggestions() : content}
    </div>
  );
} 