'use client'

import { useState } from 'react'
import Button from './Button'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // TODO: Implement actual form submission
    console.log('Form submitted:', formData)
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitMessage('Thanks for your message! I\'ll get back to you within 24 hours.')
      setFormData({ name: '', email: '', company: '', message: '' })
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000)
    }, 1000)
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
      {submitMessage && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
          <p className="text-green-400">{submitMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Your Name *
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
            Email Address *
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
            How Can We Help? *
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
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
        
        <p className="text-sm text-gray-500 text-center">
          * Required fields. We'll respond within 24 hours.
        </p>
      </form>
    </div>
  )
} 