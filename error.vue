<script setup lang="ts">
import { clearError } from 'nuxt/app'

const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h1 class="text-9xl font-extrabold text-primary font-mulish">
          {{ error?.statusCode || 404 }}
        </h1>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Oops! Terjadi Kesalahan
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ error?.statusMessage || 'Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.' }}
        </p>
      </div>

      <div class="mt-8">
        <button
          @click="handleError"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          <i class="fas fa-home mr-2"></i> Kembali ke Beranda
        </button>
      </div>

      <div class="mt-6">
        <p class="text-xs text-gray-400">
          Butuh bantuan? <NuxtLink to="/contact-us" class="text-primary hover:underline">Hubungi Tim Dukungan Kami</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
