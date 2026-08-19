<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '../../stores/favorites'
import { formatDate, formatScore } from '../../utils/format'
import { posterUrl } from '../../utils/images'
import AppIcon from '../ui/AppIcon.vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

const favorites = useFavoritesStore()
const favorite = computed(() => favorites.isFavorite(props.movie.id))

function toggleFavorite() {
  favorites.toggle(props.movie)
}
</script>

<template>
  <article class="movie-card">
    <button
      class="card-fav"
      type="button"
      :class="{ active: favorite }"
      :aria-label="favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'"
      @click="toggleFavorite"
    >
      <AppIcon :name="favorite ? 'heart-fill' : 'heart'" />
    </button>
    <RouterLink :to="{ name: 'movie-detail', params: { id: movie.id } }">
      <div class="poster-wrap">
        <img :src="posterUrl(movie.poster_path)" :alt="movie.title" />
        <span class="score-badge">
          <AppIcon name="star" />
          {{ formatScore(movie.vote_average) }}
        </span>
      </div>
      <div class="card-body">
        <h3 class="card-title">{{ movie.title }}</h3>
        <p class="card-meta">{{ formatDate(movie.release_date) }}</p>
      </div>
    </RouterLink>
  </article>
</template>
