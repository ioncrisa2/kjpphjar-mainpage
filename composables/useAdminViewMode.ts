export type AdminViewMode = 'grid' | 'table'

/**
 * Menyimpan preferensi mode tampilan (kartu/tabel) per halaman admin
 * dengan aman terhadap SSR hydration (sinkronisasi localStorage saat mounted).
 */
export function useAdminViewMode(key: string, defaultMode: AdminViewMode = 'table') {
  const mode = useState<AdminViewMode>(`admin-view-mode:${key}`, () => defaultMode)

  onMounted(() => {
    if (!import.meta.client) return
    try {
      const saved = localStorage.getItem(`admin_view_mode_${key}`)
      if (saved === 'grid' || saved === 'table') {
        mode.value = saved
      }
    } catch {
      // Abaikan jika akses storage dibatasi browser.
    }
  })

  watch(mode, (next) => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(`admin_view_mode_${key}`, next)
    } catch {
      // Abaikan jika akses storage dibatasi browser.
    }
  })

  return mode
}
