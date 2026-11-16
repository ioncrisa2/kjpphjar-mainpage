export default defineEventHandler((event) => {
  const rawHost = getRequestHeader(event, 'x-forwarded-host') || getRequestHeader(event, 'host') || ''
  const host = rawHost.split(',')[0].trim().toLowerCase()

  // Redirect www to non-www with 301 to https://kjpp-hjar.co.id (all paths)
  if (host.startsWith('www.')) {
    const newHost = host.replace(/^www\./, '').replace(/:\d+$/, '')
    const path = event.node.req.url || '/'
    const newUrl = `https://${newHost}${path.startsWith('/') ? path : `/${path}`}`

    return sendRedirect(event, newUrl, 301)
  }
})
