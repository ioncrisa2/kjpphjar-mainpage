<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: 'Dashboard', icon: 'ph:squares-four-bold', to: '/admin' },
  { label: 'Galeri', icon: 'ph:images-bold', to: '/admin/gallery' },
  { label: 'Cabang', icon: 'ph:map-pin-bold', to: '/admin/branches' },
  { label: 'Pimpinan', icon: 'ph:user-circle-bold', to: '/admin/leaders' },
  { label: 'Klien & Rekanan', icon: 'ph:handshake-bold', to: '/admin/clients' },
  { label: 'Layanan', icon: 'ph:briefcase-bold', to: '/admin/services' },
  { label: 'Blog', icon: 'ph:article-bold', to: '/admin/blog' },
  { label: 'Karir', icon: 'ph:identification-card-bold', to: '/admin/careers' },
  { label: 'Analitik', icon: 'ph:chart-line-up-bold', to: '/admin/analytics' },
  { label: 'Pengaturan', icon: 'ph:gear-six-bold', to: '/admin/settings' },
  { label: 'Inbox Kontak', icon: 'ph:envelope-simple-bold', to: '/admin/contacts' },
  { label: 'Kontak Footer', icon: 'ph:phone-bold', to: '/admin/contact-persons' },
]

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>

<template>
  <aside class="flex h-screen w-60 flex-col border-r border-gray/10 bg-white dark:bg-gray-dark">
    <!-- Logo -->
    <div class="flex items-center gap-3 border-b border-gray/10 px-5 py-4">
      <img src="/assets/images/h-logo.png" alt="KJPP HJA'R" class="h-8" />
      <div class="leading-tight">
        <p class="text-xs font-extrabold text-black dark:text-white">KJPP HJA'R</p>
        <p class="text-xs text-gray">Admin Panel</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="admin-sidebar-link"
        :class="{ active: route.path === item.to || (item.to !== '/admin' && route.path.startsWith(item.to)) }"
      >
        <Icon :name="item.icon" class="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Logout -->
    <div class="border-t border-gray/10 p-3">
      <button
        class="admin-sidebar-link w-full text-red-500 hover:bg-red-500/10 hover:text-red-500"
        @click="logout"
      >
        <Icon name="ph:sign-out-bold" class="h-5 w-5" aria-hidden="true" />
        <span>Logout</span>
      </button>
      <div class="mt-2 px-4">
        <NuxtLink
          to="/"
          target="_blank"
          class="text-xs text-gray hover:text-primary flex items-center gap-1"
        >
          <Icon name="ph:arrow-square-out-bold" class="h-4 w-4" aria-hidden="true" />
          Lihat Website
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
