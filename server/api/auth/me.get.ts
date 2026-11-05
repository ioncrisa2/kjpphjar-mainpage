import { requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'private, no-store, max-age=0')
  try {
    const user = await requireAuth(event)
    return {
      authenticated: true as const,
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.roleKey,
      roleName: user.roleName,
      isSuperAdmin: user.isSuperAdmin,
      permissions: user.permissions,
      leaderId: user.leaderId,
    }
  } catch (error: any) {
    if (error?.statusCode === 401 || error?.statusCode === 403) {
      return { authenticated: false as const }
    }
    throw error
  }
})
