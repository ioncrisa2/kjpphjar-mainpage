import sharp from 'sharp'
import fs from 'fs'

export async function generateThumbnail(inputPath: string, outputPath: string, options: { width?: number, height?: number, quality?: number } = {}) {
  try {
    const width = options.width || 600
    const quality = options.quality || 80

    await sharp(inputPath)
      .resize(width, options.height, { fit: 'cover', withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath)

    return true
  } catch (error) {
    console.error('Error generating thumbnail:', error)
    return false
  }
}

export function deleteFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
  } catch (error) {
    console.error('Error deleting file:', error)
  }
  return false
}
