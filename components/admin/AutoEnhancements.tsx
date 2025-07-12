import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, Quote, FileText, Hash } from 'lucide-react';

interface AutoEnhancementsProps {
  content: string;
  onEnhance: (content: string) => void;
  isEnabled: boolean;
  aiMode: string;
}

export function AutoEnhancements({ content, onEnhance, isEnabled, aiMode }: AutoEnhancementsProps) {
  const enhanceWithLinks = async () => {
    const response = await fetch('/api/ai/auto-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    const data = await response.json();
    onEnhance(data.enhanced);
  };

  const addCitations = async () => {
    const response = await fetch('/api/ai/auto-cite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    const data = await response.json();
    onEnhance(data.enhanced);
  };

  const improveFormatting = async () => {
    const response = await fetch('/api/ai/auto-format', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    const data = await response.json();
    onEnhance(data.enhanced);
  };

  const generateMetaTags = async () => {
    const response = await fetch('/api/ai/generate-meta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    const data = await response.json();
    // Handle meta tags differently - maybe show in a modal
    console.log('Generated meta tags:', data);
  };

  if (!isEnabled) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Auto-Enhancements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={enhanceWithLinks}>
            <Link className="w-4 h-4 mr-2" />
            Add Internal Links
          </Button>
          <Button variant="outline" size="sm" onClick={addCitations}>
            <Quote className="w-4 h-4 mr-2" />
            Add Citations
          </Button>
          <Button variant="outline" size="sm" onClick={improveFormatting}>
            <FileText className="w-4 h-4 mr-2" />
            Improve Formatting
          </Button>
          <Button variant="outline" size="sm" onClick={generateMetaTags}>
            <Hash className="w-4 h-4 mr-2" />
            Generate Meta Tags
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 