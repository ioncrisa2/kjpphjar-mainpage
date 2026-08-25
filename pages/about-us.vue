<script setup lang="ts">
useHead({
  title: "Tentang Kami | KJPP HJA'R",
  meta: [
    { name: 'description', content: 'Kenali lebih jauh tentang KJPP Henricus Judi Adrianto dan Rekan — visi, misi, dan tim pimpinan kami.' },
  ],
})

const { data: leadersData } = await useFetch('/api/leaders')
const leaders = computed(() => leadersData.value || [])

const missions = [
  { id: '01', text: 'Menciptakan Brand Image dan Brand Loyalty bagi pengguna jasa.' },
  { id: '02', text: 'Peningkatan Profesionalisme Personil.' },
  { id: '03', text: 'Menjalankan Sistem Pengendalian Mutu, KEPI, SPI dan Peraturan lainnya dengan tertib.' },
  { id: '04', text: 'Perencanaan, Pengorganisasi Pelaksanaan dan Pengawasan Terintegrasi Dengan Baik.' },
]
</script>

<template>
  <div>
    <!-- Banner -->
    <div class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
      <div class="container">
        <div class="items-center justify-between py-10 md:flex md:h-[400px] md:py-0">
          <div class="heading relative mb-0 text-center md:text-left">
            <span class="subtitle !text-white">About Us</span>
            <h1 class="!text-white text-2xl font-extrabold sm:text-3xl lg:text-[40px] lg:!leading-[50px]">KJPP Henricus Judi Adrianto dan Rekan</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- About section -->
    <section class="flex items-center bg-stone-100 py-16 dark:bg-gray-dark/30 lg:py-24">
      <div class="container">
        <div class="flex flex-wrap gap-8 lg:gap-0">
          <div class="w-full px-4 lg:w-1/2">
            <h2 class="mt-2 mb-4 text-2xl font-bold text-black dark:text-white">
              Siapa <span class="text-primary">kami?</span>
            </h2>
            <p class="mb-6 text-xl font-bold text-black dark:text-white">
              Kami merupakan perusahaan Jasa Penilai Publik yang berdiri dengan tujuan untuk memberikan
              jasa layanan konsultasi penilaian publik.
            </p>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              KJPP Henricus Judi Adrianto dan Rekan berdiri pada 28 November 2013. Perusahaan kami
              berdiri berdasarkan Akta Notaris (Terdahulu) Linda Aprianti No. 114 Tanggal 31 Oktober
              2013 dan Akta Notaris (Perubahan Terbaru) Linta Aprianti No.01 Tanggal 3 Agustus 2019.
            </p>
          </div>
          <div class="w-full px-4 lg:w-1/2">
            <img src="/assets/images/aboutbg.png" alt="Tentang KJPP HJA'R" class="w-full rounded-xl object-cover" />
          </div>
        </div>
      </div>
    </section>

    <!-- Visi & Misi -->
    <section class="py-14 lg:py-[100px]">
      <div class="container">
        <div class="heading text-center lg:text-left">
          <span class="subtitle !text-black dark:!text-primary">Visi Kami</span>
          <h2 class="text-2xl font-extrabold text-black dark:text-white sm:text-3xl lg:text-[40px] lg:!leading-[50px]">Menjadi Perusahaan Penilai yang terpercaya dan lebih baik di Indonesia.</h2>
        </div>
        <p class="mb-6 text-lg font-semibold text-gray-700 dark:text-gray-300">Misi kami sebagai Perusahaan Penilai:</p>
        <div class="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-2">
          <div
            v-for="mission in missions"
            :key="mission.id"
            class="flex gap-6 rounded-2xl border border-primary/20 p-6 transition hover:border-primary/50"
          >
            <span class="text-4xl font-black text-primary/30">{{ mission.id }}</span>
            <p class="text-base font-semibold leading-relaxed text-black dark:text-white">{{ mission.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tim Pimpinan -->
    <section class="bg-black py-14 lg:py-20">
      <div class="container">
        <div class="heading text-center">
          <span class="subtitle">Tim Kami</span>
          <h2 class="!text-white text-2xl font-extrabold sm:text-3xl lg:text-[40px] lg:!leading-[50px]">Tim <span class="text-primary">Pimpinan</span></h2>
        </div>

        <div v-if="leaders.length === 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="animate-pulse rounded-2xl bg-gray-dark h-80" />
        </div>

        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="leader in leaders"
            :key="leader._id"
            class="group text-center"
          >
            <div class="overflow-hidden rounded-2xl">
              <img
                :src="leader.photoUrl"
                :alt="leader.name"
                class="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div class="mt-4">
              <h3 class="font-extrabold text-white text-lg leading-snug">{{ leader.name }}</h3>
              <p class="text-primary font-semibold mt-1">{{ leader.position }}</p>
              <p v-if="leader.bio" class="text-gray-300 text-sm mt-2">{{ leader.bio }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
