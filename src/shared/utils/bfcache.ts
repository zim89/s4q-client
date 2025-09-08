/**
 * Utilities for working with Back/Forward Cache (bfcache)
 */
import { log } from './logger'

/**
 * Checks bfcache support in browser
 */
export const supportsBFCache = (): boolean => {
  if (typeof window === 'undefined') return false

  // Check Page Lifecycle API support
  return 'onpageshow' in window && 'onpagehide' in window
}

/**
 * Handler for bfcache events
 */
export const setupBFCacheHandlers = () => {
  if (typeof window === 'undefined') return

  // Event when restoring from bfcache
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      log('🔄 Page restored from bfcache')

      // Update data if needed
      // For example, update time, status, etc.

      // Update page title
      document.title = document.title.replace(' (inactive)', '')
    }
  })

  // Event when saving to bfcache
  window.addEventListener('pagehide', event => {
    if (event.persisted) {
      log('💾 Page saved to bfcache')

      // Can add inactivity indicator
      document.title += ' (inactive)'
    }
  })
}

/**
 * Disables bfcache for the page (use with caution)
 */
export const disableBFCache = () => {
  if (typeof window === 'undefined') return

  // Add no-cache header
  const meta = document.createElement('meta')
  meta.httpEquiv = 'Cache-Control'
  meta.content = 'no-cache, no-store, must-revalidate'
  document.head.appendChild(meta)
}

/**
 * Enables bfcache for the page
 */
export const enableBFCache = () => {
  if (typeof window === 'undefined') return

  // Remove no-cache headers
  const metaTags = document.querySelectorAll('meta[http-equiv="Cache-Control"]')
  metaTags.forEach(tag => {
    if (tag.getAttribute('content')?.includes('no-cache')) {
      tag.remove()
    }
  })
}

/**
 * Checks if the page was loaded from bfcache
 */
export const isFromBFCache = (): boolean => {
  if (typeof window === 'undefined') return false

  return window.performance?.navigation?.type === 2 // TYPE_BACK_FORWARD
}

/**
 * Gets bfcache information
 */
export const getBFCacheInfo = () => {
  if (typeof window === 'undefined') return null

  return {
    supported: supportsBFCache(),
    fromBFCache: isFromBFCache(),
    navigationType: window.performance?.navigation?.type,
    userAgent: navigator.userAgent,
  }
}
