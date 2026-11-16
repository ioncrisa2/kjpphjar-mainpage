<script setup lang="ts">
import { useAppStore } from '~/stores/app'

const route = useRoute()
const store = useAppStore()
const { isCollapsed, toggleSidebar } = useAdminSidebar()

const breadcrumbLabel = computed(() => {
  const path = route.path.replace('/admin', '').replace('/', '') || 'dashboard'
  const map: Record<string, string> = {
    '': 'Dashboard',
    gallery: 'Galeri',
    branches: 'Cabang',
    leaders: 'Pimpinan',
    staff: 'Staff',
    clients: 'Klien & Rekanan',
    services: 'Layanan',
    blog: 'Blog',
    categories: 'Kategori',
    careers: 'Karir',
    analytics: 'Analitik',
    settings: 'Pengaturan',
    contacts: 'Inbox Kontak',
    'contact-persons': 'Kontak Footer',
    faq: 'FAQ',
    users: 'Pengguna',
    roles: 'Role & Hak Akses',
    profile: 'Profil Saya',
    create: 'Tambah Baru',
  }
  const segments = path.split('/').filter(Boolean)
  return segments.map((s) => map[s] || s).join(' / ')
})

const { unreadCount, fetchUnreadCount } = useUnreadContacts()
const { session, can, clearSession } = useAdminAuth()

const accountMenuOpen = ref(false)
const accountMenuRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (can('contacts.view')) fetchUnreadCount()
  if (import.meta.client) {
    document.addEventListener('click', onOutsideClick)
    window.addEventListener('keydown', onEscapeKey)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('click', onOutsideClick)
    window.removeEventListener('keydown', onEscapeKey)
  }
})

function onOutsideClick(event: MouseEvent) {
  if (accountMenuOpen.value && accountMenuRef.value && !accountMenuRef.value.contains(event.target as Node)) {
    accountMenuOpen.value = false
  }
}

function onEscapeKey(event: KeyboardEvent) {
  if (accountMenuOpen.value && event.key === 'Escape') {
    accountMenuOpen.value = false
  }
}

watch(() => route.path, () => {
  accountMenuOpen.value = false
})

function toggleAdminTheme() {
  store.toggleTheme(store.theme === 'light' ? 'dark' : 'light')
}

async function logout() {
  accountMenuOpen.value = false
  await $fetch('/api/auth/logout', { method: 'POST' })
  clearSession()
  await navigateTo('/admin/login')
}
</script>

<template>
  <header class="flex h-14 items-center justify-between border-b border-gray/10 bg-white px-4 md:px-6 dark:bg-gray-dark shrink-0">
    <div class="flex items-center gap-2.5 min-w-0">
      <!-- Sidebar Quick Toggle Button -->
      <button
        type="button"
        @click="toggleSidebar"
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:text-black hover:bg-stone-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition"
        :title="isCollapsed ? 'Perluas Menu Sidebar' : 'Ciutkan Menu Sidebar'"
        aria-label="Toggle Sidebar Menu"
      >
        <Icon
          name="ph:list-bold"
          class="h-5 w-5 transition-transform duration-200"
        />
      </button>

      <div class="truncate text-sm font-semibold text-black dark:text-white capitalize">
        Admin / {{ breadcrumbLabel || 'Dashboard' }}
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <!-- Inbox Link with Badge -->
      <NuxtLink
        v-if="can('contacts.view')"
        to="/admin/contacts"
        class="relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-stone-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <Icon name="ph:envelope-simple-bold" class="h-4 w-4" aria-hidden="true" />
        <span class="hidden sm:inline">Inbox</span>
        <span
          v-if="unreadCount > 0"
          class="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </NuxtLink>

      <!-- Lihat Website Button -->
      <NuxtLink
        to="/"
        target="_blank"
        class="inline-flex items-center gap-1.5 rounded-lg border border-gray/20 px-2.5 py-1.5 text-xs font-semibold text-black transition hover:border-primary hover:text-primary dark:border-white/15 dark:text-white dark:hover:border-primary dark:hover:text-primary"
        title="Buka Website Publik"
      >
        <Icon name="ph:arrow-square-out-bold" class="h-4 w-4" aria-hidden="true" />
        <span class="hidden sm:inline">Lihat Website</span>
      </NuxtLink>

      <div class="h-4 w-px bg-gray/20"></div>

      <!-- Account Card Popover -->
      <div ref="accountMenuRef" class="relative">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-transparent px-2 py-1 text-left transition hover:border-gray/15 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:hover:border-white/10 dark:hover:bg-gray-800"
          :aria-expanded="accountMenuOpen"
          aria-haspopup="menu"
          @click="accountMenuOpen = !accountMenuOpen"
        >
          <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-black dark:bg-gray-800 dark:text-white">
            <Icon name="ph:user-circle-bold" class="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span class="hidden md:block leading-tight">
            <span class="block max-w-[130px] truncate text-xs font-bold text-black dark:text-white">
              {{ session?.name || 'Administrator' }}
            </span>
            <span v-if="session?.roleName" class="block text-[10px] font-semibold text-gray">
              {{ session.roleName }}
            </span>
          </span>
          <Icon
            name="ph:caret-down-bold"
            class="h-3.5 w-3.5 text-gray transition-transform duration-150"
            :class="accountMenuOpen ? 'rotate-180' : ''"
            aria-hidden="true"
          />
        </button>

        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="accountMenuOpen"
            role="menu"
            class="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-gray/15 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-gray-dark"
          >
            <!-- Identity Header Card -->
            <div class="mb-1.5 rounded-xl bg-stone-50 px-3 py-2.5 dark:bg-gray-800/70">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="truncate text-sm font-extrabold text-black dark:text-white">
                    {{ session?.name || 'Administrator' }}
                  </p>
                  <p v-if="session?.username" class="truncate text-xs text-gray">
                    @{{ session.username }}
                  </p>
                </div>
                <span
                  v-if="session?.roleName"
                  class="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-700 ring-1 ring-gray/15 dark:bg-gray-dark dark:text-gray-200 dark:ring-white/10"
                >
                  {{ session.roleName }}
                </span>
              </div>
            </div>

            <!-- Menu Links -->
            <NuxtLink
              to="/admin/profile"
              role="menuitem"
              class="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-black transition hover:bg-stone-100 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="accountMenuOpen = false"
            >
              <Icon name="ph:user-gear-bold" class="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              <span>Profil Saya &amp; Password</span>
            </NuxtLink>

            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-black transition hover:bg-stone-100 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="toggleAdminTheme"
            >
              <span class="flex items-center gap-2.5">
                <Icon
                  :name="store.theme === 'dark' ? 'ph:moon-bold' : 'ph:sun-bold'"
                  class="h-4 w-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                />
                <span>Tema Tampilan</span>
              </span>
              <span class="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {{ store.theme === 'dark' ? 'Gelap' : 'Terang' }}
              </span>
            </button>

            <div class="my-1.5 border-t border-gray/10"></div>

            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              @click="logout"
            >
              <Icon name="ph:sign-out-bold" class="h-4 w-4" aria-hidden="true" />
              <span>Keluar</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>
