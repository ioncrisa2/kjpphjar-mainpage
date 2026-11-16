<script setup lang="ts">
import type { AdminViewMode } from '~/composables/useAdminViewMode'

const props = withDefaults(
  defineProps<{
    modelValue: AdminViewMode
    gridLabel?: string
    tableLabel?: string
  }>(),
  {
    gridLabel: 'Kartu',
    tableLabel: 'Tabel',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: AdminViewMode]
}>()

const options = computed<Array<{ value: AdminViewMode; label: string; icon: string }>>(() => [
  { value: 'grid', label: props.gridLabel, icon: 'ph:squares-four-bold' },
  { value: 'table', label: props.tableLabel, icon: 'ph:table-bold' },
])
</script>

<template>
  <div
    role="group"
    aria-label="Pilih tampilan data"
    class="inline-flex items-center rounded-xl border border-gray/15 bg-white p-1 shadow-xs dark:border-white/15 dark:bg-gray-dark"
  >
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      :aria-pressed="modelValue === opt.value"
      :title="`Tampilan ${opt.label}`"
      class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      :class="
        modelValue === opt.value
          ? 'bg-primary text-black shadow-xs'
          : 'text-gray-600 hover:bg-gray/5 hover:text-black dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white'
      "
      @click="emit('update:modelValue', opt.value)"
    >
      <Icon :name="opt.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
      <span class="hidden sm:inline">{{ opt.label }}</span>
    </button>
  </div>
</template>
