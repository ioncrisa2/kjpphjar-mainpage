import mongoose from 'mongoose'
import { User } from '~/server/models/User'
import { connectDB } from '~/server/utils/db'
import { requireSuperAdmin } from '~/server/utils/require-auth'
import { assertKeepsActiveSuperAdmin } from '~/server/utils/user-admin'
import { SUPER_ADMIN_ROLE_KEY } from '~/shared/permissions'

export default defineEventHandler(async (event) => {
  const admin = await requireSuperAdmin(event)
  const id = getRouterParam(event, 'id') || ''
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Pengguna tidak ditemukan.' })
  }
  if (id === admin.id) {
    throw createError({ statusCode: 400, statusMessage: 'Anda tidak dapat menghapus akun sendiri.' })
  }
  await connectDB()

  const user = await User.findById(id).select('username role isActive')
  if (!user) throw createError({ statusCode: 404, statusMessage: 'Pengguna tidak ditemukan.' })
  if (user.role === SUPER_ADMIN_ROLE_KEY && user.isActive !== false) {
    await assertKeepsActiveSuperAdmin(String(user._id))
  }

  // Data yang dibuat user ini tetap ada; tanpa pemilik, hanya pemegang
  // permission manage_all yang bisa mengelolanya.
  await user.deleteOne()
  return { success: true, message: `Pengguna ${user.username} berhasil dihapus.` }
})
