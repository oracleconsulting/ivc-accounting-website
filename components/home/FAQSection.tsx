// components/home/FAQSection.tsx
'use client'

import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Why only 50 clients?",
      answer: "Because real service takes time. I'd rather do exceptional work for 50 businesses than mediocre work for 500. Every client gets my personal attention, not passed to a junior."
    },
    {
      question: "What makes you different from other accountants?",
      answer: "I've been through 3 PE acquisitions myself. I know the pressure, the negotiations, the sleepless nights. When I say 'we fight', I mean it - I've been in the trenches."
    },
    {
      question: "Do you work with startups or just established businesses?",
      answer: "Both. Whether you're just starting out or preparing for exit, we provide the same personal service. The key is you're serious about building something real."
    },
    {
      question: "What if I already have an accountant?",
      answer: "No problem. We'll handle the transition smoothly. Most clients switch because they're tired of being a number. If you want someone who actually cares about your business, let's talk."
    },
    {
      question: "How do you handle PE negotiations?",
      answer: "With experience and aggression. I've been on both sides of the table. I know their tactics, their pressure points, and how to protect your interests. This isn't theoretical - it's personal."
    },
    {
      question: "What's your pricing structure?",
      answer: "Transparent and fair. No hidden fees, no surprise bills. We'll agree everything upfront. Quality service costs more than a box-ticker, but the value is incomparable."
    }
  ];

  return (
    <section className="py-24 bg-[#1a2b4a] relative overflow-hidden" id="faq">
      {/* Geometric Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
        <div className="grid grid-cols-8 gap-2">
          {[...Array(64)].map((_, i) => (
            <div key={i} className={`w-2 h-2 ${i % 3 === 0 ? 'bg-[#ff6b35]' : 'bg-[#4a90e2]'}`} />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-[#f5f1e8] mb-6">
            STRAIGHT ANSWERS TO <span className="text-[#ff6b35]">REAL QUESTIONS</span>
          </h2>
          <p className="text-xl text-[#f5f1e8]/80">
            No corporate speak. No jargon. Just honest answers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="group">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full bg-[#f5f1e8]/5 backdrop-blur-sm border border-[#f5f1e8]/20 p-6 text-left hover:border-[#ff6b35]/50 transition-all duration-300 group"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold uppercase text-[#f5f1e8] pr-4">{faq.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-[#ff6b35] transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} />
                </div>
                {openIndex === index && (
                  <div className="mt-4 text-[#f5f1e8]/80 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-[#f5f1e8]/60 mb-4">Have more questions?</p>
          <Link href="/contact" className="inline-flex items-center font-bold uppercase text-[#ff6b35] hover:text-[#f5f1e8] transition-colors group">
            Let's have a real conversation 
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}