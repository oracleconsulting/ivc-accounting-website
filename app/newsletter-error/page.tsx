'use client';

import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function NewsletterErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages = {
    'invalid-token': 'The confirmation link is invalid or has expired.',
    'server-error': 'Something went wrong. Please try again later.',
    'already-unsubscribed': "You've already unsubscribed from our newsletter."
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Oops!</h1>
        <p className="text-gray-600 mb-6">
          {errorMessages[error as keyof typeof errorMessages] || 'An unexpected error occurred.'}
        </p>
        <div className="space-y-4">
          <p className="text-sm">
            If you continue to have issues, please contact us at{' '}
            <a href="mailto:hello@ivcaccounting.co.uk" className="text-blue-600 underline">
              hello@ivcaccounting.co.uk
            </a>
          </p>
          <Link href="/">
            <Button className="w-full">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 