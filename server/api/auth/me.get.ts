import { requireAdmin } from '~/server/utils/require-admin'

export default defineEventHandler(async (event) => {
  try {
    const admin = await requireAdmin(event)
    return { authenticated: true, username: admin.username, name: admin.name, role: admin.role }
  } catch (error: any) {
    if (error?.statusCode === 401 || error?.statusCode === 403) {
      return { authenticated: false }
    }
    throw error
  }
})
