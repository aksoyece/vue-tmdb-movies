<script setup>
import { onMounted, onUnmounted } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  videoKey: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Fragman',
  },
})

const emit = defineEmits(['close'])

function onKeydown(event) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="trailer-modal" role="dialog" aria-modal="true" :aria-label="title">
    <button class="trailer-backdrop" type="button" aria-label="Kapat" @click="emit('close')" />
    <div class="trailer-panel">
      <div class="trailer-head">
        <h3 class="trailer-title">{{ title }}</h3>
        <button class="icon-btn" type="button" aria-label="Kapat" @click="emit('close')">
          <AppIcon name="close" />
        </button>
      </div>
      <div class="trailer-frame">
        <iframe
          :src="`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`"
          title="Film fragmanı"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>
    </div>
  </div>
</template>
