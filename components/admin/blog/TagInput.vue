<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string[]
  disabled?: boolean
  maxTags?: number
  suggestions?: Array<{ name: string; count?: number }>
}>(), {
  disabled: false,
  maxTags: 12,
  suggestions: () => [],
})

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const draft = ref('')
const isFocused = ref(false)

function addTag(candidate?: string) {
  const raw = typeof candidate === 'string' ? candidate : draft.value
  const tag = raw.replace(/^#+/, '').replace(/\s+/g, ' ').trim().slice(0, 40)
  if (!tag || props.disabled) return
  const exists = props.modelValue.some((item) => item.toLocaleLowerCase('id-ID') === tag.toLocaleLowerCase('id-ID'))
  if (!exists && props.modelValue.length < props.maxTags) {
    emit('update:modelValue', [...props.modelValue, tag])
  }
  draft.value = ''
}

function removeTag(index: number) {
  if (props.disabled) return
  emit('update:modelValue', props.modelValue.filter((_, itemIndex) => itemIndex !== index))
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addTag()
  } else if (event.key === 'Backspace' && !draft.value && props.modelValue.length) {
    removeTag(props.modelValue.length - 1)
  }
}

const filteredSuggestions = computed(() => {
  if (props.disabled || props.modelValue.length >= props.maxTags) return []
  const selected = new Set(props.modelValue.map((item) => item.toLocaleLowerCase('id-ID')))
  const query = draft.value.replace(/^#+/, '').trim().toLocaleLowerCase('id-ID')
  return props.suggestions
    .filter((item) => !selected.has(item.name.toLocaleLowerCase('id-ID')))
    .filter((item) => !query || item.name.toLocaleLowerCase('id-ID').includes(query))
    .slice(0, 8)
})

function handleBlur() {
  setTimeout(() => {
    isFocused.value = false
    if (draft.value.trim()) addTag()
  }, 140)
}
</script>

<template>
  <div class="relative">
    <div class="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-gray/20 bg-white px-3 py-2 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/15 dark:bg-gray-dark">
      <span
        v-for="(tag, index) in modelValue"
        :key="`${tag}-${index}`"
        class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-500/15 dark:text-blue-200"
      >
        {{ tag }}
        <button
          type="button"
          class="rounded-full p-0.5 text-blue-600 transition hover:bg-blue-100 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-primary dark:text-blue-300 dark:hover:bg-blue-400/20 dark:hover:text-white"
          :aria-label="`Hapus tag ${tag}`"
          :disabled="disabled"
          @click="removeTag(index)"
        >
          <Icon name="ph:x-bold" class="text-xs" />
        </button>
      </span>
      <input
        v-model="draft"
        type="text"
        class="min-w-40 flex-1 border-0 bg-transparent px-1 py-1.5 text-sm text-black outline-none placeholder:text-gray dark:text-white"
        :disabled="disabled || modelValue.length >= maxTags"
        :placeholder="modelValue.length >= maxTags ? 'Batas tag tercapai' : 'Ketik tag lalu Enter'"
        @focus="isFocused = true"
        @keydown="handleKeydown"
        @blur="handleBlur"
      >
    </div>

    <div
      v-if="isFocused && filteredSuggestions.length"
      class="mt-2 flex flex-wrap items-center gap-1.5 rounded-xl border border-gray/15 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-slate-900"
    >
      <span class="mr-1 text-[11px] font-bold uppercase tracking-wide text-gray dark:text-slate-400">Saran:</span>
      <button
        v-for="item in filteredSuggestions"
        :key="item.name"
        type="button"
        class="inline-flex items-center gap-1 rounded-full border border-gray/20 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 transition hover:border-primary hover:text-primary dark:border-white/15 dark:bg-slate-800 dark:text-slate-200"
        @mousedown.prevent="addTag(item.name)"
      >
        + {{ item.name }}
      </button>
    </div>

    <p class="mt-1.5 text-xs text-gray">Maksimal {{ maxTags }} tag, masing-masing 40 karakter.</p>
  </div>
</template>
