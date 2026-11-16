<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    hint?: string
    defaultOpen?: boolean
  }>(),
  {
    label: 'Opsi Lanjutan',
    hint: '',
    defaultOpen: false,
  }
)
</script>

<template>
  <details
    :open="defaultOpen || undefined"
    class="group rounded-xl border border-gray/15 bg-stone-50/70 dark:border-white/10 dark:bg-gray-800/40"
  >
    <summary
      class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl"
    >
      <div class="min-w-0">
        <span class="block text-xs font-bold uppercase tracking-wider text-gray-700 group-hover:text-black dark:text-gray-200 dark:group-hover:text-white">
          {{ label }}
        </span>
        <span v-if="hint" class="mt-0.5 block text-[11px] font-normal text-gray">
          {{ hint }}
        </span>
      </div>
      <Icon
        name="ph:caret-down-bold"
        class="h-4 w-4 shrink-0 text-gray transition-transform duration-200 group-open:rotate-180"
        aria-hidden="true"
      />
    </summary>
    <div class="space-y-4 border-t border-gray/10 px-4 py-4 dark:border-white/10">
      <slot />
    </div>
  </details>
</template>
