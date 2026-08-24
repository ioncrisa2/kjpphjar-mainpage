import { Service } from '~/server/models/Service'
import { connectDB } from '~/server/utils/db'
import slugify from 'slugify'

export default defineEventHandler(async (event) => {
  await connectDB()
  const body = await readBody(event)
  
  // Generate slug if not provided or based on title
  let slug = body.slug
  if (!slug && body.title) {
    slug = slugify(body.title, { lower: true, strict: true })
  }
  
  // Ensure slug uniqueness
  const existing = await Service.findOne({ slug })
  if (existing) {
    throw createError({ statusCode: 400, statusMessage: 'Slug sudah digunakan, silakan ubah judul atau slug.' })
  }

  const service = new Service({
    ...body,
    slug
  })

  await service.save()
  return service
})
