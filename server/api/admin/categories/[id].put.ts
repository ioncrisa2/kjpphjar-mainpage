import mongoose from 'mongoose'
import { Category } from '~/server/models/Category'
import { connectDB } from '~/server/utils/db'
import { normalizeSlug, parseBoolean, sanitizePlainText, toCategoryDto } from '~/server/utils/blog'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id') || ''
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID kategori tidak valid.' })
  }

  const body = await readBody(event)
  const name = sanitizePlainText(body?.name, 80)
  const slug = normalizeSlug(body?.slug, name).slice(0, 100)
  if (!name || !slug) {
    throw createError({ statusCode: 400, statusMessage: 'Nama dan slug kategori wajib diisi.' })
  }

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description: sanitizePlainText(body?.description, 300),
        isActive: parseBoolean(body?.isActive, true),
      },
      { new: true, runValidators: true },
    )
    if (!category) throw createError({ statusCode: 404, statusMessage: 'Kategori tidak ditemukan.' })
    return toCategoryDto(category.toObject())
  } catch (error: any) {
    if (error?.code === 11000) {
      throw createError({ statusCode: 409, statusMessage: 'Slug kategori sudah digunakan.' })
    }
    throw error
  }
})
