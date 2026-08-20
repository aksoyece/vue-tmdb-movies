<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import MovieGrid from '../components/movie/MovieGrid.vue'
import PaginationBar from '../components/ui/PaginationBar.vue'
import Loader from '../components/ui/Loader.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import { useMovieListStore } from '../stores/movieList'
import { parsePage } from '../utils/listQuery'

const route = useRoute()
const router = useRouter()
const listStore = useMovieListStore()
const { search } = storeToRefs(listStore)

const query = computed(() => String(route.query.q || '').trim())
const page = computed(() => parsePage(route.query))

function setPage(nextPage) {
  const nextQuery = { ...route.query }
  if (nextPage > 1) nextQuery.page = String(nextPage)
  else delete nextQuery.page
  router.replace({ query: nextQuery })
}

function reload() {
  listStore.loadSearch({ query: query.value, page: page.value })
}

watch(
  () => [query.value, page.value],
  () => {
    reload()
    if (query.value) window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  { immediate: true },
)
</script>

<template>
  <section>
    <div class="page-head">
      <div>
        <p class="page-kicker">Arama</p>
        <h1 class="page-title">“{{ query || '...' }}”</h1>
        <p class="page-subtitle">Ada göre film arama sonuçları.</p>
      </div>
    </div>

    <EmptyState
      v-if="!query"
      title="Arama yapın"
      message="Üstteki arama kutusuna bir film adı yazın."
    />
    <Loader v-else-if="search.loading" />
    <ErrorState v-else-if="search.error" :message="search.error" @retry="reload" />
    <EmptyState
      v-else-if="!search.list.length"
      title="Sonuç bulunamadı"
      :message="`“${query}” ile eşleşen film bulunamadı.`"
    />
    <template v-else>
      <p class="page-subtitle">{{ search.totalResults }} sonuç bulundu</p>
      <MovieGrid :movies="search.list" />
      <PaginationBar :page="search.page" :total-pages="search.totalPages" @change="setPage" />
    </template>
  </section>
</template>
