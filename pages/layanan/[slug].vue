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

const config = useRuntimeConfig()
const baseUrl = String(config.public.baseUrl || 'https://kjpp-hjar.co.id').replace('://www.', '://').replace(/\/$/, '')
const { company } = useCompanyProfile()

const serviceHtml = computed(() => {
  const raw = String(service.value?.content || '')
  return raw.replace(/<(\/?)h1(\b[^>]*)>/gi, '<$1h2$2>')
})

const pageTitle = computed(() =>
  service.value
    ? `${service.value.title} di Palembang & Sumatera Selatan | KJPP HJA'R`
    : "Layanan Penilaian Publik | KJPP HJA'R"
)
const pageDescription = computed(() => service.value?.description || '')

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
  ogTitle: () => pageTitle.value,
  ogDescription: () => pageDescription.value,
  twitterTitle: () => pageTitle.value,
  twitterDescription: () => pageDescription.value,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() =>
        service.value
          ? JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: service.value.title,
              serviceType: service.value.title,
              description: service.value.description,
              url: `${baseUrl}/layanan/${service.value.slug || slug}`,
              provider: {
                '@type': 'ProfessionalService',
                '@id': `${baseUrl}/#organization`,
                name: company.name,
                url: baseUrl,
                telephone: company.headOffice.phone,
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: company.headOffice.streetAddress,
                  addressLocality: company.headOffice.locality,
                  addressRegion: company.headOffice.region,
                  postalCode: company.headOffice.postalCode,
                  addressCountry: company.headOffice.country,
                },
              },
              areaServed: [
                { '@type': 'City', name: 'Palembang' },
                { '@type': 'AdministrativeArea', name: 'Sumatera Selatan' },
                { '@type': 'Place', name: 'Sumatera' },
                { '@type': 'Country', name: 'Indonesia' },
              ],
            })
          : ''
      ),
    },
  ],
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
            <span v-if="service.titleEn" class="subtitle !text-white">{{ service.titleEn }}</span>
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
          class="mb-8"
        />

        <!-- Quill/WYSIWYG Output Container -->
        <article
          ref="serviceRef"
          class="prose prose-lg prose-blue mx-auto max-w-none text-gray-900 dark:prose-invert dark:text-gray-300"
          v-html="serviceHtml"
        ></article>

        <!-- CTA -->
        <div class="mt-16 bg-gray-50 rounded-xl p-8 text-center border border-gray-200 dark:bg-white/5 dark:border-white/10">
          <h2 class="text-2xl font-bold text-black mb-4 dark:text-white">Butuh Layanan {{ service.title }}?</h2>
          <p class="text-gray mb-8">
            Hubungi tim penilai publik kami di Palembang untuk konsultasi ruang lingkup, dokumen persyaratan, dan penawaran tertulis, atau pelajari <NuxtLink to="/faq" class="font-bold text-primary hover:underline">Tanya Jawab (FAQ)</NuxtLink> seputar prosedur penilaian.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <NuxtLink to="/contact-us" class="btn !rounded-xl inline-flex items-center justify-center gap-2 md:px-10 md:py-4 md:text-base">
              <span>Hubungi Kami Sekarang</span>
              <Icon name="ph:arrow-right-bold" class="h-4 w-4" aria-hidden="true" />
            </NuxtLink>
            <NuxtLink to="/faq" class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray/25 bg-white px-6 py-4 text-sm font-extrabold uppercase text-black transition hover:border-primary hover:text-primary dark:border-white/15 dark:bg-gray-dark dark:text-white">
              <span>Baca Tanya Jawab (FAQ)</span>
            </NuxtLink>
          </div>
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
