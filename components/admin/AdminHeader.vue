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
</script>

<template>
  <header class="flex h-14 items-center justify-between border-b border-gray/10 bg-white px-6 dark:bg-gray-dark">
    <div class="text-sm font-semibold text-black dark:text-white capitalize">
      Admin / {{ breadcrumbLabel || 'Dashboard' }}
    </div>
    <div class="flex items-center gap-3">
      <NuxtLink to="/admin/contacts" class="relative inline-flex items-center gap-1.5 text-sm text-gray transition hover:text-primary">
        <Icon name="ph:envelope-simple-bold" class="h-4 w-4" aria-hidden="true" />
        Inbox
      </NuxtLink>
    </div>
  </header>
</template>
