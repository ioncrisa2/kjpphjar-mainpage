import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import { upload, ensureUploadsFolder } from '~/server/utils/upload'
import { deleteFile } from '~/server/utils/image'
import slugify from 'slugify'
import path from 'path'
import fs from 'fs'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')
  
  const req = event.node.req as any
  const res = event.node.res as any
  
  const uploadFolder = ensureUploadsFolder('blog')
  
  await new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err: any) => {
      if (err) reject(err)
      else resolve(true)
    })
  })

  const body = req.body
  const updates: Record<string, any> = {
    title: body.title,
    content: body.content,
    excerpt: body.excerpt,
    author: body.author
  }
  
  if (body.tags) {
    updates.tags = body.tags.split(',').map((t: string) => t.trim())
  }
  
  if (body.isPublished !== undefined) {
    const isPublished = body.isPublished === 'true'
    updates.isPublished = isPublished
    // only set publishedAt if it wasn't published before
    if (isPublished) {
      const existing = await BlogPost.findById(id)
      if (existing && !existing.publishedAt) {
        updates.publishedAt = new Date()
      }
    }
  }

  if (body.slug) {
    const slug = slugify(body.slug, { lower: true, strict: true })
    const existing = await BlogPost.findOne({ slug, _id: { $ne: id } })
    if (existing) {
      throw createError({ statusCode: 400, statusMessage: 'Slug sudah digunakan oleh artikel lain.' })
    }
    updates.slug = slug
  }

  const file = req.file
  if (file) {
    const newPath = path.join(uploadFolder, file.filename)
    fs.renameSync(file.path, newPath)
    updates.coverImageUrl = `/uploads/blog/${file.filename}`
    
    const oldPost = await BlogPost.findById(id)
    if (oldPost && oldPost.coverImageUrl) {
      deleteFile(path.join(process.cwd(), 'public', oldPost.coverImageUrl))
    }
  }

  const updated = await BlogPost.findByIdAndUpdate(id, updates, { new: true })
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
  }

  return updated
})
