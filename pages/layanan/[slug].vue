<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: service, pending, error } = await useFetch(`/api/services/${slug}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Layanan tidak ditemukan' })
}

import lightGallery from 'lightgallery'
import lgZoom from 'lightgallery/plugins/zoom'

const serviceRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (serviceRef.value) {
    const images = serviceRef.value.querySelectorAll('img')
    images.forEach(img => {
      // Don't wrap if already wrapped
      if (img.parentElement?.tagName.toLowerCase() === 'a') return

      const a = document.createElement('a')
      a.href = img.src
      a.setAttribute('data-src', img.src)
      img.parentNode?.insertBefore(a, img)
      a.appendChild(img)
      img.style.cursor = 'zoom-in'
    })

    lightGallery(serviceRef.value, {
      plugins: [lgZoom],
      speed: 500,
      selector: 'a[data-src]',
      download: false
    })
  }
})

useHead({
  title: computed(() => service.value ? `${service.value.title} | KJPP HJA'R` : "Layanan | KJPP HJA'R"),
  meta: [
    { name: 'description', content: computed(() => service.value?.description || '') },
    { property: 'og:title', content: computed(() => service.value?.title || '') },
    { property: 'og:description', content: computed(() => service.value?.description || '') }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => service.value ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": service.value.title,
        "description": service.value.description,
        "provider": {
          "@type": "LocalBusiness",
          "name": "KJPP Henricus Judi Adrianto dan Rekan"
        }
      }) : '')
    }
  ]
})
</script>

<template>
  <div v-if="pending" class="min-h-[60vh] flex items-center justify-center text-gray">
    Memuat data...
  </div>
  <div v-else-if="service">
    <!-- Banner -->
    <div class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
      <div class="container">
        <div class="items-center py-10 md:flex md:h-[400px] md:py-0">
          <div class="heading mb-0 text-center md:text-left">
            <h1 class="!text-white text-2xl font-extrabold sm:text-3xl lg:text-[40px] lg:!leading-[50px]">{{ service.title }}</h1>
          </div>
        </div>
      </div>
    </div>
    <!-- Main Content (Rich Text) -->
    <div class="py-16 sm:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <UiBreadcrumbs 
          :items="[
            { label: 'Layanan', to: '/layanan' },
            { label: service.title }
          ]" 
          class="mb-6"
        />
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <ClientOnly v-if="service.icon">
              <Icon :name="getNuxtIconName(service.icon)" class="text-3xl text-primary" />
            </ClientOnly>
            <svg v-else class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-black font-mulish mb-4 dark:text-white">{{ service.title }}</h2>
          <p v-if="service.titleEn" class="text-sm font-semibold text-primary uppercase tracking-widest mb-6">
            {{ service.titleEn }}
          </p>
          <p class="text-xl text-gray">
            {{ service.description }}
          </p>
        </div>

        <!-- Quill/WYSIWYG Output Container -->
        <!-- We use the prose (Tailwind Typography) plugin to style raw HTML content automatically -->
        <article
          ref="serviceRef"
          class="prose prose-lg prose-blue mx-auto max-w-none text-gray-900 dark:prose-invert dark:text-gray-300"
          v-html="service.content"
        ></article>

        <!-- CTA -->
        <div class="mt-16 bg-gray-50 rounded-xl p-8 text-center border border-gray-200 dark:bg-white/5 dark:border-white/10">
          <h3 class="text-2xl font-bold text-black mb-4 dark:text-white">Butuh Layanan Ini?</h3>
          <p class="text-gray mb-8">Hubungi tim profesional kami untuk mendiskusikan kebutuhan Anda lebih lanjut.</p>
          <NuxtLink to="/contact-us" class="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 text-base font-bold text-black transition hover:bg-secondary hover:text-white md:px-10 md:py-4 md:text-lg">
            Hubungi Kami Sekarang
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Artikel sekategori dengan layanan (slug kategori = slug layanan), fallback ke artikel terbaru -->
    <BlogRecentArticles
      class="border-t border-gray-100 bg-gray-50 py-16 dark:border-white/10 dark:bg-white/5 sm:py-20"
      :category="service.slug"
      :category-title="`Artikel seputar ${service.title}`"
      description="Bacaan lanjutan untuk membantu Anda memahami layanan ini lebih dalam."
    />
  </div>
</template>
