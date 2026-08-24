import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import { deleteFile } from '~/server/utils/image'
import path from 'path'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')

  const post = await BlogPost.findByIdAndDelete(id)
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
  }

  if (post.coverImageUrl) {
    deleteFile(path.join(process.cwd(), 'public', post.coverImageUrl))
  }

  return { success: true, message: 'Artikel berhasil dihapus' }
})
