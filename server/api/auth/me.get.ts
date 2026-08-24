import { verifyToken } from '~/server/utils/auth'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'admin_token')
  if (!token) return { authenticated: false }

  try {
    const payload = verifyToken(token)
    return { authenticated: true, username: payload.username }
  } catch {
    return { authenticated: false }
  }
})
