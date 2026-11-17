<script setup lang="ts">
import { useAppStore } from '~/stores/app'

const store = useAppStore()
const config = useRuntimeConfig()
const baseUrl = String(config.public.baseUrl || 'https://kjpp-hjar.co.id').replace('://www.', '://').replace(/\/$/, '')
const { branches, buildProfessionalServiceJsonLd } = useCompanyProfile()

const homeTitle = "KJPP Palembang – Jasa Penilai Publik Sumatera Selatan | HJA'R"
const homeDescription =
  "KJPP HJA'R di Palembang melayani jasa penilai publik independen untuk properti, bisnis & studi kelayakan di Sumsel dan seluruh Sumatera sejak 2013."

useSeoMeta({
  title: homeTitle,
  description: homeDescription,
  ogTitle: homeTitle,
  ogDescription: homeDescription,
  twitterTitle: homeTitle,
  twitterDescription: homeDescription,
})

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600&display=swap',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(buildProfessionalServiceJsonLd(baseUrl)),
    },
  ],
})

const { data: servicesData } = await useFetch<any[]>('/api/services')
const { data: clientsData } = await useFetch<{ items: any[] }>('/api/clients')

const services = computed(() => servicesData.value || [])
const clients = computed(() => clientsData.value?.items || [])
const featuredClients = computed(() => clients.value.slice(0, 6))
const clientCountLabel = computed(() => (clients.value.length > 0 ? `${clients.value.length}+` : '19+'))
const officeCountLabel = computed(() => (branches.value.length > 0 ? String(branches.value.length) : '4'))

const chooseUs = [
  {
    title: 'Tim Solid',
    desc: 'Didukung tim manajemen dan penilai bersertifikat MAPPI yang berpengalaman.',
  },
  {
    title: 'Skalabilitas',
    desc: 'Siap melayani kebutuhan penilaian perusahaan berskala kecil, menengah, hingga korporasi besar.',
  },
  {
    title: 'Efektif & Efisien',
    desc: 'Menggunakan jadwal kerja terstruktur, terukur, dan pelaporan tepat waktu.',
  },
  {
    title: 'Kerahasiaan',
    desc: 'Menjamin kerahasiaan data dan dokumen klien sesuai kode etik dan pakta integritas.',
  },
]

const lahatPhoto = {
  src: '/uploads/gallery/original/1790935537696-2a45c98f-0b36-4b66-ac6f-a9bf9bc88180.webp',
  alt: 'Survey Tambang Gunung Jempol, Lahat',
}

const fieldPhotos = [
  {
    src: '/uploads/gallery/original/1794799892204-80f8a8f8-0739-42f0-8be4-6115a52d18a9.webp',
    alt: 'Penilaian Tug Boat',
  },
  {
    src: '/uploads/gallery/original/1794836031909-d5726ae7-3bb3-42cf-8b52-6d5838ebf5bc.webp',
    alt: 'Kegiatan Penilaian Alat Berat',
  },
  {
    src: '/uploads/gallery/original/1794836007528-1b46cdfa-19b9-4888-97da-8803b4ca0e0e.webp',
    alt: 'Kegiatan Penilaian di Galangan Kapal',
  },
]

const regionalLinks = [
  {
    to: '/kjpp-palembang',
    label: 'KJPP Palembang →',
    desc: 'Layanan langsung dari Kantor Pusat di Kota Palembang.',
  },
  {
    to: '/kjpp-sumatera-selatan',
    label: 'KJPP Sumatera Selatan →',
    desc: 'Jangkauan 17 kabupaten/kota di Provinsi Sumsel.',
  },
  {
    to: '/kjpp-sumatera',
    label: 'KJPP Sumatera →',
    desc: 'Layanan lintas provinsi di seluruh Pulau Sumatera.',
  },
]
</script>

<template>
  <div class="home-page overflow-x-hidden" :class="{ 'is-dark': store.theme === 'dark' }">
    <!-- 1. Hero -->
    <section class="hp-section border-b border-[var(--rule)] pt-[112px] pb-16 lg:pt-[136px] lg:pb-24">
      <div class="container">
        <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div class="text-left lg:col-span-8">
            <h1 class="hp-serif text-[32px] leading-[1.2] text-[var(--ink)] lg:text-[48px] lg:leading-[1.15]">
              KJPP di Palembang, Sumatera Selatan – Henricus Judi Adrianto &amp; Rekan
            </h1>

            <p class="mt-6 max-w-[68ch] text-[18px] font-normal leading-[1.6] text-[var(--ink)] lg:text-[20px]">
              KJPP HJA'R merupakan perusahaan jasa penilai publik dan konsultan independen yang
              menawarkan berbagai layanan profesional.
            </p>

            <p class="mt-4 max-w-[68ch] text-[16px] font-normal leading-[1.6] text-[var(--muted)]">
              Berkantor pusat di
              <NuxtLink to="/kjpp-palembang" class="hp-link underline underline-offset-4">Palembang</NuxtLink>
              sejak tahun 2013, KJPP Henricus Judi Adrianto &amp; Rekan melayani kebutuhan penilaian
              properti, penilaian bisnis, studi kelayakan, dan pengawasan proyek di seluruh kabupaten/kota
              <NuxtLink to="/kjpp-sumatera-selatan" class="hp-link underline underline-offset-4">Sumatera Selatan</NuxtLink>
              serta berbagai provinsi di pulau
              <NuxtLink to="/kjpp-sumatera" class="hp-link underline underline-offset-4">Sumatera</NuxtLink>
              dan Indonesia.
            </p>

            <p class="mt-6 border-t border-[var(--rule)] pt-4 text-[14px] font-normal leading-[1.6] tabular-nums text-[var(--muted)]">
              Izin Usaha KJPP No. 2.20.0166 · Anggota MAPPI · Berdiri 28 November 2013
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-6">
              <NuxtLink
                to="/contact-us"
                class="hp-btn-primary inline-flex items-center justify-center rounded-[2px] px-6 py-3 text-[16px] font-bold transition-colors duration-150"
              >
                Hubungi Kantor Palembang
              </NuxtLink>
              <NuxtLink
                to="/layanan"
                class="hp-link inline-flex items-center text-[16px] font-bold transition-colors duration-150"
              >
                Layanan kami →
              </NuxtLink>
            </div>
          </div>

          <figure class="mx-auto w-full max-w-[360px] lg:col-span-4 lg:mx-0 lg:ml-auto">
            <div class="overflow-hidden rounded-[2px] border border-[var(--rule)] bg-[var(--paper)]">
              <img
                src="/assets/images/pak-henricus.png"
                alt="Henricus Judi Adrianto, Pimpinan Rekan KJPP HJA'R di Palembang"
                width="386"
                height="450"
                fetchpriority="high"
                decoding="async"
                class="h-auto w-full rounded-[2px] object-cover"
              />
            </div>
            <figcaption class="mt-3 text-left text-[14px] font-normal leading-[1.5] tabular-nums text-[var(--muted)]">
              Henricus Judi Adrianto · Pimpinan Rekan · Izin Penilai Publik P-1.13.0380
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- 2. Strip klien -->
    <section v-if="featuredClients.length > 0" class="hp-section border-b border-[var(--rule)] py-10 lg:py-12">
      <div class="container">
        <div class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-baseline">
          <p class="text-[14px] font-normal leading-[1.6] tabular-nums text-[var(--muted)]">
            Dipercaya oleh {{ clientCountLabel }} rekan &amp; klien institusi
          </p>
          <NuxtLink
            to="/rekan-klien"
            class="hp-link text-[14px] font-bold transition-colors duration-150"
          >
            Lihat seluruh rekan &amp; klien →
          </NuxtLink>
        </div>

        <div class="mt-6 grid grid-cols-3 items-center gap-x-6 gap-y-6 lg:grid-cols-6 lg:gap-x-8">
          <div
            v-for="client in featuredClients"
            :key="client._id"
            class="flex h-8 items-center justify-start"
            :title="client.name"
          >
            <img
              :src="client.logoUrl"
              :alt="`Logo klien ${client.name} – mitra KJPP HJA'R`"
              width="120"
              height="32"
              loading="lazy"
              decoding="async"
              class="hp-client-logo h-8 w-auto max-w-[120px] rounded-[2px] object-contain grayscale opacity-70 transition duration-150 hover:grayscale-0 hover:opacity-100"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Layanan -->
    <section id="service" class="hp-section border-b border-[var(--rule)] py-16 lg:py-24">
      <div class="container">
        <div class="text-left">
          <h2 class="hp-serif text-[32px] leading-[1.2] text-[var(--ink)]">
            Layanan Kami
          </h2>
          <p class="mt-2 text-[16px] font-normal leading-[1.6] text-[var(--muted)]">
            Lingkup Jasa Penilaian &amp; Konsultasi
          </p>
        </div>

        <div v-if="services.length > 0" class="mt-10 border-t border-[var(--rule)]">
          <div
            v-for="service in services"
            :key="service._id"
            class="grid grid-cols-1 items-baseline gap-4 border-b border-[var(--rule)] py-6 lg:grid-cols-12 lg:gap-8 lg:py-8"
          >
            <div class="lg:col-span-3">
              <h3 class="hp-serif text-[24px] leading-[1.3] text-[var(--ink)]">
                {{ service.title }}
              </h3>
              <p v-if="service.titleEn" class="mt-1 text-[14px] font-normal leading-[1.5] text-[var(--muted)]">
                {{ service.titleEn }}
              </p>
            </div>

            <div class="lg:col-span-6">
              <p class="max-w-[68ch] text-[17px] font-normal leading-[1.6] text-[var(--ink)]">
                {{ service.description }}
              </p>
            </div>

            <div class="lg:col-span-3 lg:text-right">
              <NuxtLink
                :to="`/layanan/${service.slug}`"
                class="hp-link inline-flex items-center text-[16px] font-bold transition-colors duration-150"
              >
                Pelajari ruang lingkup →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Kenapa memilih kami? -->
    <section class="hp-section border-b border-[var(--rule)] py-16 lg:py-24">
      <div class="container">
        <h2 class="hp-serif text-left text-[32px] leading-[1.2] text-[var(--ink)]">
          Kenapa memilih kami?
        </h2>

        <div class="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <figure class="lg:col-span-5">
            <img
              :src="lahatPhoto.src"
              :alt="lahatPhoto.alt"
              width="640"
              height="480"
              loading="lazy"
              decoding="async"
              class="aspect-[4/3] w-full rounded-[2px] object-cover"
            />
            <figcaption class="mt-2 text-[14px] font-normal leading-[1.5] text-[var(--muted)]">
              {{ lahatPhoto.alt }}
            </figcaption>
          </figure>

          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-7">
            <div v-for="item in chooseUs" :key="item.title">
              <h3 class="text-[18px] font-bold leading-[1.4] text-[var(--ink)]">
                {{ item.title }}
              </h3>
              <p class="mt-2 max-w-[68ch] text-[17px] font-normal leading-[1.6] text-[var(--muted)]">
                {{ item.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Strip foto lapangan -->
    <section class="hp-section border-b border-[var(--rule)] py-16 lg:py-24">
      <div class="container">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          <figure v-for="photo in fieldPhotos" :key="photo.src">
            <img
              :src="photo.src"
              :alt="photo.alt"
              width="480"
              height="360"
              loading="lazy"
              decoding="async"
              class="aspect-[4/3] w-full rounded-[2px] object-cover"
            />
            <figcaption class="mt-2 text-[14px] font-normal leading-[1.5] text-[var(--muted)]">
              {{ photo.alt }}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- 6. Pengalaman & Kredibilitas (satu-satunya section gelap) -->
    <section class="hp-navy-section py-16 lg:py-24">
      <div class="container">
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div class="lg:col-span-7">
            <h2 class="hp-serif text-[32px] leading-[1.2] text-[#F7F5F0]">
              Pengalaman &amp; Kredibilitas
            </h2>
            <p class="mt-4 max-w-[68ch] text-[17px] font-normal leading-[1.6] text-[#EDEAE3]">
              Berdiri sejak 28 November 2013 dan beroperasi sesuai Standar Penilaian Indonesia (SPI)
              serta Kode Etik Penilai Indonesia (KEPI), kami menjadi mitra independen bagi sektor
              perbankan, BUMN, BUMD, pemerintah daerah, dan korporasi di seluruh Indonesia.
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-6">
              <NuxtLink
                to="/contact-us"
                class="hp-btn-paper inline-flex items-center justify-center rounded-[2px] bg-[#F7F5F0] px-6 py-3 text-[16px] font-bold text-[#141B2D] transition-colors duration-150 hover:bg-[#EDEAE3]"
              >
                Hubungi Kami
              </NuxtLink>
              <NuxtLink
                to="/about-us"
                class="hp-navy-link inline-flex items-center text-[16px] font-bold text-[#F7F5F0] underline decoration-[#F7F5F0]/50 underline-offset-4 transition-colors duration-150 hover:text-white"
              >
                Profil &amp; tim kami →
              </NuxtLink>
            </div>
          </div>

          <div class="lg:col-span-5">
            <ul class="border-t border-[#D9D3C7]/25">
              <li
                v-for="region in regionalLinks"
                :key="region.to"
                class="border-b border-[#D9D3C7]/25 py-4"
              >
                <NuxtLink
                  :to="region.to"
                  class="hp-navy-link block text-[16px] font-bold text-[#F7F5F0] transition-colors duration-150 hover:underline"
                >
                  {{ region.label }}
                </NuxtLink>
                <p class="mt-1 text-[14px] font-normal leading-[1.5] text-[#D9D3C7]">
                  {{ region.desc }}
                </p>
              </li>
            </ul>
          </div>
        </div>

        <!-- Statistik satu baris 3 angka dipisah garis vertikal -->
        <div class="mt-12 border-t border-[#D9D3C7]/25 pt-8">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0">
            <div class="md:pr-8">
              <span class="hp-serif block text-[40px] leading-[1.1] tabular-nums text-[#F7F5F0]">
                2013
              </span>
              <p class="mt-2 text-[14px] font-normal leading-[1.5] text-[#D9D3C7]">
                Tahun berdiri
              </p>
            </div>

            <div class="border-t border-[#D9D3C7]/25 pt-6 md:border-t-0 md:border-l md:px-8 md:pt-0">
              <span class="hp-serif block text-[40px] leading-[1.1] tabular-nums text-[#F7F5F0]">
                {{ officeCountLabel }}
              </span>
              <p class="mt-2 text-[14px] font-normal leading-[1.5] tabular-nums text-[#D9D3C7]">
                Kantor layanan (Palembang, Surabaya, Balikpapan, Tangerang Selatan)
              </p>
            </div>

            <div class="border-t border-[#D9D3C7]/25 pt-6 md:border-t-0 md:border-l md:pl-8 md:pt-0">
              <span class="hp-serif block text-[40px] leading-[1.1] tabular-nums text-[#F7F5F0]">
                {{ clientCountLabel }}
              </span>
              <p class="mt-2 text-[14px] font-normal leading-[1.5] tabular-nums text-[#D9D3C7]">
                Klien &amp; rekanan
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  --paper: #F7F5F0;
  --ink: #141B2D;
  --muted: #5B6470;
  --rule: #D9D3C7;
  --brand-red: #900F13;
  --brand-navy: #011987;
  --navy-deep: #0B1640;
  --btn-fg: #FFFFFF;
  background-color: var(--paper);
  color: var(--ink);
}

.home-page.is-dark,
:global(body.dark) .home-page,
:global(html.dark) .home-page {
  --paper: #0D1222;
  --ink: #EDEAE3;
  --muted: #A4ACBA;
  --rule: #273049;
  --brand-red: #F08A8E;
  --brand-navy: #8FA3FF;
  --navy-deep: #0B1640;
  --btn-fg: #141B2D;
}

.hp-section {
  background-color: var(--paper);
  color: var(--ink);
}

.hp-navy-section {
  background-color: var(--navy-deep);
  color: #F7F5F0;
}

.hp-serif {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 600;
  text-transform: none;
}

.hp-link {
  color: var(--brand-navy);
}

.hp-link:hover {
  color: var(--brand-red);
}

.hp-btn-primary {
  background-color: var(--brand-red);
  color: var(--btn-fg);
}

.hp-btn-primary:hover {
  opacity: 0.92;
}

.hp-link:focus-visible,
.hp-btn-primary:focus-visible {
  outline: 2px solid var(--brand-navy);
  outline-offset: 2px;
}

.hp-navy-link:focus-visible,
.hp-btn-paper:focus-visible {
  outline: 2px solid #F7F5F0;
  outline-offset: 2px;
}

.home-page.is-dark .hp-client-logo,
:global(body.dark) .home-page .hp-client-logo,
:global(html.dark) .home-page .hp-client-logo {
  filter: grayscale(100%) brightness(1.8);
}

.home-page.is-dark .hp-client-logo:hover,
:global(body.dark) .home-page .hp-client-logo:hover,
:global(html.dark) .home-page .hp-client-logo:hover {
  filter: none;
}

/* Pastikan teks navigasi header di atas hero --paper mode terang tetap terbaca jelas (WCAG AA) */
@media (min-width: 1024px) {
  :global(body:not(.dark):has(.home-page) header.bg-transparent) {
    background-color: #F7F5F0;
    border-bottom: 1px solid #D9D3C7;
  }
  :global(body:not(.dark):has(.home-page) header.bg-transparent ul li a) {
    color: #141B2D;
  }
  :global(body:not(.dark):has(.home-page) header.bg-transparent ul li a.router-link-active) {
    color: #900F13;
  }
  :global(body:not(.dark):has(.home-page) header.bg-transparent ul li a:hover) {
    color: #011987;
  }
}
</style>
