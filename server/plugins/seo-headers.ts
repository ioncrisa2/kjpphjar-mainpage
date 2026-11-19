export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event) => {
    const pathname = getRequestURL(event).pathname
    if (pathname === '/sitemap.xml' || event.context._isSitemap) {
      setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    }
  })
})
