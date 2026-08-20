<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import MovieGrid from '../components/movie/MovieGrid.vue'
import PaginationBar from '../components/ui/PaginationBar.vue'
import Loader from '../components/ui/Loader.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import GenreFilter from '../components/ui/GenreFilter.vue'
import { useMovieListStore } from '../stores/movieList'
import { categoryLabels } from '../services/tmdb'
import { buildListQuery, parseGenreIds, parsePage } from '../utils/listQuery'

const route = useRoute()
const router = useRouter()
const listStore = useMovieListStore()
const { category } = storeToRefs(listStore)

const type = computed(() => {
  const value = route.params.type
  return categoryLabels[value] ? value : 'popular'
})

const title = computed(() => categoryLabels[type.value] || 'Kategori')
const page = computed(() => parsePage(route.query))
const genreIds = computed(() => parseGenreIds(route.query))

const genreModel = computed({
  get: () => genreIds.value,
  set: (value) => {
    router.replace({
      query: buildListQuery({ page: 1, genres: value }),
    })
  },
})

function setPage(nextPage) {
  router.replace({
    query: buildListQuery({ page: nextPage, genres: genreIds.value }),
  })
}

function reload() {
  listStore.loadCategory({
    type: type.value,
    page: page.value,
    genreIds: genreIds.value,
  })
}

watch(
  () => [type.value, page.value, genreIds.value.join(',')],
  () => {
    reload()
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        <Loader v-if="category.loading" />
        <ErrorState v-else-if="category.error" :message="category.error" @retry="reload" />
        <EmptyState v-else-if="!category.list.length" message="Bu kategoride gösterilecek film yok." />
        <template v-else>
          <p class="page-subtitle">Toplam {{ category.totalResults }} film</p>
          <MovieGrid :movies="category.list" />
          <PaginationBar
            :page="category.page"
            :total-pages="category.totalPages"
            @change="setPage"
          />
        </template>
      </div>
    </div>
  </section>
</template>
