import type { H3Event } from 'h3'
import { User } from '~/server/models/User'
import { verifyToken } from '~/server/utils/auth'
import { connectDB } from '~/server/utils/db'

export interface AdminIdentity {
  username: string
  name: string
  role: 'admin'
}

export async function requireAdmin(event: H3Event): Promise<AdminIdentity> {
  const cachedIdentity = event.context.adminIdentity as AdminIdentity | undefined
  if (cachedIdentity?.role === 'admin') return cachedIdentity

  const token = getCookie(event, 'admin_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  let username: string
  try {
    username = verifyToken(token).username
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Token expired or invalid' })
  }

  await connectDB()
  const user = await User.findOne({ username }).select('username name role').lean()
  if (!user || user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Akses admin diperlukan.' })
  }

  const identity: AdminIdentity = {
    username: user.username,
    name: user.name || 'Administrator',
    role: 'admin',
  }
  event.context.adminIdentity = identity
  return identity
}
