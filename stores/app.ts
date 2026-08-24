import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: 'light' as 'light' | 'dark',
  }),

  actions: {
    toggleTheme(payload: 'light' | 'dark') {
      this.theme = payload
      if (import.meta.client) {
        localStorage.setItem('theme', payload)
        document.querySelector('body')?.classList.toggle('dark', payload === 'dark')
      }
    },

    initTheme() {
      if (import.meta.client) {
        const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
        this.toggleTheme(saved || 'light')
      }
    },
  },
})
