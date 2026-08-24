import { Client } from '~/server/models/Client'
import { connectDB } from '~/server/utils/db'
import { upload, ensureUploadsFolder } from '~/server/utils/upload'
import path from 'path'
import fs from 'fs'

export default defineEventHandler(async (event) => {
  await connectDB()
  const req = event.node.req as any
  const res = event.node.res as any
  
  const uploadFolder = ensureUploadsFolder('clients')
  
  await new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err: any) => {
      if (err) reject(err)
      else resolve(true)
    })
  })

  const file = req.file
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'Logo klien wajib diunggah.' })
  }

  const newPath = path.join(uploadFolder, file.filename)
  fs.renameSync(file.path, newPath)
  
  const body = req.body
  const client = new Client({
    name: body.name,
    category: body.category || '',
    order: body.order || 0,
    isActive: body.isActive === 'true',
    logoUrl: `/uploads/clients/${file.filename}`
  })

  await client.save()
  return client
})
