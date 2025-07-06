'use client';

import { useState } from 'react';
import { 
  Search, 
  PenTool, 
  Share2, 
  Loader2, 
  TrendingUp, 
  Target,
  Sparkles,
  MessageSquare,
  Linkedin,
  Instagram,
  Youtube
} from 'lucide-react';

interface ResearchResult {
  topic: string;
  relevance: number;
  impact: string;
  keywords: string[];
  sources: string[];
  targetAudience: string;
}

interface SocialPost {
  platform: 'linkedin' | 'instagram' | 'youtube';
  content: string;
  hashtags: string[];
  mediaType?: 'image' | 'video' | 'carousel';
  scheduledTime?: Date;
}

interface AIBlogAssistantProps {
  onResearchComplete: (results: ResearchResult[]) => void;
  onContentGenerated: (content: string) => void;
  onSocialPostsGenerated: (posts: SocialPost[]) => void;
  currentContent?: string;
  postTitle?: string;
}

export default function AIBlogAssistant({
  onResearchComplete,
  onContentGenerated,
  onSocialPostsGenerated,
  currentContent,
  postTitle
}: AIBlogAssistantProps) {
  const [activeTab, setActiveTab] = useState<'research' | 'writing' | 'social'>('research');
  const [loading, setLoading] = useState(false);
  const [researchResults, setResearchResults] = useState<ResearchResult[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  
  // Research Settings
  const [industry, setIndustry] = useState('accounting');
  const [targetMarket, setTargetMarket] = useState('small-businesses-essex');
  const [timeframe, setTimeframe] = useState('current-quarter');

  // Research Tab Component
  const ResearchTab = () => {
    const handleResearch = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/ai/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            industry,
            targetMarket,
            timeframe,
            context: 'UK accounting and tax law'
          })
        });
        
        const data = await response.json();
        setResearchResults(data.results);
        onResearchComplete(data.results);
      } catch (error) {
        console.error('Research failed:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Research Assistant</h3>
          <p className="text-sm text-blue-700">
            Discover trending topics and changes in tax law that directly impact your clients.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry Focus
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35]"
            >
              <option value="accounting">Accounting & Tax</option>
              <option value="small-business">Small Business</option>
              <option value="startups">Startups</option>
              <option value="real-estate">Real Estate</option>
              <option value="ecommerce">E-commerce</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Market
            </label>
            <select
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35]"
            >
              <option value="small-businesses-essex">Small Businesses in Essex</option>
              <option value="contractors">Contractors & Freelancers</option>
              <option value="property-investors">Property Investors</option>
              <option value="tech-startups">Tech Startups</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timeframe
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35]"
            >
              <option value="current-quarter">Current Quarter</option>
              <option value="upcoming-tax-year">Upcoming Tax Year</option>
              <option value="recent-changes">Recent Changes</option>
              <option value="evergreen">Evergreen Topics</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleResearch}
          disabled={loading}
          className="w-full bg-[#ff6b35] text-white py-3 rounded-lg hover:bg-[#e55a2b] transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          {loading ? 'Researching...' : 'Find Trending Topics'}
        </button>

        {researchResults.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Research Results</h4>
            {researchResults.map((result, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{result.topic}</h5>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">{result.relevance}% relevant</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{result.impact}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Target className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-500">{result.targetAudience}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {result.keywords.map((keyword, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setActiveTab('writing');
                    // Pass the topic to writing assistant
                  }}
                  className="mt-3 text-sm text-[#ff6b35] hover:text-[#e55a2b] font-medium"
                >
                  Write about this topic →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Writing Tab Component
  const WritingTab = () => {
    const [tone, setTone] = useState('professional');
    const [style, setStyle] = useState('educational');
    const [prompt, setPrompt] = useState('');

    const handleWritingAssist = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/ai/writing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentContent,
            prompt,
            tone,
            style,
            seoOptimization: true,
            targetKeywords: researchResults[0]?.keywords || []
          })
        });
        
        const data = await response.json();
        onContentGenerated(data.content);
      } catch (error) {
        console.error('Writing assistance failed:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">Writing Assistant</h3>
          <p className="text-sm text-purple-700">
            Expert AI trained on top-performing blog content and SEO best practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Writing Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35]"
            >
              <option value="professional">Professional</option>
              <option value="conversational">Conversational</option>
              <option value="authoritative">Authoritative</option>
              <option value="friendly">Friendly & Approachable</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35]"
            >
              <option value="educational">Educational</option>
              <option value="how-to">How-To Guide</option>
              <option value="listicle">Listicle</option>
              <option value="case-study">Case Study</option>
              <option value="news-analysis">News Analysis</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What would you like help with?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., 'Help me write an introduction about the new dividend tax changes' or 'Make this paragraph more engaging'"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6b35]"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setPrompt('Write a compelling introduction')}
            className="text-sm bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
          >
            Introduction
          </button>
          <button
            onClick={() => setPrompt('Add statistics and data')}
            className="text-sm bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
          >
            Add Data
          </button>
          <button
            onClick={() => setPrompt('Create a strong conclusion with CTA')}
            className="text-sm bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
          >
            Conclusion
          </button>
        </div>

        <button
          onClick={handleWritingAssist}
          disabled={loading || !prompt}
          className="w-full bg-[#ff6b35] text-white py-3 rounded-lg hover:bg-[#e55a2b] transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <PenTool className="w-5 h-5" />
          )}
          {loading ? 'Generating...' : 'Generate Content'}
        </button>
      </div>
    );
  };

  // Social Media Tab Component
  const SocialTab = () => {
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin']);
    
    const handleGenerateSocial = async () => {
      if (!currentContent || !postTitle) {
        alert('Please write your blog post first');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/ai/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blogTitle: postTitle,
            blogContent: currentContent,
            platforms: selectedPlatforms,
            businessInfo: {
              name: 'IVC Accounting',
              tagline: 'OTHER ACCOUNTANTS FILE. WE FIGHT.',
              location: 'Halstead, Essex'
            }
          })
        });
        
        const data = await response.json();
        setSocialPosts(data.posts);
        onSocialPostsGenerated(data.posts);
      } catch (error) {
        console.error('Social media generation failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const togglePlatform = (platform: string) => {
      setSelectedPlatforms(prev =>
        prev.includes(platform)
          ? prev.filter(p => p !== platform)
          : [...prev, platform]
      );
    };

    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Social Media Generator</h3>
          <p className="text-sm text-green-700">
            Automatically create platform-optimized social posts from your blog content.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Platforms
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => togglePlatform('linkedin')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedPlatforms.includes('linkedin')
                  ? 'border-[#0077b5] bg-[#0077b5]/10'
                  : 'border-gray-200'
              }`}
            >
              <Linkedin className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">LinkedIn</span>
            </button>
            
            <button
              onClick={() => togglePlatform('instagram')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedPlatforms.includes('instagram')
                  ? 'border-[#E4405F] bg-[#E4405F]/10'
                  : 'border-gray-200'
              }`}
            >
              <Instagram className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">Instagram</span>
            </button>
            
            <button
              onClick={() => togglePlatform('youtube')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedPlatforms.includes('youtube')
                  ? 'border-[#FF0000] bg-[#FF0000]/10'
                  : 'border-gray-200'
              }`}
            >
              <Youtube className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">YouTube</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleGenerateSocial}
          disabled={loading || selectedPlatforms.length === 0 || !currentContent}
          className="w-full bg-[#ff6b35] text-white py-3 rounded-lg hover:bg-[#e55a2b] transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Share2 className="w-5 h-5" />
          )}
          {loading ? 'Generating Posts...' : 'Generate Social Posts'}
        </button>

        {socialPosts.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Generated Posts</h4>
            {socialPosts.map((post, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {post.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-[#0077b5]" />}
                    {post.platform === 'instagram' && <Instagram className="w-5 h-5 text-[#E4405F]" />}
                    {post.platform === 'youtube' && <Youtube className="w-5 h-5 text-[#FF0000]" />}
                    <span className="font-medium capitalize">{post.platform}</span>
                  </div>
                  <button className="text-sm text-[#ff6b35] hover:text-[#e55a2b]">
                    Schedule in Buffer
                  </button>
                </div>
                <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{post.content}</p>
                <div className="flex flex-wrap gap-1">
                  {post.hashtags.map((tag, idx) => (
                    <span key={idx} className="text-xs text-blue-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#ff6b35]" />
          AI Blog Assistant
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('research')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'research'
                ? 'bg-[#ff6b35] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Research
          </button>
          <button
            onClick={() => setActiveTab('writing')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'writing'
                ? 'bg-[#ff6b35] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Writing
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'social'
                ? 'bg-[#ff6b35] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Social Media
          </button>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'research' && <ResearchTab />}
        {activeTab === 'writing' && <WritingTab />}
        {activeTab === 'social' && <SocialTab />}
      </div>
    </div>
  );
} 