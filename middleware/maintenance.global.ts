import type { PublicAppSettings } from '~/types/settings'

export default defineNuxtRouteMiddleware(async (to) => {
  if (
    to.path === '/maintenance' ||
    to.path.startsWith('/maintenance/') ||
    to.path === '/admin' ||
    to.path.startsWith('/admin/')
  ) {
    return
  }

  try {
    const requestFetch = import.meta.server ? useRequestFetch() : $fetch
    const settings = await requestFetch<PublicAppSettings>('/api/settings')
    if (!settings.maintenanceMode.isActive) return

    try {
      await requestFetch('/api/settings/session')
      return
    } catch {
      return navigateTo('/maintenance')
    }
  } catch (error) {
    console.error('[Maintenance] Pemeriksaan client gagal; navigasi dilanjutkan.', error)
  }
})
