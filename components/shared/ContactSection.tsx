'use client'

import { useState } from 'react'
import Button from './Button'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" id="contact">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="text-orange-500">Fight</span> Instead of File?
            </h2>
            
            <div className="space-y-6 text-lg text-gray-300">
              <p>
                Let's have a real conversation. No sales pitch, no jargon, just straight talk 
                about your business and how we can help protect and grow it.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-4">📞</span>
                  <div>
                    <p className="font-semibold text-white">Direct Line</p>
                    <p>Call James directly - no gatekeepers</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-2xl mr-4">📧</span>
                  <div>
                    <p className="font-semibold text-white">james@ivcaccounting.co.uk</p>
                    <p>I read and respond to every email personally</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-2xl mr-4">🗓️</span>
                  <div>
                    <p className="font-semibold text-white">Book a No-BS Call</p>
                    <p>30 minutes, no obligation, real advice</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <Button
                  variant="primary"
                  size="large"
                  href="https://calendly.com/james-ivc/consultation"
                  className="inline-flex items-center"
                >
                  <span className="mr-2">📅</span>
                  Schedule Your Call Now
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="John Smith"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="john@company.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Your Company Ltd"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  How Can We Help?
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  placeholder="Tell us about your business and what you're looking for..."
                  required
                />
              </div>
              
              <Button type="submit" variant="primary" fullWidth>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
} 