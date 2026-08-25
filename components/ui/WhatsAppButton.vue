<script setup lang="ts">
const config = useRuntimeConfig()
const { data: settings } = await useAppSettings()
const waNumber = computed(() => {
  const configured = settings.value.generalContacts.whatsapp.replace(/\D/g, '')
  return configured || String(config.public.whatsappNumber || '').replace(/\D/g, '')
})
const waMessage = encodeURIComponent('Halo, saya ingin bertanya mengenai layanan KJPP HJA\'R.')
const waUrl = computed(() => `https://wa.me/${waNumber.value}?text=${waMessage}`)
</script>

<template>
  <a
    v-if="waNumber"
    :href="waUrl"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Hubungi kami via WhatsApp"
    class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
  >
    <Icon name="ph:whatsapp-logo-fill" class="h-7 w-7 text-white" aria-hidden="true" />
  </a>
</template>
