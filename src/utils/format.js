export function formatDate(value) {
  if (!value) return 'Tarih yok'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Tarih yok'
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatScore(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '—'
  }
  return Number(value).toFixed(1)
}

export function formatRuntime(minutes) {
  if (!minutes) return '—'
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return `${rest} dk`
  return `${hours} saat ${rest} dk`
}

export function parseApiError(error) {
  if (error?.code === 'MISSING_API_KEY') {
    return 'TMDB API anahtarı bulunamadı. .env dosyasına VITE_TMDB_API_KEY ekleyip uygulamayı yeniden başlatın.'
  }

  const status = error?.response?.status
  const message = error?.response?.data?.status_message

  if (status === 401) {
    return 'API anahtarı geçersiz. TMDB hesabınızdan aldığınız anahtarı kontrol edin.'
  }
  if (status === 404) {
    return 'Aradığınız içerik bulunamadı.'
  }
  if (status === 429) {
    return 'Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.'
  }
  if (message) return message
  if (!error?.response) {
    return 'Bağlantı hatası. İnternetinizi kontrol edip tekrar deneyin.'
  }
  return 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.'
}
