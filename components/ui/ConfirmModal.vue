<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    message?: string
    itemName?: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
    loading?: boolean
  }>(),
  {
    modelValue: undefined,
    title: undefined,
    message: undefined,
    itemName: undefined,
    confirmText: undefined,
    cancelText: undefined,
    variant: undefined,
    loading: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const { state: globalState, handleConfirm: globalConfirm, handleCancel: globalCancel } = useConfirm()

const isControlled = computed(() => props.modelValue !== undefined)

const visible = computed({
  get: () => (isControlled.value ? !!props.modelValue : globalState.value.isOpen),
  set: (val: boolean) => {
    if (isControlled.value) {
      emit('update:modelValue', val)
    } else {
      globalState.value.isOpen = val
    }
  },
})

const currentTitle = computed(() => props.title || globalState.value.title || 'Konfirmasi Hapus')
const currentMessage = computed(
  () => props.message || globalState.value.message || 'Apakah Anda yakin ingin menghapus data ini?'
)
const currentItemName = computed(() => props.itemName || globalState.value.itemName)
const currentConfirmText = computed(() => props.confirmText || globalState.value.confirmText || 'Ya, Hapus')
const currentCancelText = computed(() => props.cancelText || globalState.value.cancelText || 'Batal')
const currentVariant = computed(() => props.variant || globalState.value.variant || 'danger')
const isLoading = computed(() => props.loading || globalState.value.isLoading)

function onConfirm() {
  if (isControlled.value) {
    emit('confirm')
  } else {
    globalConfirm()
  }
}

function onCancel() {
  if (isControlled.value) {
    emit('cancel')
    emit('update:modelValue', false)
  } else {
    globalCancel()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (!visible.value) return
  if (e.key === 'Escape') {
    onCancel()
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
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        :aria-label="currentTitle"
      >
        <!-- Backdrop Blur Overlay -->
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          @click="onCancel"
          aria-hidden="true"
        ></div>

        <!-- Modal Dialog Box -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div
            v-if="visible"
            class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray/10 dark:bg-gray-dark dark:border-gray-800 transition-all z-10"
          >
            <!-- Close Button -->
            <button
              type="button"
              @click="onCancel"
              class="absolute top-4 right-4 rounded-lg p-1.5 text-gray-400 hover:bg-stone-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white transition"
              title="Tutup"
              aria-label="Tutup"
            >
              <Icon name="ph:x-bold" class="h-4 w-4" />
            </button>

            <!-- Icon & Title -->
            <div class="flex items-start gap-4">
              <!-- Variant Icon -->
              <div
                v-if="currentVariant === 'danger'"
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 ring-8 ring-red-500/5"
              >
                <Icon name="ph:trash-bold" class="h-6 w-6" />
              </div>
              <div
                v-else-if="currentVariant === 'warning'"
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 ring-8 ring-amber-500/5"
              >
                <Icon name="ph:warning-circle-bold" class="h-6 w-6" />
              </div>
              <div
                v-else
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20 ring-8 ring-primary/5"
              >
                <Icon name="ph:info-bold" class="h-6 w-6" />
              </div>

              <!-- Texts -->
              <div class="flex-1 min-w-0 pr-4">
                <h3 class="text-base font-extrabold text-black dark:text-white leading-snug">
                  {{ currentTitle }}
                </h3>
                <p class="mt-1.5 text-xs text-gray dark:text-gray-400 leading-relaxed">
                  {{ currentMessage }}
                </p>
              </div>
            </div>

            <!-- Optional Item Highlight Banner -->
            <div
              v-if="currentItemName"
              class="mt-4 flex items-center gap-2 rounded-xl bg-stone-100 px-3.5 py-2.5 text-xs font-semibold text-black dark:bg-gray-800 dark:text-gray-200 border border-gray/10"
            >
              <Icon name="ph:file-text-bold" class="h-4 w-4 shrink-0 text-gray-500" />
              <span class="truncate">{{ currentItemName }}</span>
            </div>

            <!-- Actions Footer -->
            <div class="mt-6 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                @click="onCancel"
                class="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-xl border border-gray/20 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-stone-100 hover:text-black dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition"
              >
                {{ currentCancelText }}
              </button>

              <button
                type="button"
                @click="onConfirm"
                :disabled="isLoading"
                class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition disabled:opacity-50"
                :class="[
                  currentVariant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                    : currentVariant === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                    : 'bg-primary hover:bg-primary/90 text-black shadow-primary/20',
                ]"
              >
                <Icon
                  v-if="isLoading"
                  name="ph:spinner-gap-bold"
                  class="h-4 w-4 animate-spin"
                />
                <span>{{ currentConfirmText }}</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
