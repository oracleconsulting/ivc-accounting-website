'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Edit, 
  Trash2, 
  Eye,
  Share2
} from 'lucide-react';

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledAt: Date;
  status: 'scheduled' | 'published' | 'failed';
  images?: string[];
}

interface SocialCalendarProps {
  scheduledPosts: ScheduledPost[];
}

export function SocialCalendar({ scheduledPosts }: SocialCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const postsForSelectedDate = scheduledPosts.filter(post => {
    const postDate = new Date(post.scheduledAt);
    return selectedDate && 
           postDate.getDate() === selectedDate.getDate() &&
           postDate.getMonth() === selectedDate.getMonth() &&
           postDate.getFullYear() === selectedDate.getFullYear();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleEditPost = (postId: string) => {
    // Implementation for editing post
    console.log('Edit post:', postId);
  };

  const handleDeletePost = (postId: string) => {
    // Implementation for deleting post
    console.log('Delete post:', postId);
  };

  const handlePreviewPost = (post: ScheduledPost) => {
    // Implementation for previewing post
    console.log('Preview post:', post);
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            onClick={() => setView('calendar')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
          >
            <Clock className="mr-2 h-4 w-4" />
            List View
          </Button>
        </div>
      </div>

      {view === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <Calendar
              value={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>

          {/* Posts for Selected Date */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Posts for {selectedDate?.toLocaleDateString()}
              </h3>
              
              {postsForSelectedDate.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">No posts scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {postsForSelectedDate.map(post => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(post.status)}>
                            {post.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(post.scheduledAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreviewPost(post)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPost(post.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">
                        {post.content.substring(0, 100)}...
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-gray-400" />
                        <div className="flex gap-1">
                          {post.platforms.map(platform => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        /* List View */
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">All Scheduled Posts</h3>
          
          <div className="space-y-4">
            {scheduledPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">No posts scheduled</p>
              </div>
            ) : (
              scheduledPosts.map(post => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(post.scheduledAt).toLocaleDateString()} at{' '}
                        {new Date(post.scheduledAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePreviewPost(post)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPost(post.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">
                    {post.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-gray-400" />
                    <div className="flex gap-1">
                      {post.platforms.map(platform => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
} 