import * as tmdb from '../services/tmdb'

export const categoryFetchers = {
  popular: tmdb.getPopularMovies,
  top_rated: tmdb.getTopRatedMovies,
  upcoming: tmdb.getUpcomingMovies,
  now_playing: tmdb.getNowPlayingMovies,
}

export const discoverSort = {
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

export function discoverExtras(type) {
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

export function applyListPayload(target, data) {
  target.list = data.results ?? []
  target.page = data.page ?? 1
  target.totalPages = Math.min(data.total_pages ?? 1, 500)
  target.totalResults = data.total_results ?? 0
}

export function resetListPayload(target) {
  target.list = []
  target.page = 1
  target.totalPages = 1
  target.totalResults = 0
}
