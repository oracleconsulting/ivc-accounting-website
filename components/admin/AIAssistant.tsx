'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Copy, Check } from 'lucide-react';
import { streamCompletion } from '@/lib/utils/openrouter';
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

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  { label: 'Write Introduction', prompt: 'Write an engaging introduction for this blog post' },
  { label: 'Add Statistics', prompt: 'Add relevant statistics and data points to support the main argument' },
  { label: 'Create Conclusion', prompt: 'Write a compelling conclusion with a clear call-to-action' },
  { label: 'Improve SEO', prompt: 'Suggest improvements for better SEO performance' },
  { label: 'Add Examples', prompt: 'Add practical examples to illustrate the key points' },
  { label: 'Simplify Language', prompt: 'Rewrite this section using simpler, more accessible language' }
];

export default function AIAssistant({ onClose, onInsert, context }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build context for the AI
      const systemPrompt = `You are an AI assistant helping to write blog content for IVC Accounting. 
      The brand voice is direct, no-BS, and focused on practical value. 
      Current post context:
      Title: ${context.title || 'Untitled'}
      Content so far: ${context.content.substring(0, 1000)}...
      
      Maintain consistency with the existing tone and style. Keep responses focused and actionable.`;

      const response = await streamCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
          userMessage
        ],
        model: 'claude-3-sonnet',
        temperature: 0.7,
        max_tokens: 1000
      });

      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
      console.error('AI error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#1a2b4a] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#ff6b35]" />
          <h3 className="font-bold">AI Writing Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Quick Actions:</p>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => sendMessage(prompt.prompt)}
              className="text-xs px-3 py-2 bg-[#f5f1e8] hover:bg-[#ff6b35] hover:text-white transition-colors font-medium"
              disabled={isLoading}
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-[#ff6b35]" />
            <p className="text-sm">
              Ask me anything about your blog post!
              <br />
              I can help with ideas, writing, and optimization.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.role === 'user' 
                ? 'ml-auto bg-[#4a90e2] text-white' 
                : 'bg-gray-100'
            } p-3 rounded-lg max-w-[85%] relative group`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            
            {message.role === 'assistant' && (
              <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => copyToClipboard(message.content, index)}
                  className="bg-white shadow-lg p-1.5 rounded hover:bg-gray-100"
                  title="Copy"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={() => onInsert(message.content)}
                  className="bg-white shadow-lg p-1.5 rounded hover:bg-gray-100"
                  title="Insert into editor"
                >
                  <Send className="w-4 h-4 text-gray-600 rotate-180" />
                </button>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="bg-gray-100 p-3 rounded-lg max-w-[85%]">
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-[#4a90e2] border-t-transparent rounded-full" />
              <span className="text-sm text-gray-600">AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for help with your content..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4a90e2]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#ff6b35] text-white p-2 rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-2">
          Powered by OpenRouter • Your content stays private
        </p>
      </div>
    </div>
  );
} 