export default defineNuxtRouteMiddleware(async (to) => {
  // Only guard /admin/* routes (except /admin/login)
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') return

  const { data } = await useFetch('/api/auth/me')

  if (!data.value?.authenticated) {
    return navigateTo('/admin/login')
  }
})
