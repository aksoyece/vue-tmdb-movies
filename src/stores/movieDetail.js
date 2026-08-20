import { defineStore } from 'pinia'
import * as tmdb from '../services/tmdb'
import { parseApiError } from '../utils/format'
import { isAbortError } from '../utils/listQuery'

let detailsController = null
let similarController = null

export const useMovieDetailStore = defineStore('movieDetail', {
  state: () => ({
    details: null,
    detailsLoading: false,
    detailsError: null,
    trailerKey: null,
    similar: [],
    similarLoading: false,
  }),

  actions: {
    pickTrailerKey(videos = [], originalLanguage = 'en') {
      const youtube = videos.filter((video) => video.site === 'YouTube' && video.key)
      const withoutTurkish = youtube.filter((video) => {
        const name = video.name || ''
        const isTurkishLang = video.iso_639_1 === 'tr'
        const isTurkishName = /t[uü]rk[cç]e|turkish|dublaj/i.test(name)
        return !isTurkishLang && !isTurkishName
      })

      const pool = withoutTurkish.length ? withoutTurkish : youtube

      function prefer(list) {
        if (!list.length) return null
        return (
          list.find((video) => video.iso_639_1 === originalLanguage && video.official) ||
          list.find((video) => video.iso_639_1 === originalLanguage) ||
          list.find((video) => video.official && video.type === 'Trailer') ||
          list.find((video) => video.type === 'Trailer') ||
          list.find((video) => video.type === 'Teaser') ||
          list[0]
        )
      }

      const trailers = pool.filter((video) => video.type === 'Trailer')
      const teasers = pool.filter((video) => video.type === 'Teaser')
      return prefer(trailers)?.key || prefer(teasers)?.key || prefer(pool)?.key || null
    },

    async loadDetails(id) {
      detailsController?.abort()
      const controller = new AbortController()
      detailsController = controller
      const signal = controller.signal

      this.detailsLoading = true
      this.detailsError = null
      this.details = null
      this.trailerKey = null

      try {
        const [detailsResponse, videosResponse] = await Promise.all([
          tmdb.getMovieDetails(id, { signal }),
          tmdb.getMovieVideos(id, { signal }),
        ])
        this.details = detailsResponse.data
        this.trailerKey = this.pickTrailerKey(
          videosResponse.data.results ?? [],
          this.details.original_language || 'en',
        )
      } catch (error) {
        if (isAbortError(error)) return
        this.detailsError = parseApiError(error)
        this.trailerKey = null
      } finally {
        if (detailsController === controller) {
          this.detailsLoading = false
        }
      }
    },

    async loadSimilar(id) {
      similarController?.abort()
      const controller = new AbortController()
      similarController = controller
      const signal = controller.signal

      this.similarLoading = true
      this.similar = []

      try {
        const response = await tmdb.getSimilarMovies(id, 1, { signal })
        this.similar = (response.data.results ?? []).slice(0, 10)
      } catch (error) {
        if (isAbortError(error)) return
        this.similar = []
      } finally {
        if (similarController === controller) {
          this.similarLoading = false
        }
      }
    },
  },
})
