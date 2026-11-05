import bcrypt from 'bcryptjs'
import { User } from '~/server/models/User'
import { connectDB } from '~/server/utils/db'
import { requireSuperAdmin } from '~/server/utils/require-auth'
import {
  readDisplayName,
  readLeaderId,
  readPassword,
  readRoleKey,
  readUsername,
} from '~/server/utils/user-admin'

export default defineEventHandler(async (event) => {
  const admin = await requireSuperAdmin(event)
  const body = (await readBody(event)) || {}
  await connectDB()

  const username = readUsername(body.username)
  const password = readPassword(body.password)
  const role = await readRoleKey(body.role)
  const leaderId = await readLeaderId(body.leaderId)

  try {
    const user = await User.create({
      username,
      password: await bcrypt.hash(password, 12),
      name: readDisplayName(body.name, username),
      role,
      leaderId,
      isActive: body.isActive !== false,
      createdBy: admin.id,
    })
    setResponseStatus(event, 201)
    return { success: true, message: `Pengguna ${user.username} berhasil dibuat.`, id: String(user._id) }
  } catch (error: any) {
    if (error?.code === 11000) {
      throw createError({ statusCode: 409, statusMessage: 'Username sudah digunakan.' })
    }
    throw error
  }
})
