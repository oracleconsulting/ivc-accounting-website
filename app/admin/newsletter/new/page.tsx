'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const NewsletterEditor = dynamic(
  () => import('@/components/admin/NewsletterEditor'),
  { ssr: false }
);

export default function NewNewsletterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/newsletter"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#1a2b4a]">Create Newsletter</h1>
        </div>
      </div>
      
      <NewsletterEditor />
    </div>
  );
} 