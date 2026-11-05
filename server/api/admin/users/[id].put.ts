import mongoose from 'mongoose'
import { User } from '~/server/models/User'
import { connectDB } from '~/server/utils/db'
import { requireSuperAdmin } from '~/server/utils/require-auth'
import {
  assertKeepsActiveSuperAdmin,
  readDisplayName,
  readLeaderId,
  readRoleKey,
} from '~/server/utils/user-admin'
import { SUPER_ADMIN_ROLE_KEY } from '~/shared/permissions'

export default defineEventHandler(async (event) => {
  const admin = await requireSuperAdmin(event)
  const id = getRouterParam(event, 'id') || ''
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Pengguna tidak ditemukan.' })
  }
  const body = (await readBody(event)) || {}
  await connectDB()

  const user = await User.findById(id)
  if (!user) throw createError({ statusCode: 404, statusMessage: 'Pengguna tidak ditemukan.' })

  const isSelf = String(user._id) === admin.id
  const nextRole = body.role === undefined ? user.role : await readRoleKey(body.role)
  const nextActive = body.isActive === undefined ? user.isActive !== false : body.isActive !== false

  if (isSelf && nextRole !== user.role) {
    throw createError({ statusCode: 400, statusMessage: 'Anda tidak dapat mengubah role akun sendiri.' })
  }
  if (isSelf && !nextActive) {
    throw createError({ statusCode: 400, statusMessage: 'Anda tidak dapat menonaktifkan akun sendiri.' })
  }

  const losesSuperAdmin =
    user.role === SUPER_ADMIN_ROLE_KEY &&
    user.isActive !== false &&
    (nextRole !== SUPER_ADMIN_ROLE_KEY || !nextActive)
  if (losesSuperAdmin) await assertKeepsActiveSuperAdmin(String(user._id))

  if (body.name !== undefined) user.name = readDisplayName(body.name, user.username)
  if (body.leaderId !== undefined) user.leaderId = (await readLeaderId(body.leaderId)) as any
  user.role = nextRole
  if (user.isActive !== false && !nextActive) {
    // Akun yang dinonaktifkan langsung keluar dari semua sesi.
    user.tokenVersion = (user.tokenVersion ?? 0) + 1
  }
  user.isActive = nextActive
  await user.save()

  return { success: true, message: `Pengguna ${user.username} berhasil diperbarui.` }
})
