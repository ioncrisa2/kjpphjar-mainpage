<script setup lang="ts">
const clientsTitle = "Rekan & Klien Institusi Perbankan, BUMN & Daerah | KJPP HJA'R"
const clientsDescription =
  "Daftar rekanan perbankan, BUMN, BUMD, pemerintah daerah, dan korporasi swasta yang mempercayakan jasa penilaian publik kepada KJPP HJA'R Palembang."

useSeoMeta({
  title: clientsTitle,
  description: clientsDescription,
  ogTitle: clientsTitle,
  ogDescription: clientsDescription,
  twitterTitle: clientsTitle,
  twitterDescription: clientsDescription,
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
    <div class="pub-page-banner">
      <div class="container">
        <span class="pub-eyebrow">Rekan &amp; Klien Institusi</span>
        <h1 class="pub-h1">Rekan dan Client</h1>
      </div>
    </div>

    <!-- Content Section -->
    <div class="pub-section bg-[var(--paper)]">
      <div class="container">
        <UiBreadcrumbs :items="[{ label: 'Rekan dan Klien' }]" class="mb-10" />

        <h2 class="pub-h2 mb-10 max-w-4xl">
          Rekan dan Client yang pernah menggunakan Jasa KJPP Henricus Judi Adrianto dan Rekan
        </h2>

        <!-- Filter Tabs -->
        <div v-if="categories.length > 1" class="mb-10 flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="pub-chip"
            :class="activeCategory === cat ? 'pub-chip-active' : 'pub-chip-idle'"
            :aria-pressed="activeCategory === cat"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Grid Klien -->
        <div v-if="pending" class="grid grid-cols-2 gap-px sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          <div v-for="i in 12" :key="i" class="h-40 animate-pulse bg-[var(--surface)]" />
        </div>

        <div v-else-if="!filteredClients.length" class="py-12 text-[var(--muted)]">
          Belum ada data klien untuk kategori ini.
        </div>

        <ul v-else class="grid grid-cols-2 border-l border-t border-[var(--rule)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          <li
            v-for="client in filteredClients"
            :key="client._id"
            class="group flex flex-col items-center justify-center border-b border-r border-[var(--rule)] bg-[var(--surface)] p-6"
          >
            <div class="flex h-20 w-full items-center justify-center">
              <img
                class="max-h-16 max-w-full object-contain grayscale opacity-70 transition duration-150 group-hover:grayscale-0 group-hover:opacity-100"
                :src="client.logoUrl"
                :alt="`Logo ${client.name} – rekan dan klien KJPP HJA'R`"
                width="160"
                height="96"
                loading="lazy"
                decoding="async"
              >
            </div>
            <h3 class="mt-4 text-center text-[14px] leading-[1.4] text-[var(--ink)]">
              {{ client.name }}
            </h3>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
