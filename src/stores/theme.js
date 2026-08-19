import { defineStore } from 'pinia'

const STORAGE_KEY = 'cinerota-theme'

function readTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('cinevue-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: readTheme(),
  }),

  getters: {
    isDark: (state) => state.mode === 'dark',
  },

  actions: {
    apply() {
      document.documentElement.dataset.theme = this.mode
      localStorage.setItem(STORAGE_KEY, this.mode)
    },
    toggle() {
      this.mode = this.mode === 'dark' ? 'light' : 'dark'
      this.apply()
    },
  },
})
