export default defineEventHandler((event) => {
  const host = getRequestHeader(event, 'host')
  
  // Redirect www to non-www
  if (host && host.startsWith('www.')) {
    const newHost = host.replace(/^www\./, '')
    // Default to https for production, though x-forwarded-proto might tell us otherwise behind a proxy
    const protocol = getRequestHeader(event, 'x-forwarded-proto') || 'https'
    const newUrl = `${protocol}://${newHost}${event.node.req.url}`
    
    return sendRedirect(event, newUrl, 301)
  }
})
