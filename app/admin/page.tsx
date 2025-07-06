import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { 
  FileText, 
  Eye, 
  Clock, 
  TrendingUp,
  Plus,
  Edit,
  Calendar,
  Share2,
  Rss,
  BarChart3,
  Database,
  Settings,
  Mail,
  Key
} from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies });
  
  // Get post statistics
  const { data: posts } = await supabase
    .from('posts')
    .select('status, view_count, created_at');
    
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = {
    total: posts?.length || 0,
    published: posts?.filter(p => p.status === 'published').length || 0,
    drafts: posts?.filter(p => p.status === 'draft').length || 0,
    totalViews: posts?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#1a2b4a] mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your blog content and track performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-3xl font-black text-[#1a2b4a]">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-[#ff6b35]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-3xl font-black text-green-600">{stats.published}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-3xl font-black text-yellow-600">{stats.drafts}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-3xl font-black text-[#4a90e2]">{stats.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-[#4a90e2]" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-[#1a2b4a] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-3 p-3 bg-[#ff6b35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create New Post</span>
            </Link>
            
            <Link
              href="/admin/posts"
              className="flex items-center gap-3 p-3 bg-[#4a90e2] text-white rounded-lg hover:bg-[#3a7bc8] transition-colors"
            >
              <Edit className="w-5 h-5" />
              <span className="font-medium">Manage Posts</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-[#1a2b4a] mb-4">Recent Posts</h3>
          <div className="space-y-3">
            {recentPosts?.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-[#1a2b4a] line-clamp-1">{post.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  post.status === 'published' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.status}
                </span>
              </div>
            ))}
            
            {(!recentPosts || recentPosts.length === 0) && (
              <p className="text-gray-500 text-center py-4">No posts yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Comprehensive Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-semibold mb-4">Content Management</h3>
          <div className="space-y-2">
            <Link href="/admin/posts/new" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Plus className="h-4 w-4" />
              Create New Post
            </Link>
            <Link href="/admin/social" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Share2 className="h-4 w-4" />
              Schedule Social Media
            </Link>
            <Link href="/admin/news" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Rss className="h-4 w-4" />
              Monitor RSS Feeds
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-semibold mb-4">Analytics & Reports</h3>
          <div className="space-y-2">
            <Link href="/admin/analytics" className="flex items-center gap-2 text-blue-600 hover:underline">
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Link>
            <Link href="/admin/database" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Database className="h-4 w-4" />
              Database Management
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-semibold mb-4">Configuration</h3>
          <div className="space-y-2">
            <Link href="/admin/settings" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Settings className="h-4 w-4" />
              General Settings
            </Link>
            <Link href="/admin/settings/email" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Mail className="h-4 w-4" />
              Email Configuration
            </Link>
            <Link href="/admin/settings/api-keys" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Key className="h-4 w-4" />
              API Keys
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 