'use client';

import { useState } from 'react';
import { 
  Loader2, 
  Share2, 
  Copy, 
  Check,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { blogAIService } from '@/lib/services/blogAIService';
import toast from 'react-hot-toast';

interface SocialMediaGeneratorProps {
  postTitle: string;
  postContent: string;
  postUrl: string;
  onClose?: () => void;
}

export default function SocialMediaGenerator({
  postTitle,
  postContent,
  postUrl,
  onClose
}: SocialMediaGeneratorProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin']);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [scheduling, setScheduling] = useState(false);

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-[#0077b5]' },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'text-black' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-[#E4405F]' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-[#1877f2]' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-[#FF0000]' }
  ];

  const handleGenerate = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    setLoading(true);
    try {
      const posts = await blogAIService.generateSocialMediaPosts(
        postTitle,
        postContent,
        postUrl,
        selectedPlatforms
      );
      
      setGeneratedPosts(posts);
      toast.success('Social media posts generated!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate posts');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success('Copied to clipboard');
  };

  const schedulePost = async (post: any) => {
    setScheduling(true);
    try {
      // This would integrate with your social media scheduling service
      console.log('Scheduling post:', post);
      toast.success('Post scheduled successfully');
    } catch (error) {
      toast.error('Failed to schedule post');
    } finally {
      setScheduling(false);
    }
  };

  const publishNow = async (post: any) => {
    setScheduling(true);
    try {
      // This would integrate with your social media publishing service
      console.log('Publishing post:', post);
      toast.success('Post published successfully');
    } catch (error) {
      toast.error('Failed to publish post');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Share2 className="w-6 h-6 text-[#ff6b35]" />
          Social Media Generator
        </h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        )}
      </div>

      {/* Platform Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Platforms
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {platforms.map(platform => (
            <button
              key={platform.id}
              onClick={() => {
                setSelectedPlatforms(prev =>
                  prev.includes(platform.id)
                    ? prev.filter(p => p !== platform.id)
                    : [...prev, platform.id]
                );
              }}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedPlatforms.includes(platform.id)
                  ? 'border-[#ff6b35] bg-[#ff6b35]/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <platform.icon className={`w-6 h-6 mx-auto mb-1 ${platform.color}`} />
              <span className="text-xs">{platform.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || selectedPlatforms.length === 0}
        className="w-full bg-[#ff6b35] text-white py-3 rounded-lg hover:bg-[#e55a2b] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Posts...
          </>
        ) : (
          <>
            <Share2 className="w-5 h-5" />
            Generate Social Posts
          </>
        )}
      </button>

      {/* Generated Posts */}
      {generatedPosts.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Generated Posts</h3>
          
          {generatedPosts.map((post, index) => {
            const platform = platforms.find(p => p.id === post.platform);
            if (!platform) return null;
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <platform.icon className={`w-5 h-5 ${platform.color}`} />
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(post.content, index)}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => schedulePost(post)}
                      disabled={scheduling}
                      className="text-sm text-[#4a90e2] hover:text-[#3a7bc8]"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
                  {post.content}
                </p>
                
                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.hashtags.map((tag: string, idx: number) => (
                      <span key={idx} className="text-xs text-[#4a90e2]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {post.imagePrompt && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    <ImageIcon className="w-3 h-3 inline mr-1" />
                    Image suggestion: {post.imagePrompt}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 