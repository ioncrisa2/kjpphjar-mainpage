import bcrypt from 'bcryptjs'
import { User } from '~/server/models/User'
import { setAuthCookie } from '~/server/utils/auth'
import { connectDB } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  // Semua user panel boleh mengubah nama dan password miliknya sendiri.
  const session = await requireAuth(event)
  const body = await readBody(event)

  await connectDB()
  const user = await User.findById(session.id)
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'Akun tidak ditemukan.' })
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
    // Sesi di perangkat lain berakhir; sesi saat ini diperbarui di bawah.
    user.tokenVersion = (user.tokenVersion ?? 0) + 1
  }

  await user.save()
  if (newPassword) {
    setAuthCookie(event, { id: String(user._id), tokenVersion: user.tokenVersion })
  }

  return {
    success: true,
    message: newPassword
      ? 'Profil dan password berhasil diperbarui. Sesi di perangkat lain telah diakhiri.'
      : 'Profil berhasil diperbarui.',
    user: {
      username: user.username,
      name: user.name,
      role: user.role,
    },
  }
})
