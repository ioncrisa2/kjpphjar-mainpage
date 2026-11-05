import mongoose from 'mongoose'
import slugify from 'slugify'
import { Leader } from '~/server/models/Leader'
import { User } from '~/server/models/User'
import { sanitizePlainText } from '~/server/utils/blog'
import { resolveRole } from '~/server/utils/require-auth'
import { SUPER_ADMIN_ROLE_KEY, isPermission, type Permission } from '~/shared/permissions'

export const MIN_PASSWORD_LENGTH = 12
const MAX_PASSWORD_LENGTH = 1024
const USERNAME_PATTERN = /^[A-Za-z0-9._@-]{3,120}$/
const ROLE_KEY_PATTERN = /^[a-z0-9][a-z0-9_-]{1,39}$/

function badRequest(message: string) {
  return createError({ statusCode: 400, statusMessage: message })
}

export function readUsername(value: unknown) {
  const username = typeof value === 'string' ? value.trim() : ''
  if (!USERNAME_PATTERN.test(username)) {
    throw badRequest('Username 3–120 karakter dan hanya boleh berisi huruf, angka, titik, @, _ atau -.')
  }
  return username
}

export function readDisplayName(value: unknown, fallback: string) {
  return sanitizePlainText(value, 120) || fallback
}

export function readPassword(value: unknown) {
  if (typeof value !== 'string' || value.length < MIN_PASSWORD_LENGTH) {
    throw badRequest(`Password minimal ${MIN_PASSWORD_LENGTH} karakter.`)
  }
  if (value.length > MAX_PASSWORD_LENGTH) throw badRequest('Password terlalu panjang.')
  return value
}

export async function readRoleKey(value: unknown) {
  const key = typeof value === 'string' ? value.trim() : ''
  if (!key || !(await resolveRole(key))) throw badRequest('Role tidak ditemukan.')
  return key
}

/** null (atau string kosong) memutus hubungan akun dengan data Pimpinan. */
export async function readLeaderId(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  const id = String(value)
  if (!mongoose.isValidObjectId(id) || !(await Leader.exists({ _id: id }))) {
    throw badRequest('Data Pimpinan tidak ditemukan.')
  }
  return id
}

/** Selalu harus tersisa minimal satu super admin aktif. */
export async function assertKeepsActiveSuperAdmin(targetUserId: string) {
  const remaining = await User.countDocuments({
    _id: { $ne: targetUserId },
    role: SUPER_ADMIN_ROLE_KEY,
    isActive: { $ne: false },
  })
  if (remaining === 0) {
    throw badRequest('Harus ada minimal satu super admin aktif.')
  }
}

export function toUserDto(user: Record<string, any>, roleNames: Map<string, string>) {
  const leader = user.leaderId && typeof user.leaderId === 'object' && user.leaderId.name
    ? { _id: String(user.leaderId._id), name: user.leaderId.name, position: user.leaderId.position || '' }
    : null
  return {
    _id: String(user._id),
    username: user.username,
    name: user.name || user.username,
    role: user.role,
    roleName: roleNames.get(user.role) || (user.role === SUPER_ADMIN_ROLE_KEY ? 'Super Admin' : user.role),
    isSuperAdmin: user.role === SUPER_ADMIN_ROLE_KEY,
    isActive: user.isActive !== false,
    leaderId: leader?._id || (user.leaderId ? String(user.leaderId) : null),
    leader,
    lastLoginAt: user.lastLoginAt || null,
    createdAt: user.createdAt,
  }
}

export function readRoleKeyForCreate(value: unknown, name: string) {
  const source = typeof value === 'string' && value.trim() ? value : name
  const key = slugify(String(source), { lower: true, strict: true, trim: true, replacement: '-' }).slice(0, 40)
  if (!ROLE_KEY_PATTERN.test(key)) {
    throw badRequest('Kode role 2–40 karakter: huruf kecil, angka, - atau _.')
  }
  if (key === SUPER_ADMIN_ROLE_KEY) throw badRequest('Kode role "admin" dipakai oleh role sistem.')
  return key
}

/** Permission yang tidak ada di katalog ditolak, bukan diabaikan diam-diam. */
export function readPermissionList(value: unknown): Permission[] {
  if (!Array.isArray(value)) throw badRequest('Daftar permission tidak valid.')
  const unknown = value.filter((item) => !isPermission(item))
  if (unknown.length) {
    throw badRequest(`Permission tidak dikenal: ${unknown.map(String).slice(0, 5).join(', ')}`)
  }
  return [...new Set(value as Permission[])]
}
