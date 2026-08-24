<script setup lang="ts">
import { useAppStore } from '~/stores/app'
const store = useAppStore()
</script>

<template>
  <div class="flex min-h-screen font-mulish" :class="store.theme === 'dark' ? 'dark' : ''">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Content -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <AdminHeader />
      <main class="flex-1 overflow-y-auto bg-stone-50 p-6 dark:bg-gray-dark/50">
        <slot />
      </main>
    </div>
  </div>
</template>
