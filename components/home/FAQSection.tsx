// components/home/FAQSection.tsx
'use client'

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Why only 50 clients?",
      answer: "Quality over quantity. With 50 clients, I can personally know each business, understand your challenges, and be there when you need me. You're not getting passed to a junior or lost in a system - you're getting me."
    },
    {
      question: "What makes you different from other accountants?",
      answer: "I've been in your shoes. Built businesses, dealt with PE investors, made tough calls. I don't just file your accounts - I fight for your business. Plus, I actually answer my phone."
    },
    {
      question: "What if I'm not ready for all services?",
      answer: "Start with what you need. Most clients begin with compliance and grow into advisory as their business develops. We'll build a relationship, not force a package."
    },
    {
      question: "How quickly can you respond to urgent matters?",
      answer: "Same day for urgent issues, next day for everything else. When HMRC comes knocking or a deal needs attention, you can't wait a week for a callback."
    },
    {
      question: "Do you work with specific industries?",
      answer: "I work with ambitious business owners across industries. From tech startups to established manufacturers, what matters is your drive to build something real, not your sector."
    },
    {
      question: "What's your experience with PE and exits?",
      answer: "I've been through a PE exit myself - by choice. I know the process inside out, from LOIs to completion. More importantly, I know how to protect your interests when the suits arrive."
    }
  ];

  return (
    <section className="py-24 bg-black relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Real Questions, <span className="text-orange-500">Straight Answers</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              No jargon, no BS. Just honest answers to what matters.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-300"
              >
                <button
                  className="w-full px-8 py-6 text-left flex items-center justify-between group"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-orange-500 transition-colors">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-64' : 'max-h-0'
                  }`}
                >
                  <div className="px-8 pb-6">
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-400 mb-6">
              Got a question that&apos;s not here?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center font-semibold text-orange-500 hover:text-orange-400 transition-colors"
            >
              Let&apos;s talk
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}