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
  const { body, file } = await receiveSingleImage(event)
  let storedCoverUrl = ''
  let didPersist = false

  try {
    const title = sanitizePlainText(body.title, 180)
    const slug = normalizeSlug(body.slug, title)
    const content = sanitizeBlogContent(body.content)
    if (!title) throw createError({ statusCode: 400, statusMessage: 'Judul artikel wajib diisi.' })
    if (!slug) throw createError({ statusCode: 400, statusMessage: 'Slug artikel tidak valid.' })
    if (!stripHtml(content)) throw createError({ statusCode: 400, statusMessage: 'Konten artikel wajib diisi.' })

    const categoryId = sanitizePlainText(body.categoryId, 30) || null
    if (categoryId) {
      if (!mongoose.isValidObjectId(categoryId) || !await Category.exists({ _id: categoryId })) {
        throw createError({ statusCode: 400, statusMessage: 'Kategori artikel tidak valid.' })
      }
    }

    const publication = parsePublicationInput(body.status, body.publishedAt)
    let coverImageUrl = ''
    if (file) {
      const filename = `${path.parse(file.filename).name}.webp`
      const buffer = await processUploadedBlogImage(file.path, { maxWidth: 1800, maxHeight: 1200, quality: 84 })
      const stored = await storeAsset({
        pathname: `blog/covers/${filename}`,
        contentType: 'image/webp',
        source: { buffer },
      })
      coverImageUrl = stored.url
      storedCoverUrl = stored.url
    }

    const excerpt = sanitizePlainText(body.excerpt, 400) || createExcerpt(content)
    const post = await BlogPost.create({
      title,
      slug,
      content,
      excerpt,
      coverImageUrl,
      tags: normalizeTags(body.tags),
      categoryId,
      isFeatured: parseBoolean(body.isFeatured),
      views: 0,
      readingTime: calculateReadingTime(content),
      metaTitle: sanitizePlainText(body.metaTitle, 70),
      metaDescription: sanitizePlainText(body.metaDescription, 180),
      author: sanitizePlainText(body.author, 100) || 'Admin',
      ...publication,
    })
    didPersist = true

    await post.populate('categoryId', 'name slug description isActive createdAt updatedAt')
    setResponseStatus(event, 201)
    return toBlogPostDto(post.toObject())
  } catch (error: any) {
    if (storedCoverUrl && !didPersist) {
      await deleteAsset(storedCoverUrl).catch((rollbackError) => {
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
