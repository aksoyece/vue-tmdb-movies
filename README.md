# CineRota

Vue 3 + TMDB API ile geliştirilmiş film listeleme uygulaması.

Canlı site: https://aksoyece.github.io/vue-tmdb-film-listesi/

![CineRota ana sayfa](docs/cinerota.png)

## Özellikler

- Popüler, en iyi, yakında ve vizyondaki filmler
- Film detay sayfası
- Ada göre arama
- Sayfalama
- Responsive tasarım
- Favoriler, tema, tür filtresi ve benzer filmler

## Teknolojiler

Vue 3 · Vite · Vue Router · Pinia · Axios · TMDB API

## Kurulum

```bash
npm install
cp .env.example .env
```

`.env` dosyasına [TMDB API anahtarını](https://www.themoviedb.org/settings/api) yazın:

```
VITE_TMDB_API_KEY=anahtar
```

```bash
npm run dev
```

## Klasör yapısı

```text
src/
  components/   yeniden kullanılan arayüz parçaları
  views/        sayfalar
  router/       rotalar
  stores/       Pinia state
  services/     TMDB API istekleri
  utils/        tarih, puan ve görsel yardımcıları
```
