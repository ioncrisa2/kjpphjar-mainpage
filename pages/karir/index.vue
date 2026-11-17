<script setup lang="ts">
const careerTitle = "Peluang Karir Penilai & Staf Profesional | KJPP HJA'R"
const careerDescription =
  "Temukan informasi lowongan kerja dan peluang berkarir sebagai penilai maupun staf profesional bersama KJPP Henricus Judi Adrianto & Rekan."

useSeoMeta({
  title: careerTitle,
  description: careerDescription,
  ogTitle: careerTitle,
  ogDescription: careerDescription,
  twitterTitle: careerTitle,
  twitterDescription: careerDescription,
})

const { data: careers, pending } = await useFetch('/api/careers')

const runtimeConfig = useRuntimeConfig()
const { data: settings } = await useAppSettings()
const emailTarget = computed(() => settings.value.generalContacts.email.trim())
const waNumber = computed(() => {
  const configured = settings.value.generalContacts.whatsapp.replace(/\D/g, '')
  return configured || String(runtimeConfig.public.whatsappNumber || '').replace(/\D/g, '')
})

// Email lamaran diatur di Admin > Pengaturan; jika kosong, arahkan ke WhatsApp
function getApplyLink(title: string) {
  if (emailTarget.value) {
    return `mailto:${emailTarget.value}?subject=Lamaran%20Posisi:%20${encodeURIComponent(title)}`
  }
  return `https://wa.me/${waNumber.value}?text=${encodeURIComponent(`Halo, saya ingin melamar posisi ${title} di KJPP HJA'R.`)}`
}
</script>

<template>
  <div>
    <!-- Banner -->
    <div class="pub-page-banner">
      <div class="container">
        <span class="pub-eyebrow">Karir</span>
        <h1 class="pub-h1">Peluang Karir</h1>
      </div>
    </div>

    <!-- Content Section -->
    <div class="pub-section bg-[var(--paper)]">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <UiBreadcrumbs :items="[{ label: 'Karir' }]" class="mb-10" />

        <p class="mb-12 max-w-[68ch] text-[20px] leading-[1.6] text-[var(--ink)]">
          Tingkatkan potensi dan kembangkan karir Anda bersama tim ahli penilai dan konsultan KJPP HJA'R.
        </p>

        <div v-if="pending" class="py-12 text-[var(--muted)]">
          Memuat lowongan...
        </div>

        <div v-else-if="!careers?.length" class="pub-box px-6 py-12 lg:px-10">
          <h3 class="pub-serif text-[24px] text-[var(--ink)]">Belum Ada Lowongan Terbuka</h3>
          <p class="mt-2 max-w-[68ch] text-[17px] leading-[1.6] text-[var(--muted)]">Saat ini kami belum membuka posisi baru. Silakan kunjungi halaman ini secara berkala untuk update terbaru.</p>
        </div>

        <div v-else class="border-t border-[var(--rule)]">
          <article
            v-for="career in careers"
            :key="career._id"
            class="border-b border-[var(--rule)] py-10"
          >
            <div class="flex flex-wrap items-start justify-between gap-3">
              <h2 class="pub-serif text-[24px] leading-[1.25] text-[var(--ink)] lg:text-[32px]">{{ career.title }}</h2>
              <span class="rounded-[2px] border border-[var(--brand-navy)] px-3 py-1 text-[14px] font-bold text-[var(--brand-navy)]">
                {{ career.type }}
              </span>
            </div>
            <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] tabular-nums text-[var(--muted)]">
              <span>{{ career.location }}</span>
              <span aria-hidden="true">·</span>
              <span>Dipublikasikan {{ new Date(career.postedAt).toLocaleDateString('id-ID') }}</span>
              <template v-if="career.closingDate">
                <span aria-hidden="true">·</span>
                <span class="font-bold text-[var(--ink)]">Tutup {{ new Date(career.closingDate).toLocaleDateString('id-ID') }}</span>
              </template>
            </div>

            <div class="mt-6 max-w-[68ch] whitespace-pre-wrap text-[17px] leading-[1.6] text-[var(--ink)]">
              {{ career.description }}
            </div>

            <div v-if="career.requirements && career.requirements.length > 0" class="mt-6">
              <h3 class="text-[18px] font-bold text-[var(--ink)]">Persyaratan</h3>
              <ul class="mt-3 max-w-[68ch] list-disc space-y-1 pl-5 text-[16px] leading-[1.6] text-[var(--ink)]">
                <li v-for="(req, idx) in career.requirements" :key="idx">{{ req }}</li>
              </ul>
            </div>

            <div class="mt-8">
              <a
                :href="getApplyLink(career.title)"
                :target="emailTarget ? undefined : '_blank'"
                :rel="emailTarget ? undefined : 'noopener noreferrer'"
                class="pub-btn"
              >
                Lamar Posisi Ini
              </a>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>
