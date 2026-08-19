<script setup>
defineProps({
  message: {
    type: String,
    default: 'Bir hata oluştu.',
  },
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div class="status-box">
    <h2>Veriler alınamadı</h2>
    <p>{{ message }}</p>
    <button class="retry-btn" type="button" @click="emit('retry')">Tekrar dene</button>
  </div>
</template>
