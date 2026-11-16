<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const baseUrl = computed(() =>
  String(config.public.baseUrl || 'https://kjpp-hjar.co.id')
    .replace('://www.', '://')
    .replace(/\/$/, '')
)
const canonicalUrl = computed(() => {
  const cleanPath = route.path === '/' ? '' : route.path.replace(/\/+$/, '')
  return `${baseUrl.value}${cleanPath}`
})
const defaultOgImage = computed(() => `${baseUrl.value}/assets/images/og-default.jpg`)

useHead({
  htmlAttrs: { lang: 'id' },
  link: [
    {
      key: 'canonical',
      rel: 'canonical',
      href: canonicalUrl,
    },
  ],
})

useSeoMeta({
  ogUrl: () => canonicalUrl.value,
  ogImage: () => defaultOgImage.value,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterImage: () => defaultOgImage.value,
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white font-mulish dark:bg-black">
    <LayoutAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutAppFooter />
    <!-- WhatsApp floating button -->
    <UiWhatsAppButton />
  </div>
</template>
