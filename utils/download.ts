/**
 * Membentuk nama file unduhan yang aman dan terbaca dari judul atau nama file asli.
 */
export function buildDownloadFilename(options: {
  title?: string | null
  filename?: string | null
  url?: string | null
  fallbackBase?: string
}): string {
  const sourcePath = (options.filename || options.url || '').split(/[?#]/)[0]
  const rawExt = sourcePath.includes('.') ? sourcePath.slice(sourcePath.lastIndexOf('.')).toLowerCase() : ''
  const ext = /^\.[a-z0-9]{2,5}$/.test(rawExt) ? rawExt : '.webp'

  const rawBase = (options.title || '').trim()
  const sanitized = rawBase
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

  if (sanitized) return `${sanitized}${ext}`
  if (options.filename?.trim()) return options.filename.trim()
  return `${options.fallbackBase || 'image'}${ext}`
}

/**
 * Mengunduh file dari URL same-origin maupun cross-origin di browser.
 */
export async function downloadAssetUrl(url: string, filename: string): Promise<void> {
  if (!import.meta.client || !url) return

  const triggerDownload = (href: string) => {
    const link = document.createElement('a')
    link.href = href
    link.download = filename
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const resolved = new URL(url, window.location.origin)
  if (resolved.origin === window.location.origin) {
    triggerDownload(resolved.pathname + resolved.search)
    return
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Download gagal (${response.status})`)
  }
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  try {
    triggerDownload(objectUrl)
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }
}
