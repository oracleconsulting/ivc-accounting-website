'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  created_at: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data.posts || data); // Handle both {posts: [...]} and [...] formats
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setPosts(posts.filter(p => p.id !== postId));
        alert('Post deleted successfully');
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#1a2b4a] mb-2">All Posts</h1>
          <p className="text-gray-600">Manage your blog content</p>
        </div>
        
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#ff6b35] text-white font-bold hover:bg-[#e55a2b] transition-colors rounded"
        >
          <Plus className="w-5 h-5" />
          New Post
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading posts: {error}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first blog post.</p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6b35] text-white font-bold hover:bg-[#e55a2b] transition-colors rounded"
            >
              <Plus className="w-5 h-5" />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a2b4a] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-[#1a2b4a]">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {post.slug}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="text-[#4a90e2] hover:text-[#3a7bc8] transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        
                        {post.status === 'published' && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="text-green-600 hover:text-green-700 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        
                        <button
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Delete"
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this post?')) {
                              try {
                                const response = await fetch(`/api/admin/posts/${post.id}`, {
                                  method: 'DELETE',
                                });
                                
                                if (response.ok) {
                                  // Refresh the page to update the list
                                  window.location.reload();
                                } else {
                                  alert('Failed to delete post');
                                }
                              } catch (error) {
                                console.error('Error deleting post:', error);
                                alert('Error deleting post');
                              }
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}