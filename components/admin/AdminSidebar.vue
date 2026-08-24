<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: 'Dashboard', icon: '📊', to: '/admin' },
  { label: 'Galeri', icon: '🖼️', to: '/admin/gallery' },
  { label: 'Cabang', icon: '📍', to: '/admin/branches' },
  { label: 'Pimpinan', icon: '👤', to: '/admin/leaders' },
  { label: 'Klien & Rekanan', icon: '🤝', to: '/admin/clients' },
  { label: 'Layanan', icon: '⚙️', to: '/admin/services' },
  { label: 'Blog', icon: '📝', to: '/admin/blog' },
  { label: 'Karir', icon: '💼', to: '/admin/careers' },
  { label: 'Inbox Kontak', icon: '✉️', to: '/admin/contacts' },
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
        <span class="text-base">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Logout -->
    <div class="border-t border-gray/10 p-3">
      <button
        class="admin-sidebar-link w-full text-red-500 hover:bg-red-500/10 hover:text-red-500"
        @click="logout"
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>
      <div class="mt-2 px-4">
        <NuxtLink
          to="/"
          target="_blank"
          class="text-xs text-gray hover:text-primary flex items-center gap-1"
        >
          <span>↗</span> Lihat Website
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
