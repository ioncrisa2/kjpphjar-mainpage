import bcrypt from 'bcryptjs'
import { User } from '~/server/models/User'
import { connectDB } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/require-admin'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const body = await readBody(event)

  await connectDB()
  const user = await User.findOne({ username: admin.username })
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'Akun admin tidak ditemukan.' })
  }

  const { name, currentPassword, newPassword } = body || {}

  // 1. Update Display Name if provided
  if (typeof name === 'string' && name.trim()) {
    user.name = name.trim().slice(0, 120)
  }

  // 2. Update Password if requested
  if (newPassword) {
    if (typeof newPassword !== 'string' || newPassword.length < 12) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password baru minimal harus 12 karakter.',
      })
    }

    if (!currentPassword || typeof currentPassword !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password saat ini wajib diisi untuk mengubah password.',
      })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password saat ini tidak sesuai.',
      })
    }

    user.password = await bcrypt.hash(newPassword, 12)
  }

  await user.save()

  return {
    success: true,
    message: newPassword
      ? 'Profil dan password admin berhasil diperbarui.'
      : 'Profil admin berhasil diperbarui.',
    user: {
      username: user.username,
      name: user.name,
      role: user.role,
    },
  }
})
