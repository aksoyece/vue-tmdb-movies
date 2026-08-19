<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import MovieGrid from '../components/movie/MovieGrid.vue'
import PaginationBar from '../components/ui/PaginationBar.vue'
import Loader from '../components/ui/Loader.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import GenreFilter from '../components/ui/GenreFilter.vue'
import { useMoviesStore } from '../stores/movies'
import { categoryLabels } from '../services/tmdb'

const route = useRoute()
const movies = useMoviesStore()
const { list, loading, error, page, totalPages, totalResults, selectedGenreIds } = storeToRefs(movies)

const type = computed(() => {
  const value = route.params.type
  return categoryLabels[value] ? value : 'popular'
})

const title = computed(() => categoryLabels[type.value] || 'Kategori')

const genreModel = computed({
  get: () => selectedGenreIds.value,
  set: (value) => {
    movies.setGenres(value)
    load(1)
  },
})

function load(nextPage = 1) {
  movies.loadCategory(type.value, nextPage)
}

watch(
  () => route.params.type,
  () => {
    movies.setGenres([])
    load(1)
  },
  { immediate: true },
)
</script>

<template>
  <section>
    <div class="page-head">
      <div>
        <p class="page-kicker">Kategori</p>
        <h1 class="page-title">{{ title }}</h1>
        <p class="page-subtitle">Seçili kategoriye göre film listesi.</p>
      </div>
    </div>

    <div class="catalog">
      <GenreFilter v-model="genreModel" />

      <div class="catalog-main">
        <Loader v-if="loading" />
        <ErrorState v-else-if="error" :message="error" @retry="load(page)" />
        <EmptyState v-else-if="!list.length" message="Bu kategoride gösterilecek film yok." />
        <template v-else>
          <p class="page-subtitle">Toplam {{ totalResults }} film</p>
          <MovieGrid :movies="list" />
          <PaginationBar :page="page" :total-pages="totalPages" @change="load" />
        </template>
      </div>
    </div>
  </section>
</template>
