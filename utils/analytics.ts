// Analytics event tracking utility

interface AnalyticsEvent {
  event_category: string
  event_label: string
  value?: number
}

// Declare gtag as a global function
declare global {
  interface Window {
    gtag: (command: string, action: string, params: AnalyticsEvent) => void
  }
}

// Track pricing page views
export const trackPricingView = (tierName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_pricing', {
      event_category: 'engagement',
      event_label: tierName
    })
  }
}

// Track contact form/Calendly clicks
export const trackBookingStart = (source: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_booking', {
      event_category: 'conversion',
      event_label: `${source}_click`
    })
  }
}

// Track tool usage
export const trackToolUsage = (toolName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'use_tool', {
      event_category: 'engagement',
      event_label: toolName
    })
  }
}

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_submission', {
      event_category: 'conversion',
      event_label: `${formName}_${success ? 'success' : 'failure'}`
    })
  }
}

// Track document downloads
export const trackDownload = (documentName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'download', {
      event_category: 'engagement',
      event_label: documentName
    })
  }
}

// Track social proof interactions
export const trackSocialProof = (messageType: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'social_proof_interaction', {
      event_category: 'engagement',
      event_label: messageType
    })
  }
}

// Track navigation events
export const trackNavigation = (destination: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'navigation', {
      event_category: 'engagement',
      event_label: destination
    })
  }
}

// Track scroll depth
export const trackScrollDepth = (depth: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'scroll_depth', {
      event_category: 'engagement',
      event_label: `${depth}%`,
      value: depth
    })
  }
}

// Track time on page
export const trackTimeOnPage = (seconds: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'time_on_page', {
      event_category: 'engagement',
      event_label: `${Math.floor(seconds / 60)}min`,
      value: seconds
    })
  }
} 