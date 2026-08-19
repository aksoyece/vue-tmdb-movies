<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import MovieGrid from '../components/movie/MovieGrid.vue'
import PaginationBar from '../components/ui/PaginationBar.vue'
import Loader from '../components/ui/Loader.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import { useMoviesStore } from '../stores/movies'

const route = useRoute()
const movies = useMoviesStore()
const { list, loading, error, page, totalPages, totalResults } = storeToRefs(movies)

const query = computed(() => String(route.query.q || '').trim())

function load(nextPage = 1) {
  if (!query.value) {
    movies.clearList()
    return
  }
  movies.search(query.value, nextPage)
}

watch(query, () => load(1), { immediate: true })
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
    <Loader v-else-if="loading" />
    <ErrorState v-else-if="error" :message="error" @retry="load(page)" />
    <EmptyState
      v-else-if="!list.length"
      title="Sonuç bulunamadı"
      :message="`“${query}” ile eşleşen film bulunamadı.`"
    />
    <template v-else>
      <p class="page-subtitle">{{ totalResults }} sonuç bulundu</p>
      <MovieGrid :movies="list" />
      <PaginationBar :page="page" :total-pages="totalPages" @change="load" />
    </template>
  </section>
</template>
