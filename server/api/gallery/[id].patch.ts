import mongoose from 'mongoose'
import { Gallery } from '~/server/models/Gallery'
import { connectDB } from '~/server/utils/db'
import { assertCanManageRecord } from '~/server/utils/ownership'
import { hasPermission, requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  await connectDB()
  const id = getRouterParam(event, 'id')
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Foto tidak ditemukan' })
  }
  const body = await readBody(event)

  const photo = await Gallery.findById(id).select('createdBy').lean()
  if (!photo) {
    throw createError({ statusCode: 404, statusMessage: 'Foto tidak ditemukan' })
  }
  assertCanManageRecord(user, photo, 'gallery.manage_all', 'Anda hanya dapat mengubah foto milik sendiri.')

  // Unggulan & urutan memengaruhi tampilan semua foto, jadi khusus manage_all.
  const allowedUpdates = hasPermission(user, 'gallery.manage_all')
    ? ['title', 'category', 'isFeatured', 'order']
    : ['title', 'category']
  const updates: Record<string, any> = { updatedBy: user.id }

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
