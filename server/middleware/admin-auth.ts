import { verifyToken } from '~/server/utils/auth'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  // Only guard write-operations under /api/admin/
  const isAdminRoute =
    url.pathname.startsWith('/api/admin/') ||
    (url.pathname.startsWith('/api/gallery') && event.method !== 'GET') ||
    (url.pathname.startsWith('/api/branches') && event.method !== 'GET') ||
    (url.pathname.startsWith('/api/leaders') && event.method !== 'GET') ||
    (url.pathname.startsWith('/api/clients') && event.method !== 'GET') ||
    (url.pathname.startsWith('/api/services') && event.method !== 'GET') ||
    (url.pathname.startsWith('/api/blog') && event.method !== 'GET') ||
    (url.pathname.startsWith('/api/careers') && event.method !== 'GET') ||
    (url.pathname.startsWith('/api/contacts') && event.method !== 'POST' && url.pathname !== '/api/contacts/submit')

  if (!isAdminRoute) return

  const token = getCookie(event, 'admin_token')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
    verifyToken(token)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Token expired or invalid' })
  }
})
