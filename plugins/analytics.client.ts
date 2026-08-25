const COOKIE_PREFIX = 'kjpp_analytics_initial_'

interface AnalyticsNavigator extends Navigator {
  globalPrivacyControl?: boolean
}

function normalizePath(input: string): string | null {
  if (!input.startsWith('/') || input.startsWith('//')) return null
  try {
    let path = new URL(input, window.location.origin).pathname.replace(/\/{2,}/g, '/')
    if (path.length > 1) path = path.replace(/\/+$/, '')
    return path.length <= 300 ? path : null
  } catch {
    return null
  }
}

function isPublicPage(path: string): boolean {
  return !(
    path === '/admin' ||
    path.startsWith('/admin/') ||
    path.startsWith('/api/') ||
    path === '/maintenance' ||
    path.startsWith('/maintenance/')
  )
}

function markerCookieName(path: string): string {
  let hash = 0x811c9dc5
  for (let index = 0; index < path.length; index += 1) {
    hash ^= path.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return `${COOKIE_PREFIX}${(hash >>> 0).toString(16)}`
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`
  const entry = document.cookie.split('; ').find((item) => item.startsWith(prefix))
  if (!entry) return null

  try {
    return decodeURIComponent(entry.slice(prefix.length))
  } catch {
    return null
  }
}

function hasPrivacyOptOut(): boolean {
  const analyticsNavigator = navigator as AnalyticsNavigator
  return analyticsNavigator.doNotTrack === '1' || analyticsNavigator.globalPrivacyControl === true
}

function createEventId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16)
    const value = character === 'x' ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
}

function sendPageView(path: string, isEntry: boolean): void {
  const payload = JSON.stringify({
    eventId: createEventId(),
    path,
    isEntry,
    referrer: isEntry ? document.referrer : undefined,
  })

  if (typeof navigator.sendBeacon === 'function') {
    const accepted = navigator.sendBeacon(
      '/api/analytics/track',
      new Blob([payload], { type: 'application/json' })
    )
    if (accepted) return
  }

  void fetch('/api/analytics/track', {
    method: 'POST',
    body: payload,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    keepalive: true,
  }).catch(() => {
    // Analytics must never interrupt navigation or surface errors to visitors.
  })
}

export default defineNuxtPlugin((nuxtApp) => {
  if (hasPrivacyOptOut()) return

  const router = useRouter()
  let isInitialRender = true
  let lastTrackedPath: string | null = null

  nuxtApp.hook('page:finish', () => {
    const path = normalizePath(router.currentRoute.value.path)
    if (!path || path === lastTrackedPath) return

    if (!isPublicPage(path)) {
      isInitialRender = false
      lastTrackedPath = path
      return
    }

    if (isInitialRender) {
      isInitialRender = false
      lastTrackedPath = path

      const marker = readCookie(markerCookieName(path))
      if (marker === path) return

      // Static/prerendered pages have no Nitro marker and need a client entry.
      sendPageView(path, true)
      return
    }

    lastTrackedPath = path
    sendPageView(path, false)
  })
})
