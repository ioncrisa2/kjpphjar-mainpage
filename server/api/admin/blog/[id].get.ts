import mongoose from 'mongoose'
import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import { toBlogPostDto } from '~/server/utils/blog'

export default defineEventHandler(async (event) => {
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
  return toBlogPostDto(post as any)
})
