<script setup lang="ts">
export interface ActionMenuItem {
  label: string
  icon?: string
  to?: string
  variant?: 'default' | 'danger'
  disabled?: boolean
  title?: string
  onClick?: () => void
}

const props = withDefaults(
  defineProps<{
    items: ActionMenuItem[]
    label?: string
    align?: 'left' | 'right'
  }>(),
  {
    label: 'Menu aksi',
    align: 'right',
  }
)

const isOpen = ref(false)
const triggerRef = ref<HTMLButtonElement | null>(null)
const menuRef = ref<HTMLDivElement | null>(null)
const coords = ref({ top: 0, left: 0 })

function updatePosition() {
  if (!triggerRef.value || !import.meta.client) return
  const rect = triggerRef.value.getBoundingClientRect()
  const menuWidth = 192
  const estimatedHeight = props.items.length * 40 + 16
  const spaceBelow = window.innerHeight - rect.bottom
  const openUpward = spaceBelow < estimatedHeight + 12 && rect.top > estimatedHeight

  const top = openUpward
    ? Math.max(8, rect.top - estimatedHeight - 6)
    : Math.min(window.innerHeight - estimatedHeight - 8, rect.bottom + 6)

  const rawLeft = props.align === 'right' ? rect.right - menuWidth : rect.left
  const left = Math.max(8, Math.min(window.innerWidth - menuWidth - 8, rawLeft))

  coords.value = { top, left }
}

function toggle() {
  if (isOpen.value) {
    isOpen.value = false
    return
  }
  updatePosition()
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function handleAction(item: ActionMenuItem) {
  if (item.disabled) return
  close()
  item.onClick?.()
}

function onDocumentClick(event: MouseEvent) {
  if (!isOpen.value) return
  const target = event.target as Node
  if (triggerRef.value?.contains(target) || menuRef.value?.contains(target)) return
  close()
}

function onKeydown(event: KeyboardEvent) {
  if (isOpen.value && event.key === 'Escape') {
    close()
    triggerRef.value?.focus()
  }
}

onMounted(() => {
  if (!import.meta.client) return
  document.addEventListener('click', onDocumentClick)
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', close)
  window.addEventListener('scroll', close, true)
})

onUnmounted(() => {
  if (!import.meta.client) return
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', close)
  window.removeEventListener('scroll', close, true)
})
</script>

<template>
  <div class="inline-flex">
    <button
      ref="triggerRef"
      type="button"
      class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-stone-100 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      :aria-label="label"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      @click.stop="toggle"
    >
      <Icon name="ph:dots-three-vertical-bold" class="h-4.5 w-4.5" aria-hidden="true" />
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-120 ease-out"
        enter-from-class="scale-95 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-95 opacity-0"
      >
        <div
          v-if="isOpen"
          ref="menuRef"
          role="menu"
          class="fixed z-[90] w-48 rounded-xl border border-gray/15 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-gray-dark"
          :style="{ top: `${coords.top}px`, left: `${coords.left}px` }"
        >
          <template v-for="item in items" :key="item.label">
            <NuxtLink
              v-if="item.to && !item.disabled"
              :to="item.to"
              role="menuitem"
              class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-black transition-colors hover:bg-stone-100 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="close"
            >
              <Icon v-if="item.icon" :name="item.icon" class="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              <span class="truncate">{{ item.label }}</span>
            </NuxtLink>
            <button
              v-else
              type="button"
              role="menuitem"
              :disabled="item.disabled"
              :title="item.title"
              class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              :class="
                item.variant === 'danger'
                  ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10'
                  : 'text-black hover:bg-stone-100 dark:text-gray-200 dark:hover:bg-gray-800'
              "
              @click="handleAction(item)"
            >
              <Icon
                v-if="item.icon"
                :name="item.icon"
                class="h-4 w-4 shrink-0"
                :class="item.variant === 'danger' ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'"
                aria-hidden="true"
              />
              <span class="truncate">{{ item.label }}</span>
            </button>
          </template>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
