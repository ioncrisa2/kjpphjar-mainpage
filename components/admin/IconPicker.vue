<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  internalValue.value = newVal
})

const updateValue = (val: string) => {
  internalValue.value = val
  emit('update:modelValue', val)
}

const showPicker = ref(false)
const search = ref('')

const togglePicker = () => {
  showPicker.value = !showPicker.value
  if (showPicker.value) {
    search.value = ''
  }
}

// Close when clicking outside
const pickerRef = ref<HTMLElement | null>(null)
const closeOnClickOutside = (e: MouseEvent) => {
  if (showPicker.value && pickerRef.value && !pickerRef.value.contains(e.target as Node)) {
    showPicker.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('click', closeOnClickOutside)
  }
})
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('click', closeOnClickOutside)
  }
})

// A curated list of popular icons for services
const popularIcons = [
  'fa6-solid:building', 'fa6-solid:chart-line', 'fa6-solid:project-diagram',
  'fa6-solid:hard-hat', 'fa6-solid:file-contract', 'fa6-solid:search-dollar',
  'fa6-solid:handshake', 'fa6-solid:users', 'fa6-solid:home',
  'fa6-solid:city', 'fa6-solid:map-location-dot', 'fa6-solid:scale-balanced',
  'fa6-solid:briefcase', 'fa6-solid:calculator', 'fa6-solid:magnifying-glass-chart',
  'fa6-solid:building-user', 'fa6-solid:industry', 'fa6-solid:shop',
  'fa6-solid:gavel', 'fa6-solid:coins', 'fa6-solid:money-bill-trend-up',
  'fa6-solid:chart-pie', 'fa6-solid:pen-ruler', 'fa6-solid:house-laptop',

  // Alternative generic icons
  'ph:buildings-bold', 'ph:chart-line-up-bold', 'ph:presentation-chart-bold',
  'ph:handshake-bold', 'ph:users-three-bold', 'ph:calculator-bold',
  'ph:money-bold', 'ph:file-text-bold', 'ph:gavel-bold', 'ph:scales-bold'
]

const filteredIcons = computed(() => {
  if (!search.value) return popularIcons
  const s = search.value.toLowerCase()
  return popularIcons.filter(icon => icon.toLowerCase().includes(s))
})

const selectIcon = (icon: string) => {
  updateValue(icon)
  showPicker.value = false
}

// Check if current value exists in our curated list
const isCustomIcon = computed(() => {
  if (!internalValue.value) return false

  // If it's a legacy font-awesome class, it might not exactly match our new list yet
  const normalized = getNuxtIconName(internalValue.value)
  return !popularIcons.includes(normalized) && !popularIcons.includes(internalValue.value)
})
</script>

<template>
  <div class="relative" ref="pickerRef">
    <div class="flex gap-2">
      <!-- Icon Preview Box -->
      <div
        class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-2xl text-primary"
      >
        <Icon v-if="internalValue" :name="getNuxtIconName(internalValue)" />
        <span v-else class="text-gray-400 text-sm">?</span>
      </div>

      <!-- Input Field -->
      <div class="relative flex-1">
        <input
          :value="internalValue"
          @input="updateValue(($event.target as HTMLInputElement).value)"
          type="text"
          class="block w-full h-12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-12 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Misal: fa6-solid:building"
        >
        <button
          @click="togglePicker"
          type="button"
          class="absolute inset-y-0 right-0 flex items-center px-3 bg-gray-200 border-l border-gray-300 rounded-r-lg hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          Pilih Icon
        </button>
      </div>
    </div>
    <p class="mt-1 text-xs text-gray-500">
      Anda dapat memilih dari daftar atau mengetikkan kode langsung dari <a href="https://icones.js.org/" target="_blank" class="text-blue-600 hover:underline">Icones.js.org</a>.
    </p>

    <!-- Picker Dropdown -->
    <div
      v-if="showPicker"
      class="absolute z-10 mt-2 w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-xl max-h-80 flex flex-col"
    >
      <div class="p-3 border-b border-gray-100">
        <input
          v-model="search"
          type="text"
          class="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Cari ikon..."
        >
      </div>
      <div class="p-3 overflow-y-auto grid grid-cols-5 gap-2">
        <button
          v-for="icon in filteredIcons"
          :key="icon"
          @click="selectIcon(icon)"
          type="button"
          class="flex flex-col items-center justify-center p-2 rounded-lg border hover:bg-blue-50 hover:border-blue-300 transition-colors group"
          :class="getNuxtIconName(internalValue) === icon ? 'bg-blue-100 border-blue-400' : 'border-transparent'"
          :title="icon"
        >
          <Icon :name="icon" class="text-2xl text-gray-700 group-hover:text-primary transition-colors" />
        </button>
        <div v-if="filteredIcons.length === 0" class="col-span-5 py-4 text-center text-sm text-gray-500">
          Ikon tidak ditemukan di daftar populer. Anda tetap bisa mengetik manual namanya.
        </div>
      </div>
    </div>
  </div>
</template>
