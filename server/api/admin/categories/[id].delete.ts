import mongoose from 'mongoose'
import { Category } from '~/server/models/Category'
import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id') || ''
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID kategori tidak valid.' })
  }

  const articleCount = await BlogPost.countDocuments({ categoryId: id })
  if (articleCount > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: `Kategori masih digunakan oleh ${articleCount} artikel. Nonaktifkan kategori sebagai gantinya.`,
    })
  }

  const category = await Category.findByIdAndDelete(id)
  if (!category) throw createError({ statusCode: 404, statusMessage: 'Kategori tidak ditemukan.' })
  return { success: true, message: 'Kategori berhasil dihapus.' }
})
