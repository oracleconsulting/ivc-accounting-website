'use client';

import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  notIncluded: string[];
  cta: string;
  ctaLink: string;
  featured?: boolean;
}

interface PricingCardProps {
  tier: PricingTier;
  featured?: boolean;
}

export default function PricingCard({ tier, featured }: PricingCardProps) {
  const { trackPricing, trackBooking } = useAnalytics();

  const handleClick = () => {
    trackPricing(tier.name);
    trackBooking(`pricing_${tier.name.toLowerCase().replace(/\s+/g, '_')}`);
  };

  return (
    <div className={`relative group ${featured ? 'scale-105' : ''}`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#ff6b35] text-[#f5f1e8] px-4 py-1 font-black uppercase text-sm">
          MOST POPULAR
        </div>
      )}
      
      {/* Offset Border */}
      <div className={`absolute -top-2 -left-2 w-full h-full border-2 ${featured ? 'border-[#ff6b35]' : 'border-[#4a90e2]'} group-hover:translate-x-1 group-hover:translate-y-1 transition-transform`} />
      
      <div className="relative bg-white border-2 border-[#1a2b4a] p-8 h-full flex flex-col">
        <div className="mb-6">
          <h3 className="text-2xl font-black uppercase text-[#1a2b4a] mb-2">
            {tier.name}
          </h3>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-black text-[#1a2b4a]">£{tier.price}</span>
            <span className="text-lg text-[#1a2b4a]/70">/month</span>
          </div>
          <p className="text-[#1a2b4a]/80">{tier.description}</p>
        </div>

        <div className="space-y-4 mb-8 flex-1">
          <div>
            <h4 className="font-bold uppercase text-[#1a2b4a] mb-3">INCLUDED:</h4>
            <ul className="space-y-2">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1a2b4a]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {tier.notIncluded.length > 0 && (
            <div>
              <h4 className="font-bold uppercase text-[#1a2b4a]/60 mb-3">NOT INCLUDED:</h4>
              <ul className="space-y-2">
                {tier.notIncluded.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 opacity-50">
                    <X className="w-5 h-5 text-[#1a2b4a]/40 flex-shrink-0 mt-0.5" />
                    <span className="text-[#1a2b4a]/60">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Link href={tier.ctaLink} onClick={handleClick}>
          <button className={`w-full font-black uppercase px-6 py-4 text-lg transition-all hover:translate-x-1 ${
            featured 
              ? 'bg-[#ff6b35] hover:bg-[#e55a2b] text-[#f5f1e8]' 
              : 'border-2 border-[#1a2b4a] text-[#1a2b4a] hover:bg-[#1a2b4a] hover:text-[#f5f1e8]'
          }`}>
            {tier.cta}
          </button>
        </Link>
      </div>
    </div>
  );
} 