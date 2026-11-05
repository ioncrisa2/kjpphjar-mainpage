import { grantsPermission, type PermissionRequirement } from '~/shared/permissions'

export interface AdminSession {
  id: string
  username: string
  name: string
  role: string
  roleName: string
  isSuperAdmin: boolean
  permissions: string[]
  leaderId: string | null
}

type MeResponse = ({ authenticated: true } & AdminSession) | { authenticated: false }

/**
 * Sesi panel admin di sisi client. Hanya untuk menampilkan atau menyembunyikan
 * menu dan tombol; semua batasan tetap ditegakkan oleh server.
 */
export function useAdminAuth() {
  const session = useState<AdminSession | null>('admin-session', () => null)

  async function fetchSession() {
    const fetcher = import.meta.server ? useRequestFetch() : $fetch
    try {
      const res = await fetcher<MeResponse>('/api/auth/me')
      session.value = res.authenticated
        ? {
            id: res.id,
            username: res.username,
            name: res.name,
            role: res.role,
            roleName: res.roleName,
            isSuperAdmin: res.isSuperAdmin,
            permissions: res.permissions,
            leaderId: res.leaderId,
          }
        : null
    } catch {
      session.value = null
    }
    return session.value
  }

  function clearSession() {
    session.value = null
  }

  /** Super admin selalu true. Untuk array, cukup memiliki salah satunya. */
  function can(required: PermissionRequirement) {
    return grantsPermission(session.value, required)
  }

  const isSuperAdmin = computed(() => Boolean(session.value?.isSuperAdmin))

  return { session, can, isSuperAdmin, fetchSession, clearSession }
}
