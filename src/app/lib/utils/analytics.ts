// Google Analytics Event Tracking Utilities

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

export type LeadCaptureSource =
  | 'newsletter-sidebar'
  | 'newsletter-inline'
  | 'newsletter-footer'
  | 'newsletter-popup'
  | 'lead-magnet'
  | 'exit-intent'
  | 'scroll-trigger'
  | 'sticky-bar'
  | 'content-upgrade'

export type ConversionEvent =
  | 'newsletter_subscribe'
  | 'lead_magnet_download'
  | 'exit_intent_subscribe'
  | 'scroll_trigger_submit'
  | 'sticky_bar_subscribe'
  | 'content_upgrade_download'
  | 'consultation_request'

interface EventParams {
  event_category?: string
  event_label?: string
  value?: number
  [key: string]: any
}

/**
 * Track a custom event in Google Analytics
 */
export function trackEvent(
  eventName: string,
  params?: EventParams
): void {
  if (typeof window === 'undefined' || !window.gtag) {
    console.log('[Analytics] Tracking not available:', eventName, params)
    return
  }

  try {
    window.gtag('event', eventName, params)
    console.log('[Analytics] Event tracked:', eventName, params)
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error)
  }
}

/**
 * Track newsletter subscription
 */
export function trackNewsletterSubscribe(
  source: LeadCaptureSource,
  email: string
): void {
  trackEvent('newsletter_subscribe', {
    event_category: 'Lead Capture',
    event_label: source,
    value: 1,
    user_email: email
  })
}

/**
 * Track lead magnet download
 */
export function trackLeadMagnetDownload(
  resourceId: string,
  email: string,
  source?: string
): void {
  trackEvent('lead_magnet_download', {
    event_category: 'Lead Capture',
    event_label: resourceId,
    resource_id: resourceId,
    value: 2, // Peso mayor que newsletter
    user_email: email,
    source: source || 'unknown'
  })
}

/**
 * Track exit intent popup interaction
 */
export function trackExitIntentInteraction(
  action: 'shown' | 'subscribed' | 'closed',
  email?: string
): void {
  trackEvent('exit_intent_' + action, {
    event_category: 'Lead Capture',
    event_label: 'exit_intent_popup',
    value: action === 'subscribed' ? 1 : 0,
    user_email: email
  })
}

/**
 * Track scroll-triggered form interaction
 */
export function trackScrollTriggerInteraction(
  action: 'shown' | 'submitted' | 'closed',
  triggerId: string,
  email?: string
): void {
  trackEvent('scroll_trigger_' + action, {
    event_category: 'Lead Capture',
    event_label: triggerId,
    value: action === 'submitted' ? 1 : 0,
    user_email: email
  })
}

/**
 * Track sticky bar interaction
 */
export function trackStickyBarInteraction(
  action: 'shown' | 'clicked' | 'subscribed' | 'closed',
  email?: string
): void {
  trackEvent('sticky_bar_' + action, {
    event_category: 'Lead Capture',
    event_label: 'sticky_bar',
    value: action === 'subscribed' ? 1 : 0,
    user_email: email
  })
}

/**
 * Track content upgrade download
 */
export function trackContentUpgradeDownload(
  upgradeType: 'pdf' | 'checklist' | 'video' | 'template',
  resourceId: string,
  email: string
): void {
  trackEvent('content_upgrade_download', {
    event_category: 'Lead Capture',
    event_label: resourceId,
    upgrade_type: upgradeType,
    value: 2,
    user_email: email
  })
}

/**
 * Track consultation request
 */
export function trackConsultationRequest(
  source: string,
  email: string,
  phone?: string
): void {
  trackEvent('consultation_request', {
    event_category: 'Lead Conversion',
    event_label: source,
    value: 5, // Alto valor
    user_email: email,
    user_phone: phone
  })
}

/**
 * Track conversion funnel step
 */
export function trackFunnelStep(
  step: 'awareness' | 'interest' | 'consideration' | 'intent' | 'evaluation' | 'purchase',
  action: string,
  label?: string
): void {
  trackEvent('funnel_' + step, {
    event_category: 'Conversion Funnel',
    event_label: label || action,
    funnel_step: step,
    action: action
  })
}

/**
 * Track page engagement
 */
export function trackPageEngagement(
  metricName: string,
  value: number,
  page?: string
): void {
  trackEvent('page_engagement', {
    event_category: 'Engagement',
    event_label: metricName,
    value: value,
    page: page || (typeof window !== 'undefined' ? window.location.pathname : undefined)
  })
}

/**
 * Track blog post read completion
 */
export function trackBlogReadCompletion(
  postSlug: string,
  percentageRead: number
): void {
  // Track milestones: 25%, 50%, 75%, 100%
  const milestones = [25, 50, 75, 100]
  const milestone = milestones.find(m =>
    percentageRead >= m && percentageRead < m + 10
  )

  if (milestone) {
    trackEvent('blog_read_' + milestone, {
      event_category: 'Content Engagement',
      event_label: postSlug,
      value: milestone,
      post_slug: postSlug,
      percentage: percentageRead
    })
  }
}

/**
 * Set user properties for better segmentation
 */
export function setUserProperties(properties: {
  user_type?: 'subscriber' | 'lead' | 'customer'
  industry?: string
  company_size?: string
  [key: string]: any
}): void {
  if (typeof window === 'undefined' || !window.gtag) return

  try {
    window.gtag('set', 'user_properties', properties)
    console.log('[Analytics] User properties set:', properties)
  } catch (error) {
    console.error('[Analytics] Error setting user properties:', error)
  }
}

/**
 * Track ecommerce transaction (for future)
 */
export function trackTransaction(
  transactionId: string,
  value: number,
  currency: string = 'MXN',
  items?: any[]
): void {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items || []
  })
}

/**
 * Create enhanced measurement for lead capture
 */
export function setupLeadCaptureTracking(): void {
  if (typeof window === 'undefined') return

  // Track time on page
  let pageLoadTime = Date.now()

  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.floor((Date.now() - pageLoadTime) / 1000)
    trackPageEngagement('time_on_page', timeOnPage)
  })

  // Track scroll depth
  let maxScrollDepth = 0
  let scrollTracked = false

  window.addEventListener('scroll', () => {
    const scrollPercentage = Math.floor(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )

    if (scrollPercentage > maxScrollDepth) {
      maxScrollDepth = scrollPercentage
    }

    // Track when user reaches 90%
    if (scrollPercentage >= 90 && !scrollTracked) {
      scrollTracked = true
      trackPageEngagement('scroll_depth_90', 90)
    }
  }, { passive: true })
}
