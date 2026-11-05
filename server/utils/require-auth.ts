import type { H3Event } from 'h3'
import mongoose from 'mongoose'
import { Role } from '~/server/models/Role'
import { User } from '~/server/models/User'
import { AUTH_COOKIE_NAME, verifyToken } from '~/server/utils/auth'
import { connectDB } from '~/server/utils/db'
import {
  SUPER_ADMIN_ROLE_KEY,
  grantsPermission,
  isPermission,
  type Permission,
  type PermissionRequirement,
} from '~/shared/permissions'

export interface SessionUser {
  id: string
  username: string
  name: string
  roleKey: string
  roleName: string
  isSuperAdmin: boolean
  /** Kosong untuk super admin; super admin selalu lolos pengecekan. */
  permissions: Permission[]
  leaderId: string | null
}

interface ResolvedRole {
  key: string
  name: string
  permissions: Permission[]
}

// Role dibaca ulang paling lama tiap 5 detik agar setiap request tidak menambah
// query. Instance yang mengubah role langsung membuang cache-nya sendiri.
const ROLE_CACHE_TTL_MS = 5_000
let roleCache: { expiresAt: number; roles: Map<string, ResolvedRole> } | null = null

export function invalidateRoleCache() {
  roleCache = null
}

async function loadRoles() {
  if (roleCache && roleCache.expiresAt > Date.now()) return roleCache.roles

  const docs = await Role.find().select('key name permissions').lean()
  const roles = new Map<string, ResolvedRole>(
    docs.map((doc) => [
      doc.key,
      {
        key: doc.key,
        name: doc.name,
        // Permission yang sudah dihapus dari katalog diabaikan, bukan diberikan.
        permissions: (doc.permissions || []).filter(isPermission),
      },
    ])
  )
  roleCache = { expiresAt: Date.now() + ROLE_CACHE_TTL_MS, roles }
  return roles
}

/** null berarti role tidak dikenal; akun dengan role seperti itu ditolak. */
export async function resolveRole(key: string): Promise<ResolvedRole | null> {
  const roles = await loadRoles()
  if (key === SUPER_ADMIN_ROLE_KEY) {
    // Super admin tetap berlaku walau dokumen role sistemnya belum ter-seed.
    return { key, name: roles.get(key)?.name || 'Super Admin', permissions: [] }
  }
  return roles.get(key) || null
}

function unauthorized(message = 'Sesi tidak valid atau sudah berakhir. Silakan login kembali.') {
  return createError({ statusCode: 401, statusMessage: message })
}

/**
 * Validasi sesi pada setiap request privat. Token saja tidak cukup karena user
 * bisa saja sudah dihapus, dinonaktifkan, atau dicabut sesinya sejak token dibuat.
 */
export async function requireAuth(event: H3Event): Promise<SessionUser> {
  const cached = event.context.sessionUser as SessionUser | undefined
  if (cached) return cached

  const token = getCookie(event, AUTH_COOKIE_NAME)
  if (!token) throw unauthorized('Unauthorized')

  let payload: ReturnType<typeof verifyToken>
  try {
    payload = verifyToken(token)
  } catch {
    throw unauthorized()
  }
  if (!mongoose.isValidObjectId(payload.sub)) throw unauthorized()

  await connectDB()
  const user = await User.findById(payload.sub)
    .select('username name role isActive tokenVersion leaderId')
    .lean()
  if (!user || user.isActive === false || (user.tokenVersion ?? 0) !== payload.tv) {
    throw unauthorized()
  }

  const role = await resolveRole(user.role)
  if (!role) {
    throw createError({ statusCode: 403, statusMessage: 'Role akun tidak dikenali. Hubungi administrator.' })
  }

  const sessionUser: SessionUser = {
    id: String(user._id),
    username: user.username,
    name: user.name || user.username,
    roleKey: role.key,
    roleName: role.name,
    isSuperAdmin: role.key === SUPER_ADMIN_ROLE_KEY,
    permissions: role.permissions,
    leaderId: user.leaderId ? String(user.leaderId) : null,
  }
  event.context.sessionUser = sessionUser
  return sessionUser
}

export function hasPermission(user: SessionUser, required: PermissionRequirement): boolean {
  return grantsPermission(user, required)
}

export async function requirePermission(
  event: H3Event,
  required: PermissionRequirement,
): Promise<SessionUser> {
  const user = await requireAuth(event)
  if (!hasPermission(user, required)) {
    throw createError({ statusCode: 403, statusMessage: 'Anda tidak memiliki akses untuk tindakan ini.' })
  }
  return user
}

export async function requireSuperAdmin(event: H3Event): Promise<SessionUser> {
  const user = await requireAuth(event)
  if (!user.isSuperAdmin) {
    throw createError({ statusCode: 403, statusMessage: 'Tindakan ini khusus super admin.' })
  }
  return user
}
