// Modul ini sengaja murni (hanya import type) agar bisa diuji langsung dengan
// `node --test tests/` tanpa runtime Nuxt.
import type { PermissionRequirement } from '~/shared/permissions'

export interface ApiRequest {
  method: string
  path: string
  query: Record<string, unknown>
}

const READ_METHODS = ['GET', 'HEAD', 'OPTIONS']

function isMutationMethod(method: string) {
  return !READ_METHODS.includes(method)
}

/**
 * Rute privat: semua bacaan privat dan setiap mutasi CMS. Pengecualian publik
 * ditulis eksplisit sehingga rute baru tidak terbuka tanpa sengaja.
 */
export function isPrivateApiRoute({ method, path, query }: ApiRequest): boolean {
  const isMutation = isMutationMethod(method)

  const isPublicContactSubmission = path === '/api/contacts/submit' && method === 'POST'
  const isPublicAnalyticsTrack = path === '/api/analytics/track' && method === 'POST'
  const isPublicBlogView = method === 'PATCH' && /^\/api\/blog\/[^/]+\/view$/.test(path)

  return (
    path.startsWith('/api/admin/') ||
    (path.startsWith('/api/analytics/') && !isPublicAnalyticsTrack) ||
    path === '/api/settings/backup' ||
    path === '/api/settings/restore' ||
    (path === '/api/settings' && isMutation) ||
    (path.startsWith('/api/categories') && isMutation) ||
    (path.startsWith('/api/contact-persons') && isMutation) ||
    (path.startsWith('/api/gallery') && (isMutation || query.admin === 'true')) ||
    (path.startsWith('/api/branches') && isMutation) ||
    (path.startsWith('/api/leaders') && isMutation) ||
    path === '/api/staff' ||
    path.startsWith('/api/staff/') ||
    (path.startsWith('/api/clients') && (isMutation || query.all === 'true')) ||
    (path.startsWith('/api/services') && isMutation) ||
    (path.startsWith('/api/faq') && (isMutation || query.admin === 'true')) ||
    (path.startsWith('/api/blog') && ((isMutation && !isPublicBlogView) || query.admin === 'true')) ||
    (path.startsWith('/api/careers') && (isMutation || query.admin === 'true')) ||
    (path.startsWith('/api/contacts') && !isPublicContactSubmission)
  )
}

interface RouteRule {
  methods: readonly string[]
  path: string | RegExp
  /** Semua pasangan query harus cocok persis. */
  query?: Record<string, string>
  permission: PermissionRequirement
}

const GET = ['GET', 'HEAD'] as const
const ID = '[^/]+'

function rule(
  methods: readonly string[],
  path: string | RegExp,
  permission: PermissionRequirement,
  query?: Record<string, string>,
): RouteRule {
  return { methods, path, permission, query }
}

/** Rute CRUD standar: POST koleksi, PUT/PATCH item, DELETE item. */
function crud(
  base: string,
  module: 'services' | 'faq' | 'careers' | 'gallery' | 'leaders' | 'staff' | 'branches' | 'clients' | 'contact_persons',
  updateMethod: 'PUT' | 'PATCH' = 'PUT',
): RouteRule[] {
  const item = new RegExp(`^${base}/${ID}$`)
  return [
    rule(['POST'], base, `${module}.create`),
    rule([updateMethod], item, `${module}.update`),
    rule(['DELETE'], item, `${module}.delete`),
  ]
}

/**
 * Peta rute privat → permission. Urutan penting: aturan pertama yang cocok
 * dipakai. Rute privat yang tidak ada di sini hanya bisa diakses super admin
 * (default-deny), termasuk /api/admin/users, /api/admin/roles, dan
 * /api/admin/permissions.
 */
const RULES: readonly RouteRule[] = [
  // Blog (panel admin)
  rule(['POST'], '/api/admin/blog/upload-image', ['blog.create', 'blog.update']),
  rule(GET, new RegExp(`^/api/admin/blog(?:/${ID})?$`), 'blog.view'),
  rule(['POST'], '/api/admin/blog', 'blog.create'),
  rule(['PUT'], new RegExp(`^/api/admin/blog/${ID}$`), 'blog.update'),
  rule(['DELETE'], new RegExp(`^/api/admin/blog/${ID}$`), 'blog.delete'),
  rule(GET, '/api/blog', 'blog.view', { admin: 'true' }),

  // Kategori blog: dibaca oleh form artikel, dikelola terpisah.
  rule(GET, '/api/admin/categories', ['blog.view', 'blog.categories']),
  rule(['POST'], '/api/admin/categories', 'blog.categories'),
  rule(['PUT', 'DELETE'], new RegExp(`^/api/admin/categories/${ID}$`), 'blog.categories'),

  rule(['PUT'], '/api/services/reorder', 'services.update'),
  ...crud('/api/services', 'services'),

  rule(GET, '/api/faq', 'faq.view', { admin: 'true' }),
  rule(['PUT'], '/api/faq/reorder', 'faq.update'),
  ...crud('/api/faq', 'faq'),

  rule(GET, '/api/careers', 'careers.view', { admin: 'true' }),
  ...crud('/api/careers', 'careers'),

  rule(GET, '/api/gallery', 'gallery.view', { admin: 'true' }),
  ...crud('/api/gallery', 'gallery', 'PATCH'),

  ...crud('/api/leaders', 'leaders'),

  rule(GET, '/api/staff', 'staff.view'),
  ...crud('/api/staff', 'staff'),

  ...crud('/api/branches', 'branches'),

  rule(GET, '/api/clients', 'clients.view', { all: 'true' }),
  rule(['PUT'], '/api/clients/reorder', 'clients.update'),
  ...crud('/api/clients', 'clients'),

  rule(GET, '/api/contacts/export', 'contacts.export'),
  rule(GET, '/api/contacts/unread-count', 'contacts.view'),
  rule(GET, '/api/contacts', 'contacts.view'),
  rule(['PATCH'], new RegExp(`^/api/contacts/${ID}$`), 'contacts.update'),

  ...crud('/api/contact-persons', 'contact_persons'),

  rule(['DELETE'], '/api/analytics/purge', 'analytics.purge'),
  rule(GET, new RegExp(`^/api/analytics/${ID}$`), 'analytics.view'),

  rule(['PUT'], '/api/settings', 'settings.manage'),
  rule(GET, '/api/settings/backup', 'settings.backup'),
  rule(['POST'], '/api/settings/restore', 'settings.restore'),
]

function matchesRule(target: RouteRule, { method, path, query }: ApiRequest) {
  if (!target.methods.includes(method)) return false
  const pathMatches = typeof target.path === 'string' ? target.path === path : target.path.test(path)
  if (!pathMatches) return false
  if (!target.query) return true
  return Object.entries(target.query).every(([key, value]) => query[key] === value)
}

/** null berarti tidak ada aturan → khusus super admin. */
export function resolveRoutePermission(request: ApiRequest): PermissionRequirement | null {
  return RULES.find((candidate) => matchesRule(candidate, request))?.permission ?? null
}
