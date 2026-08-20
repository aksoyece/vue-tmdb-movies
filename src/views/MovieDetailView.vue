<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import MovieGrid from '../components/movie/MovieGrid.vue'
import Loader from '../components/ui/Loader.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import TrailerModal from '../components/ui/TrailerModal.vue'
import { useMoviesStore } from '../stores/movies'
import { useFavoritesStore } from '../stores/favorites'
import { formatDate, formatRuntime, formatScore } from '../utils/format'
import { backdropUrl, posterUrl } from '../utils/images'
import AppIcon from '../components/ui/AppIcon.vue'

const route = useRoute()
const movies = useMoviesStore()
const favorites = useFavoritesStore()
const { details, detailsLoading, detailsError, similar, similarLoading, trailerKey } =
  storeToRefs(movies)

const movieId = computed(() => Number(route.params.id))
const isFavorite = computed(() => favorites.isFavorite(movieId.value))
const showTrailer = ref(false)

function load() {
  if (!movieId.value) return
  showTrailer.value = false
  movies.loadDetails(movieId.value)
  movies.loadSimilar(movieId.value)
}

watch(movieId, load, { immediate: true })
</script>

<template>
  <section>
    <Loader v-if="detailsLoading" />
    <ErrorState v-else-if="detailsError" :message="detailsError" @retry="load" />
    <article v-else-if="details" class="detail">
      <div class="hero">
        <img
          v-if="details.backdrop_path"
          class="backdrop"
          :src="backdropUrl(details.backdrop_path)"
          :alt="`${details.title} arka plan`"
        />
        <div class="hero-content">
          <div class="hero-poster">
            <img :src="posterUrl(details.poster_path)" :alt="details.title" />
          </div>
          <div>
            <p class="page-kicker">Film detayı</p>
            <h1 class="hero-title">{{ details.title }}</h1>
            <p class="hero-overview">{{ details.overview || 'Bu film için açıklama bulunmuyor.' }}</p>
            <ul class="meta-list">
              <li>
                <AppIcon name="star" />
                {{ formatScore(details.vote_average) }}
              </li>
              <li>Yayın: {{ formatDate(details.release_date) }}</li>
              <li>Süre: {{ formatRuntime(details.runtime) }}</li>
              <li v-for="genre in details.genres" :key="genre.id">{{ genre.name }}</li>
            </ul>
            <div class="detail-actions">
              <button
                v-if="trailerKey"
                class="primary-btn"
                type="button"
                @click="showTrailer = true"
              >
                <AppIcon name="play" />
                Fragmanı İzle
              </button>
              <button class="primary-btn" type="button" @click="favorites.toggle(details)">
                <AppIcon :name="isFavorite ? 'heart-fill' : 'heart'" />
                {{ isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 class="section-title">Benzer filmler</h2>
        <Loader v-if="similarLoading" />
        <p v-else-if="!similar.length" class="page-subtitle">Benzer film bulunamadı.</p>
        <MovieGrid v-else :movies="similar" />
      </section>
    </article>

    <TrailerModal
      v-if="showTrailer && trailerKey"
      :video-key="trailerKey"
      :title="`${details?.title || 'Film'} fragmanı`"
      @close="showTrailer = false"
    />
  </section>
</template>
