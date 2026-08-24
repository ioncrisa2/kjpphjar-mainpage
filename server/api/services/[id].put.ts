import { Service } from '~/server/models/Service'
import { connectDB } from '~/server/utils/db'
import slugify from 'slugify'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (body.title && !body.slug) {
    body.slug = slugify(body.title, { lower: true, strict: true })
  }

  if (body.slug) {
    const existing = await Service.findOne({ slug: body.slug, _id: { $ne: id } })
    if (existing) {
      throw createError({ statusCode: 400, statusMessage: 'Slug sudah digunakan oleh layanan lain.' })
    }
  }

  const updated = await Service.findByIdAndUpdate(id, body, { new: true })
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Layanan tidak ditemukan' })
  }

  return updated
})
