'use client';

import { useRouter } from 'next/navigation';
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
  Mail,
  Key
} from 'lucide-react';

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Debug logging
  console.log('AdminSidebar rendered at:', pathname);

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
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: Settings,
      subItems: [
        { name: 'General', href: '/admin/settings' },
        { name: 'Email', href: '/admin/settings/email', icon: Mail },
        { name: 'Media', href: '/admin/settings/media' },
        { name: 'API Keys', href: '/admin/settings/api-keys', icon: Key }
      ]
    },
  ];

  const handleNavigation = (href: string) => {
    console.log('Navigating to:', href);
    router.push(href);
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white shadow-md h-full">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <div key={item.name}>
              <button
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  active
                    ? 'bg-[#ff6b35] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </button>
              
              {/* Sub-items for Settings */}
              {item.subItems && active && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.name}
                      onClick={() => handleNavigation(subItem.href)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-left ${
                        pathname === subItem.href
                          ? 'bg-[#ff6b35]/10 text-[#ff6b35]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {subItem.icon && <subItem.icon className="h-4 w-4" />}
                      <span>{subItem.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
} 