import { Client } from '~/server/models/Client'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const query = getQuery(event)
  const filter: Record<string, unknown> = { isActive: true }
  if (query.category) filter.category = query.category

  const clients = await Client.find(filter).sort({ category: 1, order: 1 }).lean()
  const categories = await Client.distinct('category', { isActive: true, category: { $exists: true, $ne: null } })

  return { items: clients, categories }
})
