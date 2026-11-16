<script setup lang="ts">
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    size?: ModalSize
  }>(),
  {
    modelValue: false,
    title: '',
    size: 'md',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const sizeClassMap: Record<ModalSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-3xl',
}

function closeModal() {
  emit('update:modelValue', false)
}

function onKeydown(event: KeyboardEvent) {
  if (props.modelValue && event.key === 'Escape') {
    closeModal()
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', onKeydown)
  }
})
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex min-h-full items-center justify-center p-4">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
        @click="closeModal"
      ></div>

      <!-- Modal panel -->
      <div
        class="relative z-10 flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-2xl border border-gray/10 bg-white text-left shadow-xl transition-all dark:border-white/10 dark:bg-gray-dark"
        :class="sizeClassMap[size]"
      >
        <!-- Header with Title & Close (X) button -->
        <div class="flex shrink-0 items-center justify-between border-b border-gray/10 px-6 py-4">
          <h3 id="modal-title" class="text-base font-bold text-black dark:text-white">
            {{ title }}
          </h3>
          <button
            type="button"
            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-stone-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white"
            title="Tutup"
            aria-label="Tutup"
            @click="closeModal"
          >
            <Icon name="ph:x-bold" class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="overflow-y-auto px-6 py-5">
          <slot />
        </div>

        <!-- Footer (Only rendered if footer slot is provided) -->
        <div
          v-if="$slots.footer"
          class="shrink-0 border-t border-gray/10 bg-stone-50/50 px-6 py-3 dark:bg-gray-800/30 sm:flex sm:flex-row-reverse"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>
