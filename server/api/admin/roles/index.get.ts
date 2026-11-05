import { Role } from '~/server/models/Role'
import { User } from '~/server/models/User'
import { connectDB } from '~/server/utils/db'
import { requireSuperAdmin } from '~/server/utils/require-auth'
import { isPermission } from '~/shared/permissions'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  await connectDB()

  const [roles, counts] = await Promise.all([
    Role.find().sort({ isSystem: -1, name: 1 }).lean(),
    User.aggregate<{ _id: string; count: number }>([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
  ])
  const countByRole = new Map(counts.map((item) => [item._id, item.count]))

  return {
    items: roles.map((role) => ({
      _id: String(role._id),
      key: role.key,
      name: role.name,
      description: role.description || '',
      permissions: (role.permissions || []).filter(isPermission),
      isSystem: Boolean(role.isSystem),
      userCount: countByRole.get(role.key) || 0,
    })),
  }
})
