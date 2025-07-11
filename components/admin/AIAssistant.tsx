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
  Loader2,
  Search,
  PenTool,
  Share2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import { blogAIService } from '@/lib/services/blogAIService';

interface AIAssistantProps {
  onClose: () => void;
  onInsert: (text: string) => void;
  context: {
    title: string;
    content: string;
    excerpt: string;
    categories?: string[];
    tags?: string[];
  };
}

interface Suggestion {
  type: 'title' | 'intro' | 'outline' | 'conclusion' | 'seo' | 'improve' | 'custom';
  prompt: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
  cost?: number;
}

export default function AIAssistant({ onClose, onInsert, context }: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'research' | 'improve'>('write');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  const suggestions: Record<string, Suggestion[]> = {
    write: [
      {
        type: 'title',
        prompt: 'Suggest 5 compelling blog post titles based on the content',
        icon: <FileText className="w-4 h-4" />,
        label: 'Title Ideas',
        color: 'bg-blue-100 hover:bg-blue-200 text-blue-700'
      },
      {
        type: 'intro',
        prompt: 'Write an engaging introduction paragraph for this blog post',
        icon: <Zap className="w-4 h-4" />,
        label: 'Introduction',
        color: 'bg-purple-100 hover:bg-purple-200 text-purple-700'
      },
      {
        type: 'outline',
        prompt: 'Create a detailed outline with H2 and H3 headings for this topic',
        icon: <Hash className="w-4 h-4" />,
        label: 'Outline',
        color: 'bg-green-100 hover:bg-green-200 text-green-700'
      },
      {
        type: 'conclusion',
        prompt: 'Write a compelling conclusion with a call-to-action',
        icon: <FileText className="w-4 h-4" />,
        label: 'Conclusion',
        color: 'bg-orange-100 hover:bg-orange-200 text-orange-700'
      }
    ],
    research: [
      {
        type: 'custom',
        prompt: 'Research current UK tax law changes affecting small businesses',
        icon: <Search className="w-4 h-4" />,
        label: 'Tax Updates',
        color: 'bg-red-100 hover:bg-red-200 text-red-700'
      },
      {
        type: 'custom',
        prompt: 'Find statistics about UK small business challenges',
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'Statistics',
        color: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
      },
      {
        type: 'custom',
        prompt: 'Research competitor blog topics in UK accounting',
        icon: <Target className="w-4 h-4" />,
        label: 'Competitor Analysis',
        color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
      }
    ],
    improve: [
      {
        type: 'improve',
        prompt: 'Make this content clearer for non-accountants',
        icon: <BookOpen className="w-4 h-4" />,
        label: 'Simplify',
        color: 'bg-teal-100 hover:bg-teal-200 text-teal-700'
      },
      {
        type: 'improve',
        prompt: 'Add more engagement and personality',
        icon: <MessageSquare className="w-4 h-4" />,
        label: 'Engagement',
        color: 'bg-pink-100 hover:bg-pink-200 text-pink-700'
      },
      {
        type: 'seo',
        prompt: 'Optimize for SEO with UK accounting keywords',
        icon: <Search className="w-4 h-4" />,
        label: 'SEO Optimize',
        color: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700'
      }
    ]
  };

  const generateAIResponse = async (userPrompt: string, type: string = 'custom') => {
    setLoading(true);
    setResponse('');

    try {
      let result = '';
      
      switch (type) {
        case 'title':
          result = await blogAIService.generateBlogContent(userPrompt, context, 'title');
          break;
        case 'intro':
          result = await blogAIService.generateBlogContent(userPrompt, context, 'intro');
          break;
        case 'outline':
          result = await blogAIService.generateBlogContent(userPrompt, context, 'outline');
          break;
        case 'conclusion':
          result = await blogAIService.generateBlogContent(userPrompt, context, 'conclusion');
          break;
        case 'seo':
          const seoResult = await blogAIService.generateSEOContent(
            context.content,
            context.title,
            context.tags || []
          );
          result = `**SEO Optimization Results:**\n\n` +
            `**SEO Title:** ${seoResult.seoTitle}\n\n` +
            `**Meta Description:** ${seoResult.metaDescription}\n\n` +
            `**Suggested Keywords:** ${seoResult.suggestedKeywords.join(', ')}\n\n` +
            `**Content Optimizations:**\n${seoResult.contentOptimizations.map((opt: string) => `- ${opt}`).join('\n')}`;
          break;
        case 'improve':
          const improvementType = userPrompt.includes('clear') ? 'clarity' : 
                                userPrompt.includes('engagement') ? 'engagement' : 'tone';
          result = await blogAIService.improveContent(
            context.content || userPrompt,
            improvementType
          );
          break;
        default:
          result = await blogAIService.generateBlogContent(userPrompt, context, 'section');
      }

      setResponse(result);
      
      // Add to conversation history
      const newMessage: ConversationMessage = {
        role: 'assistant',
        content: result,
        timestamp: new Date()
      };
      setConversation([...conversation, 
        { role: 'user', content: userPrompt, timestamp: new Date() },
        newMessage
      ]);
      
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate response');
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      generateAIResponse(prompt);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setPrompt(suggestion.prompt);
    generateAIResponse(suggestion.prompt, suggestion.type);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const insertIntoEditor = (text: string) => {
    onInsert(text);
    toast.success('Inserted into editor');
  };

  const handleResearch = async () => {
    setLoading(true);
    try {
      const results = await blogAIService.researchTrendingTopics('accounting', 'current');
      
      const formattedResults = results.map((r: any) => 
        `**${r.topic}** (${r.relevance}% relevant)\n` +
        `Impact: ${r.impact}\n` +
        `Keywords: ${r.keywords.join(', ')}\n`
      ).join('\n\n');
      
      setResponse(formattedResults);
    } catch (error) {
      toast.error('Research failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  return (
    <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#4a90e2] to-[#ff6b35]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white">AI Writing Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('write')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'write' 
              ? 'text-[#4a90e2] border-b-2 border-[#4a90e2]' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <PenTool className="w-4 h-4 inline mr-1" />
          Write
        </button>
        <button
          onClick={() => setActiveTab('research')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'research' 
              ? 'text-[#4a90e2] border-b-2 border-[#4a90e2]' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Search className="w-4 h-4 inline mr-1" />
          Research
        </button>
        <button
          onClick={() => setActiveTab('improve')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'improve' 
              ? 'text-[#4a90e2] border-b-2 border-[#4a90e2]' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-4 h-4 inline mr-1" />
          Improve
        </button>
      </div>

      {/* Suggestions */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 mb-2 font-medium">Quick actions:</p>
        <div className="grid grid-cols-2 gap-2">
          {suggestions[activeTab].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={loading}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all disabled:opacity-50 ${suggestion.color}`}
            >
              {suggestion.icon}
              <span className="font-medium">{suggestion.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Response Area */}
      <div ref={responseRef} className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-[#4a90e2] animate-spin mb-4" />
            <p className="text-gray-600">Generating AI response...</p>
            <p className="text-xs text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        )}
        
        {response && !loading && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ 
                  __html: response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br />')
                }} />
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => insertIntoEditor(response)}
                className="flex items-center gap-2 px-3 py-2 bg-[#ff6b35] text-white text-sm font-medium rounded-lg hover:bg-[#e55a2b] transition-colors"
              >
                <FileText className="w-4 h-4" />
                Insert
              </button>
              
              <button
                onClick={() => copyToClipboard(response)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              
              <button
                onClick={() => generateAIResponse(prompt || suggestions[activeTab][0].prompt)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
            </div>
          </div>
        )}
        
        {conversation.length > 0 && !response && !loading && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Conversation History</p>
            {conversation.slice(-6).map((msg, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-50 ml-8' : 'bg-white mr-8 shadow-sm'
              }`}>
                <p className="text-xs text-gray-500 mb-1">
                  {msg.role === 'user' ? 'You' : 'AI'} • {msg.timestamp.toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Token Counter */}
      {totalCost > 0 && (
        <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Session cost: ${totalCost.toFixed(4)} • 
            Messages: {conversation.length}
          </p>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Ask me to help with your ${activeTab === 'research' ? 'research' : 'blog post'}...`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent"
            rows={3}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 bg-gradient-to-r from-[#4a90e2] to-[#ff6b35] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Ctrl+Enter to send</p>
      </form>
    </div>
  );
} 