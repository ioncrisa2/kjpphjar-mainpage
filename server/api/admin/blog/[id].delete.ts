import mongoose from 'mongoose'
import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import { deleteAsset } from '~/server/utils/media-storage'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id') || ''
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID artikel tidak valid.' })
  }

  const post = await BlogPost.findByIdAndDelete(id)
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan.' })
  if (post.coverImageUrl) {
    await deleteAsset(post.coverImageUrl).catch((cleanupError) => {
      console.error('Gagal membersihkan cover artikel yang dihapus:', cleanupError)
    })
  }
  return { success: true, message: 'Artikel berhasil dihapus.' }
})
