import path from 'path'
import { connectDB } from '~/server/utils/db'
import { processUploadedBlogImage } from '~/server/utils/image'
import { storeAsset } from '~/server/utils/media-storage'
import { receiveSingleImage, removeFileIfExists } from '~/server/utils/upload'

export default defineEventHandler(async (event) => {
  await connectDB()
  const { file } = await receiveSingleImage(event)
  if (!file) throw createError({ statusCode: 400, statusMessage: 'Pilih gambar yang ingin diunggah.' })

  const filename = `${path.parse(file.filename).name}.webp`

  try {
    const buffer = await processUploadedBlogImage(file.path, { maxWidth: 2000, maxHeight: 2000, quality: 84 })
    const stored = await storeAsset({
      pathname: `blog/content/${filename}`,
      contentType: 'image/webp',
      source: { buffer },
    })
    setResponseStatus(event, 201)
    return { url: stored.url }
  } finally {
    await removeFileIfExists(file.path)
  }
})
