import mongoose from 'mongoose'
import { Role } from '~/server/models/Role'
import { sanitizePlainText } from '~/server/utils/blog'
import { connectDB } from '~/server/utils/db'
import { invalidateRoleCache, requireSuperAdmin } from '~/server/utils/require-auth'
import { readPermissionList } from '~/server/utils/user-admin'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  const id = getRouterParam(event, 'id') || ''
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Role tidak ditemukan.' })
  }
  const body = (await readBody(event)) || {}
  await connectDB()

  const role = await Role.findById(id)
  if (!role) throw createError({ statusCode: 404, statusMessage: 'Role tidak ditemukan.' })
  if (role.isSystem) {
    throw createError({ statusCode: 403, statusMessage: 'Role sistem tidak dapat diubah.' })
  }

  // Kode role tidak bisa diubah karena tersimpan di setiap akun pengguna.
  if (body.name !== undefined) {
    const name = sanitizePlainText(body.name, 80)
    if (!name) throw createError({ statusCode: 400, statusMessage: 'Nama role wajib diisi.' })
    role.name = name
  }
  if (body.description !== undefined) role.description = sanitizePlainText(body.description, 300)
  if (body.permissions !== undefined) role.permissions = readPermissionList(body.permissions)

  await role.save()
  invalidateRoleCache()
  return { success: true, message: `Role ${role.name} berhasil diperbarui.` }
})
