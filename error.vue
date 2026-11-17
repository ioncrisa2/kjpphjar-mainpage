<script setup lang="ts">
import { clearError } from 'nuxt/app'

const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 font-mulish sm:px-6 lg:px-8 dark:bg-[#08111F]">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h1 class="text-9xl font-bold tabular-nums text-[#011987] dark:text-[#47BDFF]" style="font-family: 'Source Serif 4', Georgia, serif">
          {{ error?.statusCode || 404 }}
        </h1>
        <h2 class="mt-6 text-[32px] text-[#08111F] dark:text-white" style="font-family: 'Source Serif 4', Georgia, serif; font-weight: 600">
          Oops! Terjadi Kesalahan
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {{ error?.statusMessage || 'Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.' }}
        </p>
      </div>

      <div class="mt-8">
        <button
          @click="handleError"
          class="w-full flex items-center justify-center py-3 px-4 rounded-[2px] text-[16px] font-bold text-white bg-[#011987] hover:bg-[#0B1640] dark:bg-[#47BDFF] dark:text-[#08111F] dark:hover:bg-[#74CEFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary transition-colors dark:focus-visible:ring-offset-black"
        >
          <Icon name="ph:house-bold" class="mr-2" aria-hidden="true" /> Kembali ke Beranda
        </button>
      </div>

      <div class="mt-6">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Butuh bantuan? <NuxtLink to="/contact-us" class="font-bold text-[#011987] underline dark:text-[#47BDFF]">Hubungi Tim Dukungan Kami</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
