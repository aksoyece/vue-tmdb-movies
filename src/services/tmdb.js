import http from './http'

const REGION = 'TR'

export function getPopularMovies(page = 1, { signal } = {}) {
  return http.get('/movie/popular', { params: { page }, signal })
}

export function getTopRatedMovies(page = 1, { signal } = {}) {
  return http.get('/movie/top_rated', { params: { page }, signal })
}

export function getUpcomingMovies(page = 1, { signal } = {}) {
  return http.get('/movie/upcoming', { params: { page, region: REGION }, signal })
}

export function getNowPlayingMovies(page = 1, { signal } = {}) {
  return http.get('/movie/now_playing', { params: { page, region: REGION }, signal })
}

export function searchMovies(query, page = 1, { signal } = {}) {
  return http.get('/search/movie', {
    params: {
      query,
      page,
      include_adult: false,
    },
    signal,
  })
}

export function getMovieDetails(id, { signal } = {}) {
  return http.get(`/movie/${id}`, { signal })
}

export function getSimilarMovies(id, page = 1, { signal } = {}) {
  return http.get(`/movie/${id}/similar`, { params: { page }, signal })
}

export function getMovieVideos(id, { signal } = {}) {
  // Override global tr-TR so we get original/English trailers, not Turkish dubs
  return http.get(`/movie/${id}/videos`, {
    params: {
      language: 'en-US',
      include_video_language: 'en-US,en,null,fr,de,es,it,ja,ko,zh,hi,pt',
    },
    signal,
  })
}

export function getGenreList({ signal } = {}) {
  return http.get('/genre/movie/list', { signal })
}

export function discoverMovies({
  page = 1,
  withGenres,
  sortBy = 'popularity.desc',
  extra = {},
  signal,
} = {}) {
  return http.get('/discover/movie', {
    params: {
      page,
      with_genres: withGenres,
      sort_by: sortBy,
      include_adult: false,
      ...extra,
    },
    signal,
  })
}

export const categoryLabels = {
  popular: 'Popüler',
  top_rated: 'En İyiler',
  upcoming: 'Yakında',
  now_playing: 'Vizyonda',
}
