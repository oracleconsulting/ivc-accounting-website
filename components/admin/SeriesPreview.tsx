// /components/admin/SeriesPreview.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram,
  Edit2,
  Save,
  X,
  Calendar,
  Hash,
  Image,
  ChevronLeft,
  ChevronRight,
  Eye,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface SeriesPreviewProps {
  campaignId: string;
  socialSeries: any;
  onUpdate?: (platform: string, updatedSeries: any) => void;
  editable?: boolean;
}

export function SeriesPreview({ 
  campaignId, 
  socialSeries, 
  onUpdate,
  editable = true 
}: SeriesPreviewProps) {
  const [editingPost, setEditingPost] = useState<{ platform: string; index: number } | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [copiedPost, setCopiedPost] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleEdit = (platform: string, index: number, content: string) => {
    setEditingPost({ platform, index });
    setEditedContent(content);
  };

  const handleSave = () => {
    if (!editingPost || !onUpdate) return;

    const updatedSeries = { ...socialSeries[editingPost.platform] };
    
    if (editingPost.platform === 'linkedin') {
      updatedSeries.posts[editingPost.index].content = editedContent;
    } else if (editingPost.platform === 'twitter') {
      updatedSeries.tweets[editingPost.index].content = editedContent;
    } else if (editingPost.platform === 'facebook') {
      updatedSeries.posts[editingPost.index].content = editedContent;
    } else if (editingPost.platform === 'instagram') {
      updatedSeries.slides[editingPost.index].caption = editedContent;
    }

    onUpdate(editingPost.platform, updatedSeries);
    setEditingPost(null);
    toast.success('Post updated');
  };

  const handleCancel = () => {
    setEditingPost(null);
    setEditedContent('');
  };

  const copyToClipboard = (text: string, postId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPost(postId);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedPost(null), 2000);
  };

  const getCharacterCount = (text: string, platform: string) => {
    const limits = {
      twitter: 280,
      linkedin: 1300,
      facebook: 63206,
      instagram: 2200
    };
    const limit = limits[platform as keyof typeof limits] || 0;
    const count = text.length;
    const percentage = (count / limit) * 100;
    
    return {
      count,
      limit,
      percentage,
      isOver: count > limit
    };
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="linkedin" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="linkedin" className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center gap-2">
            <Twitter className="w-4 h-4" />
            Twitter
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Facebook className="w-4 h-4" />
            Facebook
          </TabsTrigger>
          <TabsTrigger value="instagram" className="flex items-center gap-2">
            <Instagram className="w-4 h-4" />
            Instagram
          </TabsTrigger>
        </TabsList>

        {/* LinkedIn Series Preview */}
        <TabsContent value="linkedin" className="space-y-4">
          {socialSeries.linkedin && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>LinkedIn 5-Part Series</span>
                    <Badge variant="secondary">{socialSeries.linkedin.theme}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Hook:</strong> {socialSeries.linkedin.hook}
                  </p>
                  
                  <div className="space-y-4">
                    {socialSeries.linkedin.posts.map((post: any, index: number) => {
                      const isEditing = editingPost?.platform === 'linkedin' && editingPost?.index === index;
                      const charCount = getCharacterCount(post.content, 'linkedin');
                      const postId = `linkedin-${index}`;
                      
                      return (
                        <Card key={index} className="border">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">Post {index + 1}/5</Badge>
                              <div className="flex items-center gap-2">
                                {post.scheduled_for && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {format(new Date(post.scheduled_for), 'MMM d, h:mm a')}
                                  </Badge>
                                )}
                                {editable && !isEditing && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEdit('linkedin', index, post.content)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(post.content, postId)}
                                >
                                  {copiedPost === postId ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {isEditing ? (
                              <div className="space-y-3">
                                <Textarea
                                  value={editedContent}
                                  onChange={(e) => setEditedContent(e.target.value)}
                                  rows={6}
                                  className={charCount.isOver ? 'border-red-500' : ''}
                                />
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${charCount.isOver ? 'text-red-600' : 'text-gray-500'}`}>
                                    {charCount.count}/{charCount.limit} characters
                                  </span>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={handleCancel}>
                                      <X className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" onClick={handleSave}>
                                      <Save className="w-4 h-4 mr-2" />
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="whitespace-pre-wrap">{post.content}</p>
                                <div className="mt-3 flex items-center justify-between">
                                  <div className="flex flex-wrap gap-2">
                                    {post.hashtags.map((tag: string, i: number) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        <Hash className="w-3 h-3 mr-1" />
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {charCount.count} characters
                                  </span>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Twitter Thread Preview */}
        <TabsContent value="twitter" className="space-y-4">
          {socialSeries.twitter && (
            <Card>
              <CardHeader>
                <CardTitle>Twitter Thread ({socialSeries.twitter.tweets.length} tweets)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Opener:</strong> {socialSeries.twitter.opener}
                </p>
                
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {socialSeries.twitter.tweets.map((tweet: any, index: number) => {
                      const isEditing = editingPost?.platform === 'twitter' && editingPost?.index === index;
                      const charCount = getCharacterCount(tweet.content, 'twitter');
                      const tweetId = `twitter-${index}`;
                      
                      return (
                        <Card key={index} className="border">
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                {tweet.order}/{socialSeries.twitter.tweets.length}
                              </Badge>
                              <div className="flex gap-1">
                                {editable && !isEditing && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEdit('twitter', index, tweet.content)}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(tweet.content, tweetId)}
                                >
                                  {copiedPost === tweetId ? (
                                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            {isEditing ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editedContent}
                                  onChange={(e) => setEditedContent(e.target.value)}
                                  rows={3}
                                  className={charCount.isOver ? 'border-red-500' : ''}
                                />
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs ${charCount.isOver ? 'text-red-600' : 'text-gray-500'}`}>
                                    {charCount.count}/{charCount.limit}
                                  </span>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={handleCancel}>
                                      Cancel
                                    </Button>
                                    <Button size="sm" onClick={handleSave}>
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm">{tweet.content}</p>
                                <div className="mt-2 flex justify-between items-center">
                                  <span className="text-xs text-gray-500">
                                    {charCount.count} characters
                                  </span>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                    
                    {/* CTA Tweet */}
                    <Card className="border border-purple-200 bg-purple-50">
                      <CardContent className="pt-4">
                        <Badge variant="secondary" className="mb-2">CTA</Badge>
                        <p className="text-sm font-medium">{socialSeries.twitter.cta}</p>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Facebook Posts Preview */}
        <TabsContent value="facebook" className="space-y-4">
          {socialSeries.facebook && (
            <Card>
              <CardHeader>
                <CardTitle>Facebook Posts ({socialSeries.facebook.posts.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialSeries.facebook.posts.map((post: any, index: number) => {
                  const isEditing = editingPost?.platform === 'facebook' && editingPost?.index === index;
                  const postId = `facebook-${index}`;
                  
                  return (
                    <Card key={index} className="border">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{post.type}</Badge>
                            {post.scheduled_for && (
                              <Badge variant="secondary" className="text-xs">
                                <Calendar className="w-3 h-3 mr-1" />
                                {format(new Date(post.scheduled_for), 'MMM d')}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {editable && !isEditing && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit('facebook', index, post.content)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(post.content, postId)}
                            >
                              {copiedPost === postId ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              rows={4}
                            />
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={handleCancel}>
                                Cancel
                              </Button>
                              <Button size="sm" onClick={handleSave}>
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="whitespace-pre-wrap">{post.content}</p>
                            {post.cta_button && (
                              <Button className="mt-3" variant="outline" size="sm">
                                {post.cta_button}
                              </Button>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Instagram Carousel Preview */}
        <TabsContent value="instagram" className="space-y-4">
          {socialSeries.instagram && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Instagram Carousel ({socialSeries.instagram.slides.length} slides)</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Carousel Preview */}
                  <div className="mb-6">
                    <div className="relative bg-gray-100 rounded-lg aspect-square max-w-md mx-auto">
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="text-center space-y-4">
                          <Image className="w-16 h-16 mx-auto text-gray-400" />
                          <div>
                            <h4 className="font-medium mb-2">
                              Slide {currentSlide + 1}: {socialSeries.instagram.slides[currentSlide].order}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {socialSeries.instagram.slides[currentSlide].image_prompt}
                            </p>
                          </div>
                          <Card className="border p-4">
                            <p className="text-sm">
                              {socialSeries.instagram.slides[currentSlide].caption}
                            </p>
                          </Card>
                        </div>
                      </div>
                      
                      {/* Navigation */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-2 top-1/2 -translate-y-1/2"
                        onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                        disabled={currentSlide === 0}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setCurrentSlide(Math.min(socialSeries.instagram.slides.length - 1, currentSlide + 1))}
                        disabled={currentSlide === socialSeries.instagram.slides.length - 1}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                      
                      {/* Slide indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {socialSeries.instagram.slides.map((_: any, index: number) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentSlide ? 'bg-purple-600' : 'bg-gray-300'
                            }`}
                            onClick={() => setCurrentSlide(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Main Caption */}
                  <Card className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Main Caption</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(
                            `${socialSeries.instagram.main_caption}\n\n${socialSeries.instagram.hashtags.map((h: string) => `#${h}`).join(' ')}`,
                            'instagram-caption'
                          )}
                        >
                          {copiedPost === 'instagram-caption' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap mb-3">{socialSeries.instagram.main_caption}</p>
                      <div className="flex flex-wrap gap-2">
                        {socialSeries.instagram.hashtags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            <Hash className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}