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
    <section className="py-24 relative overflow-hidden" id="faq">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Straight Answers to <span className="text-orange-500">Real Questions</span>
          </h2>
          <p className="text-xl text-gray-300">
            No corporate speak. No jargon. Just honest answers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="group">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-left hover:border-orange-500/50 transition-all duration-300 group"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-orange-500 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} />
                </div>
                {openIndex === index && (
                  <div className="mt-4 text-gray-300 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-300 mb-4">Have more questions?</p>
          <Link href="/contact" className="text-orange-500 hover:text-orange-400 font-semibold transition-colors inline-flex items-center group">
            Let&apos;s have a real conversation 
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}