import mongoose from 'mongoose'
import path from 'path'
import { BlogPost } from '~/server/models/BlogPost'
import { Category } from '~/server/models/Category'
import { Leader } from '~/server/models/Leader'
import { connectDB } from '~/server/utils/db'
import {
  calculateReadingTime,
  createExcerpt,
  getLegacyCompatibleStatus,
  normalizeSlug,
  normalizeTags,
  parseBoolean,
  parsePublicationInput,
  sanitizeBlogContent,
  sanitizePlainText,
  stripHtml,
  toBlogPostDto,
} from '~/server/utils/blog'
import { processUploadedBlogImage } from '~/server/utils/image'
import { deleteAsset, storeAsset } from '~/server/utils/media-storage'
import { receiveSingleImage, removeFileIfExists } from '~/server/utils/upload'

export default defineEventHandler(async (event) => {
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

    const leaderId = sanitizePlainText(body.leaderId, 30) || null
    let authorName = sanitizePlainText(body.author, 100) || 'Admin'
    if (leaderId) {
      if (!mongoose.isValidObjectId(leaderId)) {
        throw createError({ statusCode: 400, statusMessage: 'Pimpinan penulis tidak valid.' })
      }
      const leaderDoc = await Leader.findById(leaderId).select('name').lean()
      if (leaderDoc) {
        authorName = leaderDoc.name
      }
    }

    const publication = parsePublicationInput(
      body.status || getLegacyCompatibleStatus(existing.toObject()),
      body.publishedAt,
      existing.publishedAt,
    )

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
      isFeatured: parseBoolean(body.isFeatured),
      readingTime: calculateReadingTime(content),
      metaTitle: sanitizePlainText(body.metaTitle, 70),
      metaDescription: sanitizePlainText(body.metaDescription, 180),
      author: authorName,
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
