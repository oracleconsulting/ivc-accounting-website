// FILE: app/admin/news/page.tsx
// RSS/News management page

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the existing RSS page
    router.replace('/admin/rss');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6b35] mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to RSS management...</p>
      </div>
    </div>
  );
} 