<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'

const appReady = ref(false)

onMounted(() => {
  const seen = localStorage.getItem('splash-seen')
  if (seen) {
    appReady.value = true
    return
  }
  setTimeout(() => {
    localStorage.setItem('splash-seen', '1')
    appReady.value = true
  }, 800)
})
</script>

<template>
  <Transition name="splash-out">
    <div v-if="!appReady" class="splash">
      <div class="splash-inner">
        <p class="splash-logo">CineRota</p>
        <div class="splash-bar">
          <div class="splash-bar-fill" />
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="app-in">
    <div v-if="appReady" class="app-shell">
      <AppHeader />
      <main class="app-main">
        <RouterView />
      </main>
      <AppFooter />
    </div>
  </Transition>
</template>
