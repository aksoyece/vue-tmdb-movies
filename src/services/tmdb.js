import http from './http'

const REGION = 'TR'

export function getPopularMovies(page = 1) {
  return http.get('/movie/popular', { params: { page } })
}

export function getTopRatedMovies(page = 1) {
  return http.get('/movie/top_rated', { params: { page } })
}

export function getUpcomingMovies(page = 1) {
  return http.get('/movie/upcoming', { params: { page, region: REGION } })
}

export function getNowPlayingMovies(page = 1) {
  return http.get('/movie/now_playing', { params: { page, region: REGION } })
}

export function searchMovies(query, page = 1) {
  return http.get('/search/movie', {
    params: {
      query,
      page,
      include_adult: false,
    },
  })
}

export function getMovieDetails(id) {
  return http.get(`/movie/${id}`)
}

export function getSimilarMovies(id, page = 1) {
  return http.get(`/movie/${id}/similar`, { params: { page } })
}

export function getMovieVideos(id) {
  // Override global tr-TR so we get original/English trailers, not Turkish dubs
  return http.get(`/movie/${id}/videos`, {
    params: {
      language: 'en-US',
      include_video_language: 'en-US,en,null,fr,de,es,it,ja,ko,zh,hi,pt',
    },
  })
}

export function getGenreList() {
  return http.get('/genre/movie/list')
}

export function discoverMovies({
  page = 1,
  withGenres,
  sortBy = 'popularity.desc',
  extra = {},
} = {}) {
  return http.get('/discover/movie', {
    params: {
      page,
      with_genres: withGenres,
      sort_by: sortBy,
      include_adult: false,
      ...extra,
    },
  })
}

export const categoryLabels = {
  popular: 'Popüler',
  top_rated: 'En İyiler',
  upcoming: 'Yakında',
  now_playing: 'Vizyonda',
}
