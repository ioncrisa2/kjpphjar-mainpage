<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" @click="closeModal" aria-hidden="true"></div>

      <!-- Centering element -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-dark rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray/10">
        <!-- Header with Title & Close (X) button -->
        <div class="flex items-center justify-between border-b border-gray/10 px-6 py-4">
          <h3 class="text-base font-bold text-black dark:text-white" id="modal-title">
            {{ title }}
          </h3>
          <button
            @click="closeModal"
            type="button"
            class="rounded-lg p-1.5 text-gray-400 hover:bg-stone-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
            title="Tutup"
          >
            <Icon name="ph:x-bold" class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-5">
          <slot></slot>
        </div>

        <!-- Footer (Only rendered if footer slot is provided) -->
        <div v-if="$slots.footer" class="border-t border-gray/10 bg-stone-50/50 dark:bg-gray-800/30 px-6 py-3 sm:flex sm:flex-row-reverse">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const closeModal = () => {
  emit('update:modelValue', false)
}
</script>

