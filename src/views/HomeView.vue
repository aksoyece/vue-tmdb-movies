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
import HeroSection from '../components/movie/HeroSection.vue'
import { useMovieListStore } from '../stores/movieList'
import { buildListQuery, parseGenreIds, parsePage } from '../utils/listQuery'

const route = useRoute()
const router = useRouter()
const listStore = useMovieListStore()
const { home } = storeToRefs(listStore)

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
  listStore.loadHome({ page: page.value, genreIds: genreIds.value })
}

watch(
  () => [page.value, genreIds.value.join(',')],
  () => {
    reload()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  { immediate: true },
)
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
        <Loader v-if="home.loading" />
        <ErrorState v-else-if="home.error" :message="home.error" @retry="reload" />
        <EmptyState v-else-if="!home.list.length" message="Bu filtreye uygun popüler film bulunamadı." />
        <template v-else>
          <div class="results-badge">
            <span class="results-count">{{ home.totalResults.toLocaleString('tr-TR') }}</span>
            <span class="results-label">film listelendi</span>
          </div>
          <MovieGrid :movies="home.list" />
          <PaginationBar :page="home.page" :total-pages="home.totalPages" @change="setPage" />
        </template>
      </div>
    </div>
  </section>
</template>
