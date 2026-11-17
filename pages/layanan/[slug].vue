<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: service, pending, error } = await useFetch(`/api/services/${slug}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Layanan tidak ditemukan' })
}

import lightGallery from 'lightgallery'
import lgZoom from 'lightgallery/plugins/zoom'
import { sanitizeJsonLd } from '~/shared/company-data'
import { SERVICE_CONTENT_CATALOG } from '~/shared/service-content'

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
  const dbContent = String(service.value?.content || '').trim()
  const catalogContent = SERVICE_CONTENT_CATALOG[slug]?.content || ''
  const raw = dbContent.length >= 600 ? dbContent : catalogContent || dbContent
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
          ? JSON.stringify(
              sanitizeJsonLd({
                '@context': 'https://schema.org',
                '@type': 'Service',
                name: service.value.title,
                serviceType: service.value.title,
                description: service.value.description,
                url: `${baseUrl}/layanan/${service.value.slug || slug}`,
                provider: {
                  '@type': 'ProfessionalService',
                  '@id': `${baseUrl}/#organization`,
                  name: company.value.name,
                  url: baseUrl,
                  telephone: company.value.headOffice.phone,
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: company.value.headOffice.streetAddress,
                    addressLocality: company.value.headOffice.locality,
                    addressRegion: company.value.headOffice.region,
                    postalCode: company.value.headOffice.postalCode,
                    addressCountry: company.value.headOffice.country,
                  },
                },
                areaServed: [
                  { '@type': 'City', name: 'Palembang' },
                  { '@type': 'AdministrativeArea', name: 'Sumatera Selatan' },
                  { '@type': 'Place', name: 'Sumatera' },
                  { '@type': 'Country', name: 'Indonesia' },
                ],
              })
            ).replace(/</g, '\\u003c')
          : ''
      ),
    },
  ],
})
</script>

<template>
  <div v-if="pending" class="flex min-h-[60vh] items-center justify-center text-[var(--muted)]">
    Memuat data...
  </div>
  <div v-else-if="service">
    <!-- Banner -->
    <div class="pub-page-banner">
      <div class="container">
        <span v-if="service.titleEn" class="pub-eyebrow">{{ service.titleEn }}</span>
        <h1 class="pub-h1">{{ service.title }}</h1>
      </div>
    </div>
    <!-- Main Content (Rich Text) -->
    <div class="pub-section bg-[var(--paper)]">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <UiBreadcrumbs
          :items="[
            { label: 'Layanan', to: '/layanan' },
            { label: service.title }
          ]"
          class="mb-10"
        />

        <!-- Quill/WYSIWYG Output Container -->
        <article
          ref="serviceRef"
          class="prose prose-lg mx-auto max-w-none text-[var(--ink)] dark:prose-invert"
          v-html="serviceHtml"
        ></article>

        <!-- CTA -->
        <div class="pub-box mt-16 p-8 lg:p-10">
          <h2 class="pub-serif mb-4 text-[24px] leading-[1.25] text-[var(--ink)]">Butuh Layanan {{ service.title }}?</h2>
          <p class="mb-8 max-w-[68ch] text-[17px] leading-[1.6] text-[var(--muted)]">
            Hubungi tim penilai publik kami di Palembang untuk konsultasi ruang lingkup, dokumen persyaratan, dan penawaran tertulis, atau pelajari <NuxtLink to="/faq" class="pub-link font-bold underline underline-offset-[3px]">Tanya Jawab (FAQ)</NuxtLink> seputar prosedur penilaian.
          </p>
          <div class="flex flex-wrap items-center gap-4">
            <NuxtLink to="/contact-us" class="pub-btn">
              Hubungi Kami Sekarang
            </NuxtLink>
            <NuxtLink to="/faq" class="pub-btn-ghost">
              Baca Tanya Jawab (FAQ)
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Artikel sekategori dengan layanan (slug kategori = slug layanan), fallback ke artikel terbaru -->
    <BlogRecentArticles
      class="border-t border-[var(--rule)] bg-[var(--surface)] py-16 sm:py-20"
      :category="service.slug"
      :category-title="`Artikel seputar ${service.title}`"
      description="Bacaan lanjutan untuk membantu Anda memahami layanan ini lebih dalam."
    />
  </div>
</template>
