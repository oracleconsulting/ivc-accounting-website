// FILE: components/admin/SocialPostComposer.tsx
// Social post composer component

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Image, 
  Hash, 
  Clock, 
  Send,
  Save,
  Eye,
  Copy
} from 'lucide-react';

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  profileUrl: string;
}

interface SocialPostComposerProps {
  platforms: SocialPlatform[];
}

export function SocialPostComposer({ platforms }: SocialPostComposerProps) {
  const [content, setContent] = useState({
    linkedin: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: ''
  });
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [images, setImages] = useState<File[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [currentHashtag, setCurrentHashtag] = useState('');

  // Character limits per platform
  const limits = {
    linkedin: 3000,
    instagram: 2200,
    twitter: 280,
    youtube: 5000,
    tiktok: 2200
  };

  const addHashtag = () => {
    if (currentHashtag && !hashtags.includes(currentHashtag)) {
      setHashtags([...hashtags, currentHashtag]);
      setCurrentHashtag('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handlePublish = async () => {
    // Implementation for publishing posts
    console.log('Publishing posts:', {
      content,
      selectedPlatforms,
      scheduledDate,
      scheduledTime,
      images,
      hashtags
    });
  };

  const handleSchedule = async () => {
    // Implementation for scheduling posts
    console.log('Scheduling posts:', {
      content,
      selectedPlatforms,
      scheduledDate,
      scheduledTime,
      images,
      hashtags
    });
  };

  return (
    <div className="space-y-6">
      {/* Platform Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Platforms</h3>
        <div className="flex flex-wrap gap-2">
          {platforms.map(platform => (
            <Button
              key={platform.id}
              variant={selectedPlatforms.includes(platform.id) ? 'default' : 'outline'}
              onClick={() => {
                setSelectedPlatforms(prev =>
                  prev.includes(platform.id)
                    ? prev.filter(p => p !== platform.id)
                    : [...prev, platform.id]
                );
              }}
              disabled={!platform.connected}
              className="flex items-center gap-2"
            >
              {platform.icon}
              {platform.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Content Editor */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Content</h3>
        
        <Tabs defaultValue="linkedin">
          <TabsList>
            {selectedPlatforms.map(platform => (
              <TabsTrigger key={platform} value={platform}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {selectedPlatforms.map(platform => (
            <TabsContent key={platform} value={platform}>
              <div className="space-y-4">
                <div>
                  <Textarea
                    value={content[platform as keyof typeof content]}
                    onChange={(e) => setContent({ ...content, [platform]: e.target.value })}
                    placeholder={`Write your ${platform} post...`}
                    rows={6}
                    maxLength={limits[platform as keyof typeof limits]}
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-500">
                      {content[platform as keyof typeof content].length} / {limits[platform as keyof typeof limits]} characters
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(content[platform as keyof typeof content])}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Platform-specific features */}
                {platform === 'instagram' && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Drop images here or click to upload</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                        Upload Images
                      </label>
                    </div>
                  </div>
                )}
                
                {platform === 'twitter' && content[platform as keyof typeof content].length > 280 && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    This will be posted as a thread ({Math.ceil(content[platform as keyof typeof content].length / 280)} tweets)
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Hashtags */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hashtags</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={currentHashtag}
              onChange={(e) => setCurrentHashtag(e.target.value)}
              placeholder="Add hashtag..."
              onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
            />
            <Button onClick={addHashtag} variant="outline">
              <Hash className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map(tag => (
              <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeHashtag(tag)}>
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Scheduling */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <Calendar
              value={scheduledDate || undefined}
              onSelect={setScheduledDate}
              className="rounded-md border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <Input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
        </div>
        <div className="flex gap-2">
          {scheduledDate ? (
            <Button onClick={handleSchedule}>
              <Clock className="mr-2 h-4 w-4" />
              Schedule Post
            </Button>
          ) : (
            <Button onClick={handlePublish}>
              <Send className="mr-2 h-4 w-4" />
              Publish Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 