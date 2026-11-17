<script setup lang="ts">
const galleryTitle = "Galeri Kegiatan Inspeksi & Penilaian Lapangan | KJPP HJA'R"
const galleryDescription =
  "Dokumentasi kegiatan survei dan inspeksi lapangan tim penilai KJPP Henricus Judi Adrianto & Rekan pada berbagai objek properti, industri, dan aset."

useSeoMeta({
  title: galleryTitle,
  description: galleryDescription,
  ogTitle: galleryTitle,
  ogDescription: galleryDescription,
  twitterTitle: galleryTitle,
  twitterDescription: galleryDescription,
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
    <div class="pub-page-banner">
      <div class="container">
        <span class="pub-eyebrow">Momen &amp; Kegiatan</span>
        <h1 class="pub-h1">Galeri</h1>
      </div>
    </div>

    <section class="pub-section bg-[var(--paper)]">
      <div class="container">
        <UiBreadcrumbs :items="[{ label: 'Galeri' }]" class="mb-10" />
        <h2 class="pub-h2 mb-10">Valuing What Matters</h2>

        <!-- Category filter -->
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
            {{ cat === 'all' ? 'Semua' : cat }}
          </button>
        </div>

        <!-- Grid -->
        <div v-if="filteredPhotos.length === 0" class="py-16 text-[var(--muted)]">
          Belum ada foto di galeri.
        </div>

        <div v-else :key="activeCategory">
          <ClientOnly>
            <lightgallery
              :settings="{ speed: 500, plugins: plugins, download: false }"
              class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-8"
            >
              <a
                v-for="photo in filteredPhotos"
                :key="photo._id"
                :href="photo.imageUrl"
                :data-src="photo.imageUrl"
                :data-sub-html="photo.title"
                class="group block cursor-zoom-in"
              >
                <img
                  :src="photo.thumbnailUrl"
                  :alt="photo.title ? `${photo.title} – dokumentasi kegiatan KJPP HJA'R` : 'Dokumentasi kegiatan survei penilaian lapangan KJPP HJA\'R'"
                  class="aspect-[4/3] w-full rounded-[2px] bg-[var(--surface)] object-cover"
                  loading="lazy"
                />
                <span v-if="photo.title" class="mt-2 block text-[14px] leading-[1.4] text-[var(--muted)] transition-colors duration-150 group-hover:text-[var(--ink)]">{{ photo.title }}</span>
              </a>
            </lightgallery>
          </ClientOnly>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
@import 'lightgallery/css/lightgallery.css';
@import 'lightgallery/css/lg-zoom.css';
@import 'lightgallery/css/lg-thumbnail.css';
</style>
