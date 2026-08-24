'use client'

import { useEffect } from 'react'

// Sends a GA4 event whenever a visitor clicks a link to an external site
// (manufacturer pages, retailer listings, product pages, etc.). Uses event
// delegation so every outbound <a> across the site is tracked without
// editing each link individually.
//
// The event name 'click' with a top-level 'link_url' parameter shows up in GA4
// as a card on the Events report. Build explorations / filters on link_url,
// link_text, and page_location to see which outbound links get clicked.
//
// This site's GA tag (G-96B8NQ63BP) is configured without consent mode, so
// events fire for all visitors.

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export default function OutboundLinkTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    function handleClick(e: MouseEvent) {
      // Only track primary left-click navigation (ignore modified clicks so we
      // don't double-count open-in-new-tab via ctrl/cmd/shift, and middle-clicks).
      if (e.defaultPrevented) return
      if (e.button !== 0) return
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return

      // Walk up from the target to the nearest anchor.
      let el = e.target as HTMLElement | null
      while (el && el.tagName !== 'A') {
        el = el.parentElement
      }
      if (!el) return

      const anchor = el as HTMLAnchorElement
      const href = anchor.getAttribute('href') || anchor.href || ''
      if (!href || !/^https?:\/\//i.test(href)) return

      // Skip links to our own origin (internal navigation).
      try {
        const url = new URL(href)
        if (url.hostname === window.location.hostname) return
      } catch {
        return
      }

      const params = {
        link_url: href,
        link_text: (anchor.textContent || '').trim().slice(0, 120),
        page_location: window.location.pathname,
      }

      window.gtag = window.gtag || function gtag() {}
      window.gtag('event', 'click', params)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
