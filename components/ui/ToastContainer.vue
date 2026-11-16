<script setup lang="ts">
import type { ToastVariant } from '~/composables/useToast'

const { toasts, dismiss } = useToast()

const iconMap: Record<ToastVariant, string> = {
  success: 'ph:check-circle-bold',
  error: 'ph:warning-circle-bold',
  info: 'ph:info-bold',
}

const styleMap: Record<ToastVariant, string> = {
  success:
    'border-emerald-200 bg-white text-emerald-900 dark:border-emerald-500/30 dark:bg-gray-dark dark:text-emerald-200',
  error:
    'border-red-200 bg-white text-red-900 dark:border-red-500/30 dark:bg-gray-dark dark:text-red-200',
  info:
    'border-sky-200 bg-white text-black dark:border-primary/30 dark:bg-gray-dark dark:text-white',
}

const iconColorMap: Record<ToastVariant, string> = {
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-primary',
}
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed bottom-5 right-5 z-[110] flex w-full max-w-sm flex-col gap-2.5 px-4 sm:px-0"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-2 opacity-0"
      >
        <div
          v-for="item in toasts"
          :key="item.id"
          role="status"
          class="pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg"
          :class="styleMap[item.type]"
        >
          <Icon
            :name="iconMap[item.type]"
            class="mt-0.5 h-5 w-5 shrink-0"
            :class="iconColorMap[item.type]"
            aria-hidden="true"
          />
          <p class="flex-1 leading-snug">{{ item.message }}</p>
          <button
            type="button"
            class="rounded-md p-0.5 text-gray-400 transition hover:bg-black/5 hover:text-black dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Tutup notifikasi"
            @click="dismiss(item.id)"
          >
            <Icon name="ph:x-bold" class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
