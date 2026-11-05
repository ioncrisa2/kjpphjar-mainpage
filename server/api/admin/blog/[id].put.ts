import mongoose from 'mongoose'
import path from 'path'
import { BlogPost } from '~/server/models/BlogPost'
import { Category } from '~/server/models/Category'
import { connectDB } from '~/server/utils/db'
import {
  calculateReadingTime,
  createExcerpt,
  normalizeSlug,
  normalizeTags,
  parseBoolean,
  sanitizeBlogContent,
  sanitizePlainText,
  stripHtml,
  toBlogPostDto,
} from '~/server/utils/blog'
import {
  assertBlogPublicationUnlocked,
  resolveBlogAuthor,
  resolveBlogPublication,
} from '~/server/utils/blog-access'
import { processUploadedBlogImage } from '~/server/utils/image'
import { deleteAsset, storeAsset } from '~/server/utils/media-storage'
import { assertCanManageRecord } from '~/server/utils/ownership'
import { hasPermission, requireAuth } from '~/server/utils/require-auth'
import { receiveSingleImage, removeFileIfExists } from '~/server/utils/upload'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  await connectDB()
  const id = getRouterParam(event, 'id') || ''
  if (!mongoose.isValidObjectId(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID artikel tidak valid.' })
  }

  const { body, file } = await receiveSingleImage(event)
  let newCoverImageUrl: string | null = null
  let didPersistUpdate = false

  try {
    const existing = await BlogPost.findById(id)
    if (!existing) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan.' })
    assertCanManageRecord(user, existing, 'blog.manage_all', 'Anda hanya dapat mengubah artikel milik sendiri.')
    assertBlogPublicationUnlocked(user, existing.toObject())

    const title = sanitizePlainText(body.title, 180)
    const slug = normalizeSlug(body.slug, title)
    const content = sanitizeBlogContent(body.content)
    if (!title || !slug) throw createError({ statusCode: 400, statusMessage: 'Judul dan slug artikel wajib diisi.' })
    if (!stripHtml(content)) throw createError({ statusCode: 400, statusMessage: 'Konten artikel wajib diisi.' })

    const categoryId = sanitizePlainText(body.categoryId, 30) || null
    if (categoryId) {
      if (!mongoose.isValidObjectId(categoryId) || !await Category.exists({ _id: categoryId })) {
        throw createError({ statusCode: 400, statusMessage: 'Kategori artikel tidak valid.' })
      }
    }

    const { leaderId, author: authorName } = await resolveBlogAuthor(user, body)
    const publication = resolveBlogPublication(user, body, existing.toObject())

    const removeCover = parseBoolean(body.removeCover)
    if (file && !removeCover) {
      const filename = `${path.parse(file.filename).name}.webp`
      const buffer = await processUploadedBlogImage(file.path, { maxWidth: 1800, maxHeight: 1200, quality: 84 })
      const stored = await storeAsset({
        pathname: `blog/covers/${filename}`,
        contentType: 'image/webp',
        source: { buffer },
      })
      newCoverImageUrl = stored.url
    }

    const updates: Record<string, any> = {
      title,
      slug,
      content,
      excerpt: sanitizePlainText(body.excerpt, 400) || createExcerpt(content),
      tags: normalizeTags(body.tags),
      categoryId,
      leaderId,
      // Artikel unggulan hanya diatur oleh pemegang blog.manage_all.
      isFeatured: hasPermission(user, 'blog.manage_all')
        ? parseBoolean(body.isFeatured)
        : existing.isFeatured,
      readingTime: calculateReadingTime(content),
      metaTitle: sanitizePlainText(body.metaTitle, 70),
      metaDescription: sanitizePlainText(body.metaDescription, 180),
      author: authorName,
      updatedBy: user.id,
      ...publication,
    }

    if (newCoverImageUrl) updates.coverImageUrl = newCoverImageUrl
    if (removeCover) updates.coverImageUrl = ''

    const updated = await BlogPost.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    if (!updated) throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan.' })
    didPersistUpdate = true
    await updated.populate([
      { path: 'categoryId', select: 'name slug description isActive createdAt updatedAt' },
      { path: 'leaderId', select: 'name position photoUrl bio' },
    ])

    if ((newCoverImageUrl || removeCover) && existing.coverImageUrl) {
      await deleteAsset(existing.coverImageUrl).catch((cleanupError) => {
        console.error('Gagal membersihkan cover blog lama:', cleanupError)
      })
    }
    return toBlogPostDto(updated.toObject())
  } catch (error: any) {
    if (newCoverImageUrl && !didPersistUpdate) {
      await deleteAsset(newCoverImageUrl).catch((rollbackError) => {
        console.error('Gagal membatalkan upload cover blog:', rollbackError)
      })
    }
    if (error?.code === 11000) {
      throw createError({ statusCode: 409, statusMessage: 'Slug artikel sudah digunakan.' })
    }
    throw error
  } finally {
    await removeFileIfExists(file?.path)
  }
})
