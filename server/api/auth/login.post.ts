import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'
import { setAuthCookie } from '~/server/utils/auth'
import { User } from '~/server/models/User'
import { connectDB } from '~/server/utils/db'
import { resolveRole } from '~/server/utils/require-auth'
import { enforcePersistentRequestRateLimit } from '~/server/utils/request-rate-limit'

const MAX_LOGIN_BODY_BYTES = 4 * 1024

async function readLimitedLoginBody(event: H3Event): Promise<Record<string, unknown>> {
  const contentType = getRequestHeader(event, 'content-type') || ''
  if (!contentType.toLowerCase().includes('application/json')) {
    throw createError({ statusCode: 415, statusMessage: 'Payload login harus berupa JSON.' })
  }

  const contentLength = Number(getRequestHeader(event, 'content-length') || 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_LOGIN_BODY_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Payload login terlalu besar.' })
  }

  const chunks: Buffer[] = []
  let total = 0
  for await (const chunk of event.node.req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    total += buffer.length
    if (total > MAX_LOGIN_BODY_BYTES) {
      throw createError({ statusCode: 413, statusMessage: 'Payload login terlalu besar.' })
    }
    chunks.push(buffer)
  }

  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid')
    return parsed as Record<string, unknown>
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Payload login tidak valid.' })
  }
}

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'private, no-store, max-age=0')
  await enforcePersistentRequestRateLimit(event, {
    namespace: 'admin-login',
    limit: 10,
    windowMs: 15 * 60 * 1000,
  })

  await connectDB()
  const body = await readLimitedLoginBody(event)
  const username = typeof body?.username === 'string' ? body.username.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!username || !password || username.length > 120 || password.length > 1024) {
    throw createError({ statusCode: 400, statusMessage: 'Username dan password wajib diisi.' })
  }

  const user = await User.findOne({ username })
  
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Username atau password salah.' })
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Username atau password salah.' })
  }

  // Status akun hanya diungkap setelah password terbukti benar.
  if (user.isActive === false) {
    throw createError({ statusCode: 403, statusMessage: 'Akun Anda dinonaktifkan. Hubungi administrator.' })
  }
  const role = await resolveRole(user.role)
  if (!role) {
    throw createError({ statusCode: 403, statusMessage: 'Role akun tidak dikenali. Hubungi administrator.' })
  }

  user.lastLoginAt = new Date()
  await user.save()

  setAuthCookie(event, { id: String(user._id), tokenVersion: user.tokenVersion ?? 0 })

  return {
    success: true,
    message: 'Login berhasil',
    user: {
      username: user.username,
      name: user.name,
      role: user.role,
      roleName: role.name,
    }
  }
})
