<script setup lang="ts">
const servicesTitle = "Layanan Penilaian Properti, Bisnis & Konsultasi | KJPP HJA'R Palembang"
const servicesDescription =
  "Layanan profesional KJPP HJA'R di Palembang dan Sumatera Selatan: penilaian properti, penilaian bisnis, studi kelayakan, dan pengawasan proyek independen."

useSeoMeta({
  title: servicesTitle,
  description: servicesDescription,
  ogTitle: servicesTitle,
  ogDescription: servicesDescription,
  twitterTitle: servicesTitle,
  twitterDescription: servicesDescription,
})

const { data: services, pending } = await useFetch<any[]>('/api/services')
const { data: categoriesData } = await useFetch<{ items: Array<{ slug: string; articleCount?: number }> }>('/api/categories')

const activeCategorySlugs = computed(
  () => new Set((categoriesData.value?.items || []).map((cat) => cat.slug))
)

function formatServiceCode(index: number) {
  return String(index + 1).padStart(2, '0')
}
</script>

<template>
  <div>
    <!-- Banner -->
    <div class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
      <div class="container">
        <div class="items-center py-10 md:flex md:h-[400px] md:py-0">
          <div class="heading mb-0 text-center md:text-left">
            <h1 class="!text-white text-2xl font-extrabold sm:text-3xl lg:text-[40px] lg:!leading-[50px]">Layanan Kami</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="bg-white py-16 dark:bg-black sm:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <UiBreadcrumbs :items="[{ label: 'Layanan' }]" class="mb-6" />

        <div class="mb-12 text-center">
          <p class="mx-auto max-w-3xl font-mulish text-xl font-extrabold text-black dark:text-white sm:text-2xl">
            Berbagai solusi penilaian dan konsultasi properti terbaik yang disesuaikan dengan kebutuhan Anda.
          </p>
        </div>

        <div v-if="pending" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 6" :key="i" class="h-64 animate-pulse rounded-2xl bg-gray/10" />
        </div>

        <div v-else-if="!services?.length" class="py-12 text-center text-gray">
          Belum ada layanan yang ditambahkan.
        </div>

        <div v-else class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="(service, index) in services"
            :key="service._id"
            :to="`/layanan/${service.slug}`"
            class="group flex flex-col justify-between rounded-2xl border border-gray/15 bg-white p-7 transition-all duration-200 hover:border-primary/60 hover:shadow-lg dark:border-white/10 dark:bg-gray-dark"
          >
            <div>
              <div class="mb-5 flex items-center justify-between gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-black">
                  <ClientOnly v-if="service.icon">
                    <Icon :name="getNuxtIconName(service.icon)" class="h-6 w-6" aria-hidden="true" />
                  </ClientOnly>
                  <Icon v-else name="ph:buildings-bold" class="h-6 w-6" aria-hidden="true" />
                </div>
                <span class="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-bold tabular-nums text-gray-600 dark:bg-white/10 dark:text-gray-300">
                  {{ formatServiceCode(index) }}
                </span>
              </div>

              <h2 class="text-xl font-extrabold text-black transition-colors group-hover:text-primary dark:text-white">
                {{ service.title }}
              </h2>
              <p v-if="service.titleEn" class="mt-1 text-xs font-bold uppercase tracking-wider text-gray">
                {{ service.titleEn }}
              </p>
              <p class="mt-3 text-sm leading-relaxed text-gray-700 line-clamp-3 dark:text-gray-300">
                {{ service.description }}
              </p>
            </div>

            <div class="mt-6 flex items-center justify-between gap-3 border-t border-gray/10 pt-4 text-xs font-bold">
              <span class="inline-flex items-center gap-1.5 text-sky-700 group-hover:text-primary dark:text-primary">
                <span>Ruang lingkup &amp; detail</span>
                <Icon name="ph:arrow-right-bold" class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </span>
              <span
                v-if="activeCategorySlugs.has(service.slug)"
                class="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300"
              >
                Artikel terkait
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- Internal Links to FAQ, Contact & Regional Pages -->
        <div class="mt-16 rounded-2xl border border-gray/15 bg-stone-50 p-8 text-center dark:border-white/10 dark:bg-gray-dark">
          <h2 class="text-2xl font-extrabold text-black dark:text-white">
            Konsultasi Kebutuhan Penilaian di Palembang, Sumatera Selatan &amp; Sumatera
          </h2>
          <p class="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            Pelajari prosedur, estimasi waktu, dan dokumen yang perlu disiapkan melalui halaman <NuxtLink to="/faq" class="font-bold text-primary hover:underline">Tanya Jawab (FAQ)</NuxtLink>, atau tinjau cakupan wilayah kami di <NuxtLink to="/kjpp-palembang" class="font-bold text-primary hover:underline">Palembang</NuxtLink>, <NuxtLink to="/kjpp-sumatera-selatan" class="font-bold text-primary hover:underline">Sumatera Selatan</NuxtLink>, dan <NuxtLink to="/kjpp-sumatera" class="font-bold text-primary hover:underline">Pulau Sumatera</NuxtLink>.
          </p>
          <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
            <NuxtLink to="/contact-us" class="btn !rounded-xl">
              Hubungi Kami untuk Penawaran
            </NuxtLink>
            <NuxtLink to="/faq" class="inline-flex items-center gap-2 rounded-xl border border-gray/25 bg-white px-6 py-4 text-sm font-extrabold uppercase text-black transition hover:border-primary hover:text-primary dark:border-white/15 dark:bg-black dark:text-white">
              Baca FAQ Penilaian
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
