import { Gallery } from '~/server/models/Gallery'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const allowedUpdates = ['title', 'category', 'isFeatured', 'order']
  const updates: Record<string, any> = {}

  for (const key of allowedUpdates) {
    if (body[key] !== undefined) {
      updates[key] = body[key]
    }
  }

  const updated = await Gallery.findByIdAndUpdate(id, updates, { new: true })
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Foto tidak ditemukan' })
  }

  return updated
})
