'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle } from 'lucide-react';

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'sidebar';
  className?: string;
}

export function NewsletterSignup({ variant = 'inline', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      setError('Please agree to receive communications');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          source: variant,
          consent,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSuccess(true);
      setEmail('');
      setConsent(false);

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`flex items-center space-x-2 text-green-600 ${className}`}>
        <CheckCircle className="h-5 w-5" />
        <span>Successfully subscribed! Check your email to confirm.</span>
      </div>
    );
  }

  const content = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="newsletter-email">Email address</Label>
        <Input
          id="newsletter-email"
          type="email"
          placeholder="james@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={setConsent}
          className="mt-1"
        />
        <Label htmlFor="consent" className="text-sm text-gray-600 cursor-pointer">
          I agree to receive newsletters and marketing communications from IVC Accounting. 
          You can unsubscribe at any time.
        </Label>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <Button 
        type="submit" 
        disabled={loading || !email}
        className="w-full bg-[#ff6b35] hover:bg-[#ff5522]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subscribing...
          </>
        ) : (
          'Subscribe to Newsletter'
        )}
      </Button>
    </form>
  );

  if (variant === 'inline') {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
        <p className="text-sm text-gray-600 mb-4">
          Get the latest tax tips and accounting insights for Essex businesses.
        </p>
        {content}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`border rounded-lg p-4 ${className}`}>
        <h4 className="font-semibold mb-3">Newsletter</h4>
        {content}
      </div>
    );
  }

  return content;
} 