import { requireSuperAdmin } from '~/server/utils/require-auth'
import { groupPermissions } from '~/shared/permissions'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  return { groups: groupPermissions() }
})
