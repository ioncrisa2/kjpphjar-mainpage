import mongoose from 'mongoose'
import { Role } from '~/server/models/Role'
import { User } from '~/server/models/User'
import { connectDB } from '~/server/utils/db'
import { invalidateRoleCache, requireSuperAdmin } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  const id = getRouterParam(event, 'id') || ''
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Role tidak ditemukan.' })
  }
  await connectDB()

  const role = await Role.findById(id)
  if (!role) throw createError({ statusCode: 404, statusMessage: 'Role tidak ditemukan.' })
  if (role.isSystem) {
    throw createError({ statusCode: 403, statusMessage: 'Role sistem tidak dapat dihapus.' })
  }

  const userCount = await User.countDocuments({ role: role.key })
  if (userCount > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: `Role masih dipakai oleh ${userCount} pengguna. Pindahkan pengguna ke role lain terlebih dahulu.`,
    })
  }

  await role.deleteOne()
  invalidateRoleCache()
  return { success: true, message: `Role ${role.name} berhasil dihapus.` }
})
