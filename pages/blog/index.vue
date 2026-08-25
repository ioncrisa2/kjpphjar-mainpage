<script setup lang="ts">
useHead({
  title: "Blog & Publikasi | KJPP HJA'R",
  meta: [
    { name: 'description', content: "Artikel, berita, dan wawasan terbaru dari KJPP HJA'R seputar properti, penilaian, dan konsultasi." },
  ],
})

const route = useRoute()
const router = useRouter()
const initialPage = Number.parseInt(String(route.query.page || '1'), 10)
const page = ref(Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1)
const searchInput = ref(String(route.query.q || ''))
const search = refDebounced(searchInput, 350)
const activeCategory = ref(String(route.query.category || ''))
const activeTag = ref(String(route.query.tag || ''))

const { data: categoryData } = await useFetch('/api/categories')
const categories = computed(() => categoryData.value?.items || [])
const { data: featuredData } = await useFetch('/api/blog', {
  query: { featured: 'true', page: 1, limit: 1 },
})
const featured = computed(() => featuredData.value?.items?.[0] || null)
const hasFilters = computed(() => Boolean(search.value || activeCategory.value || activeTag.value))
const showFeatured = computed(() => Boolean(featured.value && page.value === 1 && !hasFilters.value))
const excludeFeatured = computed(() => Boolean(featured.value && !hasFilters.value))

const { data, pending, error: listError, refresh } = await useFetch('/api/blog', {
  query: computed(() => ({
    page: page.value,
    limit: 9,
    q: search.value || undefined,
    category: activeCategory.value || undefined,
    tag: activeTag.value || undefined,
    exclude: excludeFeatured.value ? featured.value?._id : undefined,
  })),
})
const articles = computed(() => data.value?.items || [])

watch([search, activeCategory, activeTag], () => { page.value = 1 })
watch([page, search, activeCategory, activeTag], () => {
  if (!import.meta.client) return
  router.replace({
    query: {
      page: page.value > 1 ? String(page.value) : undefined,
      q: search.value || undefined,
      category: activeCategory.value || undefined,
      tag: activeTag.value || undefined,
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
}

function selectTag(tag: string) {
  activeTag.value = activeTag.value === tag ? '' : tag
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="bg-white dark:bg-gray-dark">
    <section class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
      <div class="container flex min-h-[300px] items-center py-12 md:min-h-[400px]">
        <div class="max-w-3xl text-center md:text-left">
          <h1 class="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[46px] lg:leading-[1.15]">Wawasan untuk keputusan bernilai</h1>
          <p class="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">Berita, panduan, dan perspektif praktis dari tim KJPP HJA'R mengenai penilaian properti, bisnis, dan konsultasi.</p>
        </div>
      </div>
    </section>

    <main class="py-14 sm:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NuxtLink
          v-if="showFeatured"
          :to="`/blog/${featured.slug}`"
          class="group grid overflow-hidden rounded-2xl bg-black md:grid-cols-[1.05fr_.95fr]"
        >
          <div class="relative min-h-[280px] overflow-hidden bg-slate-800 md:order-2 md:min-h-[390px]">
            <img v-if="featured.coverImageUrl" :src="featured.coverImageUrl" :alt="featured.title" class="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]">
            <div v-else class="absolute inset-0 flex items-center justify-center text-white/30"><Icon name="ph:newspaper-clipping-bold" class="text-7xl" /></div>
          </div>
          <div class="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <div class="flex flex-wrap items-center gap-3 text-sm font-semibold text-primary">
              <span class="rounded-full bg-primary/15 px-3 py-1">Artikel unggulan</span>
              <span v-if="featured.category">{{ featured.category.name }}</span>
            </div>
            <h2 class="mt-5 text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">{{ featured.title }}</h2>
            <p class="mt-4 line-clamp-3 max-w-[65ch] text-base leading-7 text-white/70">{{ featured.excerpt }}</p>
            <div class="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/65">
              <span class="inline-flex items-center gap-1.5"><Icon name="ph:calendar-blank-bold" /> {{ formatDate(featured.publishedAt || featured.createdAt) }}</span>
              <span class="inline-flex items-center gap-1.5"><Icon name="ph:clock-bold" /> {{ featured.readingTime }} menit baca</span>
            </div>
            <span class="mt-8 inline-flex items-center gap-2 font-bold text-primary">Baca artikel <Icon name="ph:arrow-right-bold" class="transition-transform group-hover:translate-x-1" /></span>
          </div>
        </NuxtLink>

        <section class="mt-12 border-b border-gray/10 pb-8 dark:border-white/10" aria-labelledby="article-filter-heading">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="article-filter-heading" class="text-2xl font-extrabold text-black dark:text-white sm:text-3xl">Jelajahi artikel</h2>
              <p class="mt-2 text-sm text-gray dark:text-slate-300">Temukan topik berdasarkan kata kunci, kategori, atau tag.</p>
            </div>
            <button v-if="hasFilters" type="button" class="text-sm font-bold text-primary hover:underline" @click="resetFilters">Reset semua filter</button>
          </div>

          <div class="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]">
            <label class="relative">
              <span class="sr-only">Cari artikel</span>
              <Icon name="ph:magnifying-glass-bold" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-slate-300" />
              <input v-model="searchInput" type="search" class="w-full rounded-xl border border-gray/20 bg-white py-3 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-gray focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/15 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-400" placeholder="Cari judul, ringkasan, atau tag">
            </label>
            <label>
              <span class="sr-only">Pilih kategori</span>
              <select v-model="activeCategory" class="w-full rounded-xl border border-gray/20 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/15 dark:bg-slate-900 dark:text-white">
                <option value="">Semua kategori</option>
                <option v-for="category in categories" :key="category._id" :value="category.slug">{{ category.name }}</option>
              </select>
            </label>
          </div>

          <div v-if="activeTag" class="mt-4 flex items-center gap-2 text-sm">
            <span class="text-gray dark:text-slate-300">Tag aktif:</span>
            <button type="button" class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 font-semibold text-blue-800 dark:bg-blue-400/15 dark:text-blue-200" @click="activeTag = ''">#{{ activeTag }} <Icon name="ph:x-bold" /></button>
          </div>
        </section>

        <div v-if="pending" class="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3" aria-label="Memuat artikel">
          <div v-for="index in 6" :key="index" class="overflow-hidden rounded-xl border border-gray/10 dark:border-white/10 dark:bg-slate-900">
            <div class="h-48 animate-pulse bg-slate-100 dark:bg-white/10"></div>
            <div class="space-y-3 p-6"><div class="h-4 w-24 animate-pulse rounded bg-slate-100 dark:bg-white/10"></div><div class="h-6 animate-pulse rounded bg-slate-100 dark:bg-white/10"></div><div class="h-16 animate-pulse rounded bg-slate-100 dark:bg-white/10"></div></div>
          </div>
        </div>

        <div v-else-if="listError" class="py-20 text-center" role="alert">
          <Icon name="ph:warning-circle-bold" class="mx-auto text-5xl text-amber-500" />
          <h2 class="mt-5 text-xl font-extrabold text-black dark:text-white">Artikel gagal dimuat</h2>
          <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray dark:text-slate-300">Koneksi ke server sedang bermasalah. Coba muat ulang daftar artikel.</p>
          <button type="button" class="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-black transition hover:bg-secondary hover:text-white" @click="refresh()">Coba lagi</button>
        </div>

        <div v-else-if="!articles.length" class="py-20 text-center">
          <Icon name="ph:magnifying-glass-bold" class="mx-auto text-5xl text-slate-300" />
          <h2 class="mt-5 text-xl font-extrabold text-black dark:text-white">{{ hasFilters ? 'Artikel tidak ditemukan' : 'Belum ada artikel lainnya' }}</h2>
          <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-gray dark:text-slate-300">{{ hasFilters ? 'Coba kata kunci atau kategori lain untuk memperluas hasil pencarian.' : 'Kunjungi kembali halaman ini untuk publikasi berikutnya.' }}</p>
          <button v-if="hasFilters" type="button" class="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-black transition hover:bg-secondary hover:text-white" @click="resetFilters">Reset filter</button>
        </div>

        <div v-else class="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          <article v-for="article in articles" :key="article._id" class="group flex min-h-full flex-col overflow-hidden rounded-xl border border-gray/15 bg-white transition duration-200 hover:border-primary/60 dark:border-white/10 dark:bg-slate-900">
            <NuxtLink :to="`/blog/${article.slug}`" class="relative block h-52 overflow-hidden bg-slate-100 dark:bg-white/5">
              <img v-if="article.coverImageUrl" :src="article.coverImageUrl" :alt="article.title" loading="lazy" class="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]">
              <div v-else class="flex h-full items-center justify-center text-slate-300"><Icon name="ph:image-bold" class="text-5xl" /></div>
            </NuxtLink>
            <div class="flex flex-1 flex-col p-6">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-gray dark:text-slate-300">
                <button v-if="article.category" type="button" class="text-primary hover:underline" @click="activeCategory = article.category.slug">{{ article.category.name }}</button>
                <span>{{ article.readingTime }} menit baca</span>
              </div>
              <h2 class="mt-3 text-xl font-extrabold leading-snug text-black dark:text-white">
                <NuxtLink :to="`/blog/${article.slug}`" class="transition hover:text-primary">{{ article.title }}</NuxtLink>
              </h2>
              <p class="mt-3 line-clamp-3 text-sm leading-6 text-gray dark:text-slate-300">{{ article.excerpt }}</p>
              <div v-if="article.tags.length" class="mt-4 flex flex-wrap gap-1.5">
                <button v-for="tag in article.tags.slice(0, 3)" :key="tag" type="button" class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-800 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-blue-400/15 dark:hover:text-blue-200" @click="selectTag(tag)">#{{ tag }}</button>
              </div>
              <div class="mt-auto flex items-center justify-between border-t border-gray/10 pt-5 text-xs text-gray dark:border-white/10 dark:text-slate-300" :class="article.tags.length ? 'mt-5' : 'mt-6'">
                <span>{{ formatDate(article.publishedAt || article.createdAt) }}</span>
                <span class="inline-flex items-center gap-1"><Icon name="ph:eye-bold" /> {{ article.views.toLocaleString('id-ID') }}</span>
              </div>
            </div>
          </article>
        </div>

        <nav v-if="data?.totalPages && data.totalPages > 1" class="mt-14 flex items-center justify-center gap-3" aria-label="Pagination artikel">
          <button class="rounded-xl border border-gray/20 px-4 py-2.5 text-sm font-bold text-black transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-white" :disabled="page === 1" @click="page--">Sebelumnya</button>
          <span class="px-2 text-sm font-semibold text-gray dark:text-slate-300">{{ page }} / {{ data.totalPages }}</span>
          <button class="rounded-xl border border-gray/20 px-4 py-2.5 text-sm font-bold text-black transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-white" :disabled="page === data.totalPages" @click="page++">Berikutnya</button>
        </nav>
      </div>
    </main>
  </div>
</template>
