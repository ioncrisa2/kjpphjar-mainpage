<script setup lang="ts">
useHead({
  title: "Karir | KJPP HJA'R",
  meta: [
    { name: 'description', content: "Bergabunglah bersama tim profesional kami. Temukan peluang karir terbaru di KJPP HJA'R." }
  ]
})

const { data: careers, pending } = await useFetch('/api/careers')

const runtimeConfig = useRuntimeConfig()
const emailTarget = runtimeConfig.public.contactEmail || 'hrd@kjpphjar.com'

function getMailtoLink(title: string) {
  return `mailto:${emailTarget}?subject=Lamaran%20Posisi:%20${encodeURIComponent(title)}`
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
    <div class="py-16 sm:py-24 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="text-center mb-12">
           <p class="text-xl sm:text-2xl font-extrabold text-black font-mulish max-w-2xl mx-auto">
             Tingkatkan potensi dan kembangkan karir Anda bersama tim ahli penilai dan konsultan KJPP HJA'R.
           </p>
        </div>

        <div v-if="pending" class="text-center text-gray py-12">
          Memuat lowongan...
        </div>

        <div v-else-if="!careers?.length" class="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <i class="far fa-folder-open text-5xl text-gray-400 mb-4"></i>
          <h3 class="text-lg font-bold text-black">Belum Ada Lowongan Terbuka</h3>
          <p class="text-gray mt-2">Saat ini kami belum membuka posisi baru. Silakan kunjungi halaman ini secara berkala untuk update terbaru.</p>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="career in careers"
            :key="career._id"
            class="bg-white border border-gray-200 rounded-xl p-6 md:p-8 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
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
                <h2 class="text-2xl font-bold text-black mb-2 pr-24">{{ career.title }}</h2>
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray mb-6">
                  <div class="flex items-center">
                    <i class="fas fa-map-marker-alt mr-2 text-primary"></i>
                    {{ career.location }}
                  </div>
                  <div class="flex items-center">
                    <i class="far fa-clock mr-2 text-primary"></i>
                    Dipublikasikan {{ new Date(career.postedAt).toLocaleDateString('id-ID') }}
                  </div>
                  <div v-if="career.closingDate" class="flex items-center text-red-500 font-medium">
                    <i class="fas fa-hourglass-half mr-2"></i>
                    Tutup {{ new Date(career.closingDate).toLocaleDateString('id-ID') }}
                  </div>
                </div>
              </div>
            </div>

            <div class="prose prose-sm prose-blue max-w-none text-gray-800 mb-6 whitespace-pre-wrap">
              {{ career.description }}
            </div>

            <div v-if="career.requirements && career.requirements.length > 0" class="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 class="text-sm font-bold text-black uppercase tracking-wider mb-3">Persyaratan</h3>
              <ul class="list-disc pl-5 space-y-1 text-sm text-gray-800">
                <li v-for="(req, idx) in career.requirements" :key="idx">{{ req }}</li>
              </ul>
            </div>

            <div class="pt-4 border-t border-gray-100 flex justify-end">
              <a
                :href="getMailtoLink(career.title)"
                class="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <i class="far fa-paper-plane mr-2"></i> Lamar Posisi Ini
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
