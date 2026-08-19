<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFavoritesStore } from '../../stores/favorites'
import { useThemeStore } from '../../stores/theme'
import AppIcon from '../ui/AppIcon.vue'

const router = useRouter()
const route = useRoute()
const favorites = useFavoritesStore()
const theme = useThemeStore()
const menuOpen = ref(false)
const query = ref(typeof route.query.q === 'string' ? route.query.q : '')

const links = [
  { to: '/', label: 'Popüler' },
  { to: '/kategori/top_rated', label: 'En İyiler' },
  { to: '/kategori/upcoming', label: 'Yakında' },
  { to: '/kategori/now_playing', label: 'Vizyonda' },
]

const themeLabel = computed(() => (theme.isDark ? 'Açık tema' : 'Koyu tema'))

function search(event) {
  event.preventDefault()
  const value = query.value.trim()
  menuOpen.value = false
  if (!value) return
  router.push({ name: 'search', query: { q: value } })
}

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

watch(
  () => route.query.q,
  (value) => {
    if (typeof value === 'string') query.value = value
  },
)
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <RouterLink class="logo" to="/">
        <span class="logo-mark">C</span>
        CineRota
      </RouterLink>

      <nav class="nav" :class="{ open: menuOpen }">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to">
          {{ link.label }}
        </RouterLink>
      </nav>

      <form class="search-form" @submit="search">
        <AppIcon name="search" />
        <input
          v-model="query"
          type="search"
          placeholder="Film ara..."
          aria-label="Film ara"
        />
        <button class="search-btn" type="submit">Ara</button>
      </form>

      <div class="header-actions">
        <RouterLink class="fav-link" to="/favoriler" aria-label="Favoriler">
          <AppIcon name="heart" />
          <span v-if="favorites.count" class="badge">{{ favorites.count }}</span>
        </RouterLink>

        <button class="icon-btn" type="button" :aria-label="themeLabel" @click="theme.toggle()">
          <AppIcon :name="theme.isDark ? 'sun' : 'moon'" />
        </button>

        <button
          class="icon-btn menu-btn"
          type="button"
          :aria-label="menuOpen ? 'Menüyü kapat' : 'Menü'"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" />
        </button>
      </div>
    </div>
  </header>
</template>
