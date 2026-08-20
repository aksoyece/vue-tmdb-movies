import { defineStore } from 'pinia'
import * as tmdb from '../services/tmdb'
import { parseApiError } from '../utils/format'

const categoryFetchers = {
  popular: tmdb.getPopularMovies,
  top_rated: tmdb.getTopRatedMovies,
  upcoming: tmdb.getUpcomingMovies,
  now_playing: tmdb.getNowPlayingMovies,
}

const discoverSort = {
  popular: 'popularity.desc',
  top_rated: 'vote_average.desc',
  upcoming: 'primary_release_date.asc',
  now_playing: 'popularity.desc',
}

function toIsoDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

function discoverExtras(type) {
  const today = new Date()
  if (type === 'upcoming') {
    return {
      region: 'TR',
      'release_date.gte': toIsoDate(today),
      'release_date.lte': toIsoDate(addDays(today, 90)),
      with_release_type: '3|2',
    }
  }
  if (type === 'now_playing') {
    return {
      region: 'TR',
      'release_date.gte': toIsoDate(addDays(today, -45)),
      'release_date.lte': toIsoDate(today),
      with_release_type: '3|2',
    }
  }
  if (type === 'top_rated') {
    return { 'vote_count.gte': 200 }
  }
  return {}
}

export const useMoviesStore = defineStore('movies', {
  state: () => ({
    list: [],
    page: 1,
    totalPages: 1,
    totalResults: 0,
    loading: false,
    error: null,
    selectedGenreIds: [],
    details: null,
    detailsLoading: false,
    detailsError: null,
    trailerKey: null,
    similar: [],
    similarLoading: false,
  }),

  actions: {
    setGenres(ids) {
      this.selectedGenreIds = Array.isArray(ids) ? [...ids] : []
    },

    clearList() {
      this.list = []
      this.page = 1
      this.totalPages = 1
      this.totalResults = 0
      this.error = null
      this.loading = false
    },

    async loadCategory(type = 'popular', page = 1) {
      this.loading = true
      this.error = null

      try {
        let data
        if (this.selectedGenreIds.length) {
          const response = await tmdb.discoverMovies({
            page,
            withGenres: this.selectedGenreIds.join('|'),
            sortBy: discoverSort[type] || 'popularity.desc',
            extra: discoverExtras(type),
          })
          data = response.data
        } else {
          const fetcher = categoryFetchers[type] || tmdb.getPopularMovies
          const response = await fetcher(page)
          data = response.data
        }

        this.list = data.results ?? []
        this.page = data.page ?? 1
        this.totalPages = Math.min(data.total_pages ?? 1, 500)
        this.totalResults = data.total_results ?? 0
      } catch (error) {
        this.list = []
        this.totalPages = 1
        this.totalResults = 0
        this.error = parseApiError(error)
      } finally {
        this.loading = false
      }
    },

    async search(query, page = 1) {
      this.loading = true
      this.error = null

      try {
        const response = await tmdb.searchMovies(query, page)
        const data = response.data
        this.list = data.results ?? []
        this.page = data.page ?? 1
        this.totalPages = Math.min(data.total_pages ?? 1, 500)
        this.totalResults = data.total_results ?? 0
      } catch (error) {
        this.list = []
        this.totalPages = 1
        this.totalResults = 0
        this.error = parseApiError(error)
      } finally {
        this.loading = false
      }
    },

    pickTrailerKey(videos = []) {
      const youtube = videos.filter((video) => video.site === 'YouTube' && video.key)
      const trailer = youtube.find((video) => video.type === 'Trailer')
      const teaser = youtube.find((video) => video.type === 'Teaser')
      return trailer?.key || teaser?.key || youtube[0]?.key || null
    },

    async loadDetails(id) {
      this.detailsLoading = true
      this.detailsError = null
      this.details = null
      this.trailerKey = null
      this.similar = []

      try {
        const [detailsResponse, videosResponse] = await Promise.all([
          tmdb.getMovieDetails(id),
          tmdb.getMovieVideos(id),
        ])
        this.details = detailsResponse.data
        this.trailerKey = this.pickTrailerKey(videosResponse.data.results ?? [])
      } catch (error) {
        this.detailsError = parseApiError(error)
        this.trailerKey = null
      } finally {
        this.detailsLoading = false
      }
    },

    async loadSimilar(id) {
      this.similarLoading = true
      try {
        const response = await tmdb.getSimilarMovies(id)
        this.similar = (response.data.results ?? []).slice(0, 10)
      } catch {
        this.similar = []
      } finally {
        this.similarLoading = false
      }
    },
  },
})
