import sharp from 'sharp'
import { createError } from 'h3'

export interface ProcessImageOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

const SUPPORTED_INPUT_FORMATS = new Set(['jpeg', 'png', 'webp'])

/**
 * Decode untrusted upload bytes and emit a fresh WebP image. This validates the
 * actual file contents, applies EXIF rotation, strips metadata, and bounds the
 * decoded image size before it can be exposed publicly.
 */
export async function processUploadedImage(
  input: string | Buffer,
  options: ProcessImageOptions = {},
) {
  try {
    const image = sharp(input, {
      failOn: 'error',
      limitInputPixels: 40_000_000,
      sequentialRead: true,
    })
    const metadata = await image.metadata()

    if (!metadata.format || !SUPPORTED_INPUT_FORMATS.has(metadata.format)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Isi file bukan gambar JPG, PNG, atau WebP yang valid.',
      })
    }
    if (!metadata.width || !metadata.height) {
      throw createError({ statusCode: 400, statusMessage: 'Dimensi gambar tidak dapat dibaca.' })
    }

    return await image
      .rotate()
      .resize({
        width: options.maxWidth || 1920,
        height: options.maxHeight || 1920,
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3,
      })
      .webp({
        quality: options.quality || 85,
        effort: 6,
        smartSubsample: true,
        alphaQuality: 95,
      })
      .toBuffer()
  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: 'Isi file bukan gambar JPG, PNG, atau WebP yang valid.',
    })
  }
}

export async function generateThumbnail(
  input: string | Buffer,
  options: { width?: number; height?: number; quality?: number } = {},
) {
  return processUploadedImage(input, {
    maxWidth: options.width || 600,
    maxHeight: options.height || 600,
    quality: options.quality || 82,
  })
}

export async function processUploadedBlogImage(
  input: string | Buffer,
  options: ProcessImageOptions = {},
) {
  return processUploadedImage(input, {
    maxWidth: options.maxWidth || 1920,
    maxHeight: options.maxHeight || 1920,
    quality: options.quality || 85,
  })
}
