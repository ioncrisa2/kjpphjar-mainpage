<script setup lang="ts">
import { setResponseHeader, setResponseStatus } from 'h3'

definePageMeta({ layout: false })

const { data: settings } = await useAppSettings()

useSeoMeta({
  title: () => `Maintenance | ${settings.value.siteName}`,
  description: () => settings.value.maintenanceMode.message,
  robots: 'noindex, nofollow, noarchive',
  googlebot: 'noindex, nofollow, noarchive',
})

const expectedEnd = computed(() => {
  const value = settings.value.maintenanceMode.expectedEndTime
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(date)
})

if (import.meta.server) {
  const event = useRequestEvent()
  if (event) {
    setResponseStatus(event, 503, 'Service Unavailable')
    setResponseHeader(event, 'Cache-Control', 'private, no-store, max-age=0')
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive')

    const expected = settings.value.maintenanceMode.expectedEndTime
    if (expected) {
      const retrySeconds = Math.ceil((new Date(expected).getTime() - Date.now()) / 1000)
      if (retrySeconds > 0) setResponseHeader(event, 'Retry-After', String(retrySeconds))
    }
  }
}
</script>

<template>
  <main class="flex min-h-[100dvh] items-center bg-[#08111F] px-5 py-12 font-mulish text-white sm:px-8">
    <div class="mx-auto w-full max-w-3xl">
      <div class="mb-10 flex items-center gap-3">
        <img src="/assets/images/h-logo.png" :alt="settings.siteName" class="h-11 w-auto" />
        <p class="max-w-xs text-sm font-bold leading-5 text-white/85">{{ settings.siteName }}</p>
      </div>

      <div class="max-w-2xl">
        <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/85">
          <span class="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          Pemeliharaan terjadwal
        </div>
        <h1 class="max-w-xl text-4xl font-black leading-tight tracking-[-0.03em] text-wrap-balance sm:text-5xl">
          Kami sedang merawat website ini.
        </h1>
        <p class="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
          {{ settings.maintenanceMode.message }}
        </p>

        <div v-if="expectedEnd" class="mt-8 border-t border-white/15 pt-6">
          <p class="text-xs font-bold text-white/55">Estimasi layanan kembali</p>
          <p class="mt-1 text-base font-bold text-white">{{ expectedEnd }} WIB</p>
        </div>

        <p class="mt-10 max-w-xl text-sm leading-6 text-white/55">
          Terima kasih atas kesabaran Anda. Silakan muat ulang halaman ini setelah waktu pemeliharaan berakhir.
        </p>
      </div>

      <div class="mt-14 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/45">
        <span>HTTP 503 / Layanan sementara tidak tersedia</span>
        <NuxtLink to="/admin/login" class="font-semibold transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          Akses admin
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
