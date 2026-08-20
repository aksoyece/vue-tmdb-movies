# CineRota

Vue 3 + TMDB API ile geliştirilmiş modern film keşif uygulaması.

🌐 **Canlı site:** https://aksoyece.github.io/vue-tmdb-movies/

![CineRota önizleme](cinerota.png)

---

## Özellikler

### Task kapsamı

- 🎬 Popüler, En İyiler, Yakında ve Vizyonda kategorileri
- 🔍 Film arama
- 📄 Film detay sayfası
- ⚡ Sayfalama
- 📱 Mobil, tablet ve masaüstü uyumlu tasarım
- ⚠️ Loading / error / empty durumları

### Ekstra özellikler

Task dışı eklenenler:

- 🎞️ **Hero section** — Ana sayfada öne çıkan filmler backdrop ile gösterilir
- ❤️ **Favoriler** — Filmleri favorilere ekle / çıkar (localStorage ile kalıcı)
- 🌗 **Dark / Light tema** — Header’daki butonla geçiş yapılır (tercih kaydedilir)
- 🎭 **Çoklu tür filtresi** — Birden fazla tür seçilebilir
- 🔗 **Benzer filmler** — Detay sayfasında benzer öneriler listelenir
- ✨ Splash ekranı — Siteye ilk girişte kısa marka ekranı
- ▶️ **Fragman** — Detay sayfasında YouTube fragmanı modal ile izlenir

## Ekstra özelliklerin kullanımı

### Hero section
- Ana sayfanın en üstünde otomatik olarak kayar (4 sn)
- Üzerine gelince kayma durur
- Ok butonları yalnızca hover’da görünür
- Sürükleyerek veya altındaki noktalara basarak manuel geçiş yapılabilir
- **Detayları Gör** ile film detay sayfasına gidilir

### Fragman
- Film detay sayfasında **Fragmanı İzle** butonu görünür (YouTube fragmanı varsa)
- Butona basınca modal açılır ve fragman oynatılır
- ESC, X veya dışarı tıklayarak kapatılır
- Fragmanı olmayan filmlerde buton gösterilmez

### Favoriler
- Film kartındaki kalp ikonuna veya detay sayfasındaki butona basarak eklenir / çıkarılır
- Header’daki kalp ikonuyla Favoriler sayfasına gidilir
- Veriler tarayıcıda `localStorage` içinde saklanır

### Tema
- Header’daki güneş / ay ikonuyla dark ↔ light geçişi yapılır
- Seçim `localStorage` ile hatırlanır

### Tür filtresi
- Liste sayfalarında soldaki (mobilde üstteki) panelden tür seçilir
- Birden fazla tür aynı anda seçilebilir
- **Tümü** ile filtre temizlenir

### Benzer filmler
- Film detay sayfasının altında TMDB benzer filmleri gösterilir

## Mimari notlar

- Liste/arama state’i `movieList` store’unda; detay/fragman/benzer filmler `movieDetail` store’unda
- Home, kategori ve arama kendi bucket’larında tutulur (birbirinin listesini ezmez)
- Hızlı sayfa/arama değişiminde eski istekler `AbortController` ile iptal edilir
- Hero, ana sayfadaki `/popular` cevabından beslenir (ayrı istek atmaz)
- Sayfa numarası ve tür filtresi URL query’de tutulur (`?page=2&genres=28,12`)

## Teknolojiler

| Teknoloji | Kullanım amacı |
|-----------|----------------|
| Vue 3 (Composition API) | UI framework |
| Vite | Build tool |
| Vue Router | Sayfa yönlendirme |
| Pinia | State management |
| Axios | HTTP istekleri |
| TMDB API | Film verisi |

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Ortam değişkenlerini ayarla (Mac/Linux/Git Bash)
cp .env.example .env
```

Windows PowerShell / CMD:

```powershell
copy .env.example .env
```

`.env` dosyasına [TMDB API anahtarını](https://www.themoviedb.org/settings/api) ekle:

```
VITE_TMDB_API_KEY=senin_api_anahtarin
```

```bash
# Geliştirme sunucusunu başlat
npm run dev
```

## Klasör yapısı

```
src/
├── components/
│   ├── layout/     AppHeader, AppFooter
│   ├── movie/      MovieCard, MovieGrid, HeroSection
│   └── ui/         GenreFilter, PaginationBar, Loader, TrailerModal, AppIcon...
├── views/          HomeView, CategoryView, SearchView, MovieDetailView, FavoritesView
├── router/         Vue Router tanımları
├── stores/         Pinia store'ları (movieList, movieDetail, favorites, genres, theme)
├── services/       TMDB API istekleri
└── utils/          Tarih, puan ve görsel yardımcı fonksiyonlar
```
