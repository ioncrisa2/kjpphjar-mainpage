<script setup lang="ts">
import { clearError } from 'nuxt/app'

const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 font-mulish sm:px-6 lg:px-8 dark:bg-black">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h1 class="text-9xl font-extrabold text-primary font-mulish">
          {{ error?.statusCode || 404 }}
        </h1>
        <h2 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          Oops! Terjadi Kesalahan
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {{ error?.statusMessage || 'Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.' }}
        </p>
      </div>

      <div class="mt-8">
        <button
          @click="handleError"
          class="w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-black bg-primary hover:bg-secondary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary transition-colors dark:focus-visible:ring-offset-black"
        >
          <Icon name="ph:house-bold" class="mr-2" aria-hidden="true" /> Kembali ke Beranda
        </button>
      </div>

      <div class="mt-6">
        <p class="text-xs text-gray-400 dark:text-gray-500">
          Butuh bantuan? <NuxtLink to="/contact-us" class="text-primary hover:underline">Hubungi Tim Dukungan Kami</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
