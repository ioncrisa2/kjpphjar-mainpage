<script setup lang="ts">
import type { PublicStaffGroup } from '~/types/staff'

const { company, headOffice, branches } = useCompanyProfile()

const aboutTitle = "Tentang Kami – Profil & Tim Penilai Publik Palembang | KJPP HJA'R"
const aboutDescription =
  "Profil KJPP Henricus Judi Adrianto & Rekan (HJA'R), kantor jasa penilai publik berizin Kemenkeu di Palembang sejak 2013 beserta tim pimpinan, cabang, dan legalitas."

useSeoMeta({
  title: aboutTitle,
  description: aboutDescription,
  ogTitle: aboutTitle,
  ogDescription: aboutDescription,
  twitterTitle: aboutTitle,
  twitterDescription: aboutDescription,
})

const { data: leadersData } = await useFetch('/api/leaders')
const leaders = computed(() => leadersData.value || [])

const { data: staffData } = await useFetch<PublicStaffGroup[]>('/api/staff')
const staffGroups = computed(() => staffData.value || [])

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
              {{ company.name }} merupakan perusahaan Jasa Penilai Publik independen yang berkantor pusat di Palembang dan berdiri dengan tujuan memberikan layanan penilaian publik serta konsultasi profesional.
            </p>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ company.name }} berdiri pada 28 November 2013 berdasarkan {{ company.foundedDeed }}. Kantor pusat kami berlokasi di {{ headOffice.fullAddress }}, dengan telepon resmi <a :href="`tel:${headOffice.phoneE164}`" class="font-bold text-primary hover:underline">{{ headOffice.phone }}</a> dan jaringan kantor cabang di Surabaya, Balikpapan, serta Tangerang Selatan.
            </p>
          </div>
          <div class="w-full px-4 lg:w-1/2">
            <img
              src="/assets/images/aboutbg.png"
              alt="Kantor dan tim penilai publik KJPP Henricus Judi Adrianto & Rekan di Palembang"
              width="600"
              height="400"
              loading="lazy"
              decoding="async"
              class="w-full h-auto rounded-xl object-cover"
            />
          </div>
        </div>

        <!-- Legalitas, Nomor Izin & Jaringan Kantor dari Satu Sumber Data -->
        <div class="mt-14 grid gap-6 lg:grid-cols-2">
          <div class="rounded-2xl border border-primary/25 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-dark">
            <h2 class="text-xl font-extrabold text-black dark:text-white">
              Izin Usaha &amp; Keanggotaan Profesi
            </h2>
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Seluruh penugasan dilaksanakan secara independen sesuai Kode Etik Penilai Indonesia (KEPI) dan Standar Penilaian Indonesia (SPI).
            </p>
            <dl class="mt-5 space-y-3 text-sm">
              <div class="flex flex-col border-b border-gray/10 pb-2.5 sm:flex-row sm:justify-between">
                <dt class="font-semibold text-gray">Nomor Izin Usaha KJPP (Kemenkeu)</dt>
                <dd class="font-extrabold text-black dark:text-white">{{ company.licenses.kjppLicenseNumber }} ({{ company.licenses.kjppDecreeNumber }})</dd>
              </div>
              <div class="flex flex-col border-b border-gray/10 pb-2.5 sm:flex-row sm:justify-between">
                <dt class="font-semibold text-gray">Izin Penilai Publik Pimpinan Rekan</dt>
                <dd class="font-extrabold text-black dark:text-white">{{ company.licenses.managingPartnerValuerLicense }}</dd>
              </div>
              <div class="flex flex-col border-b border-gray/10 pb-2.5 sm:flex-row sm:justify-between">
                <dt class="font-semibold text-gray">Keanggotaan Asosiasi Profesi</dt>
                <dd class="font-extrabold text-black dark:text-white">{{ company.licenses.mappiMembership }}</dd>
              </div>
              <div class="flex flex-col sm:flex-row sm:justify-between">
                <dt class="font-semibold text-gray">Pendaftaran OJK (STTD)</dt>
                <dd class="font-extrabold text-black dark:text-white">{{ company.licenses.ojkRegistration }}</dd>
              </div>
            </dl>
          </div>

          <div class="rounded-2xl border border-primary/25 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-dark">
            <h2 class="text-xl font-extrabold text-black dark:text-white">
              Kantor Pusat &amp; Jaringan Cabang
            </h2>
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Data alamat dan nomor telepon resmi seluruh kantor layanan {{ company.shortName }}:
            </p>
            <ul class="mt-4 space-y-3 text-sm">
              <li v-for="branch in branches" :key="branch.id" class="border-b border-gray/10 pb-2.5 last:border-b-0 last:pb-0">
                <p class="font-extrabold text-black dark:text-white">{{ branch.name }} ({{ branch.city }})</p>
                <p class="text-xs text-gray-700 dark:text-gray-300">{{ branch.address }}</p>
                <p class="mt-0.5 text-xs font-semibold text-primary">
                  Telp: <a :href="branch.phoneHref" class="hover:underline">{{ branch.phone }}</a> · Email: <a :href="`mailto:${branch.email}`" class="hover:underline">{{ branch.email }}</a>
                </p>
              </li>
            </ul>
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
            :to="`/pimpinan/${leader.slug || leader._id}`"
            class="group block text-center"
          >
            <div class="overflow-hidden rounded-2xl">
              <img
                :src="leader.photoUrl"
                :alt="`Foto ${leader.name}, ${leader.position} KJPP HJA'R`"
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
                class="flex items-start gap-3.5 rounded-2xl border border-gray/15 bg-white p-5 transition hover:border-primary/50 dark:border-white/10 dark:bg-gray-dark/40"
              >
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                  :class="member.mappiNumber ? 'border-primary/25 bg-primary/10 text-primary' : 'border-gray/15 bg-stone-100 text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300'"
                  aria-hidden="true"
                >
                  <Icon
                    :name="member.mappiNumber ? 'ph:seal-check-bold' : 'ph:identification-badge-bold'"
                    class="h-5 w-5"
                  />
                </span>
                <div class="min-w-0">
                  <p class="font-extrabold leading-snug text-black dark:text-white">{{ member.name }}</p>
                  <p class="mt-0.5 text-sm text-gray">{{ member.position }}</p>
                  <p v-if="member.mappiNumber" class="mt-2 inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-200">
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
