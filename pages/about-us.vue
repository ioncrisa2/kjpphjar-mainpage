<script setup lang="ts">
import type { PublicStaffGroup } from '~/types/staff'

useHead({
  title: "Tentang Kami | KJPP HJA'R",
  meta: [
    { name: 'description', content: 'Kenali lebih jauh tentang KJPP Henricus Judi Adrianto dan Rekan — visi, misi, tim pimpinan, serta penilai dan staff kami.' },
  ],
})

const { data: leadersData } = await useFetch('/api/leaders')
const leaders = computed(() => leadersData.value || [])

const { data: staffData } = await useFetch<PublicStaffGroup[]>('/api/staff')
const staffGroups = computed(() => staffData.value || [])

/** Inisial untuk avatar staff, tanpa gelar di belakang koma. */
function initials(name: string) {
  const words = name.split(',')[0].trim().split(/\s+/).filter(Boolean)
  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return (first + last).toUpperCase()
}

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
        <UiBreadcrumbs :items="[{ label: 'Tentang Kami' }]" class="mb-6" />
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
            <img
              src="/assets/images/aboutbg.png"
              alt="Tentang KJPP HJA'R"
              width="600"
              height="400"
              loading="lazy"
              decoding="async"
              class="w-full h-auto rounded-xl object-cover"
            />
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
          <NuxtLink
            v-for="leader in leaders"
            :key="leader._id"
            :to="`/pimpinan/${leader._id}`"
            class="group block text-center"
          >
            <div class="overflow-hidden rounded-2xl">
              <img
                :src="leader.photoUrl"
                :alt="leader.name"
                width="400"
                height="400"
                class="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="mt-4">
              <h3 class="font-extrabold text-white text-lg leading-snug transition group-hover:text-primary">{{ leader.name }}</h3>
              <p class="text-primary font-semibold mt-1">{{ leader.position }}</p>
              <p v-if="leader.bio" class="text-gray-300 text-sm mt-2 line-clamp-3">{{ leader.bio }}</p>
              <span class="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                Lihat profil <Icon name="ph:arrow-right-bold" class="transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Penilai & Staff per kantor -->
    <section v-if="staffGroups.length" id="staff" class="scroll-mt-28 py-14 lg:py-[100px]">
      <div class="container">
        <div class="heading text-center">
          <span class="subtitle !text-black dark:!text-primary">Tim Profesional</span>
          <h2 class="text-2xl font-extrabold text-black dark:text-white sm:text-3xl lg:text-[40px] lg:!leading-[50px]">Penilai & <span class="text-primary">Staff</span> Kami</h2>
          <p class="mx-auto mt-3 max-w-2xl text-gray">Tenaga profesional yang siap melayani kebutuhan penilaian Anda di kantor pusat maupun cabang.</p>
        </div>

        <div class="space-y-12">
          <div
            v-for="group in staffGroups"
            :id="`staff-${group.branch._id}`"
            :key="group.branch._id"
            class="scroll-mt-28"
          >
            <div class="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-gray/10 pb-3">
              <h3 class="flex items-center gap-2 text-xl font-extrabold text-black dark:text-white">
                <Icon name="ph:map-pin-bold" class="text-primary" aria-hidden="true" />
                {{ group.branch.name }}
              </h3>
              <span class="text-sm font-semibold text-gray">{{ group.branch.city }} · {{ group.staff.length }} orang</span>
            </div>

            <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <li
                v-for="member in group.staff"
                :key="member._id"
                class="flex items-start gap-4 rounded-2xl border border-primary/20 p-5 transition hover:border-primary/50"
              >
                <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-extrabold text-primary" aria-hidden="true">
                  {{ initials(member.name) }}
                </span>
                <div class="min-w-0">
                  <p class="font-extrabold leading-snug text-black dark:text-white">{{ member.name }}</p>
                  <p class="mt-0.5 text-sm text-gray">{{ member.position }}</p>
                  <p v-if="member.mappiNumber" class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <Icon name="ph:identification-card-bold" class="text-primary" aria-hidden="true" />
                    No. MAPPI {{ member.mappiNumber }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
