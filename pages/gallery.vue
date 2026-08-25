<script setup lang="ts">
useHead({
  title: "Galeri | KJPP HJA'R",
  meta: [{ name: 'description', content: 'Galeri foto kegiatan dan momen KJPP Henricus Judi Adrianto dan Rekan.' }],
})

import Lightgallery from 'lightgallery/vue'
import lgZoom from 'lightgallery/plugins/zoom'
import lgThumbnail from 'lightgallery/plugins/thumbnail'

const plugins = [lgZoom, lgThumbnail]

const activeCategory = ref('all')

const { data } = await useFetch('/api/gallery')

const categories = computed(() => ['all', ...(data.value?.categories || [])])

const filteredPhotos = computed(() => {
  const all = data.value?.items || []
  if (activeCategory.value === 'all') return all
  return all.filter((p: Record<string, string>) => p.category === activeCategory.value)
})


</script>

<template>
  <div>
    <!-- Banner -->
    <div class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
      <div class="container">
        <div class="items-center py-10 md:flex md:h-[400px] md:py-0">
          <div class="heading mb-0 text-center md:text-left">
            <h4 class="!text-white">Galeri</h4>
          </div>
        </div>
      </div>
    </div>

    <section class="py-14 lg:py-[100px]">
      <div class="container">
        <div class="heading text-center">
          <h6>Momen & Kegiatan</h6>
          <h4>Valuing What Matters</h4>
        </div>

        <!-- Category filter -->
        <div v-if="categories.length > 1" class="mb-8 flex flex-wrap justify-center gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            class="rounded-full border px-5 py-2 text-sm font-semibold transition"
            :class="activeCategory === cat
              ? 'border-primary bg-primary text-black'
              : 'border-gray/30 text-gray hover:border-primary hover:text-primary'"
            @click="activeCategory = cat"
          >
            {{ cat === 'all' ? 'Semua' : cat }}
          </button>
        </div>

        <!-- Grid -->
        <div v-if="filteredPhotos.length === 0" class="text-center py-16 text-gray">
          Belum ada foto di galeri.
        </div>

        <div v-else :key="activeCategory">
          <ClientOnly>
            <lightgallery
              :settings="{ speed: 500, plugins: plugins, download: false }"
              class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6"
            >
              <a
                v-for="photo in filteredPhotos"
                :key="photo._id"
                :href="photo.imageUrl"
                :data-src="photo.imageUrl"
                :data-sub-html="photo.title"
                class="cursor-pointer overflow-hidden rounded-[24px] block"
              >
                <img
                  :src="photo.thumbnailUrl"
                  :alt="photo.title || 'Galeri'"
                  class="h-56 w-full object-cover transition duration-500 hover:scale-110"
                  loading="lazy"
                />
              </a>
            </lightgallery>
          </ClientOnly>
        </div>
      </div>
    </section>
  </div>
</template>
