'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Copy, 
  RefreshCw,
  FileText,
  Hash,
  Zap,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AIAssistantProps {
  onClose: () => void;
  onInsert: (text: string) => void;
  context: {
    title: string;
    content: string;
    excerpt: string;
  };
}

interface Suggestion {
  type: 'title' | 'intro' | 'outline' | 'conclusion' | 'seo' | 'custom';
  prompt: string;
  icon: React.ReactNode;
  label: string;
}

export default function AIAssistant({ onClose, onInsert, context }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ prompt: string; response: string }>>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions: Suggestion[] = [
    {
      type: 'title',
      prompt: 'Suggest 5 compelling blog post titles based on the content',
      icon: <FileText className="w-4 h-4" />,
      label: 'Title Ideas'
    },
    {
      type: 'intro',
      prompt: 'Write an engaging introduction paragraph for this blog post',
      icon: <Zap className="w-4 h-4" />,
      label: 'Introduction'
    },
    {
      type: 'outline',
      prompt: 'Create a detailed outline with H2 and H3 headings for this topic',
      icon: <Hash className="w-4 h-4" />,
      label: 'Outline'
    },
    {
      type: 'conclusion',
      prompt: 'Write a compelling conclusion with a call-to-action',
      icon: <FileText className="w-4 h-4" />,
      label: 'Conclusion'
    },
    {
      type: 'seo',
      prompt: 'Suggest SEO improvements including meta description and keywords',
      icon: <Sparkles className="w-4 h-4" />,
      label: 'SEO Tips'
    }
  ];

  const generateAIResponse = async (userPrompt: string) => {
    setLoading(true);
    setResponse('');

    try {
      // Build context for AI
      const aiContext = `
Blog Post Context:
Title: ${context.title || 'Not provided'}
Excerpt: ${context.excerpt || 'Not provided'}
Current Content Length: ${context.content.split(' ').length} words

Content Preview:
${context.content.substring(0, 500)}${context.content.length > 500 ? '...' : ''}

User Request: ${userPrompt}
`;

      const res = await fetch('/api/admin/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiContext,
          type: 'blog_assistance'
        }),
      });

      if (!res.ok) throw new Error('Failed to generate response');

      const data = await res.json();
      setResponse(data.content);
      setHistory([...history, { prompt: userPrompt, response: data.content }]);
    } catch (error) {
      console.error('AI generation error:', error);
      // Fallback response for demo
      const fallbackResponse = generateFallbackResponse(userPrompt);
      setResponse(fallbackResponse);
      setHistory([...history, { prompt: userPrompt, response: fallbackResponse }]);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackResponse = (userPrompt: string): string => {
    // Simple fallback responses based on prompt type
    if (userPrompt.includes('title')) {
      return `Here are 5 compelling title suggestions:

1. "Transform Your Business: The Accountant's Guide to Growth"
2. "Why Your Business Deserves an Accountant Who Fights for You"
3. "Breaking the Mold: Modern Accounting for Essex Businesses"
4. "The Financial Fighter: How IVC Accounting Changes the Game"
5. "Beyond Numbers: Strategic Accounting That Drives Success"`;
    }
    
    if (userPrompt.includes('introduction')) {
      return `In today's competitive business landscape, having the right financial partner isn't just important—it's essential. At IVC Accounting, we're not your typical accountants. We're financial fighters who believe every business deserves expert guidance, strategic insights, and someone who genuinely cares about their success. Whether you're a startup finding your feet or an established business ready to scale, we're here to ensure your finances work as hard as you do.`;
    }
    
    if (userPrompt.includes('outline')) {
      return `## Blog Post Outline

### 1. Introduction
- Hook: The challenge of finding the right accountant
- Thesis: Why businesses need more than just number-crunchers

### 2. The IVC Difference
- Our "Fight for What You Deserve" philosophy
- How we go beyond traditional accounting

### 3. Services That Make a Difference
#### Tax Strategy
- Proactive planning vs. reactive filing
- Real examples of tax savings

#### Business Growth Support
- Financial insights that drive decisions
- Strategic planning for scaling

### 4. Client Success Stories
- Case study 1: Startup to success
- Case study 2: Tax savings transformation

### 5. Getting Started with IVC
- What to expect in your first consultation
- Our onboarding process

### 6. Conclusion
- Recap of key benefits
- Call to action: Book your free consultation`;
    }
    
    if (userPrompt.includes('SEO')) {
      return `## SEO Optimization Suggestions

**Meta Description (155 chars):**
"Discover how IVC Accounting fights for Essex businesses with strategic tax planning, growth support, and accounting that goes beyond the numbers."

**Focus Keywords:**
- accountant essex
- tax strategy halstead
- business accounting essex
- financial planning essex
- strategic accountant

**Additional SEO Tips:**
1. Include location-based keywords naturally throughout
2. Add internal links to service pages
3. Include a FAQ section for voice search optimization
4. Optimize images with descriptive alt text
5. Ensure mobile responsiveness`;
    }
    
    return "I'll help you improve your blog post. Could you be more specific about what aspect you'd like assistance with? I can help with introductions, conclusions, outlines, SEO optimization, or any other content needs.";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      generateAIResponse(prompt);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setPrompt(suggestion.prompt);
    generateAIResponse(suggestion.prompt);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const insertIntoEditor = (text: string) => {
    onInsert(text);
    toast.success('Inserted into editor');
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#ff6b35]" />
          <h3 className="font-bold text-[#1a2b4a]">AI Writing Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggestions */}
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Quick actions:</p>
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.type}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 hover:border-[#4a90e2] hover:bg-[#4a90e2]/5 transition-colors disabled:opacity-50"
            >
              {suggestion.icon}
              <span>{suggestion.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Response Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating response...</span>
          </div>
        )}
        
        {response && !loading && (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap">{response}</div>
            </div>
            
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => insertIntoEditor(response)}
                className="flex items-center gap-2 px-3 py-2 bg-[#ff6b35] text-white text-sm font-medium hover:bg-[#e55a2b] transition-colors"
              >
                <FileText className="w-4 h-4" />
                Insert
              </button>
              
              <button
                onClick={() => copyToClipboard(response)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              
              <button
                onClick={() => generateAIResponse(prompt)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
            </div>
          </div>
        )}
        
        {history.length > 0 && !response && !loading && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Previous responses:</p>
            {history.slice(-3).reverse().map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">{item.prompt}</p>
                <p className="text-sm text-gray-700 line-clamp-3">{item.response}</p>
                <button
                  onClick={() => {
                    setResponse(item.response);
                    setPrompt(item.prompt);
                  }}
                  className="text-xs text-[#4a90e2] hover:text-[#ff6b35] mt-2"
                >
                  View full response
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask for help with your blog post..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-[#4a90e2]"
            rows={3}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 bg-[#4a90e2] text-white rounded-lg hover:bg-[#3a7bc8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 