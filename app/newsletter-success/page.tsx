'use client';

import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function NewsletterSuccessContent() {
  const searchParams = useSearchParams();
  const alreadySubscribed = searchParams.get('already') === 'true';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">
          {alreadySubscribed ? 'Already Subscribed!' : 'Success!'}
        </h1>
        <p className="text-gray-600 mb-6">
          {alreadySubscribed 
            ? "You're already subscribed to our newsletter."
            : "You've successfully confirmed your subscription to the IVC Accounting newsletter."}
        </p>
        <div className="space-y-4">
          <p className="text-sm">
            You'll receive our next newsletter on Tuesday with valuable tax tips and accounting insights.
          </p>
          <Link href="/blog">
            <Button className="w-full">
              Read Our Latest Articles
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function NewsletterSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <NewsletterSuccessContent />
    </Suspense>
  );
} 