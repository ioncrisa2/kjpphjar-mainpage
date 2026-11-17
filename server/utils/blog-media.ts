import { BlogPost } from '~/server/models/BlogPost'
import { escapeRegex, extractBlogContentImageUrls } from '~/server/utils/blog'
import { deleteAsset } from '~/server/utils/media-storage'

/**
 * Menghapus gambar inline di `/uploads/blog/content/` yang tidak lagi dirujuk
 * oleh artikel mana pun (mencegah file yatim menumpuk di storage).
 */
export async function cleanupOrphanBlogContentImages(
  previousHtml: string,
  nextHtml = '',
  excludePostId?: string,
) {
  const previousUrls = extractBlogContentImageUrls(previousHtml)
  if (!previousUrls.length) return

  const nextSet = new Set(extractBlogContentImageUrls(nextHtml))
  const removedUrls = previousUrls.filter((url) => !nextSet.has(url))
  if (!removedUrls.length) return

  for (const url of removedUrls) {
    const query: Record<string, any> = {
      content: new RegExp(escapeRegex(url)),
    }
    if (excludePostId) query._id = { $ne: excludePostId }

    const stillReferenced = await BlogPost.exists(query)
    if (!stillReferenced) {
      await deleteAsset(url).catch((error) => {
        console.error(`Gagal membersihkan gambar konten blog yatim (${url}):`, error)
      })
    }
  }
}
