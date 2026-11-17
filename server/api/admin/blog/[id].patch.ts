import mongoose from 'mongoose'
import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import { BLOG_STATUSES, parseBoolean, toBlogPostDto, type BlogPostStatus } from '~/server/utils/blog'
import {
  assertBlogPublicationUnlocked,
  resolveBlogEditorialNote,
  resolveBlogPublication,
} from '~/server/utils/blog-access'
import { assertCanManageRecord } from '~/server/utils/ownership'
import { hasPermission, requireAuth } from '~/server/utils/require-auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  await connectDB()
  const id = getRouterParam(event, 'id') || ''
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID artikel tidak valid.' })
  }

  const existing = await BlogPost.findById(id)
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan.' })
  assertCanManageRecord(user, existing, 'blog.manage_all', 'Anda hanya dapat mengubah artikel milik sendiri.')
  assertBlogPublicationUnlocked(user, existing.toObject())

  const body = await readBody<Record<string, any>>(event) || {}
  const updates: Record<string, any> = { updatedBy: user.id }

  if (body.status !== undefined) {
    const requestedStatus = String(body.status) as BlogPostStatus
    if (!BLOG_STATUSES.includes(requestedStatus)) {
      throw createError({ statusCode: 400, statusMessage: 'Status artikel tidak valid.' })
    }
    if ((requestedStatus === 'published' || requestedStatus === 'scheduled') && !hasPermission(user, 'blog.publish')) {
      throw createError({ statusCode: 403, statusMessage: 'Anda tidak memiliki izin untuk menerbitkan artikel.' })
    }
    Object.assign(updates, resolveBlogPublication(user, body, existing.toObject()))
    if (body.editorialNote !== undefined || requestedStatus === 'published') {
      updates.editorialNote = resolveBlogEditorialNote(user, body, existing.toObject())
    }
  } else if (body.editorialNote !== undefined) {
    if (!hasPermission(user, 'blog.publish')) {
      throw createError({ statusCode: 403, statusMessage: 'Hanya editor yang dapat menulis catatan revisi.' })
    }
    updates.editorialNote = resolveBlogEditorialNote(user, body, existing.toObject())
  }

  if (body.isFeatured !== undefined) {
    if (!hasPermission(user, 'blog.manage_all')) {
      throw createError({ statusCode: 403, statusMessage: 'Hanya editor yang dapat mengatur artikel unggulan.' })
    }
    updates.isFeatured = parseBoolean(body.isFeatured)
  }

  const updated = await BlogPost.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    .select('-content')
    .populate('categoryId', 'name slug description isActive createdAt updatedAt')
    .populate('leaderId', 'name position photoUrl bio')
    .lean()
  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan.' })

  return toBlogPostDto(updated as any, false)
})
