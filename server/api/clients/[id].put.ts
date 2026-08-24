import { Client } from '~/server/models/Client'
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
  
  const uploadFolder = ensureUploadsFolder('clients')
  
  await new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err: any) => {
      if (err) reject(err)
      else resolve(true)
    })
  })

  const body = req.body
  const updates: Record<string, any> = {
    name: body.name,
    category: body.category,
    order: body.order,
  }
  
  if (body.isActive !== undefined) {
    updates.isActive = body.isActive === 'true'
  }

  const file = req.file
  if (file) {
    const newPath = path.join(uploadFolder, file.filename)
    fs.renameSync(file.path, newPath)
    updates.logoUrl = `/uploads/clients/${file.filename}`
    
    const oldClient = await Client.findById(id)
    if (oldClient && oldClient.logoUrl) {
      deleteFile(path.join(process.cwd(), 'public', oldClient.logoUrl))
    }
  }

  const updated = await Client.findByIdAndUpdate(id, updates, { new: true })
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Klien tidak ditemukan' })
  }

  return updated
})
