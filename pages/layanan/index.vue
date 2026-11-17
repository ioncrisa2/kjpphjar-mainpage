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
</script>

<template>
  <div>
    <!-- Banner -->
    <div class="pub-page-banner">
      <div class="container">
        <span class="pub-eyebrow">Lingkup Jasa Penilaian &amp; Konsultasi</span>
        <h1 class="pub-h1">Layanan Kami</h1>
      </div>
    </div>

    <!-- Content Section -->
    <div class="pub-section bg-[var(--paper)]">
      <div class="container">
        <UiBreadcrumbs :items="[{ label: 'Layanan' }]" class="mb-10" />

        <p class="mb-12 max-w-[68ch] text-[20px] leading-[1.6] text-[var(--ink)]">
          Berbagai solusi penilaian dan konsultasi properti terbaik yang disesuaikan dengan kebutuhan Anda.
        </p>

        <div v-if="pending" class="border-t border-[var(--rule)]">
          <div v-for="i in 4" :key="i" class="h-32 animate-pulse border-b border-[var(--rule)] bg-[var(--surface)]" />
        </div>

        <div v-else-if="!services?.length" class="py-12 text-[var(--muted)]">
          Belum ada layanan yang ditambahkan.
        </div>

        <ul v-else class="border-t border-[var(--rule)]">
          <li
            v-for="service in services"
            :key="service._id"
            class="grid gap-4 border-b border-[var(--rule)] py-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)_auto] lg:gap-10"
          >
            <div>
              <h2 class="pub-serif text-[24px] leading-[1.25] text-[var(--ink)]">
                <NuxtLink :to="`/layanan/${service.slug}`" class="transition-colors duration-150 hover:text-[var(--brand-navy)]">{{ service.title }}</NuxtLink>
              </h2>
              <p v-if="service.titleEn" class="mt-1 text-[14px] text-[var(--muted)]">
                {{ service.titleEn }}
              </p>
            </div>
            <p class="max-w-[68ch] text-[17px] leading-[1.6] text-[var(--ink)]">
              {{ service.description }}
            </p>
            <div class="lg:text-right">
              <NuxtLink :to="`/layanan/${service.slug}`" class="pub-link whitespace-nowrap text-[16px] font-bold">
                Pelajari ruang lingkup →
              </NuxtLink>
            </div>
          </li>
        </ul>

        <!-- Internal Links to FAQ, Contact & Regional Pages -->
        <div class="pub-box mt-16 p-8 lg:p-12">
          <h2 class="pub-serif max-w-3xl text-[24px] leading-[1.25] text-[var(--ink)]">
            Konsultasi Kebutuhan Penilaian di Palembang, Sumatera Selatan &amp; Sumatera
          </h2>
          <p class="mt-3 max-w-[68ch] text-[17px] leading-[1.6] text-[var(--muted)]">
            Pelajari prosedur, estimasi waktu, dan dokumen yang perlu disiapkan melalui halaman <NuxtLink to="/faq" class="pub-link font-bold underline underline-offset-[3px]">Tanya Jawab (FAQ)</NuxtLink>, atau tinjau cakupan wilayah kami di <NuxtLink to="/kjpp-palembang" class="pub-link font-bold underline underline-offset-[3px]">Palembang</NuxtLink>, <NuxtLink to="/kjpp-sumatera-selatan" class="pub-link font-bold underline underline-offset-[3px]">Sumatera Selatan</NuxtLink>, dan <NuxtLink to="/kjpp-sumatera" class="pub-link font-bold underline underline-offset-[3px]">Pulau Sumatera</NuxtLink>.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-4">
            <NuxtLink to="/contact-us" class="pub-btn">
              Hubungi Kami untuk Penawaran
            </NuxtLink>
            <NuxtLink to="/faq" class="pub-btn-ghost">
              Baca FAQ Penilaian
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
