'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  Plus, 
  Settings, 
  BarChart3, 
  Users, 
  Tag,
  FolderOpen
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: BarChart3
    },
    {
      href: '/admin/posts',
      label: 'All Posts',
      icon: FileText
    },
    {
      href: '/admin/posts/new',
      label: 'New Post',
      icon: Plus
    },
    {
      href: '/admin/categories',
      label: 'Categories',
      icon: FolderOpen
    },
    {
      href: '/admin/tags',
      label: 'Tags',
      icon: Tag
    },
    {
      href: '/admin/users',
      label: 'Users',
      icon: Users
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-[#ff6b35] text-white' 
                      : 'text-[#1a2b4a] hover:bg-[#f5f1e8]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
} 