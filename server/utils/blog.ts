import xss from 'xss'
import slugify from 'slugify'
import type { FilterQuery } from 'mongoose'
import type { BlogPostStatus, IBlogPost } from '~/server/models/BlogPost'

export const BLOG_STATUSES: BlogPostStatus[] = ['draft', 'published', 'scheduled']

const contentWhiteList: Record<string, string[]> = {
  p: ['class'],
  br: [],
  h1: ['class'],
  h2: ['class'],
  h3: ['class'],
  h4: ['class'],
  h5: ['class'],
  h6: ['class'],
  strong: [],
  b: [],
  em: [],
  i: [],
  u: [],
  s: [],
  blockquote: [],
  pre: ['class'],
  code: ['class'],
  ul: ['class'],
  ol: ['class'],
  li: ['class', 'data-list'],
  span: ['class'],
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height'],
}

const allowedQuillClass = /^(?:ql-(?:align-(?:center|right|justify)|direction-rtl|indent-[1-8]|size-(?:small|large|huge)|syntax)|language-[a-z0-9_-]+)$/i

function decodeEntities(value: string) {
  const named: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  }

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      const code = Number.parseInt(entity.slice(2), 16)
      return Number.isFinite(code) ? String.fromCodePoint(code) : match
    }
    if (entity.startsWith('#')) {
      const code = Number.parseInt(entity.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : match
    }
    return named[entity.toLowerCase()] ?? match
  })
}

export function stripHtml(value: unknown) {
  const source = String(value ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(?:address|article|aside|blockquote|div|figcaption|figure|footer|h[1-6]|header|li|main|nav|ol|p|pre|section|table|td|th|tr|ul)>/gi, ' ')
  const withoutMarkup = xss(source, {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
  })

  return decodeEntities(withoutMarkup).replace(/\s+/g, ' ').trim()
}

export function sanitizePlainText(value: unknown, maxLength = 500) {
  return stripHtml(value).slice(0, maxLength).trim()
}

export function sanitizeBlogContent(value: unknown) {
  return xss(String(value ?? ''), {
    whiteList: contentWhiteList,
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
    onTagAttr(tag, name, value) {
      if (tag === 'li' && name === 'data-list') {
        return value === 'bullet' || value === 'ordered' ? undefined : ''
      }

      if (name === 'class') {
        const classes = value.split(/\s+/).filter(Boolean)
        return classes.length > 0 && classes.every((className) =>
          allowedQuillClass.test(className) || (tag === 'span' && className === 'ql-ui')
        )
          ? undefined
          : ''
      }

      if (tag === 'a' && name === 'href') {
        return /^(?:https?:|mailto:|tel:|\/)/i.test(value) ? undefined : ''
      }

      if (tag === 'a' && name === 'target') {
        return value === '_blank' ? undefined : ''
      }

      if (tag === 'img' && name === 'src') {
        return value.startsWith('/uploads/blog/') || /^https:\/\//i.test(value) ? undefined : ''
      }

      return undefined
    },
  })
}

export function calculateReadingTime(content: unknown, wordsPerMinute = 200) {
  const text = stripHtml(content)
  const words = text ? text.split(/\s+/).length : 0
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export function createExcerpt(content: unknown, maxLength = 220) {
  const text = stripHtml(content)
  if (text.length <= maxLength) return text
  const shortened = text.slice(0, maxLength + 1)
  const lastSpace = shortened.lastIndexOf(' ')
  return `${shortened.slice(0, lastSpace > 120 ? lastSpace : maxLength).trim()}…`
}

export function normalizeSlug(value: unknown, fallbackTitle?: unknown) {
  const source = sanitizePlainText(value || fallbackTitle, 180)
  return slugify(source, { lower: true, strict: true, trim: true }).slice(0, 180)
}

export function normalizeTags(value: unknown) {
  let candidates: unknown[] = []

  if (Array.isArray(value)) {
    candidates = value
  } else if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        candidates = Array.isArray(parsed) ? parsed : []
      } catch {
        candidates = trimmed.split(',')
      }
    } else {
      candidates = trimmed.split(',')
    }
  }

  const seen = new Set<string>()
  const tags: string[] = []
  for (const candidate of candidates) {
    const tag = sanitizePlainText(candidate, 40)
    const key = tag.toLocaleLowerCase('id-ID')
    if (!tag || seen.has(key)) continue
    seen.add(key)
    tags.push(tag)
    if (tags.length === 12) break
  }
  return tags
}

export function parseBoolean(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  if (typeof value === 'number') return value === 1
  return fallback
}

export function clampPagination(pageValue: unknown, limitValue: unknown, maxLimit = 50) {
  const parsedPage = Number.parseInt(String(pageValue ?? ''), 10)
  const parsedLimit = Number.parseInt(String(limitValue ?? ''), 10)
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1
  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0
    ? Math.min(parsedLimit, maxLimit)
    : 10
  return { page, limit, skip: (page - 1) * limit }
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function normalizeStatus(value: unknown, fallback: BlogPostStatus = 'draft'): BlogPostStatus {
  return BLOG_STATUSES.includes(value as BlogPostStatus) ? value as BlogPostStatus : fallback
}

export function parsePublicationInput(
  statusValue: unknown,
  publishedAtValue: unknown,
  existingPublishedAt?: Date | string | null,
) {
  const status = normalizeStatus(statusValue)
  let publishedAt: Date | null = null

  if (publishedAtValue) {
    const parsed = new Date(String(publishedAtValue))
    if (!Number.isNaN(parsed.getTime())) publishedAt = parsed
  } else if (existingPublishedAt) {
    const parsed = new Date(existingPublishedAt)
    if (!Number.isNaN(parsed.getTime())) publishedAt = parsed
  }

  if (status === 'published' && !publishedAt) publishedAt = new Date()
  if (status === 'draft') publishedAt = null
  if (status === 'scheduled' && !publishedAt) {
    throw createError({ statusCode: 400, statusMessage: 'Tanggal terbit wajib diisi untuk artikel terjadwal.' })
  }

  return {
    status,
    publishedAt,
    isPublished: status === 'published',
  }
}

/**
 * New documents use status. Legacy documents without status continue to be
 * visible when isPublished=true. Scheduled posts become public when due.
 */
export function getPublicBlogFilter(now = new Date()): FilterQuery<IBlogPost> {
  return {
    $and: [
      {
        $or: [
          { status: { $in: ['published', 'scheduled'] } },
          { status: { $exists: false }, isPublished: true },
        ],
      },
      {
        $or: [
          { publishedAt: { $lte: now } },
          { publishedAt: null },
          { publishedAt: { $exists: false } },
        ],
      },
    ],
  }
}

export function getLegacyCompatibleStatus(post: Record<string, any>): BlogPostStatus {
  if (BLOG_STATUSES.includes(post.status)) return post.status
  return post.isPublished ? 'published' : 'draft'
}

export function toCategoryDto(category: Record<string, any>) {
  return {
    _id: String(category._id),
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    isActive: category.isActive !== false,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }
}

export function toBlogPostDto(post: Record<string, any>, includeContent = true) {
  const populatedCategory = post.categoryId && typeof post.categoryId === 'object' && post.categoryId.name
    ? toCategoryDto(post.categoryId)
    : null

  const categoryId = populatedCategory?._id
    || (post.categoryId ? String(post.categoryId) : null)

  const dto: Record<string, any> = {
    _id: String(post._id),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || createExcerpt(post.content || ''),
    coverImageUrl: post.coverImageUrl || '',
    tags: Array.isArray(post.tags) ? post.tags : [],
    categoryId,
    category: populatedCategory,
    isFeatured: Boolean(post.isFeatured),
    views: Number(post.views) || 0,
    readingTime: Number(post.readingTime) || calculateReadingTime(post.content || ''),
    metaTitle: post.metaTitle || '',
    metaDescription: post.metaDescription || '',
    status: getLegacyCompatibleStatus(post),
    isPublished: Boolean(post.isPublished),
    publishedAt: post.publishedAt || null,
    author: post.author || 'Admin',
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }

  if (includeContent) dto.content = sanitizeBlogContent(post.content || '')
  return dto
}
