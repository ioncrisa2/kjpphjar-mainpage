import { useAppStore } from '~/stores/app'

export default defineNuxtPlugin(() => {
  const store = useAppStore()
  store.initTheme()
})
