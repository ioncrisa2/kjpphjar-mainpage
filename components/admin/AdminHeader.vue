<script setup lang="ts">
const route = useRoute()

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

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>

<template>
  <header class="flex h-14 items-center justify-between border-b border-gray/10 bg-white px-6 dark:bg-gray-dark">
    <div class="text-sm font-semibold text-black dark:text-white capitalize">
      Admin / {{ breadcrumbLabel || 'Dashboard' }}
    </div>

    <div class="flex items-center gap-3">
      <!-- Inbox Link -->
      <NuxtLink
        to="/admin/contacts"
        class="relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-stone-100 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Icon name="ph:envelope-simple-bold" class="h-4 w-4" aria-hidden="true" />
        <span>Inbox</span>
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

