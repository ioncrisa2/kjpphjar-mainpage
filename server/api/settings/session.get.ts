import { requireAdmin } from '~/server/utils/require-admin'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  setResponseHeader(event, 'Cache-Control', 'private, no-store, max-age=0')
  return { authenticated: true, admin }
})
