<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { backdropUrl, posterUrl } from '../../utils/images'
import { formatScore } from '../../utils/format'
import { getPopularMovies } from '../../services/tmdb'
import AppIcon from '../ui/AppIcon.vue'

const router = useRouter()

const movies = ref([])
const activeIndex = ref(0)
const loaded = ref(false)
const paused = ref(false)
let timer = null

const active = computed(() => movies.value[activeIndex.value] ?? null)

async function fetchMovies() {
  try {
    const res = await getPopularMovies(1)
    movies.value = res.data.results.filter((m) => m.backdrop_path).slice(0, 8)
    loaded.value = true
    startTimer()
  } catch {
    /* sessizce geç */
  }
}

function startTimer() {
  clearInterval(timer)
  timer = setInterval(() => {
    if (!paused.value) {
      activeIndex.value = (activeIndex.value + 1) % movies.value.length
    }
  }, 4000)
}

function goTo(index) {
  activeIndex.value = index
  startTimer()
}

function pause() { paused.value = true }
function resume() { paused.value = false }

onMounted(fetchMovies)
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div v-if="loaded && active" class="home-hero" @mouseenter="pause" @mouseleave="resume">
    <Transition name="hero-fade" mode="out-in">
      <div :key="active.id" class="home-hero-inner">
        <img
          class="home-hero-bg"
          :src="backdropUrl(active.backdrop_path, 'original')"
          :alt="active.title"
        />
        <div class="home-hero-overlay" />

        <div class="home-hero-content">
          <img
            class="home-hero-poster"
            :src="posterUrl(active.poster_path, 'w342')"
            :alt="active.title"
          />
          <div class="home-hero-info">
            <p class="home-hero-kicker">Öne çıkan film</p>
            <h2 class="home-hero-title">{{ active.title }}</h2>
            <ul class="meta-list">
              <li>
                <AppIcon name="star" />
                {{ formatScore(active.vote_average) }}
              </li>
              <li>{{ active.release_date?.slice(0, 4) }}</li>
            </ul>
            <p class="home-hero-overview">{{ active.overview }}</p>
            <button class="home-hero-btn" @click="router.push(`/movie/${active.id}`)">
              Detayları Gör
            </button>
          </div>
        </div>

        <div class="home-hero-dots">
          <button
            v-for="(_, i) in movies"
            :key="i"
            class="hero-dot"
            :class="{ active: i === activeIndex }"
            :aria-label="`Film ${i + 1}`"
            @click="goTo(i)"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>
