import axios from 'axios'

const apiKey = import.meta.env.VITE_TMDB_API_KEY

const http = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 15000,
  params: {
    language: 'tr-TR',
    ...(apiKey ? { api_key: apiKey } : {}),
  },
})

http.interceptors.request.use((config) => {
  if (!apiKey) {
    const error = new Error('TMDB API anahtarı tanımlı değil.')
    error.code = 'MISSING_API_KEY'
    return Promise.reject(error)
  }
  return config
})

export default http
