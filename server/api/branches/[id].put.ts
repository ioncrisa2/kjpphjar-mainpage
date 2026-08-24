import { Branch } from '~/server/models/Branch'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const updated = await Branch.findByIdAndUpdate(id, body, { new: true })
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Cabang tidak ditemukan' })
  }

  return updated
})
