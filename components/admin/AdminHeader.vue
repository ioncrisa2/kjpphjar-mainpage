<script setup lang="ts">
const route = useRoute()
const { isCollapsed, toggleSidebar } = useAdminSidebar()

const breadcrumbLabel = computed(() => {
  const path = route.path.replace('/admin', '').replace('/', '') || 'dashboard'
  const map: Record<string, string> = {
    '': 'Dashboard',
    gallery: 'Galeri',
    branches: 'Cabang',
    leaders: 'Pimpinan',
    clients: 'Klien & Rekanan',
    services: 'Layanan',
    blog: 'Blog',
    categories: 'Kategori',
    careers: 'Karir',
    analytics: 'Analitik',
    settings: 'Pengaturan',
    contacts: 'Inbox Kontak',
    'contact-persons': 'Kontak Footer',
    create: 'Tambah Baru',
  }
  const segments = path.split('/').filter(Boolean)
  return segments.map((s) => map[s] || s).join(' / ')
})

const { unreadCount, fetchUnreadCount } = useUnreadContacts()
const { data: adminInfo } = useFetch<{ authenticated: boolean; username?: string; name?: string }>('/api/auth/me')

onMounted(() => {
  fetchUnreadCount()
})

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>

<template>
  <header class="flex h-14 items-center justify-between border-b border-gray/10 bg-white px-4 md:px-6 dark:bg-gray-dark shrink-0">
    <div class="flex items-center gap-2.5">
      <!-- Sidebar Quick Toggle Button -->
      <button
        type="button"
        @click="toggleSidebar"
        class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:text-black hover:bg-stone-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition"
        :title="isCollapsed ? 'Perluas Menu Sidebar' : 'Ciutkan Menu Sidebar'"
        aria-label="Toggle Sidebar Menu"
      >
        <Icon
          name="ph:list-bold"
          class="h-5 w-5 transition-transform duration-200"
        />
      </button>

      <div class="text-sm font-semibold text-black dark:text-white capitalize">
        Admin / {{ breadcrumbLabel || 'Dashboard' }}
      </div>
    </div>

    <div class="flex items-center gap-3">
      <!-- Admin Profile Quick Link -->
      <NuxtLink
        to="/admin/settings"
        class="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-black hover:bg-stone-100 dark:text-white dark:hover:bg-gray-800 transition"
        title="Buka Profil & Pengaturan Admin"
      >
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Icon name="ph:user-bold" class="h-3.5 w-3.5" />
        </div>
        <span class="hidden md:inline">{{ adminInfo?.name || 'Administrator' }}</span>
      </NuxtLink>

      <div class="h-4 w-px bg-gray/20"></div>

      <!-- Inbox Link with Badge -->
      <NuxtLink
        to="/admin/contacts"
        class="relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-stone-100 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Icon name="ph:envelope-simple-bold" class="h-4 w-4" aria-hidden="true" />
        <span>Inbox</span>
        <span
          v-if="unreadCount > 0"
          class="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-xs animate-pulse"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </NuxtLink>

      <div class="h-4 w-px bg-gray/20"></div>

      <!-- Lihat Website Button -->
      <NuxtLink
        to="/"
        target="_blank"
        class="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-black dark:bg-primary/10 dark:hover:bg-primary dark:hover:text-black"
        title="Buka Website Publik"
      >
        <Icon name="ph:arrow-square-out-bold" class="h-4 w-4" aria-hidden="true" />
        <span>Lihat Website</span>
      </NuxtLink>

      <!-- Logout Button -->
      <button
        @click="logout"
        class="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-500 hover:text-white dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
        title="Keluar dari Admin Panel"
      >
        <Icon name="ph:sign-out-bold" class="h-4 w-4" aria-hidden="true" />
        <span>Logout</span>
      </button>
    </div>
  </header>
</template>

