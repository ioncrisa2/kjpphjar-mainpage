import { Role } from '~/server/models/Role'
import { sanitizePlainText } from '~/server/utils/blog'
import { connectDB } from '~/server/utils/db'
import { invalidateRoleCache, requireSuperAdmin } from '~/server/utils/require-auth'
import { readPermissionList, readRoleKeyForCreate } from '~/server/utils/user-admin'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  const body = (await readBody(event)) || {}

  const name = sanitizePlainText(body.name, 80)
  if (!name) throw createError({ statusCode: 400, statusMessage: 'Nama role wajib diisi.' })
  const key = readRoleKeyForCreate(body.key, name)
  const permissions = readPermissionList(body.permissions ?? [])

  await connectDB()
  try {
    const role = await Role.create({
      key,
      name,
      description: sanitizePlainText(body.description, 300),
      permissions,
      isSystem: false,
    })
    invalidateRoleCache()
    setResponseStatus(event, 201)
    return { success: true, message: `Role ${role.name} berhasil dibuat.`, id: String(role._id) }
  } catch (error: any) {
    if (error?.code === 11000) {
      throw createError({ statusCode: 409, statusMessage: `Kode role "${key}" sudah digunakan.` })
    }
    throw error
  }
})
