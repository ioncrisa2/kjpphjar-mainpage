<script setup lang="ts">
import type { PublicStaffGroup } from '~/types/staff'

const { company, headOffice, branches, hasValue } = useCompanyProfile()

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
    <div class="pub-page-banner">
      <div class="container">
        <span class="pub-eyebrow">Tentang Kami</span>
        <h1 class="pub-h1">KJPP Henricus Judi Adrianto dan Rekan</h1>
      </div>
    </div>

    <!-- About section -->
    <section class="pub-section bg-[var(--paper)]">
      <div class="container">
        <UiBreadcrumbs :items="[{ label: 'Tentang Kami' }]" class="mb-10" />
        <div class="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 class="pub-h2 mb-6">Siapa kami?</h2>
            <p class="mb-6 max-w-[68ch] text-[20px] leading-[1.6] text-[var(--ink)]">
              {{ company.name }} merupakan perusahaan Jasa Penilai Publik independen yang berkantor pusat di Palembang dan berdiri dengan tujuan memberikan layanan penilaian publik serta konsultasi profesional.
            </p>
            <p class="max-w-[68ch] text-[17px] leading-[1.6] text-[var(--muted)]">
              {{ company.name }} berdiri pada <span class="tabular-nums">28 November 2013</span> berdasarkan {{ company.foundedDeed }}. Kantor pusat kami berlokasi di {{ headOffice.fullAddress }}, dengan telepon resmi <a :href="`tel:${headOffice.phoneE164}`" class="pub-link font-bold tabular-nums underline underline-offset-[3px]">{{ headOffice.phone }}</a> dan jaringan kantor cabang di Surabaya, Balikpapan, serta Tangerang Selatan.
            </p>
          </div>
          <div>
            <img
              src="/assets/images/aboutbg.png"
              alt="Kantor dan tim penilai publik KJPP Henricus Judi Adrianto & Rekan di Palembang"
              width="600"
              height="400"
              loading="lazy"
              decoding="async"
              class="h-auto w-full rounded-[2px] object-cover"
            />
          </div>
        </div>

        <!-- Legalitas, Nomor Izin & Jaringan Kantor dari Satu Sumber Data -->
        <div class="mt-16 grid gap-8 border-t border-[var(--rule)] pt-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 class="pub-serif text-[24px] text-[var(--ink)]">
              Izin Usaha &amp; Keanggotaan Profesi
            </h2>
            <p class="mt-2 text-[16px] leading-[1.6] text-[var(--muted)]">
              Seluruh penugasan dilaksanakan secara independen sesuai Kode Etik Penilai Indonesia (KEPI) dan Standar Penilaian Indonesia (SPI).
            </p>
            <dl class="mt-6 border-t border-[var(--rule)] text-[16px]">
              <div v-if="hasValue(company.licenses.kjppLicenseNumber)" class="flex flex-col gap-1 border-b border-[var(--rule)] py-4 sm:flex-row sm:justify-between sm:gap-6">
                <dt class="text-[var(--muted)]">Nomor Izin Usaha KJPP (Kemenkeu)</dt>
                <dd class="font-bold tabular-nums text-[var(--ink)] sm:text-right">
                  {{ company.licenses.kjppLicenseNumber }}
                  <template v-if="hasValue(company.licenses.kjppDecreeNumber)"> ({{ company.licenses.kjppDecreeNumber }})</template>
                </dd>
              </div>
              <div v-if="hasValue(company.licenses.managingPartnerValuerLicense)" class="flex flex-col gap-1 border-b border-[var(--rule)] py-4 sm:flex-row sm:justify-between sm:gap-6">
                <dt class="text-[var(--muted)]">Izin Penilai Publik Pimpinan Rekan</dt>
                <dd class="font-bold tabular-nums text-[var(--ink)] sm:text-right">{{ company.licenses.managingPartnerValuerLicense }}</dd>
              </div>
              <div v-if="hasValue(company.licenses.mappiMembership)" class="flex flex-col gap-1 border-b border-[var(--rule)] py-4 sm:flex-row sm:justify-between sm:gap-6">
                <dt class="text-[var(--muted)]">Keanggotaan Asosiasi Profesi</dt>
                <dd class="font-bold tabular-nums text-[var(--ink)] sm:text-right">{{ company.licenses.mappiMembership }}</dd>
              </div>
              <div v-if="hasValue(company.licenses.ojkRegistration)" class="flex flex-col gap-1 border-b border-[var(--rule)] py-4 sm:flex-row sm:justify-between sm:gap-6">
                <dt class="text-[var(--muted)]">Pendaftaran OJK (STTD)</dt>
                <dd class="font-bold tabular-nums text-[var(--ink)] sm:text-right">{{ company.licenses.ojkRegistration }}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 class="pub-serif text-[24px] text-[var(--ink)]">
              Kantor Pusat &amp; Jaringan Cabang
            </h2>
            <p class="mt-2 text-[16px] leading-[1.6] text-[var(--muted)]">
              Data alamat dan nomor telepon resmi seluruh kantor layanan {{ company.shortName }}:
            </p>
            <ul class="mt-6 border-t border-[var(--rule)] text-[16px]">
              <li v-for="branch in branches" :key="branch.id" class="border-b border-[var(--rule)] py-4">
                <p class="font-bold text-[var(--ink)]">{{ branch.name }} ({{ branch.city }})</p>
                <p class="mt-1 text-[14px] leading-[1.6] text-[var(--muted)]">{{ branch.address }}</p>
                <p class="mt-1 text-[14px] text-[var(--muted)]">
                  Telp: <a :href="branch.phoneHref" class="pub-link font-bold tabular-nums">{{ branch.phone }}</a> · Email: <a :href="`mailto:${branch.email}`" class="pub-link font-bold">{{ branch.email }}</a>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Visi & Misi -->
    <section class="pub-section border-t border-[var(--rule)] bg-[var(--paper)]">
      <div class="container">
        <span class="mb-3 block text-[14px] font-bold text-[var(--brand-navy)]">Visi Kami</span>
        <h2 class="pub-h2 max-w-4xl">Menjadi Perusahaan Penilai yang terpercaya dan lebih baik di Indonesia.</h2>
        <p class="mt-8 mb-4 text-[18px] font-bold text-[var(--ink)]">Misi kami sebagai Perusahaan Penilai:</p>
        <ol class="grid border-t border-[var(--rule)] sm:grid-cols-2 sm:gap-x-12">
          <li
            v-for="mission in missions"
            :key="mission.id"
            class="flex gap-6 border-b border-[var(--rule)] py-6"
          >
            <span class="pub-serif text-[24px] tabular-nums text-[var(--brand-navy)]">{{ mission.id }}</span>
            <p class="text-[17px] leading-[1.6] text-[var(--ink)]">{{ mission.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Tim Pimpinan -->
    <section class="pub-navy pub-section">
      <div class="container">
        <span class="pub-eyebrow">Tim Kami</span>
        <h2 class="pub-serif mb-10 text-[24px] leading-[1.25] text-white lg:text-[32px]">Tim Pimpinan</h2>

        <div v-if="leaders.length === 0" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 3" :key="i" class="h-80 animate-pulse rounded-[2px] bg-white/10" />
        </div>

        <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="leader in leaders"
            :key="leader._id"
            :to="`/pimpinan/${leader.slug || leader._id}`"
            class="group block border-t border-[#1E3A6E] pt-6"
          >
            <div class="overflow-hidden rounded-[2px]">
              <img
                :src="leader.photoUrl"
                :alt="`Foto ${leader.name}, ${leader.position} KJPP HJA'R`"
                width="400"
                height="400"
                class="h-64 w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="mt-4">
              <h3 class="pub-serif text-[20px] leading-snug text-white transition-colors duration-150 group-hover:text-[#47BDFF]">{{ leader.name }}</h3>
              <p class="mt-1 text-[16px] font-bold text-[#47BDFF]">{{ leader.position }}</p>
              <p v-if="leader.bio" class="mt-2 text-[14px] leading-[1.6] text-[#CBD5E1]">{{ leader.bio }}</p>
              <span class="mt-3 inline-block text-[14px] font-bold text-[#47BDFF] group-hover:underline">
                Lihat profil →
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Penilai & Staff per kantor -->
    <section v-if="staffGroups.length" id="staff" class="pub-section scroll-mt-28 bg-[var(--paper)]">
      <div class="container">
        <span class="mb-3 block text-[14px] font-bold text-[var(--brand-navy)]">Tim Profesional</span>
        <h2 class="pub-h2">Penilai &amp; Staff Kami</h2>
        <p class="mt-3 max-w-[68ch] text-[17px] leading-[1.6] text-[var(--muted)]">Tenaga profesional yang siap melayani kebutuhan penilaian Anda di kantor pusat maupun cabang.</p>

        <div class="mt-12 space-y-12">
          <div
            v-for="group in staffGroups"
            :id="`staff-${group.branch._id}`"
            :key="group.branch._id"
            class="scroll-mt-28"
          >
            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-[var(--rule)] pb-3">
              <h3 class="pub-serif text-[24px] text-[var(--ink)]">
                {{ group.branch.name }}
              </h3>
              <span class="text-[14px] tabular-nums text-[var(--muted)]">{{ group.branch.city }} · {{ group.staff.length }} orang</span>
            </div>

            <ul class="grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 xl:grid-cols-4">
              <li
                v-for="member in group.staff"
                :key="member._id"
                class="border-b border-[var(--rule)] py-4"
              >
                <p class="font-bold leading-snug text-[var(--ink)]">{{ member.name }}</p>
                <p v-if="hasValue(member.position)" class="mt-0.5 text-[14px] text-[var(--muted)]">{{ member.position }}</p>
                <p v-if="hasValue(member.mappiNumber)" class="mt-1 text-[14px] tabular-nums text-[var(--brand-navy)]">
                  No. MAPPI {{ member.mappiNumber }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
