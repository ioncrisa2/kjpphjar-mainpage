<script setup lang="ts">
useHead({
  title: "KJPP HJA'R | Penilai Publik & Konsultan Independen",
  meta: [
    {
      name: 'description',
      content:
        'KJPP Henricus Judi Adrianto dan Rekan — perusahaan jasa penilai publik dan konsultan independen terpercaya dengan pengalaman lebih dari 10 tahun.',
    },
    { property: 'og:title', content: "KJPP HJA'R | Penilai Publik & Konsultan Independen" },
    { property: 'og:description', content: 'Jasa penilai publik dan konsultan independen terpercaya.' },
  ],
})

// Fetch services and featured gallery
const { data: servicesData } = await useFetch('/api/services')
const { data: galleryData } = await useFetch('/api/gallery', { query: { featured: 'true', limit: 6 } })
const { data: leadersData } = await useFetch('/api/leaders')

const services = computed(() => servicesData.value || [])
const featuredPhotos = computed(() => galleryData.value?.items || [])
const leaders = computed(() => leadersData.value || [])

const chooseUs = [
  { title: 'Tim Solid', desc: 'Didukung tim manajemen yang solid dan berkualitas tinggi', image: '/assets/images/team.jpg' },
  { title: 'Skalabilitas', desc: 'Siap menjadi pilihan dari perusahaan berskala kecil, menengah hingga besar.', image: '/assets/images/scale.jpg' },
  { title: 'Efektif & Efisien', desc: 'Menggunakan schedule kerja yang jelas, terukur dan dilakukan secara efektif dan efisien.', image: '/assets/images/efektif&efisien.jpg' },
  { title: 'Kerahasiaan', desc: 'Kami menjamin kerahasiaan data Anda sesuai dengan pakta integritas.', image: '/assets/images/rahasia.jpg' },
]

// Service icon map (static SVG components by slug)
const serviceIcons: Record<string, string> = {
  consulting: 'consulting',
  'feasibility-study': 'feasibility',
  'project-supervision': 'supervision',
  'asset-valuation': 'asset',
  'project-valuation': 'valuation',
  monitoring: 'monitoring',
}
</script>

<template>
  <div class="overflow-x-hidden">
    <!-- Hero -->
    <section class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-center bg-no-repeat pt-[82px] text-white lg:pt-[106px]">
      <div class="container">
        <div class="flex flex-col gap-7 pt-6 md:flex-row md:gap-0">
          <div class="space-y-5 pt-24 pb-10 text-center ltr:md:text-left">
            <h5 class="text-xl font-bold">Selamat Datang</h5>
            <h1 class="text-3xl font-black uppercase sm:leading-tight lg:text-4xl">
              KJPP Henricus Judi Adrianto dan Rekan
            </h1>
            <p class="text-xl font-semibold max-w-xl">
              KJPP HJA'R merupakan perusahaan jasa penilai publik dan konsultan independen yang
              menawarkan berbagai layanan profesional.
            </p>
            <NuxtLink to="/layanan" class="btn rounded-md bg-white !text-black inline-flex items-center gap-2">
              <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.3873 7.1575L11.9999 12L3.60913 7.14978" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12 12V21" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M11 2.577C11.6188 2.22 12.3812 2.22 13 2.577L19.66 6.423C20.279 6.78 20.66 7.44 20.66 8.155V15.845C20.66 16.56 20.279 17.22 19.66 17.577L13 21.423C12.3812 21.78 11.6188 21.78 11 21.423L4.34 17.577C3.721 17.22 3.34 16.56 3.34 15.845V8.155C3.34 7.44 3.721 6.78 4.34 6.423L11 2.577Z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="text-lg">Layanan Kami</span>
            </NuxtLink>
          </div>
          <div class="mx-auto w-full max-w-[386px] hidden lg:block">
            <img src="/assets/images/pak-henricus.png" alt="Pimpinan KJPP HJA'R" />
          </div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="bg-gradient-to-b from-white/[55%] to-transparent py-14 dark:bg-none lg:py-20" id="service">
      <div class="container">
        <div class="heading mb-5 text-center">
          <h4>Layanan Kami</h4>
        </div>

        <!-- Loading state -->
        <div v-if="services.length === 0" class="mt-16 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl bg-gray/10 h-48" />
        </div>

        <!-- Services from DB -->
        <div v-else class="mt-16 grid gap-x-7 gap-y-12 text-lg font-semibold sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-20">
          <NuxtLink
            v-for="service in services"
            :key="service._id"
            :to="`/layanan/${service.slug}`"
            class="group text-center"
          >
            <div class="mb-6 flex justify-center">
              <div
                class="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-primary/10 transition duration-300 group-hover:bg-primary/20"
                v-html="service.icon"
              />
            </div>
            <h3 class="text-black dark:text-white text-xl font-extrabold transition group-hover:text-primary">
              {{ service.title }}
            </h3>
            <p class="mt-3 text-sm font-medium text-gray">{{ service.titleEn }}</p>
            <p class="mt-4 text-base text-gray leading-relaxed">{{ service.description }}</p>
          </NuxtLink>
        </div>

        <!-- Fallback: hardcoded jika DB kosong belum diisi -->
        <div v-if="services.length === 0" class="mt-8 text-center">
          <NuxtLink to="/admin/services" class="text-sm text-primary hover:underline">
            + Tambahkan layanan dari admin panel
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="relative bg-black py-12 dark:bg-white/5 lg:py-24">
      <div class="absolute bottom-0 right-0">
        <img src="/assets/images/consulting/bg-icon.svg" alt="" />
      </div>
      <div class="container relative z-[1]">
        <div class="heading text-center text-white">
          <h4 class="mb-2 !font-black uppercase !text-white">
            Kenapa <span class="text-primary">Memilih kami</span>?
          </h4>
        </div>
        <div class="mt-10 grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-2" data-aos="zoom-in" data-aos-duration="1000">
          <div v-for="(item, index) in chooseUs" :key="index" class="group">
            <div class="overflow-hidden">
              <img :src="item.image" class="w-full duration-200 group-hover:rotate-2 group-hover:scale-110" :alt="item.title" />
            </div>
            <div class="relative mx-4 -mt-10 space-y-2.5 bg-gray-dark px-4 pt-[22px] text-center dark:bg-black md:px-[26px]">
              <h5 class="text-2xl font-bold text-primary group-hover:text-secondary">{{ item.title }}</h5>
              <div class="mx-auto h-1 w-[50px] bg-secondary duration-200 group-hover:bg-primary" />
              <p class="pb-[60px] text-lg font-semibold text-white">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="bg-black bg-[url(/assets/images/consulting/business-img.png)] bg-cover bg-center bg-no-repeat py-12 lg:py-24">
      <div class="container">
        <div class="grid grid-cols-1 gap-12 text-center lg:grid-cols-2 lg:gap-20 lg:text-left">
          <div>
            <h3 class="text-3xl font-black uppercase text-white sm:text-[40px] sm:leading-[50px]">
              Pengalaman <span class="text-primary">Kami</span>
            </h3>
            <p class="mt-[18px] text-lg text-gray">
              Dengan pengalaman lebih dari 10 tahun dan ribuan pelanggan puas, kami menjadi mitra
              terpercaya dalam memenuhi kebutuhan Anda.
            </p>
            <div class="mt-[18px] flex justify-center gap-6 lg:justify-start">
              <NuxtLink to="/contact-us" class="btn rounded-md bg-secondary text-white shadow-[10px_15px_30px_rgba(180,118,229,0.3)] hover:bg-primary">
                Contact Us
              </NuxtLink>
            </div>
          </div>
          <div class="grid grid-cols-2 items-center gap-3 sm:gap-7" data-aos="zoom-in" data-aos-duration="1000">
            <div class="border border-transparent bg-gray/20 py-10 px-5 text-center duration-200 hover:border-secondary sm:py-[52px]">
              <span class="text-[34px] font-black text-white">5000+</span>
              <p class="mt-2.5 font-bold text-gray">Pelanggan Puas</p>
            </div>
            <div class="border border-transparent bg-gray/20 py-10 px-5 text-center duration-200 hover:border-secondary sm:py-[52px]">
              <span class="text-[34px] font-black text-white">10+</span>
              <p class="mt-2.5 font-bold text-gray">Tahun Pengalaman</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Gallery Preview (only if there are featured photos) -->
    <section v-if="featuredPhotos.length > 0" class="py-14 lg:py-20">
      <div class="container">
        <div class="heading text-center">
          <h6>Galeri Kami</h6>
          <h4>Momen & Kegiatan</h4>
        </div>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
          <div
            v-for="photo in featuredPhotos"
            :key="photo._id"
            class="overflow-hidden rounded-2xl"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <img
              :src="photo.thumbnailUrl"
              :alt="photo.title || 'Galeri KJPP HJA\'R'"
              class="h-48 w-full object-cover transition duration-500 hover:scale-110"
              loading="lazy"
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
