import { defineStore } from 'pinia'

const STORAGE_KEY = 'cinerota-favorites'

function readFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('cinevue-favorites')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    items: readFavorites(),
  }),

  getters: {
    count: (state) => state.items.length,
    isFavorite: (state) => (id) => state.items.some((movie) => movie.id === id),
  },

  actions: {
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    },

    toggle(movie) {
      if (!movie?.id) return
      const exists = this.items.some((item) => item.id === movie.id)
      if (exists) {
        this.items = this.items.filter((item) => item.id !== movie.id)
      } else {
        this.items = [
          {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
          },
          ...this.items,
        ]
      }
      this.persist()
    },
  },
})
