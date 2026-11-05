<script setup lang="ts">
import type { PermissionRequirement } from '~/shared/permissions'

definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Dashboard | Admin KJPP HJA'R" })

const { session, can } = useAdminAuth()

// Middleware auth mengarahkan ke sini dengan ?akses=ditolak saat halaman tidak boleh diakses.
const route = useRoute()
const shownNotice = computed(() =>
  route.query.akses === 'ditolak' ? 'Anda tidak memiliki akses ke halaman tersebut.' : ''
)
function dismissNotice() {
  navigateTo({ path: '/admin', replace: true })
}

// Endpoint privat hanya dipanggil bila user memiliki izinnya.
const { data: galleryData } = await useFetch('/api/gallery', {
  query: { limit: 1, admin: 'true' },
  immediate: can('gallery.view'),
})
const { data: contactsData } = await useFetch('/api/contacts', {
  query: { limit: 1 },
  immediate: can('contacts.view'),
})
const { data: servicesData } = await useFetch('/api/services', { immediate: can('services.view') })
const { data: careersData } = await useFetch('/api/careers', { immediate: can('careers.view') })

interface StatCard {
  label: string
  value: number
  icon: string
  to: string
  permission: PermissionRequirement
  highlight?: boolean
}

const stats = computed(() => ([
  { label: can('gallery.manage_all') ? 'Total Foto Galeri' : 'Foto Galeri Saya', value: galleryData.value?.total ?? 0, icon: '🖼️', to: '/admin/gallery', permission: 'gallery.view' },
  { label: 'Pesan Belum Dibaca', value: contactsData.value?.unread ?? 0, icon: '✉️', to: '/admin/contacts', permission: 'contacts.view', highlight: true },
  { label: 'Layanan Aktif', value: servicesData.value?.length ?? 0, icon: '⚙️', to: '/admin/services', permission: 'services.view' },
  { label: 'Lowongan Aktif', value: careersData.value?.length ?? 0, icon: '💼', to: '/admin/careers', permission: 'careers.view' },
] as StatCard[]).filter((stat) => can(stat.permission)))

const quickLinks = computed(() => ([
  { label: 'Tulis Artikel Blog', to: '/admin/blog/create', icon: '✍️', permission: 'blog.create' },
  { label: 'Upload Foto Galeri', to: '/admin/gallery', icon: '📸', permission: 'gallery.create' },
  { label: 'Tambah Klien & Rekanan', to: '/admin/clients', icon: '🤝', permission: 'clients.create' },
  { label: 'Tambah Cabang', to: '/admin/branches', icon: '📍', permission: 'branches.create' },
  { label: 'Update Pimpinan', to: '/admin/leaders', icon: '👤', permission: 'leaders.update' },
] as Array<{ label: string; to: string; icon: string; permission: PermissionRequirement }>)
  .filter((link) => can(link.permission)))
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold text-black dark:text-white">Dashboard</h1>
      <p class="text-sm text-gray mt-1">
        Selamat datang kembali<span v-if="session?.name">, {{ session.name }}</span>, di admin panel KJPP HJA'R.
      </p>
    </div>

    <div
      v-if="shownNotice"
      role="alert"
      class="flex items-start justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300"
    >
      <span class="flex items-center gap-2">
        <Icon name="ph:lock-key-bold" class="h-4 w-4 shrink-0" aria-hidden="true" />
        {{ shownNotice }}
      </span>
      <button type="button" class="text-amber-700 hover:text-amber-900 dark:text-amber-300" aria-label="Tutup pesan" @click="dismissNotice">
        <Icon name="ph:x-bold" class="h-4 w-4" />
      </button>
    </div>

    <!-- Stats -->
    <div v-if="stats.length" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
    <div v-if="quickLinks.length" class="admin-card">
      <h2 class="text-lg font-extrabold text-black dark:text-white mb-4">Aksi Cepat</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NuxtLink
          v-for="link in quickLinks"
          :key="link.to + link.label"
          :to="link.to"
          class="flex flex-col items-center gap-2 rounded-xl border border-gray/10 p-4 text-center text-sm font-semibold text-black transition hover:border-primary hover:text-primary dark:text-white"
        >
          <span class="text-2xl">{{ link.icon }}</span>
          <span>{{ link.label }}</span>
        </NuxtLink>
      </div>
    </div>

    <div v-if="!stats.length && !quickLinks.length" class="admin-card text-sm text-gray">
      Akun Anda belum memiliki akses ke menu apa pun. Hubungi administrator untuk mengatur hak akses.
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
