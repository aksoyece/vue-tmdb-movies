<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGenresStore } from '../../stores/genres'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])
const genresStore = useGenresStore()
const { list } = storeToRefs(genresStore)
const open = ref(false)

const selected = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []))

const orderedGenres = computed(() => {
  const selectedIds = selected.value
  const picked = [...selectedIds]
    .reverse()
    .map((id) => list.value.find((genre) => genre.id === id))
    .filter(Boolean)
  const rest = list.value.filter((genre) => !selectedIds.includes(genre.id))
  return [...picked, ...rest]
})

function selectAll() {
  emit('update:modelValue', [])
}

function toggle(id) {
  if (selected.value.includes(id)) {
    emit(
      'update:modelValue',
      selected.value.filter((item) => item !== id),
    )
    return
  }
  emit('update:modelValue', [...selected.value, id])
}

onMounted(() => {
  genresStore.load()
})
</script>

<template>
  <aside class="genre-panel">
    <button
      class="genre-toggle"
      type="button"
      :aria-expanded="open"
      @click="open = !open"
    >
      <AppIcon name="filter" />
      Türler
      <span v-if="selected.length" class="genre-count">{{ selected.length }}</span>
      <AppIcon :name="open ? 'close' : 'chevron-right'" />
    </button>

    <p class="genre-heading">Türler</p>

    <div class="genre-body" :class="{ open }">
      <div class="genre-row" aria-label="Tür filtresi">
        <button
          class="genre-chip"
          type="button"
          :class="{ active: !selected.length }"
          @click="selectAll"
        >
          Tümü
        </button>
        <button
          v-for="genre in orderedGenres"
          :key="genre.id"
          class="genre-chip"
          type="button"
          :class="{ active: selected.includes(genre.id) }"
          @click="toggle(genre.id)"
        >
          {{ genre.name }}
        </button>
      </div>
    </div>
  </aside>
</template>
