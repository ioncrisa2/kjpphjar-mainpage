import mongoose from 'mongoose'
import { Leader } from '~/server/models/Leader'
import { getLegacyCompatibleStatus, parsePublicationInput, sanitizePlainText } from '~/server/utils/blog'
import { hasPermission, type SessionUser } from '~/server/utils/require-auth'

/**
 * Penulis artikel. Tanpa blog.manage_all penulis dikunci ke data Pimpinan
 * milik akun, atau ke nama akun bila akun tidak terhubung ke Pimpinan.
 */
export async function resolveBlogAuthor(user: SessionUser, body: Record<string, any>) {
  if (!hasPermission(user, 'blog.manage_all')) {
    if (user.leaderId) {
      const leader = await Leader.findById(user.leaderId).select('name').lean()
      if (leader) return { leaderId: user.leaderId, author: leader.name as string }
    }
    return { leaderId: null, author: user.name.slice(0, 100) }
  }

  const leaderId = sanitizePlainText(body.leaderId, 30) || null
  let author = sanitizePlainText(body.author, 100) || 'Admin'
  if (leaderId) {
    if (!mongoose.isValidObjectId(leaderId)) {
      throw createError({ statusCode: 400, statusMessage: 'Pimpinan penulis tidak valid.' })
    }
    const leaderDoc = await Leader.findById(leaderId).select('name').lean()
    if (leaderDoc) {
      author = leaderDoc.name
    }
  }
  return { leaderId, author }
}

/** Tanpa blog.publish artikel hanya bisa disimpan sebagai draft atau siap review. */
export function resolveBlogPublication(
  user: SessionUser,
  body: Record<string, any>,
  existing?: Record<string, any>,
) {
  if (!hasPermission(user, 'blog.publish')) {
    const requested = body.status === 'in_review' ? 'in_review' : 'draft'
    return parsePublicationInput(requested, null)
  }
  if (!existing) return parsePublicationInput(body.status, body.publishedAt)
  return parsePublicationInput(
    body.status || getLegacyCompatibleStatus(existing),
    body.publishedAt,
    existing.publishedAt,
  )
}

export function resolveBlogEditorialNote(
  user: SessionUser,
  body: Record<string, any>,
  existing?: Record<string, any>,
) {
  if (!hasPermission(user, 'blog.publish')) {
    return typeof existing?.editorialNote === 'string' ? existing.editorialNote : ''
  }
  if (body.editorialNote === undefined) {
    return body.status === 'published' ? '' : (typeof existing?.editorialNote === 'string' ? existing.editorialNote : '')
  }
  return sanitizePlainText(body.editorialNote, 500)
}

/**
 * Artikel yang sudah terbit atau terjadwal hanya boleh diubah/dihapus oleh
 * pemegang blog.publish (keputusan D3). Draft dan siap review masih boleh diubah penulis.
 */
export function assertBlogPublicationUnlocked(user: SessionUser, post: Record<string, any>) {
  if (hasPermission(user, 'blog.publish')) return
  const currentStatus = getLegacyCompatibleStatus(post)
  if (currentStatus !== 'draft' && currentStatus !== 'in_review') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Artikel yang sudah terbit atau terjadwal hanya bisa diubah oleh editor.',
    })
  }
}
