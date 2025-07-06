// FILE: components/admin/SEOPanel.tsx
// SEO panel component

'use client';

import { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';
import { analyzeSEO, generateMetaDescription, suggestKeywords } from '@/lib/utils/seo';
import { generateSlug } from '@/lib/utils/blog';

interface SEOPanelProps {
  data: {
    seo_title: string;
    seo_description: string;
    seo_keywords: string[];
  };
  onChange: (data: any) => void;
  content: string;
  title: string;
}

export default function SEOPanel({ data, onChange, content, title }: SEOPanelProps) {
  const [score, setScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const analyzeContent = async () => {
      if (!content || !title) return;
      
      setIsAnalyzing(true);
      const analysis = await analyzeSEO({ title, content, ...data });
      setScore(analysis.score);
      setSuggestions(analysis.suggestions);
      setIsAnalyzing(false);
    };

    const debounced = setTimeout(analyzeContent, 1000);
    return () => clearTimeout(debounced);
  }, [content, title, data]);

  const generateDescription = async () => {
    const description = await generateMetaDescription(title, content);
    onChange({ ...data, seo_description: description });
  };

  const suggestKeywordsHandler = async () => {
    const keywords = await suggestKeywords(content);
    onChange({ ...data, seo_keywords: keywords });
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1a2b4a]">SEO Optimization</h3>
        <div className={`flex items-center gap-2 ${getScoreColor()}`}>
          {score >= 80 ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold">{score}/100</span>
        </div>
      </div>

      {/* SEO Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SEO Title ({data.seo_title.length}/60)
        </label>
        <input
          type="text"
          value={data.seo_title}
          onChange={(e) => onChange({ ...data, seo_title: e.target.value })}
          placeholder={title || 'Enter SEO title...'}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#4a90e2]"
          maxLength={60}
        />
      </div>

      {/* SEO Description */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">
            Meta Description ({data.seo_description.length}/160)
          </label>
          <button
            onClick={generateDescription}
            className="text-xs text-[#4a90e2] hover:text-[#ff6b35]"
          >
            Auto-generate
          </button>
        </div>
        <textarea
          value={data.seo_description}
          onChange={(e) => onChange({ ...data, seo_description: e.target.value })}
          placeholder="Brief description for search results..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#4a90e2] resize-none"
          rows={3}
          maxLength={160}
        />
      </div>

      {/* Keywords */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">
            Focus Keywords
          </label>
          <button
            onClick={suggestKeywordsHandler}
            className="text-xs text-[#4a90e2] hover:text-[#ff6b35]"
          >
            Suggest keywords
          </button>
        </div>
        <input
          type="text"
          value={data.seo_keywords.join(', ')}
          onChange={(e) => onChange({ 
            ...data, 
            seo_keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) 
          })}
          placeholder="accountant, halstead, essex, tax..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#4a90e2]"
        />
      </div>

      {/* Google Preview */}
      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
        <p className="text-xs text-gray-600 mb-2">Google Preview:</p>
        <div>
          <h4 className="text-[#1a40e0] text-lg hover:underline cursor-pointer">
            {data.seo_title || title || 'Page Title'}
          </h4>
          <p className="text-sm text-green-700">
            ivcaccounting.co.uk › blog › {data.seo_title ? generateSlug(data.seo_title) : 'url-slug'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {data.seo_description || 'Meta description will appear here...'}
          </p>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Suggestions:</p>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">{suggestion}</span>
            </div>
          ))}
        </div>
      )}

      {isAnalyzing && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin w-4 h-4 border-2 border-[#4a90e2] border-t-transparent rounded-full" />
          Analyzing SEO...
        </div>
      )}
    </div>
  );
} 