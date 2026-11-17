<script setup lang="ts">
import { COMPANY_DATA, sanitizeJsonLd } from '~/shared/company-data'

const route = useRoute()
const id = route.params.id as string
const { data: leader, error } = await useFetch<any>(`/api/leaders/${id}`)

if (error.value || !leader.value) {
  throw createError({ statusCode: 404, statusMessage: 'Pimpinan tidak ditemukan', fatal: true })
}

if (leader.value.slug && id !== leader.value.slug) {
  await navigateTo(`/pimpinan/${leader.value.slug}`, { redirectCode: 301 })
}

const leaderObjectId = computed(() => String(leader.value?._id || id))
const leaderSlug = computed(() => String(leader.value?.slug || id))

const { data: articlesData } = await useFetch('/api/blog', { query: { author: leaderObjectId, limit: 3 } })
const articles = computed(() => articlesData.value?.items || [])
const totalArticles = computed(() => articlesData.value?.total || 0)

// Hanya kredensial yang diisi admin yang ditampilkan
const credentials = computed(() => [
  { label: 'Nomor MAPPI', value: leader.value?.mappiNumber, icon: 'ph:identification-card-bold' },
  { label: 'No. Ijin Penilai Publik', value: leader.value?.publicValuerLicense, icon: 'ph:seal-check-bold' },
].filter((item) => item.value))

const config = useRuntimeConfig()
const baseUrl = String(config.public.baseUrl || 'https://kjpp-hjar.co.id').replace('://www.', '://').replace(/\/$/, '')
const canonicalUrl = computed(() => `${baseUrl}/pimpinan/${leaderSlug.value}`)
const defaultOgImage = `${baseUrl}/assets/images/og-default.jpg`
const absolutePhoto = computed(() => {
  const photo = leader.value?.photoUrl || ''
  if (!photo) return defaultOgImage
  return /^https?:\/\//i.test(photo) ? photo : `${baseUrl}${photo.startsWith('/') ? '' : '/'}${photo}`
})
const seoTitle = computed(() => `${leader.value?.name} — ${leader.value?.position}`)
const seoDescription = computed(() => {
  if (leader.value?.bio) return leader.value.bio
  const creds = credentials.value.map((c) => `${c.label} ${c.value}`).join(', ')
  return `Profil ${leader.value?.name}, ${leader.value?.position} di KJPP Henricus Judi Adrianto & Rekan${creds ? ` (${creds})` : ''}.`
})

useSeoMeta({
  title: () => `${seoTitle.value} | KJPP HJA'R`,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogImage: () => defaultOgImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogUrl: () => canonicalUrl.value,
  ogType: 'profile',
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => defaultOgImage,
})

useHead({
  link: [{ key: 'canonical', rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => {
        if (!leader.value) return ''
        const identifiers = credentials.value.map((item) => ({
          '@type': 'PropertyValue',
          name: item.label,
          value: item.value,
        }))
        return JSON.stringify(
          sanitizeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: leader.value.name,
            jobTitle: leader.value.position,
            description: seoDescription.value,
            image: absolutePhoto.value || undefined,
            url: canonicalUrl.value,
            identifier: identifiers.length ? identifiers : undefined,
            worksFor: {
              '@type': 'Organization',
              name: COMPANY_DATA.name,
              url: baseUrl,
            },
          })
        ).replace(/</g, '\\u003c')
      }),
    },
  ],
})
</script>

<template>
  <div v-if="leader">
    <!-- Banner -->
    <div class="pub-page-banner">
      <div class="container">
        <span class="pub-eyebrow">Tim Pimpinan</span>
        <h1 class="pub-h1">{{ leader.name }}</h1>
      </div>
    </div>

    <!-- Profil -->
    <section class="pub-section bg-[var(--paper)]">
      <div class="container">
        <UiBreadcrumbs
          :items="[
            { label: 'Tentang Kami', to: '/about-us' },
            { label: leader.name }
          ]"
          class="mb-10"
        />

        <div class="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
          <figure>
            <img
              :src="leader.photoUrl"
              :alt="`Foto profil ${leader.name}, ${leader.position} KJPP Henricus Judi Adrianto & Rekan`"
              width="600"
              height="750"
              class="aspect-[4/5] w-full rounded-[2px] object-cover"
              decoding="async"
            />
          </figure>

          <div class="flex flex-col">
            <p class="text-[14px] font-bold text-[var(--brand-navy)]">{{ leader.position }}</p>
            <h2 class="pub-serif mt-2 text-[32px] leading-[1.2] text-[var(--ink)] lg:text-[40px]">{{ leader.name }}</h2>
            <p class="mt-1 text-[16px] text-[var(--muted)]">KJPP Henricus Judi Adrianto dan Rekan</p>

            <dl v-if="credentials.length" class="mt-8 border-t border-[var(--rule)] text-[16px]">
              <div
                v-for="item in credentials"
                :key="item.label"
                class="flex flex-col gap-1 border-b border-[var(--rule)] py-4 sm:flex-row sm:justify-between sm:gap-6"
              >
                <dt class="text-[var(--muted)]">{{ item.label }}</dt>
                <dd class="break-words font-bold tabular-nums text-[var(--ink)] sm:text-right">{{ item.value }}</dd>
              </div>
            </dl>

            <div v-if="leader.bio" class="mt-8">
              <h3 class="text-[18px] font-bold text-[var(--ink)]">Profil Singkat</h3>
              <p class="mt-3 max-w-[68ch] whitespace-pre-line text-[17px] leading-[1.6] text-[var(--ink)]">{{ leader.bio }}</p>
            </div>

            <div class="mt-10 flex flex-wrap items-center gap-4">
              <NuxtLink to="/contact-us" class="pub-btn">
                Hubungi Kami
              </NuxtLink>
              <NuxtLink to="/about-us" class="pub-link text-[16px] font-bold">
                ← Kembali ke Tentang Kami
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Artikel yang ditulis pimpinan ini -->
    <section v-if="articles.length" class="pub-section border-t border-[var(--rule)] bg-[var(--paper)]" aria-labelledby="leader-articles-heading">
      <div class="container">
        <div class="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 id="leader-articles-heading" class="pub-h2">Artikel oleh {{ leader.name }}</h2>
            <p class="mt-2 text-[16px] text-[var(--muted)]">Wawasan dan tulisan dari {{ leader.name }}.</p>
          </div>
          <NuxtLink
            v-if="totalArticles > articles.length"
            :to="{ path: '/blog', query: { author: leaderObjectId } }"
            class="pub-link hidden shrink-0 text-[14px] font-bold tabular-nums sm:inline"
          >
            Lihat semua ({{ totalArticles }}) →
          </NuxtLink>
        </div>
        <div class="grid gap-8 md:grid-cols-3">
          <BlogArticleCard v-for="article in articles" :key="article._id" :article="article" />
        </div>
        <NuxtLink
          v-if="totalArticles > articles.length"
          :to="{ path: '/blog', query: { author: leaderObjectId } }"
          class="pub-link mt-6 inline-block text-[14px] font-bold tabular-nums sm:hidden"
        >
          Lihat semua artikel ({{ totalArticles }}) →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
