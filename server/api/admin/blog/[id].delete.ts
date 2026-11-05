import mongoose from 'mongoose'
import { BlogPost } from '~/server/models/BlogPost'
import { assertBlogPublicationUnlocked } from '~/server/utils/blog-access'
import { connectDB } from '~/server/utils/db'
import { deleteAsset } from '~/server/utils/media-storage'
import { assertCanManageRecord } from '~/server/utils/ownership'
import { requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  await connectDB()
  const id = getRouterParam(event, 'id') || ''
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID artikel tidak valid.' })
  }

  const post = await BlogPost.findById(id)
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan.' })
  assertCanManageRecord(user, post, 'blog.manage_all', 'Anda hanya dapat menghapus artikel milik sendiri.')
  assertBlogPublicationUnlocked(user, post.toObject())

  await post.deleteOne()
  if (post.coverImageUrl) {
    await deleteAsset(post.coverImageUrl).catch((cleanupError) => {
      console.error('Gagal membersihkan cover artikel yang dihapus:', cleanupError)
    })
  }
  return { success: true, message: 'Artikel berhasil dihapus.' }
})
