import { Client } from '~/server/models/Client'
import { connectDB } from '~/server/utils/db'
import { OWNERSHIP_FIELDS_EXCLUSION, ownedRecordsFilter } from '~/server/utils/ownership'
import { requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  await connectDB()
  const query = getQuery(event)
  // ?all=true adalah varian panel admin (dijaga middleware admin-auth).
  const isAdmin = query.all === 'true'
  const filter: Record<string, unknown> = {}

  if (isAdmin) {
    Object.assign(filter, ownedRecordsFilter(await requireAuth(event), 'clients.manage_all'))
  } else {
    filter.isActive = true
  }

  if (query.category) filter.category = query.category

  let clientsQuery = Client.find(filter).sort({ category: 1, order: 1 })
  if (!isAdmin) clientsQuery = clientsQuery.select(OWNERSHIP_FIELDS_EXCLUSION)
  const clients = await clientsQuery.lean()
  const categories = await Client.distinct('category', { isActive: true, category: { $exists: true, $ne: null } })

  return { items: clients, categories }
})
