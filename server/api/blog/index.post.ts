import { BlogPost } from '~/server/models/BlogPost'
import { connectDB } from '~/server/utils/db'
import { upload, ensureUploadsFolder } from '~/server/utils/upload'
import slugify from 'slugify'
import path from 'path'
import fs from 'fs'

export default defineEventHandler(async (event) => {
  await connectDB()
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
  
  let slug = body.slug
  if (!slug && body.title) {
    slug = slugify(body.title, { lower: true, strict: true })
  }

  const existing = await BlogPost.findOne({ slug })
  if (existing) {
    throw createError({ statusCode: 400, statusMessage: 'Slug sudah digunakan.' })
  }

  const postData: any = {
    title: body.title,
    slug,
    content: body.content,
    excerpt: body.excerpt,
    tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()) : [],
    isPublished: body.isPublished === 'true',
    publishedAt: body.isPublished === 'true' ? new Date() : null,
    author: body.author || 'Admin'
  }

  const file = req.file
  if (file) {
    const newPath = path.join(uploadFolder, file.filename)
    fs.renameSync(file.path, newPath)
    postData.coverImageUrl = `/uploads/blog/${file.filename}`
  }

  const post = new BlogPost(postData)
  await post.save()
  
  return post
})
