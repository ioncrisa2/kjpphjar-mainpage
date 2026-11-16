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
  <main class="min-h-screen font-mulish bg-white dark:bg-gray-dark flex flex-col relative z-0">
    <div class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat flex-1 flex flex-col justify-center relative">
      <div class="absolute inset-0 bg-black/30"></div>
      
      <div class="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto py-20 flex flex-col items-center text-center">
        
        <div class="mb-10 inline-block rounded-2xl border border-white/15 bg-black/40 p-6 shadow-xl">
          <img src="/assets/images/h-logo.png" :alt="settings.siteName" width="220" height="55" class="mx-auto h-14 w-auto" />
        </div>

        <div class="relative max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b131e]/90 p-8 shadow-2xl sm:p-12">
          <div class="relative z-10">
            <div class="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-4 py-2 text-sm font-bold text-white">
              <span class="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true"></span>
              Mode Pemeliharaan
            </div>
            
            <h1 class="max-w-xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[40px] mx-auto mb-6 drop-shadow-md">
              Situs ini sedang dalam pemeliharaan.
            </h1>
            
            <p class="max-w-xl mx-auto text-base leading-relaxed text-white/80 sm:text-lg">
              {{ settings.maintenanceMode.message || 'Kami sedang melakukan pemeliharaan sistem rutin untuk meningkatkan kualitas layanan kami. Silakan kembali dalam beberapa saat lagi.' }}
            </p>

            <div v-if="expectedEnd" class="mt-8 mx-auto inline-block border border-white/15 bg-white/10 rounded-xl px-6 py-4 backdrop-blur-sm">
              <p class="text-xs font-bold text-white/70 uppercase tracking-wider mb-1">Estimasi Layanan Kembali</p>
              <p class="text-xl font-extrabold text-primary drop-shadow-sm">{{ expectedEnd }} WIB</p>
            </div>
          </div>
        </div>

      </div>
    </div>
    
    <!-- Footer -->
    <div class="bg-[#0b131e] py-5 border-t border-white/5 relative z-10">
      <div class="container mx-auto px-4 text-center">
        <p class="text-sm font-semibold text-white/50">
          &copy; {{ new Date().getFullYear() }} {{ settings.siteName }}. HTTP 503 Service Unavailable.
        </p>
      </div>
    </div>
  </main>
</template>
