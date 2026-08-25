import { Category } from '~/server/models/Category'
import { connectDB } from '~/server/utils/db'
import { normalizeSlug, parseBoolean, sanitizePlainText, toCategoryDto } from '~/server/utils/blog'

export default defineEventHandler(async (event) => {
  await connectDB()
  const body = await readBody(event)
  const name = sanitizePlainText(body?.name, 80)
  const slug = normalizeSlug(body?.slug, name).slice(0, 100)
  const description = sanitizePlainText(body?.description, 300)

  if (!name) throw createError({ statusCode: 400, statusMessage: 'Nama kategori wajib diisi.' })
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Slug kategori tidak valid.' })

  try {
    const category = await Category.create({
      name,
      slug,
      description,
      isActive: parseBoolean(body?.isActive, true),
    })
    setResponseStatus(event, 201)
    return toCategoryDto(category.toObject())
  } catch (error: any) {
    if (error?.code === 11000) {
      throw createError({ statusCode: 409, statusMessage: 'Slug kategori sudah digunakan.' })
    }
    throw error
  }
})
