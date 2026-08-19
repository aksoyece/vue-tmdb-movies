import { defineStore } from 'pinia'
import { getGenreList } from '../services/tmdb'

export const useGenresStore = defineStore('genres', {
  state: () => ({
    list: [],
    loaded: false,
  }),

  actions: {
    async load() {
      if (this.loaded) return
      try {
        const response = await getGenreList()
        this.list = response.data.genres ?? []
        this.loaded = true
      } catch {
        this.list = []
      }
    },
  },
})
