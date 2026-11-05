import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { User } from '~/server/models/User'
import { connectDB } from '~/server/utils/db'
import { requireSuperAdmin } from '~/server/utils/require-auth'
import { readPassword } from '~/server/utils/user-admin'

export default defineEventHandler(async (event) => {
  const admin = await requireSuperAdmin(event)
  const id = getRouterParam(event, 'id') || ''
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Pengguna tidak ditemukan.' })
  }
  if (id === admin.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Gunakan halaman Profil untuk mengganti password sendiri.',
    })
  }
  const body = (await readBody(event)) || {}
  const password = readPassword(body.password)
  await connectDB()

  const user = await User.findById(id)
  if (!user) throw createError({ statusCode: 404, statusMessage: 'Pengguna tidak ditemukan.' })

  user.password = await bcrypt.hash(password, 12)
  // Semua sesi lama pengguna ini langsung tidak berlaku.
  user.tokenVersion = (user.tokenVersion ?? 0) + 1
  await user.save()

  return { success: true, message: `Password ${user.username} berhasil direset. Sesi lamanya telah diakhiri.` }
})
