<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
const { data: leader, error } = await useFetch<any>(`/api/leaders/${id}`)

if (error.value || !leader.value) {
  throw createError({ statusCode: 404, statusMessage: 'Pimpinan tidak ditemukan', fatal: true })
}

const { data: articlesData } = await useFetch('/api/blog', { query: { author: id, limit: 3 } })
const articles = computed(() => articlesData.value?.items || [])
const totalArticles = computed(() => articlesData.value?.total || 0)

// Hanya kredensial yang diisi admin yang ditampilkan
const credentials = computed(() => [
  { label: 'Nomor MAPPI', value: leader.value?.mappiNumber, icon: 'ph:identification-card-bold' },
  { label: 'No. Ijin Penilai Publik', value: leader.value?.publicValuerLicense, icon: 'ph:seal-check-bold' },
].filter((item) => item.value))

const config = useRuntimeConfig()
const baseUrl = String(config.public.baseUrl || 'https://kjpp-hjar.co.id').replace(/\/$/, '')
const canonicalUrl = computed(() => `${baseUrl}/pimpinan/${id}`)
const absolutePhoto = computed(() => {
  const photo = leader.value?.photoUrl || ''
  if (!photo) return ''
  return /^https?:\/\//i.test(photo) ? photo : `${baseUrl}${photo.startsWith('/') ? '' : '/'}${photo}`
})
const seoTitle = computed(() => `${leader.value?.name} — ${leader.value?.position}`)
const seoDescription = computed(() =>
  leader.value?.bio || `${leader.value?.name}, ${leader.value?.position} di KJPP Henricus Judi Adrianto dan Rekan.`
)

useSeoMeta({
  title: () => `${seoTitle.value} | KJPP HJA'R`,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogImage: () => absolutePhoto.value,
  ogUrl: () => canonicalUrl.value,
  ogType: 'profile',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
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
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: leader.value.name,
          jobTitle: leader.value.position,
          description: leader.value.bio || undefined,
          image: absolutePhoto.value || undefined,
          url: canonicalUrl.value,
          identifier: identifiers.length ? identifiers : undefined,
          worksFor: {
            '@type': 'Organization',
            name: 'KJPP Henricus Judi Adrianto dan Rekan',
            url: baseUrl,
          },
        }).replace(/</g, '\\u003c')
      }),
    },
  ],
})
</script>

<template>
  <div v-if="leader">
    <!-- Banner -->
    <div class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
      <div class="container">
        <div class="items-center py-10 md:flex md:h-[300px] md:py-0">
          <div class="heading relative mb-0 text-center md:text-left">
            <span class="subtitle !text-white">Tim Pimpinan</span>
            <h1 class="!text-white text-2xl font-extrabold sm:text-3xl lg:text-[40px] lg:!leading-[50px]">{{ leader.name }}</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Profil -->
    <section class="bg-stone-100 py-14 dark:bg-gray-dark/30 lg:py-20">
      <div class="container">
        <UiBreadcrumbs
          :items="[
            { label: 'Tentang Kami', to: '/about-us' },
            { label: leader.name }
          ]"
          class="mb-8"
        />

        <div class="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-14">
          <div>
            <div class="overflow-hidden rounded-2xl shadow-lg">
              <img
                :src="leader.photoUrl"
                :alt="leader.name"
                width="600"
                height="750"
                class="aspect-[4/5] w-full object-cover"
                decoding="async"
              />
            </div>
          </div>

          <div class="flex flex-col">
            <p class="text-sm font-extrabold uppercase tracking-wider text-primary">{{ leader.position }}</p>
            <h2 class="mt-2 text-3xl font-extrabold text-black dark:text-white lg:text-4xl">{{ leader.name }}</h2>
            <p class="mt-1 text-sm font-semibold text-gray dark:text-slate-300">KJPP Henricus Judi Adrianto dan Rekan</p>

            <dl v-if="credentials.length" class="mt-8 grid gap-4 sm:grid-cols-2">
              <div
                v-for="item in credentials"
                :key="item.label"
                class="flex items-start gap-4 rounded-2xl border border-primary/20 bg-white p-5 dark:border-white/10 dark:bg-gray-dark"
              >
                <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon :name="item.icon" class="h-5 w-5" aria-hidden="true" />
                </span>
                <div class="min-w-0">
                  <dt class="text-xs font-bold uppercase tracking-wider text-gray dark:text-slate-400">{{ item.label }}</dt>
                  <dd class="mt-1 break-words text-base font-extrabold text-black dark:text-white">{{ item.value }}</dd>
                </div>
              </div>
            </dl>

            <div v-if="leader.bio" class="mt-8">
              <h3 class="text-lg font-extrabold text-black dark:text-white">Profil Singkat</h3>
              <p class="mt-3 whitespace-pre-line text-base leading-relaxed text-gray-700 dark:text-gray-300">{{ leader.bio }}</p>
            </div>

            <div class="mt-10 flex flex-wrap gap-3">
              <NuxtLink to="/about-us" class="inline-flex items-center gap-2 rounded-xl border border-gray/20 bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-gray-dark dark:text-white">
                <Icon name="ph:arrow-left-bold" aria-hidden="true" /> Kembali ke Tentang Kami
              </NuxtLink>
              <NuxtLink to="/contact-us" class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-black transition hover:bg-primary/90">
                Hubungi Kami <Icon name="ph:arrow-right-bold" aria-hidden="true" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Artikel yang ditulis pimpinan ini -->
    <section v-if="articles.length" class="py-14 lg:py-20" aria-labelledby="leader-articles-heading">
      <div class="container">
        <div class="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 id="leader-articles-heading" class="text-2xl font-extrabold text-black dark:text-white sm:text-3xl">Artikel oleh {{ leader.name }}</h2>
            <p class="mt-2 text-sm text-gray dark:text-slate-300">Wawasan dan tulisan dari {{ leader.name }}.</p>
          </div>
          <NuxtLink
            v-if="totalArticles > articles.length"
            :to="{ path: '/blog', query: { author: id } }"
            class="hidden shrink-0 text-sm font-bold text-primary hover:underline sm:inline"
          >
            Lihat semua ({{ totalArticles }})
          </NuxtLink>
        </div>
        <div class="grid gap-7 md:grid-cols-3">
          <BlogArticleCard v-for="article in articles" :key="article._id" :article="article" />
        </div>
        <NuxtLink
          v-if="totalArticles > articles.length"
          :to="{ path: '/blog', query: { author: id } }"
          class="mt-6 inline-block text-sm font-bold text-primary hover:underline sm:hidden"
        >
          Lihat semua artikel ({{ totalArticles }})
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
