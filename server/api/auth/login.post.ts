import bcrypt from 'bcryptjs'
import { generateToken } from '~/server/utils/auth'
import { User } from '~/server/models/User'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
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

  // Set JWT
  const token = generateToken(username)
  setCookie(event, 'admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  })

  return {
    success: true,
    message: 'Login berhasil',
    user: {
      username: user.username,
      name: user.name,
      role: user.role
    }
  }
})
