<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  page: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['change'])

function pages(current, total) {
  const max = Math.max(total, 1)
  const start = Math.max(1, current - 2)
  const end = Math.min(max, start + 4)
  const list = []
  for (let i = start; i <= end; i += 1) list.push(i)
  return list
}
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="Sayfalama">
    <button
      class="page-btn"
      type="button"
      :disabled="page <= 1"
      aria-label="Önceki sayfa"
      @click="emit('change', page - 1)"
    >
      <AppIcon name="chevron-left" />
      <span class="page-nav-text">Önceki</span>
    </button>
    <button
      v-for="item in pages(page, totalPages)"
      :key="item"
      class="page-btn"
      :class="{ active: item === page }"
      type="button"
      @click="emit('change', item)"
    >
      {{ item }}
    </button>
    <button
      class="page-btn"
      type="button"
      :disabled="page >= totalPages"
      aria-label="Sonraki sayfa"
      @click="emit('change', page + 1)"
    >
      <span class="page-nav-text">Sonraki</span>
      <AppIcon name="chevron-right" />
    </button>
  </nav>
</template>
