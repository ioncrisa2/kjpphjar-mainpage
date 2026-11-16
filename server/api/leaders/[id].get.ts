import { connectDB } from '~/server/utils/db'
import { findActiveLeaderByParam } from '~/server/utils/leader'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id') || ''

  const leader = await findActiveLeaderByParam(id)
  if (!leader) {
    throw createError({ statusCode: 404, statusMessage: 'Pimpinan tidak ditemukan' })
  }

  return leader
})
