'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
  ]

  return (
    <section className="py-20 px-4" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Straight Answers to <span className="text-orange-500">Real Questions</span>
          </h2>
          <p className="text-xl text-gray-300">
            No corporate speak. No jargon. Just honest answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/70 transition-colors"
              >
                <span className="text-lg font-semibold">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-4">Have more questions?</p>
          <a
            href="/ivc/contact"
            className="text-orange-400 font-semibold hover:text-orange-300 transition-colors"
          >
            Let's have a real conversation →
          </a>
        </div>
      </div>
    </section>
  )
} 