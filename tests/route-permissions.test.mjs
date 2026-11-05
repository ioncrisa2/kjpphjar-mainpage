// Jalankan: npm test (butuh Node >= 22.18 untuk import file .ts langsung).
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isPrivateApiRoute, resolveRoutePermission } from '../server/utils/route-permissions.ts'
import { isPermission } from '../shared/permissions.ts'

function request(method, url) {
  const parsed = new URL(url, 'http://localhost')
  return {
    method,
    path: parsed.pathname,
    query: Object.fromEntries(parsed.searchParams.entries()),
  }
}

describe('rute publik tetap terbuka', () => {
  const publicRoutes = [
    ['POST', '/api/contacts/submit'],
    ['POST', '/api/analytics/track'],
    ['PATCH', '/api/blog/judul-artikel/view'],
    ['GET', '/api/blog'],
    ['GET', '/api/blog/judul-artikel'],
    ['GET', '/api/gallery'],
    ['GET', '/api/gallery?featured=true'],
    ['GET', '/api/clients'],
    ['GET', '/api/faq'],
    ['GET', '/api/careers'],
    ['GET', '/api/services'],
    ['GET', '/api/services/abc'],
    ['GET', '/api/leaders'],
    ['GET', '/api/leaders/abc'],
    ['GET', '/api/branches'],
    ['GET', '/api/contact-persons'],
    ['GET', '/api/categories'],
    ['GET', '/api/settings'],
    ['GET', '/api/auth/me'],
    ['POST', '/api/auth/login'],
  ]

  for (const [method, url] of publicRoutes) {
    it(`${method} ${url}`, () => {
      assert.equal(isPrivateApiRoute(request(method, url)), false)
    })
  }
})

describe('rute privat dipetakan ke permission yang benar', () => {
  const cases = [
    ['GET', '/api/admin/blog', 'blog.view'],
    ['GET', '/api/admin/blog/123', 'blog.view'],
    ['POST', '/api/admin/blog', 'blog.create'],
    ['PUT', '/api/admin/blog/123', 'blog.update'],
    ['DELETE', '/api/admin/blog/123', 'blog.delete'],
    ['POST', '/api/admin/blog/upload-image', ['blog.create', 'blog.update']],
    ['GET', '/api/admin/categories', ['blog.view', 'blog.categories']],
    ['POST', '/api/admin/categories', 'blog.categories'],
    ['PUT', '/api/admin/categories/123', 'blog.categories'],
    ['DELETE', '/api/admin/categories/123', 'blog.categories'],
    ['GET', '/api/blog?admin=true', 'blog.view'],
    ['POST', '/api/services', 'services.create'],
    ['PUT', '/api/services/reorder', 'services.update'],
    ['PUT', '/api/services/123', 'services.update'],
    ['DELETE', '/api/services/123', 'services.delete'],
    ['GET', '/api/faq?admin=true', 'faq.view'],
    ['POST', '/api/faq', 'faq.create'],
    ['PUT', '/api/faq/reorder', 'faq.update'],
    ['DELETE', '/api/faq/123', 'faq.delete'],
    ['GET', '/api/careers?admin=true', 'careers.view'],
    ['POST', '/api/careers', 'careers.create'],
    ['PUT', '/api/careers/123', 'careers.update'],
    ['DELETE', '/api/careers/123', 'careers.delete'],
    ['GET', '/api/gallery?admin=true', 'gallery.view'],
    ['POST', '/api/gallery', 'gallery.create'],
    ['PATCH', '/api/gallery/123', 'gallery.update'],
    ['DELETE', '/api/gallery/123', 'gallery.delete'],
    ['POST', '/api/leaders', 'leaders.create'],
    ['PUT', '/api/leaders/123', 'leaders.update'],
    ['DELETE', '/api/leaders/123', 'leaders.delete'],
    ['GET', '/api/staff', 'staff.view'],
    ['POST', '/api/staff', 'staff.create'],
    ['PUT', '/api/staff/123', 'staff.update'],
    ['DELETE', '/api/staff/123', 'staff.delete'],
    ['POST', '/api/branches', 'branches.create'],
    ['PUT', '/api/branches/123', 'branches.update'],
    ['DELETE', '/api/branches/123', 'branches.delete'],
    ['GET', '/api/clients?all=true', 'clients.view'],
    ['POST', '/api/clients', 'clients.create'],
    ['PUT', '/api/clients/reorder', 'clients.update'],
    ['PUT', '/api/clients/123', 'clients.update'],
    ['DELETE', '/api/clients/123', 'clients.delete'],
    ['GET', '/api/contacts', 'contacts.view'],
    ['GET', '/api/contacts?isRead=false', 'contacts.view'],
    ['GET', '/api/contacts/unread-count', 'contacts.view'],
    ['PATCH', '/api/contacts/123', 'contacts.update'],
    ['GET', '/api/contacts/export', 'contacts.export'],
    ['POST', '/api/contact-persons', 'contact_persons.create'],
    ['PUT', '/api/contact-persons/123', 'contact_persons.update'],
    ['DELETE', '/api/contact-persons/123', 'contact_persons.delete'],
    ['GET', '/api/analytics/overview', 'analytics.view'],
    ['GET', '/api/analytics/top-pages', 'analytics.view'],
    ['DELETE', '/api/analytics/purge', 'analytics.purge'],
    ['PUT', '/api/settings', 'settings.manage'],
    ['GET', '/api/settings/backup', 'settings.backup'],
    ['POST', '/api/settings/restore', 'settings.restore'],
  ]

  for (const [method, url, expected] of cases) {
    it(`${method} ${url}`, () => {
      const req = request(method, url)
      assert.equal(isPrivateApiRoute(req), true, 'harus privat')
      assert.deepEqual(resolveRoutePermission(req), expected)
    })
  }

  it('setiap permission yang dirujuk ada di katalog', () => {
    for (const [method, url] of cases) {
      const required = resolveRoutePermission(request(method, url))
      for (const permission of [required].flat()) {
        assert.ok(isPermission(permission), `${permission} tidak ada di katalog`)
      }
    }
  })
})

describe('rute privat tanpa aturan hanya untuk super admin', () => {
  const superAdminOnly = [
    ['GET', '/api/admin/users'],
    ['POST', '/api/admin/users'],
    ['PUT', '/api/admin/users/123'],
    ['POST', '/api/admin/users/123/reset-password'],
    ['GET', '/api/admin/roles'],
    ['PUT', '/api/admin/roles/123'],
    ['GET', '/api/admin/permissions'],
    ['GET', '/api/admin/sesuatu-baru'],
    ['POST', '/api/categories'],
    ['DELETE', '/api/blog/123'],
    ['GET', '/api/blog/123?admin=true'],
    ['GET', '/api/staff/'],
    ['GET', '/api/analytics/a/b'],
    ['PUT', '/api/gallery/123'],
    ['PATCH', '/api/clients/123'],
    ['DELETE', '/api/settings'],
  ]

  for (const [method, url] of superAdminOnly) {
    it(`${method} ${url}`, () => {
      const req = request(method, url)
      assert.equal(isPrivateApiRoute(req), true, 'harus privat')
      assert.equal(resolveRoutePermission(req), null)
    })
  }
})
