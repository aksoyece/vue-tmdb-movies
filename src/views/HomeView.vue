<script setup>
import { computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import MovieGrid from '../components/movie/MovieGrid.vue'
import PaginationBar from '../components/ui/PaginationBar.vue'
import Loader from '../components/ui/Loader.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import GenreFilter from '../components/ui/GenreFilter.vue'
import { useMoviesStore } from '../stores/movies'
import HeroSection from '../components/movie/HeroSection.vue'

const movies = useMoviesStore()
const { list, loading, error, page, totalPages, totalResults, selectedGenreIds } = storeToRefs(movies)

const genreModel = computed({
  get: () => selectedGenreIds.value,
  set: (value) => {
    movies.setGenres(value)
    load(1)
  },
})

function load(nextPage = 1) {
  movies.loadCategory('popular', nextPage)
}

onMounted(() => {
  movies.setGenres([])
  load(1)
})

watch(page, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<template>
  <section>
    <HeroSection />

    <div class="page-head">
      <div>
        <p class="page-kicker">Ana sayfa</p>
        <h1 class="page-title">Popüler filmler</h1>
        <p class="page-subtitle">TMDB üzerindeki güncel popüler yapımlar.</p>
      </div>
    </div>

    <div class="catalog">
      <GenreFilter v-model="genreModel" />

      <div class="catalog-main">
        <Loader v-if="loading" />
        <ErrorState v-else-if="error" :message="error" @retry="load(page)" />
        <EmptyState v-else-if="!list.length" message="Bu filtreye uygun popüler film bulunamadı." />
        <template v-else>
          <div class="results-badge">
            <span class="results-count">{{ totalResults.toLocaleString('tr-TR') }}</span>
            <span class="results-label">film listelendi</span>
          </div>
          <MovieGrid :movies="list" />
          <PaginationBar :page="page" :total-pages="totalPages" @change="load" />
        </template>
      </div>
    </div>
  </section>
</template>
