<script setup lang="ts">
const blogIndexTitle = "Blog & Publikasi Seputar Penilaian Publik | KJPP HJA'R"
const blogIndexDescription =
  "Artikel, panduan, dan wawasan praktis dari tim penilai publik KJPP HJA'R mengenai penilaian properti, valuasi bisnis, studi kelayakan, dan regulasi SPI."

useSeoMeta({
  title: blogIndexTitle,
  description: blogIndexDescription,
  ogTitle: blogIndexTitle,
  ogDescription: blogIndexDescription,
  twitterTitle: blogIndexTitle,
  twitterDescription: blogIndexDescription,
})

const route = useRoute()
const router = useRouter()
const initialPage = Number.parseInt(String(route.query.page || '1'), 10)
const page = ref(Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1)
const searchInput = ref(String(route.query.q || ''))
const search = refDebounced(searchInput, 350)
const activeCategory = ref(String(route.query.category || ''))
const activeTag = ref(String(route.query.tag || ''))
const activeAuthor = ref(String(route.query.author || ''))
const sortBy = ref(String(route.query.sort || '') === 'popular' ? 'popular' : 'latest')

const { data: categoryData } = await useFetch('/api/categories')
const categories = computed(() => categoryData.value?.items || [])
const { data: featuredData } = await useFetch('/api/blog', {
  query: { featured: 'true', page: 1, limit: 1 },
})
const featured = computed(() => featuredData.value?.items?.[0] || null)
const hasFilters = computed(() => Boolean(search.value || activeCategory.value || activeTag.value || activeAuthor.value || sortBy.value !== 'latest'))
const showFeatured = computed(() => Boolean(featured.value && page.value === 1 && !hasFilters.value))
const excludeFeatured = computed(() => Boolean(featured.value && !hasFilters.value))

const { data, pending, error: listError, refresh } = await useFetch('/api/blog', {
  query: computed(() => ({
    page: page.value,
    limit: 9,
    q: search.value || undefined,
    category: activeCategory.value || undefined,
    tag: activeTag.value || undefined,
    author: activeAuthor.value || undefined,
    sort: sortBy.value === 'popular' ? 'popular' : undefined,
    exclude: excludeFeatured.value ? featured.value?._id : undefined,
  })),
})
const articles = computed(() => data.value?.items || [])
const activeAuthorLabel = computed(() => data.value?.activeAuthorName || activeAuthor.value)

watch([search, activeCategory, activeTag, activeAuthor, sortBy], () => { page.value = 1 })
watch([page, search, activeCategory, activeTag, activeAuthor, sortBy], () => {
  if (!import.meta.client) return
  router.replace({
    query: {
      page: page.value > 1 ? String(page.value) : undefined,
      q: search.value || undefined,
      category: activeCategory.value || undefined,
      tag: activeTag.value || undefined,
      author: activeAuthor.value || undefined,
      sort: sortBy.value === 'popular' ? 'popular' : undefined,
    },
  })
})
watch(page, () => {
  if (import.meta.client) window.scrollTo({ top: 360, behavior: 'smooth' })
})

function resetFilters() {
  searchInput.value = ''
  activeCategory.value = ''
  activeTag.value = ''
  activeAuthor.value = ''
  sortBy.value = 'latest'
}

function selectTag(tag: string) {
  activeTag.value = activeTag.value === tag ? '' : tag
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="bg-[var(--paper)]">
    <section class="pub-page-banner">
      <div class="container">
        <span class="pub-eyebrow">Blog &amp; Publikasi</span>
        <h1 class="pub-h1">Wawasan untuk keputusan bernilai</h1>
        <p class="pub-lead">Berita, panduan, dan perspektif praktis dari tim KJPP HJA'R mengenai penilaian properti, bisnis, dan konsultasi.</p>
      </div>
    </section>

    <main class="pub-section">
      <div class="container">
        <UiBreadcrumbs :items="[{ label: 'Blog & Publikasi' }]" class="mb-10" />

        <NuxtLink
          v-if="showFeatured"
          :to="`/blog/${featured.slug}`"
          class="group grid overflow-hidden rounded-[2px] bg-[#0B1640] md:grid-cols-[1.05fr_.95fr]"
        >
          <div class="relative min-h-[280px] overflow-hidden bg-[#0D162B] md:order-2 md:min-h-[390px]">
            <img v-if="featured.coverImageUrl" :src="featured.coverImageUrl" :alt="`Ilustrasi artikel unggulan: ${featured.title}`" class="absolute inset-0 h-full w-full object-cover">
            <div v-else class="absolute inset-0 flex items-center justify-center text-white/30"><Icon name="ph:newspaper-clipping-bold" class="text-7xl" /></div>
          </div>
          <div class="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
            <div class="flex flex-wrap items-center gap-3 text-[14px] font-bold text-[#47BDFF]">
              <span>Artikel unggulan</span>
              <span v-if="featured.category" class="text-[#CBD5E1]">· {{ featured.category.name }}</span>
            </div>
            <h2 class="pub-serif mt-4 text-[24px] leading-[1.25] text-white lg:text-[32px]">{{ featured.title }}</h2>
            <p class="mt-4 max-w-[65ch] text-[16px] leading-[1.6] text-[#CBD5E1]">{{ featured.excerpt }}</p>
            <div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] tabular-nums text-[#CBD5E1]">
              <span>{{ formatDate(featured.publishedAt || featured.createdAt) }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ featured.readingTime }} menit baca</span>
            </div>
            <span class="mt-8 inline-block font-bold text-[#47BDFF] group-hover:underline">Baca artikel →</span>
          </div>
        </NuxtLink>

        <section class="mt-16 border-b border-[var(--rule)] pb-8" aria-labelledby="article-filter-heading">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="article-filter-heading" class="pub-h2">Jelajahi artikel</h2>
              <p class="mt-2 text-[16px] text-[var(--muted)]">Temukan topik berdasarkan kata kunci, kategori, atau tag.</p>
            </div>
            <button v-if="hasFilters" type="button" class="pub-link text-[14px] font-bold" @click="resetFilters">Reset semua filter</button>
          </div>

          <div class="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_200px]">
            <label class="relative">
              <span class="sr-only">Cari artikel</span>
              <Icon name="ph:magnifying-glass-bold" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input v-model="searchInput" type="search" class="w-full rounded-[2px] border border-[var(--rule)] bg-[var(--surface)] py-3 pl-11 pr-4 text-[16px] text-[var(--ink)] outline-none transition-colors duration-150 placeholder:text-[var(--muted)] focus:border-[var(--brand-navy)] focus:ring-2 focus:ring-[#47BDFF]/40" placeholder="Cari judul, ringkasan, atau tag">
            </label>
            <label>
              <span class="sr-only">Urutkan artikel</span>
              <select v-model="sortBy" class="w-full rounded-[2px] border border-[var(--rule)] bg-[var(--surface)] px-4 py-3 text-[16px] font-bold text-[var(--ink)] outline-none transition-colors duration-150 focus:border-[var(--brand-navy)] focus:ring-2 focus:ring-[#47BDFF]/40">
                <option value="latest">Terbaru</option>
                <option value="popular">Terpopuler</option>
              </select>
            </label>
          </div>

          <div v-if="categories.length" class="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter kategori artikel">
            <button
              type="button"
              class="pub-chip"
              :class="!activeCategory ? 'pub-chip-active' : 'pub-chip-idle'"
              :aria-pressed="!activeCategory"
              @click="activeCategory = ''"
            >
              Semua kategori
            </button>
            <button
              v-for="category in categories"
              :key="category._id"
              type="button"
              class="pub-chip"
              :class="activeCategory === category.slug ? 'pub-chip-active' : 'pub-chip-idle'"
              :aria-pressed="activeCategory === category.slug"
              @click="activeCategory = activeCategory === category.slug ? '' : category.slug"
            >
              {{ category.name }}
            </button>
          </div>

          <div v-if="activeTag || activeAuthor" class="mt-4 flex flex-wrap items-center gap-2 text-[14px]">
            <span class="text-[var(--muted)]">Filter aktif:</span>
            <button v-if="activeTag" type="button" class="pub-chip pub-chip-idle inline-flex items-center gap-1" @click="activeTag = ''">#{{ activeTag }} <Icon name="ph:x-bold" aria-hidden="true" /></button>
            <button v-if="activeAuthor" type="button" class="pub-chip pub-chip-idle inline-flex items-center gap-1" @click="activeAuthor = ''">Penulis: {{ activeAuthorLabel }} <Icon name="ph:x-bold" aria-hidden="true" /></button>
          </div>
        </section>

        <div v-if="pending" class="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3" aria-label="Memuat artikel">
          <div v-for="index in 6" :key="index" class="pub-box overflow-hidden">
            <div class="h-48 animate-pulse bg-[var(--rule)]/40"></div>
            <div class="space-y-3 p-6"><div class="h-4 w-24 animate-pulse bg-[var(--rule)]/40"></div><div class="h-6 animate-pulse bg-[var(--rule)]/40"></div><div class="h-16 animate-pulse bg-[var(--rule)]/40"></div></div>
          </div>
        </div>

        <div v-else-if="listError" class="py-20" role="alert">
          <h2 class="pub-serif text-[24px] text-[var(--ink)]">Artikel gagal dimuat</h2>
          <p class="mt-2 max-w-md text-[16px] leading-[1.6] text-[var(--muted)]">Koneksi ke server sedang bermasalah. Coba muat ulang daftar artikel.</p>
          <button type="button" class="pub-btn mt-6" @click="refresh()">Coba lagi</button>
        </div>

        <div v-else-if="!articles.length" class="py-20">
          <h2 class="pub-serif text-[24px] text-[var(--ink)]">{{ hasFilters ? 'Artikel tidak ditemukan' : 'Belum ada artikel lainnya' }}</h2>
          <p class="mt-2 max-w-md text-[16px] leading-[1.6] text-[var(--muted)]">{{ hasFilters ? 'Coba kata kunci atau kategori lain untuk memperluas hasil pencarian.' : 'Kunjungi kembali halaman ini untuk publikasi berikutnya.' }}</p>
          <button v-if="hasFilters" type="button" class="pub-btn mt-6" @click="resetFilters">Reset filter</button>
        </div>

        <div v-else class="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          <article v-for="article in articles" :key="article._id" class="group flex min-h-full flex-col border-t border-[var(--rule)] pt-6">
            <NuxtLink :to="`/blog/${article.slug}`" class="relative block aspect-[16/10] overflow-hidden rounded-[2px] bg-[var(--surface)]">
              <img v-if="article.coverImageUrl" :src="article.coverImageUrl" :alt="`Ilustrasi artikel: ${article.title}`" loading="lazy" class="h-full w-full object-cover">
              <div v-else class="flex h-full items-center justify-center text-[var(--rule)]"><Icon name="ph:image-bold" class="text-5xl" /></div>
            </NuxtLink>
            <div class="flex flex-1 flex-col pt-5">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-[var(--muted)]">
                <button v-if="article.category" type="button" class="pub-link font-bold" @click="activeCategory = article.category.slug">{{ article.category.name }}</button>
                <span class="tabular-nums">{{ article.readingTime }} menit baca</span>
              </div>
              <h2 class="pub-serif mt-3 text-[20px] leading-[1.3] text-[var(--ink)]">
                <NuxtLink :to="`/blog/${article.slug}`" class="transition-colors duration-150 hover:text-[var(--brand-navy)]">{{ article.title }}</NuxtLink>
              </h2>
              <p class="mt-3 text-[16px] leading-[1.6] text-[var(--muted)]">{{ article.excerpt }}</p>
              <div v-if="article.tags.length" class="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                <button v-for="tag in article.tags.slice(0, 3)" :key="tag" type="button" class="text-[14px] text-[var(--muted)] transition-colors duration-150 hover:text-[var(--brand-navy)]" @click="selectTag(tag)">#{{ tag }}</button>
              </div>
              <div class="mt-auto flex items-center justify-between gap-3 border-t border-[var(--rule)] pt-4 text-[14px] text-[var(--muted)]" :class="article.tags.length ? 'mt-5' : 'mt-6'">
                <div class="flex min-w-0 items-center gap-2 pr-2">
                  <img
                    v-if="article.leader?.photoUrl"
                    :src="article.leader.photoUrl"
                    :alt="`Foto penulis ${article.author}`"
                    width="24"
                    height="24"
                    class="h-6 w-6 shrink-0 rounded-[2px] object-cover"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    class="truncate text-left font-bold text-[var(--ink)] transition-colors duration-150 hover:text-[var(--brand-navy)]"
                    :title="`Lihat artikel oleh ${article.author}`"
                    @click="activeAuthor = article.leader?._id || article.author"
                  >
                    {{ article.author }}
                  </button>
                </div>
                <span class="shrink-0 tabular-nums">{{ formatDate(article.publishedAt || article.createdAt) }}</span>
              </div>
            </div>
          </article>
        </div>

        <nav v-if="data?.totalPages && data.totalPages > 1" class="mt-16 flex items-center justify-center gap-3" aria-label="Pagination artikel">
          <button class="pub-btn-ghost disabled:cursor-not-allowed disabled:opacity-40" :disabled="page === 1" @click="page--">Sebelumnya</button>
          <span class="px-2 text-[14px] font-bold tabular-nums text-[var(--muted)]">{{ page }} / {{ data.totalPages }}</span>
          <button class="pub-btn-ghost disabled:cursor-not-allowed disabled:opacity-40" :disabled="page === data.totalPages" @click="page++">Berikutnya</button>
        </nav>
      </div>
    </main>
  </div>
</template>
