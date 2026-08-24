import { ContactSubmission } from '~/server/models/ContactSubmission'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (body.isRead === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'isRead is required' })
  }

  const updated = await ContactSubmission.findByIdAndUpdate(id, { isRead: body.isRead }, { new: true })
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Pesan tidak ditemukan' })
  }

  return updated
})
