import { Gallery } from '~/server/models/Gallery'
import { connectDB } from '~/server/utils/db'
import { upload, ensureUploadsFolder } from '~/server/utils/upload'
import { generateThumbnail } from '~/server/utils/image'
import path from 'path'
import { fromNodeMiddleware } from 'h3'

// Setup upload middleware for 'image' field
const uploadMiddleware = fromNodeMiddleware(upload.single('image'))

export default defineEventHandler(async (event) => {
  await connectDB()
  
  // Custom middleware to set destination dynamically
  const req = event.node.req as any
  const res = event.node.res as any
  
  const originalFolder = ensureUploadsFolder('gallery/original')
  ensureUploadsFolder('gallery/thumbnails') // ensure thumbnails folder exists too
  
  // Override multer storage destination logic here would be tricky via fromNodeMiddleware directly if we want dynamic,
  // but since we only have one diskStorage, we can just ensure the global destination is the fallback and move the file.
  // Alternatively, since multer is configured in utils/upload.ts to save to 'public/uploads', we'll move it to gallery/original.
  
  await new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err: any) => {
      if (err) reject(err)
      else resolve(true)
    })
  })

  const file = req.file
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'File gambar wajib diunggah.' })
  }

  // Move file from default upload path to gallery/original
  const fs = await import('fs')
  const newOriginalPath = path.join(originalFolder, file.filename)
  fs.renameSync(file.path, newOriginalPath)
  
  // Generate thumbnail
  const thumbFilename = `thumb-${file.filename.replace(/\.[^/.]+$/, "")}.webp`
  const thumbPath = path.join(process.cwd(), 'public/uploads/gallery/thumbnails', thumbFilename)
  
  await generateThumbnail(newOriginalPath, thumbPath, { width: 600, quality: 80 })

  // Data from body
  const body = req.body
  const title = body.title || ''
  const category = body.category || ''
  const isFeatured = body.isFeatured === 'true'
  
  const gallery = new Gallery({
    filename: file.filename,
    imageUrl: `/uploads/gallery/original/${file.filename}`,
    thumbnailUrl: `/uploads/gallery/thumbnails/${thumbFilename}`,
    title,
    category,
    isFeatured
  })

  await gallery.save()

  return gallery
})
