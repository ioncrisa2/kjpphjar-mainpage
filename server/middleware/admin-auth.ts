import { requireAdmin } from '~/server/utils/require-admin'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const path = url.pathname
  const method = event.method.toUpperCase()
  const query = getQuery(event)
  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(method)

  const isPublicContactSubmission =
    path === '/api/contacts/submit' && method === 'POST'
  const isPublicAnalyticsTrack =
    path === '/api/analytics/track' && method === 'POST'
  const isPublicBlogView =
    method === 'PATCH' && /^\/api\/blog\/[^/]+\/view$/.test(path)

  // Guard every private read and every CMS mutation. Public collector/write
  // exceptions are kept explicit so a newly added route is not opened by
  // accident.
  const isAdminRoute =
    path.startsWith('/api/admin/') ||
    (path.startsWith('/api/analytics/') && !isPublicAnalyticsTrack) ||
    path === '/api/settings/backup' ||
    path === '/api/settings/restore' ||
    (path === '/api/settings' && isMutation) ||
    (path.startsWith('/api/categories') && isMutation) ||
    (path.startsWith('/api/contact-persons') && isMutation) ||
    (path.startsWith('/api/gallery') && isMutation) ||
    (path.startsWith('/api/branches') && isMutation) ||
    (path.startsWith('/api/leaders') && isMutation) ||
    (path.startsWith('/api/clients') && (isMutation || query.all === 'true')) ||
    (path.startsWith('/api/services') && isMutation) ||
    (path.startsWith('/api/blog') &&
      ((isMutation && !isPublicBlogView) || query.admin === 'true')) ||
    (path.startsWith('/api/careers') &&
      (isMutation || query.admin === 'true')) ||
    (path.startsWith('/api/contacts') && !isPublicContactSubmission)

  if (!isAdminRoute) return

  // Revalidate the account on every private request. A signed token alone is
  // insufficient because the user may have been removed or demoted since the
  // token was issued.
  await requireAdmin(event)
})
