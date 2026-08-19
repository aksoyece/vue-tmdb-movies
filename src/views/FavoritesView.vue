<script setup>
import { storeToRefs } from 'pinia'
import MovieGrid from '../components/movie/MovieGrid.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import { useFavoritesStore } from '../stores/favorites'

const favorites = useFavoritesStore()
const { items } = storeToRefs(favorites)
</script>

<template>
  <section>
    <div class="page-head">
      <div>
        <p class="page-kicker">Kütüphane</p>
        <h1 class="page-title">Favoriler</h1>
        <p class="page-subtitle">Beğendiğin filmler tarayıcında saklanır.</p>
      </div>
    </div>

    <EmptyState
      v-if="!items.length"
      title="Henüz favori yok"
      message="Kartlardaki kalp ikonuna basarak film ekleyebilirsin."
    />
    <MovieGrid v-else :movies="items" />
  </section>
</template>
