import { defineStore } from 'pinia'
import * as tmdb from '../services/tmdb'
import { parseApiError } from '../utils/format'
import { isAbortError } from '../utils/listQuery'
import {
  applyListPayload,
  categoryFetchers,
  discoverExtras,
  discoverSort,
  resetListPayload,
} from '../utils/catalog'

function createBucket() {
  return {
    list: [],
    page: 1,
    totalPages: 1,
    totalResults: 0,
    loading: false,
    error: null,
    selectedGenreIds: [],
  }
}

const controllers = {
  home: null,
  category: null,
  search: null,
}

export const useMovieListStore = defineStore('movieList', {
  state: () => ({
    home: createBucket(),
    category: createBucket(),
    search: createBucket(),
    heroSlides: [],
  }),

  actions: {
    beginRequest(scope) {
      controllers[scope]?.abort()
      const controller = new AbortController()
      controllers[scope] = controller
      return controller.signal
    },

    isCurrentSignal(scope, signal) {
      return controllers[scope]?.signal === signal
    },

    async fetchCategoryData({ type = 'popular', page = 1, genreIds = [], signal } = {}) {
      if (genreIds.length) {
        const response = await tmdb.discoverMovies({
          page,
          withGenres: genreIds.join('|'),
          sortBy: discoverSort[type] || 'popularity.desc',
          extra: discoverExtras(type),
          signal,
        })
        return response.data
      }

      const fetcher = categoryFetchers[type] || tmdb.getPopularMovies
      const response = await fetcher(page, { signal })
      return response.data
    },

    async loadHome({ page = 1, genreIds = [] } = {}) {
      const bucket = this.home
      const signal = this.beginRequest('home')

      bucket.loading = true
      bucket.error = null
      bucket.selectedGenreIds = [...genreIds]

      try {
        const data = await this.fetchCategoryData({
          type: 'popular',
          page,
          genreIds,
          signal,
        })
        applyListPayload(bucket, data)

        // Hero and home list share the same /popular response when possible
        if (page === 1 && !genreIds.length) {
          this.heroSlides = (data.results ?? [])
            .filter((movie) => movie.backdrop_path)
            .slice(0, 8)
        }
      } catch (error) {
        if (isAbortError(error)) return
        resetListPayload(bucket)
        bucket.error = parseApiError(error)
      } finally {
        if (this.isCurrentSignal('home', signal)) {
          bucket.loading = false
        }
      }
    },

    async loadCategory({ type = 'popular', page = 1, genreIds = [] } = {}) {
      const bucket = this.category
      const signal = this.beginRequest('category')

      bucket.loading = true
      bucket.error = null
      bucket.selectedGenreIds = [...genreIds]

      try {
        const data = await this.fetchCategoryData({ type, page, genreIds, signal })
        applyListPayload(bucket, data)
      } catch (error) {
        if (isAbortError(error)) return
        resetListPayload(bucket)
        bucket.error = parseApiError(error)
      } finally {
        if (this.isCurrentSignal('category', signal)) {
          bucket.loading = false
        }
      }
    },

    async loadSearch({ query = '', page = 1 } = {}) {
      const bucket = this.search
      const signal = this.beginRequest('search')

      if (!query) {
        controllers.search?.abort()
        resetListPayload(bucket)
        bucket.error = null
        bucket.loading = false
        return
      }

      bucket.loading = true
      bucket.error = null

      try {
        const response = await tmdb.searchMovies(query, page, { signal })
        applyListPayload(bucket, response.data)
      } catch (error) {
        if (isAbortError(error)) return
        resetListPayload(bucket)
        bucket.error = parseApiError(error)
      } finally {
        if (this.isCurrentSignal('search', signal)) {
          bucket.loading = false
        }
      }
    },
  },
})
