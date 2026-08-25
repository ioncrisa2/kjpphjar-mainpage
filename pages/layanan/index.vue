<script setup lang="ts">
useHead({
  title: "Layanan Kami | KJPP HJA'R",
  meta: [
    { name: 'description', content: "Daftar layanan profesional penilai publik dan konsultan dari KJPP HJA'R." }
  ]
})

const { data: services, pending } = await useFetch('/api/services')
</script>

<template>
  <div>
    <!-- Banner -->
    <div class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
      <div class="container">
        <div class="items-center py-10 md:flex md:h-[400px] md:py-0">
          <div class="heading mb-0 text-center md:text-left">
            <h1 class="!text-white text-2xl font-extrabold sm:text-3xl lg:text-[40px] lg:!leading-[50px]">Layanan Kami</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="py-16 sm:py-24 bg-white dark:bg-black">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="text-center mb-12">
           <p class="text-xl sm:text-2xl font-extrabold text-black dark:text-white font-mulish max-w-3xl mx-auto">
             Berbagai solusi penilaian dan konsultasi properti terbaik yang disesuaikan dengan kebutuhan Anda.
           </p>
        </div>

        <div v-if="pending" class="text-center text-gray py-12">
          Memuat layanan...
        </div>

        <div v-else-if="!services?.length" class="text-center text-gray py-12">
          Belum ada layanan yang ditambahkan.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="service in services"
            :key="service._id"
            :to="`/layanan/${service.slug}`"
            class="group bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-800 rounded-xl p-8 hover:shadow-xl hover:border-primary transition-all duration-300"
          >
            <div class="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
              <ClientOnly v-if="service.icon">
                <Icon :name="getNuxtIconName(service.icon)" class="text-2xl text-primary group-hover:text-white transition-colors duration-300" />
              </ClientOnly>
              <!-- Fallback icon jika kosong -->
              <svg v-else class="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            <h2 class="text-xl font-bold text-black dark:text-white mb-3">{{ service.title }}</h2>
            <p class="text-gray-700 dark:text-gray-300 mb-6 line-clamp-3">{{ service.description }}</p>

            <div class="text-sky-600 dark:text-primary font-bold text-sm flex items-center group-hover:text-primary">
              Pelajari Lebih Lanjut
              <span class="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
            </div>
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>
