/**
 * Katalog permission panel admin. Dipakai bersama oleh server (guard API) dan
 * frontend (menu, halaman, tombol). Setiap permission terikat ke endpoint di
 * server/utils/route-permissions.ts, jadi daftar ini sengaja ditulis di kode.
 *
 * Kelola pengguna dan kelola role tidak ada di katalog: pemegangnya bisa
 * menaikkan hak akses sendiri, sehingga khusus super admin dan tidak bisa
 * diberikan ke role lain.
 */

interface PermissionDefinition {
  group: string
  label: string
  description?: string
}

export const SUPER_ADMIN_ROLE_KEY = 'admin'

export const PERMISSIONS = {
  'analytics.view': { group: 'Analitik', label: 'Lihat analitik' },
  'analytics.purge': { group: 'Analitik', label: 'Hapus data analitik' },

  'services.view': { group: 'Layanan', label: 'Lihat layanan' },
  'services.create': { group: 'Layanan', label: 'Tambah layanan' },
  'services.update': { group: 'Layanan', label: 'Ubah & urutkan layanan' },
  'services.delete': { group: 'Layanan', label: 'Hapus layanan' },

  'faq.view': { group: 'FAQ', label: 'Lihat FAQ' },
  'faq.create': { group: 'FAQ', label: 'Tambah FAQ' },
  'faq.update': { group: 'FAQ', label: 'Ubah & urutkan FAQ' },
  'faq.delete': { group: 'FAQ', label: 'Hapus FAQ' },

  'blog.view': { group: 'Blog', label: 'Lihat artikel' },
  'blog.create': { group: 'Blog', label: 'Tulis artikel' },
  'blog.update': { group: 'Blog', label: 'Ubah artikel' },
  'blog.delete': { group: 'Blog', label: 'Hapus artikel' },
  'blog.publish': {
    group: 'Blog',
    label: 'Terbitkan artikel',
    description: 'Tanpa ini artikel selalu disimpan sebagai draft, dan artikel yang sudah terbit tidak bisa diubah.',
  },
  'blog.manage_all': {
    group: 'Blog',
    label: 'Kelola semua artikel',
    description: 'Akses artikel milik siapa pun, memilih penulis, dan mengatur artikel unggulan.',
  },
  'blog.categories': { group: 'Blog', label: 'Kelola kategori' },

  'careers.view': { group: 'Karir', label: 'Lihat lowongan' },
  'careers.create': { group: 'Karir', label: 'Tambah lowongan' },
  'careers.update': { group: 'Karir', label: 'Ubah lowongan' },
  'careers.delete': { group: 'Karir', label: 'Hapus lowongan' },

  'gallery.view': { group: 'Galeri', label: 'Lihat galeri' },
  'gallery.create': { group: 'Galeri', label: 'Unggah foto' },
  'gallery.update': { group: 'Galeri', label: 'Ubah foto' },
  'gallery.delete': { group: 'Galeri', label: 'Hapus foto' },
  'gallery.manage_all': {
    group: 'Galeri',
    label: 'Kelola semua foto',
    description: 'Akses foto milik siapa pun dan mengatur foto unggulan & urutan.',
  },

  'leaders.view': { group: 'Pimpinan', label: 'Lihat pimpinan' },
  'leaders.create': { group: 'Pimpinan', label: 'Tambah pimpinan' },
  'leaders.update': { group: 'Pimpinan', label: 'Ubah pimpinan' },
  'leaders.delete': { group: 'Pimpinan', label: 'Hapus pimpinan' },

  'staff.view': { group: 'Staff', label: 'Lihat staff' },
  'staff.create': { group: 'Staff', label: 'Tambah staff' },
  'staff.update': { group: 'Staff', label: 'Ubah staff' },
  'staff.delete': { group: 'Staff', label: 'Hapus staff' },

  'branches.view': { group: 'Cabang', label: 'Lihat cabang' },
  'branches.create': { group: 'Cabang', label: 'Tambah cabang' },
  'branches.update': { group: 'Cabang', label: 'Ubah cabang' },
  'branches.delete': { group: 'Cabang', label: 'Hapus cabang' },

  'clients.view': { group: 'Klien & Rekanan', label: 'Lihat klien' },
  'clients.create': { group: 'Klien & Rekanan', label: 'Tambah klien' },
  'clients.update': { group: 'Klien & Rekanan', label: 'Ubah klien' },
  'clients.delete': { group: 'Klien & Rekanan', label: 'Hapus klien' },
  'clients.manage_all': {
    group: 'Klien & Rekanan',
    label: 'Kelola semua klien',
    description: 'Akses klien milik siapa pun dan mengatur urutan tampil.',
  },

  'contacts.view': { group: 'Inbox Kontak', label: 'Lihat pesan masuk' },
  'contacts.update': { group: 'Inbox Kontak', label: 'Tandai pesan' },
  'contacts.export': { group: 'Inbox Kontak', label: 'Ekspor pesan' },

  'contact_persons.view': { group: 'Kontak Footer', label: 'Lihat kontak footer' },
  'contact_persons.create': { group: 'Kontak Footer', label: 'Tambah kontak footer' },
  'contact_persons.update': { group: 'Kontak Footer', label: 'Ubah kontak footer' },
  'contact_persons.delete': { group: 'Kontak Footer', label: 'Hapus kontak footer' },

  'settings.manage': {
    group: 'Pengaturan',
    label: 'Ubah pengaturan umum & maintenance',
  },
  'settings.backup': {
    group: 'Pengaturan',
    label: 'Unduh backup',
    description: 'File backup memuat data pribadi (pesan kontak dan staff).',
  },
  'settings.restore': {
    group: 'Pengaturan',
    label: 'Restore backup',
    description: 'Menimpa data website dengan isi file backup.',
  },
} as const satisfies Record<string, PermissionDefinition>

export type Permission = keyof typeof PERMISSIONS

/** Satu permission, atau beberapa permission yang cukup dimiliki salah satunya. */
export type PermissionRequirement = Permission | readonly Permission[]

export const PERMISSION_KEYS = Object.keys(PERMISSIONS) as Permission[]

export function isPermission(value: unknown): value is Permission {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(PERMISSIONS, value)
}

export interface PermissionGroup {
  group: string
  items: Array<{ key: Permission; label: string; description?: string }>
}

export function groupPermissions(): PermissionGroup[] {
  const groups = new Map<string, PermissionGroup>()
  for (const key of PERMISSION_KEYS) {
    const definition: PermissionDefinition = PERMISSIONS[key]
    let group = groups.get(definition.group)
    if (!group) {
      group = { group: definition.group, items: [] }
      groups.set(definition.group, group)
    }
    group.items.push({ key, label: definition.label, description: definition.description })
  }
  return [...groups.values()]
}

/** Super admin selalu lolos. Untuk array, cukup memiliki salah satunya. */
export function grantsPermission(
  subject: { isSuperAdmin: boolean; permissions: readonly string[] } | null | undefined,
  required: PermissionRequirement,
): boolean {
  if (!subject) return false
  if (subject.isSuperAdmin) return true
  const list: readonly Permission[] = typeof required === 'string' ? [required] : required
  return list.some((permission) => subject.permissions.includes(permission))
}
