<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string[]
  disabled?: boolean
  maxTags?: number
}>(), {
  disabled: false,
  maxTags: 12,
})

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const draft = ref('')

function addTag() {
  const tag = draft.value.replace(/^#+/, '').replace(/\s+/g, ' ').trim().slice(0, 40)
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
</script>

<template>
  <div>
    <div class="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-gray/20 bg-white px-3 py-2 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:bg-gray-dark">
      <span
        v-for="(tag, index) in modelValue"
        :key="`${tag}-${index}`"
        class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-800"
      >
        {{ tag }}
        <button
          type="button"
          class="rounded-full p-0.5 text-blue-600 transition hover:bg-blue-100 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-primary"
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
        @keydown="handleKeydown"
        @blur="addTag"
      >
    </div>
    <p class="mt-1.5 text-xs text-gray">Maksimal {{ maxTags }} tag, masing-masing 40 karakter.</p>
  </div>
</template>
