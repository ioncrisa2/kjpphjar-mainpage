export default defineNuxtRouteMiddleware(async (to) => {
  // Only guard /admin/* routes (except /admin/login)
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') return

  const { session, fetchSession, can } = useAdminAuth()
  // Saat hydration, sesi hasil render server sudah tersedia.
  const current = import.meta.client && useNuxtApp().isHydrating && session.value
    ? session.value
    : await fetchSession()

  if (!current) {
    return navigateTo('/admin/login')
  }

  const denied =
    (to.meta.superAdminOnly && !current.isSuperAdmin) ||
    (to.meta.permission && !can(to.meta.permission))
  if (denied) {
    // Dashboard selalu bisa diakses semua user yang login. Pesan dibawa lewat
    // query agar tetap tampil setelah redirect dari server (akses langsung URL).
    return navigateTo({ path: '/admin', query: { akses: 'ditolak' } })
  }
})
