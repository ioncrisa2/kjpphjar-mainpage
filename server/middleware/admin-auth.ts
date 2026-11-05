import { hasPermission, requireAuth } from '~/server/utils/require-auth'
import { isPrivateApiRoute, resolveRoutePermission } from '~/server/utils/route-permissions'

export default defineEventHandler(async (event) => {
  const request = {
    method: event.method.toUpperCase(),
    path: getRequestURL(event).pathname,
    query: getQuery(event),
  }
  if (!isPrivateApiRoute(request)) return

  // Berjalan sebelum handler membaca body, sehingga upload dari user tanpa izin
  // ditolak sebelum file diproses.
  const user = await requireAuth(event)
  const required = resolveRoutePermission(request)

  // Default-deny: rute privat yang belum dipetakan hanya untuk super admin.
  const allowed = required ? hasPermission(user, required) : user.isSuperAdmin
  if (!allowed) {
    throw createError({ statusCode: 403, statusMessage: 'Anda tidak memiliki akses untuk tindakan ini.' })
  }
})
