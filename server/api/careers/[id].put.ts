import { Career } from '~/server/models/Career'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (body.requirements && typeof body.requirements === 'string') {
    body.requirements = body.requirements.split('\n').filter((line: string) => line.trim())
  }

  const updated = await Career.findByIdAndUpdate(id, body, { new: true })
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Lowongan tidak ditemukan' })
  }

  return updated
})
