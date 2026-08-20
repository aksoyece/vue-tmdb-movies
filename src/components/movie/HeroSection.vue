<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { backdropUrl, posterUrl } from '../../utils/images'
import { formatScore } from '../../utils/format'
import { useMovieListStore } from '../../stores/movieList'
import AppIcon from '../ui/AppIcon.vue'

const listStore = useMovieListStore()
const { heroSlides } = storeToRefs(listStore)

const activeIndex = ref(0)
const paused = ref(false)
const dragStartX = ref(0)
const dragDeltaX = ref(0)
const isDragging = ref(false)

let timer = null
const SWIPE_THRESHOLD = 48

const movies = computed(() => heroSlides.value)
const active = computed(() => movies.value[activeIndex.value] ?? null)
const loaded = computed(() => movies.value.length > 0)
const slideCount = computed(() => movies.value.length)

watch(
  movies,
  (value) => {
    if (!value.length) {
      activeIndex.value = 0
      clearInterval(timer)
      return
    }
    if (activeIndex.value >= value.length) {
      activeIndex.value = 0
    }
    startTimer()
  },
  { immediate: true },
)

function startTimer() {
  clearInterval(timer)
  if (!slideCount.value) return
  timer = setInterval(() => {
    if (!paused.value && !isDragging.value && slideCount.value) {
      next()
    }
  }, 4000)
}

function next() {
  if (!slideCount.value) return
  activeIndex.value = (activeIndex.value + 1) % slideCount.value
  startTimer()
}

function prev() {
  if (!slideCount.value) return
  activeIndex.value = (activeIndex.value - 1 + slideCount.value) % slideCount.value
  startTimer()
}

function goTo(index) {
  activeIndex.value = index
  startTimer()
}

function pause() {
  paused.value = true
}

function resume() {
  if (!isDragging.value) {
    paused.value = false
  }
}

function onPointerDown(event) {
  if (event.button !== undefined && event.button !== 0) return
  if (event.target.closest('button, a')) return

  isDragging.value = true
  paused.value = true
  dragStartX.value = event.clientX
  dragDeltaX.value = 0
  event.currentTarget.setPointerCapture(event.pointerId)
}

function onPointerMove(event) {
  if (!isDragging.value) return
  dragDeltaX.value = event.clientX - dragStartX.value
}

function onPointerEnd(event) {
  if (!isDragging.value) return

  if (Math.abs(dragDeltaX.value) >= SWIPE_THRESHOLD) {
    if (dragDeltaX.value < 0) next()
    else prev()
  }

  isDragging.value = false
  dragDeltaX.value = 0
  paused.value = false

  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }
}

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div
    v-if="loaded && active"
    class="home-hero"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <div
      class="home-hero-inner"
      :class="{ dragging: isDragging }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerEnd"
      @pointercancel="onPointerEnd"
    >
      <Transition name="hero-fade" mode="out-in">
        <img
          :key="active.id"
          class="home-hero-bg"
          :src="backdropUrl(active.backdrop_path, 'original')"
          :alt="active.title"
          draggable="false"
        />
      </Transition>

      <div class="home-hero-overlay" />

      <button
        type="button"
        class="home-hero-nav home-hero-nav--prev"
        aria-label="Önceki film"
        @click.stop="prev"
      >
        <AppIcon name="chevron-left" />
      </button>

      <button
        type="button"
        class="home-hero-nav home-hero-nav--next"
        aria-label="Sonraki film"
        @click.stop="next"
      >
        <AppIcon name="chevron-right" />
      </button>

      <div class="home-hero-content">
        <img
          class="home-hero-poster"
          :src="posterUrl(active.poster_path, 'w342')"
          :alt="active.title"
          draggable="false"
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
          <RouterLink
            class="home-hero-btn"
            :to="{ name: 'movie-detail', params: { id: active.id } }"
          >
            Detayları Gör
          </RouterLink>
        </div>
      </div>

      <div class="home-hero-dots">
        <button
          v-for="(_, i) in movies"
          :key="i"
          type="button"
          class="hero-dot"
          :class="{ active: i === activeIndex }"
          :aria-label="`Film ${i + 1}`"
          @click.stop="goTo(i)"
        />
      </div>
    </div>
  </div>
</template>
