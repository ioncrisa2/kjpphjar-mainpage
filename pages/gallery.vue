<script setup lang="ts">
useHead({
  title: "Galeri | KJPP HJA'R",
  meta: [{ name: 'description', content: 'Galeri foto kegiatan dan momen KJPP Henricus Judi Adrianto dan Rekan.' }],
})

const activeCategory = ref('all')
const visible = ref(false)
const currentIndex = ref(0)

const { data, refresh } = await useFetch('/api/gallery')

const categories = computed(() => ['all', ...(data.value?.categories || [])])

const filteredPhotos = computed(() => {
  const all = data.value?.items || []
  if (activeCategory.value === 'all') return all
  return all.filter((p: Record<string, string>) => p.category === activeCategory.value)
})

const lightboxImages = computed(() =>
  filteredPhotos.value.map((p: Record<string, string>) => ({ src: p.imageUrl, alt: p.title || "Galeri KJPP HJA'R" }))
)

function openLightbox(index: number) {
  currentIndex.value = index
  visible.value = true
}
</script>

<template>
  <div>
    <!-- Banner -->
    <div class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
      <div class="container">
        <div class="items-center py-10 md:flex md:h-[400px] md:py-0">
          <div class="heading mb-0 text-center ltr:md:text-left">
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

        <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
          <div
            v-for="(photo, index) in filteredPhotos"
            :key="photo._id"
            class="cursor-pointer overflow-hidden rounded-[24px]"
            data-aos="fade-up"
            data-aos-duration="800"
            @click="openLightbox(index)"
          >
            <img
              :src="photo.thumbnailUrl"
              :alt="photo.title || 'Galeri'"
              class="h-56 w-full object-cover transition duration-500 hover:scale-110"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Lightbox -->
        <ClientOnly>
          <VueEasyLightbox
            :visible="visible"
            :imgs="lightboxImages"
            :index="currentIndex"
            move-disabled
            loop
            @hide="visible = false"
          />
        </ClientOnly>
      </div>
    </section>
  </div>
</template>
