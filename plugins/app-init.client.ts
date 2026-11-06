import { useAppStore } from '~/stores/app'

export default defineNuxtPlugin((nuxtApp) => {
  const store = useAppStore()
  // HTML hasil SSR selalu bertema terang. Tema dari localStorage baru diterapkan
  // setelah hydration agar ikon tombol tema ikut diperbarui: Vue tidak menambal
  // atribut yang berbeda saat hydration.
  nuxtApp.hook('app:suspense:resolve', () => store.initTheme())
})
