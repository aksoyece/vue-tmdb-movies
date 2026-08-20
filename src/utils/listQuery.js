export function isAbortError(error) {
  return (
    error?.code === 'ERR_CANCELED' ||
    error?.name === 'CanceledError' ||
    error?.name === 'AbortError'
  )
}

export function parsePage(query = {}) {
  const value = Number(query.page)
  if (!Number.isFinite(value) || value < 1) return 1
  return Math.floor(value)
}

export function parseGenreIds(query = {}) {
  const raw = query.genres
  if (!raw) return []
  return String(raw)
    .split(',')
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0)
}

export function buildListQuery({ page = 1, genres = [], extra = {} } = {}) {
  const query = { ...extra }

  if (page > 1) query.page = String(page)
  else delete query.page

  if (genres.length) query.genres = genres.join(',')
  else delete query.genres

  return query
}
