<script setup lang="ts">
const config = useRuntimeConfig()
const baseUrl = String(config.public.baseUrl || 'https://kjpp-hjar.co.id').replace(/\/$/, '')

useHead({
  title: "KJPP HJA'R | Jasa Penilaian Publik & Layanan Konsultan Independen",
  meta: [
    {
      name: 'description',
      content:
        'KJPP Henricus Judi Adrianto dan Rekan menyediakan layanan konsultan dan penilaian publik independen. Terpercaya menangani berbagai proyek di seluruh Indonesia sejak 2013.',
    },
    { property: 'og:title', content: "KJPP HJA'R | Jasa Penilaian Publik & Layanan Konsultan Independen" },
    { property: 'og:description', content: 'KJPP Henricus Judi Adrianto dan Rekan menyediakan layanan konsultan dan penilaian publik independen terpercaya.' },
  ],
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: '/assets/images/consulting/banner-bg.jpg',
      fetchpriority: 'high',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "KJPP Henricus Judi Adrianto dan Rekan",
        "image": `${baseUrl}/assets/images/h-logo.png`,
        "@id": baseUrl,
        "url": baseUrl,
        "telephone": "+628117101066",
        "description": "Perusahaan jasa penilai publik dan konsultan independen berpengalaman.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Gedung Kantor Pusat",
          "addressLocality": "Jakarta",
          "addressRegion": "DKI Jakarta",
          "addressCountry": "ID"
        }
      })
    }
  ]
})

const { data: servicesData } = await useFetch<any[]>('/api/services')
const { data: galleryData } = await useFetch<{ items: any[] }>('/api/gallery', { query: { featured: 'true', limit: 6 } })
const { data: clientsData } = await useFetch<{ items: any[] }>('/api/clients')
const { data: branchesData } = await useFetch<any[]>('/api/branches')
const { data: categoriesData } = await useFetch<{ items: Array<{ slug: string }> }>('/api/categories')

const services = computed(() => servicesData.value || [])
const featuredPhotos = computed(() => galleryData.value?.items || [])
const clients = computed(() => clientsData.value?.items || [])
const featuredClients = computed(() => clients.value.slice(0, 6))
const branches = computed(() => branchesData.value || [])
const branchCitiesSummary = computed(() => {
  const cities = branches.value.map((b) => b.city).filter(Boolean)
  return cities.length ? cities.slice(0, 3).join(' · ') : 'Kantor pusat & cabang'
})
const activeCategorySlugs = computed(
  () => new Set((categoriesData.value?.items || []).map((cat) => cat.slug))
)

const firmFacts = computed(() => [
  {
    value: '2013',
    label: 'Tahun Berdiri',
    detail: 'Akta Notaris 28 November 2013',
  },
  {
    value: branches.value.length > 0 ? String(branches.value.length) : 'Nasional',
    label: 'Kantor Layanan',
    detail: branchCitiesSummary.value,
  },
  {
    value: services.value.length > 0 ? String(services.value.length) : 'Multi-sektor',
    label: 'Layanan Penilaian',
    detail: 'Properti, bisnis & studi kelayakan',
  },
  {
    value: clients.value.length > 0 ? `${clients.value.length}+` : 'KEPI & SPI',
    label: clients.value.length > 0 ? 'Klien & Rekanan' : 'Standar Profesi',
    detail: clients.value.length > 0 ? 'Perbankan, BUMN & korporasi swasta' : 'Sesuai standar penilai Indonesia',
  },
])

const chooseUs = [
  { title: 'Tim Solid', desc: 'Didukung tim manajemen dan penilai bersertifikat MAPPI yang berpengalaman.', image: '/assets/images/team.jpg' },
  { title: 'Skalabilitas', desc: 'Siap melayani kebutuhan penilaian perusahaan berskala kecil, menengah, hingga korporasi besar.', image: '/assets/images/scale.jpg' },
  { title: 'Efektif & Efisien', desc: 'Menggunakan jadwal kerja terstruktur, terukur, dan pelaporan tepat waktu.', image: '/assets/images/efektif&efisien.jpg' },
  { title: 'Kerahasiaan', desc: 'Menjamin kerahasiaan data dan dokumen klien sesuai kode etik dan pakta integritas.', image: '/assets/images/rahasia.jpg' },
]

function formatServiceCode(index: number) {
  return String(index + 1).padStart(2, '0')
}
</script>

<template>
  <div class="overflow-x-hidden">
    <!-- Hero -->
    <section class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-center bg-no-repeat pt-[82px] text-white lg:pt-[106px]">
      <div class="container">
        <div class="flex flex-col gap-7 pt-6 md:flex-row md:gap-0">
          <div class="space-y-5 pt-24 pb-10 text-center md:text-left">
            <p class="text-xl font-bold text-primary">Selamat Datang</p>
            <h1 class="text-3xl font-black uppercase sm:leading-tight lg:text-4xl">
              KJPP Henricus Judi Adrianto dan Rekan
            </h1>
            <p class="text-xl font-semibold max-w-xl">
              KJPP HJA'R merupakan perusahaan jasa penilai publik dan konsultan independen yang
              menawarkan berbagai layanan profesional.
            </p>
            <NuxtLink to="/layanan" class="btn rounded-md bg-white !text-black hover:!bg-stone-100 inline-flex items-center gap-2">
              <Icon name="ph:squares-four-bold" class="h-5 w-5" aria-hidden="true" />
              <span class="text-lg">Layanan Kami</span>
            </NuxtLink>
          </div>
          <div class="mx-auto w-full max-w-[386px] hidden lg:block">
            <img
              src="/assets/images/pak-henricus.png"
              alt="Pimpinan KJPP HJA'R"
              width="386"
              height="450"
              fetchpriority="high"
              decoding="async"
              class="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Trusted Clients Strip (real data from /api/clients) -->
    <section v-if="featuredClients.length > 0" class="border-b border-gray/10 bg-stone-50/80 py-8 dark:border-white/10 dark:bg-gray-dark/40">
      <div class="container">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-xs font-extrabold uppercase tracking-wider text-gray">
            Dipercaya Oleh {{ clients.length }}+ Rekan &amp; Klien Institusi
          </p>
          <NuxtLink to="/rekan-klien" class="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-primary dark:text-primary">
            <span>Lihat seluruh rekan &amp; klien</span>
            <Icon name="ph:arrow-right-bold" class="h-3.5 w-3.5" aria-hidden="true" />
          </NuxtLink>
        </div>
        <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div
            v-for="client in featuredClients"
            :key="client._id"
            class="flex h-16 items-center justify-center rounded-xl border border-gray/10 bg-white px-4 py-2.5 dark:border-white/10 dark:bg-white/95"
            :title="client.name"
          >
            <img
              :src="client.logoUrl"
              :alt="client.name"
              width="120"
              height="48"
              loading="lazy"
              decoding="async"
              class="max-h-10 w-auto max-w-full object-contain grayscale opacity-80 transition hover:grayscale-0 hover:opacity-100"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="bg-gradient-to-b from-white/[55%] to-transparent py-14 dark:bg-none lg:py-20" id="service">
      <div class="container">
        <div class="heading mb-5 text-center">
          <p class="subtitle">Lingkup Jasa Penilaian &amp; Konsultasi</p>
          <h2 class="text-2xl font-extrabold text-black dark:text-white sm:text-3xl lg:text-[40px] lg:!leading-[50px]">Layanan Kami</h2>
        </div>

        <!-- Loading state -->
        <div v-if="services.length === 0" class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 6" :key="i" class="h-56 animate-pulse rounded-2xl bg-gray/10" />
        </div>

        <!-- Services Preview Cards from DB -->
        <div v-else class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="(service, index) in services"
            :key="service._id"
            :to="`/layanan/${service.slug}`"
            class="group flex flex-col justify-between rounded-2xl border border-gray/15 bg-white p-6 text-left transition-all duration-200 hover:border-primary/60 hover:shadow-lg dark:border-white/10 dark:bg-gray-dark"
          >
            <div>
              <div class="mb-5 flex items-center justify-between gap-3">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-black">
                  <ClientOnly>
                    <Icon :name="getNuxtIconName(service.icon)" class="h-6 w-6" aria-hidden="true" />
                  </ClientOnly>
                </div>
                <span class="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold tabular-nums text-gray-600 dark:bg-white/10 dark:text-gray-300">
                  {{ formatServiceCode(index) }}
                </span>
              </div>

              <h3 class="text-xl font-extrabold text-black transition-colors group-hover:text-primary dark:text-white">
                {{ service.title }}
              </h3>
              <p v-if="service.titleEn" class="mt-1 text-xs font-bold uppercase tracking-wider text-gray">
                {{ service.titleEn }}
              </p>
              <p class="mt-3 text-sm leading-relaxed text-gray-700 line-clamp-3 dark:text-gray-300">
                {{ service.description }}
              </p>
            </div>

            <div class="mt-6 flex items-center justify-between gap-3 border-t border-gray/10 pt-4 text-xs font-bold">
              <span class="inline-flex items-center gap-1.5 text-sky-700 group-hover:text-primary dark:text-primary">
                <span>Pelajari ruang lingkup</span>
                <Icon name="ph:arrow-right-bold" class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </span>
              <span
                v-if="activeCategorySlugs.has(service.slug)"
                class="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300"
              >
                Artikel tersedia
              </span>
            </div>
          </NuxtLink>
        </div>

        <div v-if="services.length === 0" class="mt-8 text-center">
          <NuxtLink to="/admin/services" class="text-sm text-primary hover:underline">
            + Tambahkan layanan dari admin panel
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="relative bg-black py-12 dark:bg-white/5 lg:py-24">
      <div class="absolute bottom-0 right-0 opacity-60">
        <img src="/assets/images/consulting/bg-icon.svg" alt="" width="200" height="200" loading="lazy" decoding="async" />
      </div>
      <div class="container relative z-[1]">
        <div class="heading text-center text-white">
          <h2 class="mb-2 !font-black uppercase !text-white text-2xl sm:text-3xl lg:text-[40px] lg:!leading-[50px]">
            Kenapa <span class="text-primary">Memilih kami</span>?
          </h2>
        </div>
        <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <article
            v-for="(item, index) in chooseUs"
            :key="index"
            class="group overflow-hidden rounded-2xl border border-white/10 bg-gray-dark transition hover:border-primary/40 dark:bg-black"
          >
            <div class="aspect-[16/10] overflow-hidden">
              <img
                :src="item.image"
                class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                :alt="item.title"
                width="600"
                height="375"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between gap-3">
                <h3 class="text-xl font-extrabold text-white transition-colors group-hover:text-primary">{{ item.title }}</h3>
                <span class="text-xs font-bold tabular-nums text-primary/80">0{{ index + 1 }}</span>
              </div>
              <p class="mt-2.5 text-sm leading-relaxed text-gray-300">{{ item.desc }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Firm Credibility & Real Facts -->
    <section class="bg-black bg-[url(/assets/images/consulting/business-img.png)] bg-cover bg-center bg-no-repeat py-12 lg:py-24">
      <div class="container">
        <div class="grid grid-cols-1 gap-12 text-center lg:grid-cols-2 lg:items-center lg:gap-16 lg:text-left">
          <div>
            <h2 class="text-3xl font-black uppercase text-white sm:text-[40px] sm:leading-[50px]">
              Pengalaman &amp; <span class="text-primary">Kredibilitas</span>
            </h2>
            <p class="mt-[18px] text-lg leading-relaxed text-gray-300">
              Berdiri sejak 28 November 2013 dan beroperasi sesuai Standar Penilaian Indonesia (SPI) serta Kode Etik Penilai Indonesia (KEPI), kami menjadi mitra independen bagi sektor perbankan, BUMN, dan korporasi di seluruh Indonesia.
            </p>
            <div class="mt-6 flex flex-wrap justify-center gap-4 lg:justify-start">
              <NuxtLink to="/contact-us" class="btn rounded-md !bg-primary !text-black font-extrabold hover:!bg-white hover:!text-black">
                Contact Us
              </NuxtLink>
              <NuxtLink to="/about-us" class="inline-flex items-center gap-2 rounded-md border border-white/25 px-6 py-4 text-sm font-extrabold uppercase text-white transition hover:border-primary hover:text-primary">
                <span>Profil &amp; Tim Kami</span>
                <Icon name="ph:arrow-right-bold" class="h-4 w-4" aria-hidden="true" />
              </NuxtLink>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="fact in firmFacts"
              :key="fact.label"
              class="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xs transition hover:border-primary/40"
            >
              <span class="block text-2xl font-black tabular-nums text-white sm:text-3xl">
                {{ fact.value }}
              </span>
              <p class="mt-2 text-sm font-bold text-primary">{{ fact.label }}</p>
              <p class="mt-1 text-xs text-gray-300">{{ fact.detail }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Articles (only if at least 3 articles are published) -->
    <BlogRecentArticles
      class="py-14 lg:py-20"
      eyebrow="Wawasan & Artikel"
      description="Panduan dan wawasan seputar penilaian aset, bisnis, dan proyek dari tim penilai kami."
      :min-items="3"
      centered
    />

    <!-- Featured Gallery Preview (only if there are featured photos) -->
    <section v-if="featuredPhotos.length > 0" class="py-14 lg:py-20">
      <div class="container">
        <div class="heading text-center">
          <p class="subtitle">Galeri Kami</p>
          <h2 class="text-2xl font-extrabold text-black dark:text-white sm:text-3xl lg:text-[40px] lg:!leading-[50px]">Momen & Kegiatan</h2>
        </div>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
          <div
            v-for="photo in featuredPhotos"
            :key="photo._id"
            class="overflow-hidden rounded-2xl"
          >
            <img
              :src="photo.thumbnailUrl"
              :alt="photo.title || 'Galeri KJPP HJA\'R'"
              width="400"
              height="250"
              class="h-48 w-full object-cover transition duration-500 hover:scale-110"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <div class="mt-10 text-center">
          <NuxtLink to="/gallery" class="btn">Lihat Semua Galeri</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
