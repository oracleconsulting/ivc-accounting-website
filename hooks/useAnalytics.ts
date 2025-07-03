import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import {
  trackPricingView,
  trackBookingStart,
  trackToolUsage,
  trackFormSubmission,
  trackDownload,
  trackSocialProof,
  trackNavigation,
  trackScrollDepth,
  trackTimeOnPage
} from '@/utils/analytics'

export function useAnalytics() {
  const pathname = usePathname()

  // Track page views and time on page
  useEffect(() => {
    let startTime = Date.now()

    // Track navigation
    trackNavigation(pathname)

    // Set up scroll tracking
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrollPosition = window.scrollY
      const scrollPercentage = Math.round((scrollPosition / docHeight) * 100)

      if (scrollPercentage % 25 === 0) { // Track at 25%, 50%, 75%, 100%
        trackScrollDepth(scrollPercentage)
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Track time on page when leaving
    const handleBeforeUnload = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      trackTimeOnPage(timeSpent)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      trackTimeOnPage(timeSpent)
    }
  }, [pathname])

  // Expose tracking functions
  const trackPricing = useCallback((tierName: string) => {
    trackPricingView(tierName)
  }, [])

  const trackBooking = useCallback((source: string) => {
    trackBookingStart(source)
  }, [])

  const trackTool = useCallback((toolName: string) => {
    trackToolUsage(toolName)
  }, [])

  const trackForm = useCallback((formName: string, success: boolean) => {
    trackFormSubmission(formName, success)
  }, [])

  const trackDoc = useCallback((documentName: string) => {
    trackDownload(documentName)
  }, [])

  const trackSocial = useCallback((messageType: string) => {
    trackSocialProof(messageType)
  }, [])

  return {
    trackPricing,
    trackBooking,
    trackTool,
    trackForm,
    trackDoc,
    trackSocial
  }
} 