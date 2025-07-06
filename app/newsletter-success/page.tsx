'use client';

import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function NewsletterSuccessPage() {
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