<script setup lang="ts">
import { useAppStore } from '~/stores/app'
const store = useAppStore()
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden font-mulish bg-stone-50 dark:bg-gray-dark/50" :class="store.theme === 'dark' ? 'dark' : ''">
    <!-- Sticky / Fixed Left Sidebar -->
    <AdminSidebar class="sticky top-0 h-screen shrink-0" />

    <!-- Main Scrollable Content Area -->
    <div class="flex flex-1 flex-col h-screen min-w-0 overflow-hidden">
      <!-- Fixed / Topbar Header -->
      <AdminHeader class="shrink-0" />

      <!-- Scrollable Main Container -->
      <main class="flex-1 overflow-y-auto flex flex-col justify-between p-6 lg:p-8">
        <div class="flex-1">
          <slot />
        </div>

        <!-- Admin Content Boundary Footer -->
        <footer class="mt-12 border-t border-gray/10 pt-6 pb-2 text-xs text-gray dark:text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 select-none">
          <div class="flex items-center gap-2 text-center sm:text-left">
            <span class="font-bold text-black dark:text-white">KJPP Henricus Judi Adrianto dan Rekan</span>
            <span>— Panel Manajemen Konten & Analitik</span>
          </div>
          <div class="flex items-center gap-4 text-xs font-semibold">
            <span class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Online
            </span>
            <span class="text-gray-400 dark:text-gray-500">v1.0</span>
          </div>
        </footer>
      </main>
    </div>

    <!-- Global Confirmation Modal for Admin Actions -->
    <UiConfirmModal />
  </div>
</template>

