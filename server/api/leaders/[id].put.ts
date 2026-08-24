import { Leader } from '~/server/models/Leader'
import { connectDB } from '~/server/utils/db'
import { upload, ensureUploadsFolder } from '~/server/utils/upload'
import { deleteFile } from '~/server/utils/image'
import path from 'path'
import fs from 'fs'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = getRouterParam(event, 'id')
  
  const req = event.node.req as any
  const res = event.node.res as any
  
  const uploadFolder = ensureUploadsFolder('leaders')
  
  await new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err: any) => {
      if (err) reject(err)
      else resolve(true)
    })
  })

  const body = req.body
  const updates: Record<string, any> = {
    name: body.name,
    position: body.position,
    bio: body.bio,
    order: body.order,
  }
  
  if (body.isActive !== undefined) {
    updates.isActive = body.isActive === 'true'
  }

  const file = req.file
  if (file) {
    // There is a new photo
    const newPath = path.join(uploadFolder, file.filename)
    fs.renameSync(file.path, newPath)
    updates.photoUrl = `/uploads/leaders/${file.filename}`
    
    // Find old and delete
    const oldLeader = await Leader.findById(id)
    if (oldLeader && oldLeader.photoUrl) {
      deleteFile(path.join(process.cwd(), 'public', oldLeader.photoUrl))
    }
  }

  const updated = await Leader.findByIdAndUpdate(id, updates, { new: true })
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Pimpinan tidak ditemukan' })
  }

  return updated
})
