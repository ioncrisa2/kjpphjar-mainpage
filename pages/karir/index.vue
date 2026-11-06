<script setup lang="ts">
useHead({
  title: "Karir | KJPP HJA'R",
  meta: [
    { name: 'description', content: "Bergabunglah bersama tim profesional kami. Temukan peluang karir terbaru di KJPP HJA'R." }
  ]
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
    <div class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
      <div class="container">
        <div class="items-center py-10 md:flex md:h-[400px] md:py-0">
          <div class="heading mb-0 text-center md:text-left">
            <h1 class="!text-white text-2xl font-extrabold sm:text-3xl lg:text-[40px] lg:!leading-[50px]">Peluang Karir</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="py-16 sm:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <UiBreadcrumbs :items="[{ label: 'Karir' }]" class="mb-6" />

        <div class="text-center mb-12">
           <p class="text-xl sm:text-2xl font-extrabold text-black font-mulish max-w-2xl mx-auto dark:text-white">
             Tingkatkan potensi dan kembangkan karir Anda bersama tim ahli penilai dan konsultan KJPP HJA'R.
           </p>
        </div>

        <div v-if="pending" class="text-center text-gray py-12">
          Memuat lowongan...
        </div>

        <div v-else-if="!careers?.length" class="text-center py-16 px-6 bg-gray-50 rounded-xl border border-gray-200 dark:bg-white/5 dark:border-white/10">
          <Icon name="ph:folder-open-bold" class="mx-auto mb-4 h-12 w-12 text-gray-400" aria-hidden="true" />
          <h3 class="text-lg font-bold text-black dark:text-white">Belum Ada Lowongan Terbuka</h3>
          <p class="text-gray mt-2">Saat ini kami belum membuka posisi baru. Silakan kunjungi halaman ini secara berkala untuk update terbaru.</p>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="career in careers"
            :key="career._id"
            class="bg-white border border-gray-200 rounded-xl p-6 md:p-8 hover:shadow-lg dark:bg-white/5 dark:border-white/10 transition-shadow duration-300 relative overflow-hidden"
          >
            <!-- Badge Tipe Pekerjaan -->
            <div class="absolute top-0 right-0">
              <span
                class="inline-block px-4 py-1 text-xs font-semibold rounded-bl-lg text-white shadow-sm"
                :class="{
                  'bg-blue-600': career.type === 'Full-time',
                  'bg-green-500': career.type === 'Part-time',
                  'bg-purple-500': career.type === 'Internship',
                  'bg-gray-600': !['Full-time', 'Part-time', 'Internship'].includes(career.type)
                }"
              >
                {{ career.type }}
              </span>
            </div>

            <div class="md:flex md:items-start md:justify-between">
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-black mb-2 pr-24 dark:text-white">{{ career.title }}</h2>
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray mb-6">
                  <div class="flex items-center">
                    <Icon name="ph:map-pin-bold" class="mr-2 text-primary" aria-hidden="true" />
                    {{ career.location }}
                  </div>
                  <div class="flex items-center">
                    <Icon name="ph:clock-bold" class="mr-2 text-primary" aria-hidden="true" />
                    Dipublikasikan {{ new Date(career.postedAt).toLocaleDateString('id-ID') }}
                  </div>
                  <div v-if="career.closingDate" class="flex items-center text-red-500 font-medium">
                    <Icon name="ph:hourglass-medium-bold" class="mr-2" aria-hidden="true" />
                    Tutup {{ new Date(career.closingDate).toLocaleDateString('id-ID') }}
                  </div>
                </div>
              </div>
            </div>

            <div class="prose prose-sm prose-blue max-w-none text-gray-800 mb-6 whitespace-pre-wrap dark:prose-invert dark:text-gray-300">
              {{ career.description }}
            </div>

            <div v-if="career.requirements && career.requirements.length > 0" class="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100 dark:bg-white/5 dark:border-white/10">
              <h3 class="text-sm font-bold text-black uppercase tracking-wider mb-3 dark:text-white">Persyaratan</h3>
              <ul class="list-disc pl-5 space-y-1 text-sm text-gray-800 dark:text-gray-300">
                <li v-for="(req, idx) in career.requirements" :key="idx">{{ req }}</li>
              </ul>
            </div>

            <div class="pt-4 border-t border-gray-100 flex justify-end dark:border-white/10">
              <a
                :href="getApplyLink(career.title)"
                :target="emailTarget ? undefined : '_blank'"
                :rel="emailTarget ? undefined : 'noopener noreferrer'"
                class="inline-flex items-center rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-black transition hover:bg-secondary hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
              >
                <Icon name="ph:paper-plane-tilt-bold" class="mr-2" aria-hidden="true" /> Lamar Posisi Ini
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
