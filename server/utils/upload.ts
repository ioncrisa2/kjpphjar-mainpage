import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { createError } from 'h3'

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxSize = 10 * 1024 * 1024 // 10MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // The exact folder is decided by the route handler
    // Default fallback (should not be used in practice)
    const uploadPath = path.join(process.cwd(), 'public/uploads')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const uniqueName = `${Date.now()}-${uuidv4()}${ext}`
    cb(null, uniqueName)
  }
})

export const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.'))
    }
  }
})

export function ensureUploadsFolder(subFolder: string) {
  const uploadPath = path.join(process.cwd(), 'public/uploads', subFolder)
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
  }
  return uploadPath
}
