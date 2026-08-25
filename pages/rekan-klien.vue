<script setup lang="ts">
useHead({
  title: "Rekan & Klien | KJPP HJA'R",
  meta: [
    { name: 'description', content: "Daftar klien dan mitra bisnis yang telah mempercayakan layanan penilai publik dan konsultan kepada KJPP HJA'R." },
    { property: 'og:title', content: "Rekan & Klien | KJPP HJA'R" },
    { property: 'og:description', content: "Daftar klien dan mitra bisnis yang telah mempercayakan layanan penilai publik dan konsultan kepada KJPP HJA'R." }
  ]
})

const { data: clients, pending } = await useFetch('/api/clients')

// Ambil kategori unik yang tersedia
const categories = computed(() => {
  if (!clients.value?.items) return []
  const cats = new Set(clients.value.items.map((c: any) => c.category).filter((c: any) => c))
  return ['Semua', ...Array.from(cats)]
})

const activeCategory = ref('Semua')

// Filter klien berdasarkan kategori yang dipilih
const filteredClients = computed(() => {
  if (!clients.value?.items) return []
  if (activeCategory.value === 'Semua') return clients.value.items
  return clients.value.items.filter((c: any) => c.category === activeCategory.value)
})
</script>

<template>
  <div>
    <!-- Banner -->
    <div class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
      <div class="container">
        <div class="items-center py-10 md:flex md:h-[400px] md:py-0">
          <div class="heading mb-0 text-center md:text-left">
            <h1 class="!text-white text-2xl font-extrabold sm:text-3xl lg:text-[40px] lg:!leading-[50px]">Rekan dan Client</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="py-16 sm:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="text-center mb-12">
           <h2 class="text-2xl sm:text-3xl font-extrabold text-black font-mulish">
             Rekan dan Client yang pernah menggunakan Jasa KJPP Henricus Judi Adrianto dan Rekan
           </h2>
        </div>

        <!-- Filter Tabs -->
        <div v-if="categories.length > 1" class="flex flex-wrap justify-center gap-2 mb-12">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            class="px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
            :class="activeCategory === cat ? 'bg-primary text-black' : 'bg-gray-100 text-gray hover:bg-gray-200'"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Grid Klien -->
        <div v-if="pending" class="text-center text-gray py-12">
          <div class="animate-pulse flex space-x-4 justify-center">
            <div class="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div class="space-y-3">
              <div class="h-4 w-32 bg-gray-200 rounded"></div>
              <div class="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <div v-else-if="!filteredClients.length" class="text-center text-gray py-12">
          Belum ada data klien untuk kategori ini.
        </div>

        <div v-else class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          <div
            v-for="client in filteredClients"
            :key="client._id"
            class="group col-span-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200"
          >
            <div class="h-24 w-full flex items-center justify-center">
              <img
                class="max-h-full max-w-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                :src="client.logoUrl"
                :alt="client.name"
                width="160"
                height="96"
                loading="lazy"
                decoding="async"
              >
            </div>
            <h3 class="mt-4 text-sm font-medium text-black text-center line-clamp-2" :title="client.name">
              {{ client.name }}
            </h3>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
