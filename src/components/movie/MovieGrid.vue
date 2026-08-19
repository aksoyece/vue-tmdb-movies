<script setup>
import MovieCard from './MovieCard.vue'

defineProps({
  movies: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="movie-grid">
    <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
  </section>
</template>
