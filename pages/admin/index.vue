<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Dashboard | Admin KJPP HJA'R" })

const { data: galleryData } = await useFetch('/api/gallery', { query: { limit: 1 } })
const { data: contactsData } = await useFetch('/api/contacts', { query: { limit: 1 } })
const { data: servicesData } = await useFetch('/api/services')
const { data: careersData } = await useFetch('/api/careers')

const stats = computed(() => [
  { label: 'Total Foto Galeri', value: galleryData.value?.total ?? 0, icon: '🖼️', to: '/admin/gallery' },
  { label: 'Pesan Belum Dibaca', value: contactsData.value?.unread ?? 0, icon: '✉️', to: '/admin/contacts', highlight: true },
  { label: 'Layanan Aktif', value: servicesData.value?.length ?? 0, icon: '⚙️', to: '/admin/services' },
  { label: 'Lowongan Aktif', value: careersData.value?.length ?? 0, icon: '💼', to: '/admin/careers' },
])

const quickLinks = [
  { label: 'Upload Foto Galeri', to: '/admin/gallery', icon: '📸' },
  { label: 'Tambah Cabang', to: '/admin/branches', icon: '📍' },
  { label: 'Update Pimpinan', to: '/admin/leaders', icon: '👤' },
  { label: 'Tulis Artikel Blog', to: '/admin/blog', icon: '✍️' },
]
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold text-black dark:text-white">Dashboard</h1>
      <p class="text-sm text-gray mt-1">Selamat datang kembali di admin panel KJPP HJA'R.</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <NuxtLink
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.to"
        class="admin-card flex items-center gap-4 transition hover:shadow-md"
        :class="stat.highlight && stat.value > 0 ? 'border-2 border-primary/50' : ''"
      >
        <div class="text-3xl">{{ stat.icon }}</div>
        <div>
          <p class="text-2xl font-extrabold text-black dark:text-white">{{ stat.value }}</p>
          <p class="text-xs text-gray">{{ stat.label }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Quick Links -->
    <div class="admin-card">
      <h2 class="text-lg font-extrabold text-black dark:text-white mb-4">Aksi Cepat</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NuxtLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="flex flex-col items-center gap-2 rounded-xl border border-gray/10 p-4 text-center text-sm font-semibold text-black transition hover:border-primary hover:text-primary dark:text-white"
        >
          <span class="text-2xl">{{ link.icon }}</span>
          <span>{{ link.label }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Go to website -->
    <div class="admin-card">
      <p class="text-sm text-gray">
        Website publik:
        <NuxtLink to="/" target="_blank" class="text-primary hover:underline ml-1">
          Buka website →
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
