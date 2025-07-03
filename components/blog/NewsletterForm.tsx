'use client';

import { useAnalytics } from '@/hooks/useAnalytics';

export default function NewsletterForm() {
  const { trackDoc } = useAnalytics();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackDoc('newsletter_signup_blog');
    // Add newsletter signup logic here
  };

  return (
    <section className="py-16 bg-[#1a2b4a]">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl font-black uppercase text-[#f5f1e8] mb-4">
          GET INSIGHTS <span className="text-[#ff6b35]">FIRST</span>
        </h2>
        <p className="text-[#f5f1e8]/80 mb-8 max-w-2xl mx-auto">
          Join our fight. Get expert insights and actionable advice delivered straight to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="Your email address"
            className="px-6 py-3 bg-white border-2 border-[#ff6b35] text-[#1a2b4a] placeholder-[#1a2b4a]/50 focus:outline-none focus:border-[#e55a2b] min-w-[300px]"
            required
          />
          <button
            type="submit"
            className="bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8] font-black uppercase px-8 py-3 transition-all hover:translate-x-1"
          >
            JOIN THE FIGHT →
          </button>
        </form>
        
        <p className="text-[#f5f1e8]/60 text-sm mt-4">
          No spam. No fluff. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
} 