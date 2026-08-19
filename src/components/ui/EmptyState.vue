<script setup>
defineProps({
  title: {
    type: String,
    default: 'Sonuç bulunamadı',
  },
  message: {
    type: String,
    default: 'Aradığınız kriterlere uygun film yok.',
  },
})
</script>

<template>
  <div class="empty-box">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <slot />
  </div>
</template>
