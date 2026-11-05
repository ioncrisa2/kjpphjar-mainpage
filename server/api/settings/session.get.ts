import { requireAuth } from '~/server/utils/require-auth'

// Dipakai middleware maintenance di client: semua user panel boleh melihat
// website saat maintenance aktif (keputusan D5).
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  setResponseHeader(event, 'Cache-Control', 'private, no-store, max-age=0')
  return { authenticated: true, user: { username: user.username, name: user.name } }
})
