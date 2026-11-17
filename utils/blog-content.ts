export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

/**
 * Toolbar Quill yang sinkron 100% dengan whitelist sanitasi server
 * (`sanitizeBlogContent` di `server/utils/blog.ts`).
 */
export const BLOG_EDITOR_TOOLBAR = [
  [{ header: [2, 3, 4, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  ['link', 'image'],
  ['clean'],
]

function decodeBasicEntities(value: string) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
}

function toHeadingAnchorId(text: string, usedIds: Set<string>, index: number) {
  const base = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .slice(0, 80) || `bagian-${index + 1}`

  let candidate = base
  let suffix = 2
  while (usedIds.has(candidate)) {
    candidate = `${base}-${suffix++}`
  }
  usedIds.add(candidate)
  return candidate
}

/**
 * Menormalkan heading artikel agar tidak ada H1 ganda dan menghasilkan
 * daftar isi (TOC) otomatis dari H2/H3 beserta anchor `id`.
 */
export function buildBlogArticleWithToc(rawHtml: string): { html: string; toc: TocItem[] } {
  let normalized = String(rawHtml || '').replace(/<(\/?)h1(\b[^>]*)>/gi, '<$1h2$2>')
  if (!/<h2\b/i.test(normalized) && /<h3\b/i.test(normalized)) {
    normalized = normalized
      .replace(/<(\/?)h3(\b[^>]*)>/gi, '<$1h2$2>')
      .replace(/<(\/?)h4(\b[^>]*)>/gi, '<$1h3$2>')
  }

  const toc: TocItem[] = []
  const usedIds = new Set<string>()
  const html = normalized.replace(
    /<h([23])(\b[^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_full, levelStr: string, attrs: string, innerHtml: string) => {
      const level = Number(levelStr) as 2 | 3
      const plainText = decodeBasicEntities(innerHtml.replace(/<[^>]*>/g, ' '))
        .replace(/\s+/g, ' ')
        .trim()
      if (!plainText) return `<h${level}${attrs}>${innerHtml}</h${level}>`

      const existingIdMatch = attrs.match(/\bid=["']([^"']+)["']/i)
      let id = existingIdMatch?.[1]?.trim() || ''
      if (!id || usedIds.has(id)) {
        id = toHeadingAnchorId(plainText, usedIds, toc.length)
      } else {
        usedIds.add(id)
      }

      toc.push({ id, text: plainText, level })
      const cleanAttrs = attrs.replace(/\s*\bid=["'][^"']*["']/gi, '')
      return `<h${level} id="${id}"${cleanAttrs}>${innerHtml}</h${level}>`
    },
  )

  return { html, toc }
}
