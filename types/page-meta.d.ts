import type { PermissionRequirement } from '~/shared/permissions'

declare module '#app' {
  interface PageMeta {
    /** Permission halaman admin; dicek oleh middleware auth. */
    permission?: PermissionRequirement
    /** Halaman khusus super admin (kelola pengguna & role). */
    superAdminOnly?: boolean
  }
}

export {}
