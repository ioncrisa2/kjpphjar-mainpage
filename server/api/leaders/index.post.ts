import { Leader } from '~/server/models/Leader'
import { connectDB } from '~/server/utils/db'
import { upload, ensureUploadsFolder } from '~/server/utils/upload'
import path from 'path'
import fs from 'fs'

export default defineEventHandler(async (event) => {
  await connectDB()
  const req = event.node.req as any
  const res = event.node.res as any
  
  const uploadFolder = ensureUploadsFolder('leaders')
  
  await new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err: any) => {
      if (err) reject(err)
      else resolve(true)
    })
  })

  const file = req.file
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'Foto pimpinan wajib diunggah.' })
  }

  const newPath = path.join(uploadFolder, file.filename)
  fs.renameSync(file.path, newPath)
  
  const body = req.body
  const leader = new Leader({
    name: body.name,
    position: body.position,
    bio: body.bio,
    order: body.order || 0,
    isActive: body.isActive === 'true',
    photoUrl: `/uploads/leaders/${file.filename}`
  })

  await leader.save()
  return leader
})
