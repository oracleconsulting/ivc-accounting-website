'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  FolderOpen, 
  Tag, 
  Users, 
  Settings,
  Share2,
  Rss,
  Database,
  BarChart3,
  Mail
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'All Posts', href: '/admin/posts', icon: FileText },
    { name: 'New Post', href: '/admin/posts/new', icon: Plus },
    { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
    { name: 'Tags', href: '/admin/tags', icon: Tag },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Social Media', href: '/admin/social', icon: Share2 },
    { name: 'RSS/News', href: '/admin/news', icon: Rss },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Database', href: '/admin/database', icon: Database },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white shadow-md">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-[#ff6b35] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 