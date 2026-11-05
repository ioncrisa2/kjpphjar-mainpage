import mongoose from 'mongoose'
import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import { toBlogPostDto } from '~/server/utils/blog'
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
    .populate('categoryId', 'name slug description isActive createdAt updatedAt')
    .populate('leaderId', 'name position photoUrl bio')
    .lean()
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan.' })
  assertCanManageRecord(user, post, 'blog.manage_all', 'Anda hanya dapat membuka artikel milik sendiri.')
  return toBlogPostDto(post as any)
})
