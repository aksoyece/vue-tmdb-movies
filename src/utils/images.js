const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export function posterUrl(path, size = 'w500') {
  if (!path) return '/placeholder-poster.svg'
  return `${IMAGE_BASE}/${size}${path}`
}

export function backdropUrl(path, size = 'w1280') {
  if (!path) return ''
  return `${IMAGE_BASE}/${size}${path}`
}
