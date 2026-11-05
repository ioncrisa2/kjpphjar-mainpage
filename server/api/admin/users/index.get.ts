import { Leader } from '~/server/models/Leader'
import { Role } from '~/server/models/Role'
import { User } from '~/server/models/User'
import { connectDB } from '~/server/utils/db'
import { requireSuperAdmin } from '~/server/utils/require-auth'
import { toUserDto } from '~/server/utils/user-admin'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  await connectDB()

  const [users, roles] = await Promise.all([
    User.find()
      .select('-password -tokenVersion')
      .populate({ path: 'leaderId', model: Leader, select: 'name position' })
      .sort({ createdAt: 1 })
      .lean(),
    Role.find().select('key name').lean(),
  ])
  const roleNames = new Map(roles.map((role) => [role.key, role.name]))

  setResponseHeader(event, 'Cache-Control', 'private, no-store, max-age=0')
  return { items: users.map((user) => toUserDto(user, roleNames)) }
})
