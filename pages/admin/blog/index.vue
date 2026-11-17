<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'blog.view' })
useHead({ title: "Admin Blog | KJPP HJA'R" })

const { can } = useAdminAuth()
const viewMode = useAdminViewMode('blog', 'table')

// Tanpa blog.publish, artikel terbit/terjadwal dikunci (hanya editor yang bisa mengubah).
function isLocked(article: Record<string, any>) {
  return !can('blog.publish') && article.status !== 'draft' && article.status !== 'in_review'
}

function isPubliclyVisible(article: Record<string, any>) {
  if (article.status === 'published') return true
  if (article.status === 'scheduled' && article.publishedAt) {
    return new Date(article.publishedAt).getTime() <= Date.now()
  }
  return false
}

const page = ref(1)
const searchDraft = ref('')
const search = ref('')
const status = ref('')
const categoryId = ref('')
const featured = ref('')
const sort = ref('latest')
const busyId = ref('')

const { data: categoryData } = await useFetch('/api/admin/categories')
const categories = computed(() => categoryData.value?.items || [])
const { data, pending, refresh } = await useFetch('/api/admin/blog', {
  query: computed(() => ({
    page: page.value,
    limit: 10,
    q: search.value || undefined,
    status: status.value || undefined,
    categoryId: categoryId.value || undefined,
    featured: featured.value || undefined,
    sort: sort.value !== 'latest' ? sort.value : undefined,
  })),
})
const articles = computed(() => data.value?.items || [])
const summary = computed(() => data.value?.summary || {
  total: 0,
  published: 0,
  inReview: 0,
  draft: 0,
  scheduled: 0,
  featured: 0,
  totalViews: 0,
})
const activeFeatured = computed(() => data.value?.activeFeatured || null)

watch([status, categoryId, featured, sort], () => { page.value = 1 })

const hasActiveFilters = computed(() =>
  Boolean(search.value || status.value || categoryId.value || featured.value || sort.value !== 'latest'),
)

function applySearch() {
  search.value = searchDraft.value.trim()
  page.value = 1
}

function resetFilters() {
  searchDraft.value = ''
  search.value = ''
  status.value = ''
  categoryId.value = ''
  featured.value = ''
  sort.value = 'latest'
  page.value = 1
}

function filterByStatus(nextStatus: string) {
  status.value = status.value === nextStatus ? '' : nextStatus
}

function statusPresentation(article: Record<string, any>) {
  if (article.status === 'scheduled') {
    const isDue = article.publishedAt && new Date(article.publishedAt).getTime() <= Date.now()
    return isDue
      ? { label: 'Published · terjadwal', class: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300' }
      : { label: 'Terjadwal', class: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300' }
  }
  if (article.status === 'published') {
    return { label: 'Published', class: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300' }
  }
  if (article.status === 'in_review') {
    return { label: 'Siap Review', class: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300' }
  }
  return { label: 'Draft', class: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' }
}

const { ask } = useConfirm()
const toast = useToast()

async function toggleFeatured(article: Record<string, any>) {
  if (!can('blog.manage_all') || busyId.value) return
  busyId.value = article._id
  try {
    await $fetch(`/api/admin/blog/${article._id}`, {
      method: 'PATCH',
      body: { isFeatured: !article.isFeatured },
    })
    toast.success(article.isFeatured ? 'Artikel dilepas dari unggulan.' : 'Artikel ditandai sebagai unggulan.')
    await refresh()
  } catch (error: any) {
    toast.error(error?.data?.statusMessage || 'Gagal mengubah status unggulan.')
  } finally {
    busyId.value = ''
  }
}

async function quickSetStatus(article: Record<string, any>, nextStatus: 'published' | 'draft') {
  if (!can('blog.publish') || busyId.value) return
  busyId.value = article._id
  try {
    await $fetch(`/api/admin/blog/${article._id}`, {
      method: 'PATCH',
      body: { status: nextStatus },
    })
    toast.success(nextStatus === 'published' ? 'Artikel berhasil diterbitkan.' : 'Artikel dikembalikan ke draft.')
    await refresh()
  } catch (error: any) {
    toast.error(error?.data?.statusMessage || 'Gagal mengubah status artikel.')
  } finally {
    busyId.value = ''
  }
}

async function deleteItem(article: Record<string, any>) {
  const confirmed = await ask({
    title: 'Hapus Artikel',
    message: 'Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.',
    itemName: article.title || undefined,
    confirmText: 'Ya, Hapus',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/admin/blog/${article._id}`, { method: 'DELETE' })
    toast.success('Artikel berhasil dihapus.')
    if (articles.value.length === 1 && page.value > 1) page.value--
    else await refresh()
  } catch (error: any) {
    toast.error(error?.data?.statusMessage || 'Artikel gagal dihapus.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Blog & artikel</h1>
        <p class="mt-1 text-sm text-gray">
          {{ can('blog.manage_all') ? 'Kelola publikasi, review redaksi, kategori, SEO, dan performa artikel.' : 'Artikel yang Anda tulis. Ajukan sebagai Siap Review saat selesai agar editor meninjau.' }}
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <AdminViewSwitcher v-model="viewMode" />
        <NuxtLink v-if="can('blog.categories')" to="/admin/blog/categories" class="admin-btn-ghost">
          <Icon name="ph:folders-bold" /> Kategori
        </NuxtLink>
        <NuxtLink v-if="can('blog.create')" to="/admin/blog/create" class="admin-btn-primary">
          <Icon name="ph:plus-bold" /> Tulis artikel
        </NuxtLink>
      </div>
    </header>

    <!-- Ringkasan KPI -->
    <section class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Ringkasan blog">
      <button
        type="button"
        class="admin-card !p-4 text-left transition hover:border-primary/40"
        :class="status === '' && featured === '' ? 'ring-1 ring-primary/30' : ''"
        @click="resetFilters"
      >
        <p class="text-xs font-semibold text-gray">Total artikel</p>
        <p class="mt-1 text-2xl font-extrabold tabular-nums text-black dark:text-white">{{ summary.total }}</p>
      </button>
      <button
        type="button"
        class="admin-card !p-4 text-left transition hover:border-primary/40"
        :class="status === 'published' ? 'ring-2 ring-green-500/40' : ''"
        @click="filterByStatus('published')"
      >
        <p class="text-xs font-semibold text-green-700 dark:text-green-400">Published</p>
        <p class="mt-1 text-2xl font-extrabold tabular-nums text-black dark:text-white">{{ summary.published }}</p>
      </button>
      <button
        type="button"
        class="admin-card !p-4 text-left transition hover:border-primary/40"
        :class="status === 'in_review' ? 'ring-2 ring-indigo-500/40' : ''"
        @click="filterByStatus('in_review')"
      >
        <p class="text-xs font-semibold text-indigo-700 dark:text-indigo-400">Siap review</p>
        <p class="mt-1 text-2xl font-extrabold tabular-nums text-black dark:text-white">{{ summary.inReview }}</p>
      </button>
      <button
        type="button"
        class="admin-card !p-4 text-left transition hover:border-primary/40"
        :class="status === 'draft' ? 'ring-2 ring-amber-500/40' : ''"
        @click="filterByStatus('draft')"
      >
        <p class="text-xs font-semibold text-amber-700 dark:text-amber-400">Draft</p>
        <p class="mt-1 text-2xl font-extrabold tabular-nums text-black dark:text-white">{{ summary.draft }}</p>
      </button>
      <button
        type="button"
        class="admin-card !p-4 text-left transition hover:border-primary/40"
        :class="status === 'scheduled' ? 'ring-2 ring-blue-500/40' : ''"
        @click="filterByStatus('scheduled')"
      >
        <p class="text-xs font-semibold text-blue-700 dark:text-blue-400">Terjadwal</p>
        <p class="mt-1 text-2xl font-extrabold tabular-nums text-black dark:text-white">{{ summary.scheduled }}</p>
      </button>
      <div class="admin-card !p-4 text-left">
        <p class="text-xs font-semibold text-gray">Total views</p>
        <p class="mt-1 text-2xl font-extrabold tabular-nums text-black dark:text-white">{{ summary.totalViews.toLocaleString('id-ID') }}</p>
      </div>
    </section>

    <div
      v-if="can('blog.manage_all') && activeFeatured"
      class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-2.5 text-xs text-violet-950 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-200"
    >
      <div class="flex items-center gap-2 min-w-0">
        <Icon name="ph:star-fill" class="shrink-0 text-sm text-violet-600 dark:text-violet-300" />
        <span class="truncate">
          Banner unggulan aktif di halaman publik: <strong>{{ activeFeatured.title }}</strong>
          <span v-if="summary.featured > 1" class="opacity-80"> ({{ summary.featured }} artikel bertanda unggulan; hanya 1 terbaru yang tampil di banner).</span>
        </span>
      </div>
      <NuxtLink :to="`/blog/${activeFeatured.slug}`" target="_blank" class="shrink-0 font-bold hover:underline">
        Lihat banner
      </NuxtLink>
    </div>

    <section class="admin-card" aria-label="Filter artikel">
      <form class="grid gap-3 md:grid-cols-[minmax(220px,1fr)_165px_180px_150px_165px_auto]" @submit.prevent="applySearch">
        <label class="relative">
          <span class="sr-only">Cari artikel</span>
          <Icon name="ph:magnifying-glass-bold" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray" />
          <input v-model="searchDraft" type="search" class="admin-input !pl-11" placeholder="Cari judul, ringkasan, tag, penulis">
        </label>
        <label>
          <span class="sr-only">Filter status</span>
          <select v-model="status" class="admin-input">
            <option value="">Semua status</option>
            <option value="draft">Draft</option>
            <option value="in_review">Siap Review</option>
            <option value="published">Published</option>
            <option value="scheduled">Terjadwal</option>
          </select>
        </label>
        <label>
          <span class="sr-only">Filter kategori</span>
          <select v-model="categoryId" class="admin-input">
            <option value="">Semua kategori</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
          </select>
        </label>
        <label>
          <span class="sr-only">Filter unggulan</span>
          <select v-model="featured" class="admin-input">
            <option value="">Semua jenis</option>
            <option value="true">Unggulan</option>
            <option value="false">Reguler</option>
          </select>
        </label>
        <label>
          <span class="sr-only">Urutkan artikel</span>
          <select v-model="sort" class="admin-input">
            <option value="latest">Terbaru diubah</option>
            <option value="views">Terpopuler (views)</option>
            <option value="oldest">Terlama diubah</option>
          </select>
        </label>
        <div class="flex gap-2">
          <button type="submit" class="admin-btn-primary justify-center">Cari</button>
          <button v-if="hasActiveFilters" type="button" class="admin-btn-ghost !px-3" aria-label="Reset filter" @click="resetFilters">
            <Icon name="ph:x-bold" />
          </button>
        </div>
      </form>
    </section>

    <section class="admin-card !p-0 overflow-hidden">
      <div v-if="pending" class="space-y-3 p-6" aria-label="Memuat daftar artikel">
        <div v-for="index in 5" :key="index" class="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-white/10"></div>
      </div>
      <div v-else-if="!articles.length" class="px-6 py-14 text-center">
        <Icon name="ph:newspaper-clipping-bold" class="mx-auto text-5xl text-slate-300 dark:text-slate-600" />
        <h2 class="mt-4 text-lg font-bold text-black dark:text-white">{{ hasActiveFilters ? 'Tidak ada artikel yang cocok' : 'Belum ada artikel' }}</h2>
        <p class="mx-auto mt-2 max-w-md text-sm text-gray">{{ hasActiveFilters ? 'Ubah kata kunci atau reset filter untuk melihat artikel lain.' : 'Mulai dengan menulis artikel pertama untuk halaman publik.' }}</p>
        <button v-if="hasActiveFilters" type="button" class="admin-btn-ghost mt-5" @click="resetFilters">Reset filter</button>
        <NuxtLink v-else-if="can('blog.create')" to="/admin/blog/create" class="admin-btn-primary mt-5">Tulis artikel pertama</NuxtLink>
      </div>
      <div v-else-if="viewMode === 'table'" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-slate-50 dark:bg-white/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Artikel</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Kategori &amp; Penulis</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Performa</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Status</th>
              <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray/10 bg-white dark:bg-gray-dark">
            <tr v-for="article in articles" :key="article._id" class="transition hover:bg-slate-50/80 dark:hover:bg-white/5">
              <td class="px-6 py-4">
                <div class="flex min-w-[280px] items-center gap-4">
                  <div class="h-14 w-20 flex-none overflow-hidden rounded-lg bg-slate-100 dark:bg-white/5">
                    <img v-if="article.coverImageUrl" :src="article.coverImageUrl" :alt="article.title" class="h-full w-full object-cover">
                    <div v-else class="flex h-full items-center justify-center text-slate-300 dark:text-slate-600"><Icon name="ph:image-bold" class="text-2xl" /></div>
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="max-w-sm truncate font-bold text-black dark:text-white">{{ article.title }}</p>
                      <span v-if="article.isFeatured" class="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-800 dark:bg-violet-500/20 dark:text-violet-300">Unggulan</span>
                    </div>
                    <p class="mt-1 truncate text-xs text-gray">/blog/{{ article.slug }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-semibold text-black dark:text-white">{{ article.category?.name || 'Tanpa kategori' }}</p>
                <p class="mt-1 flex items-center gap-1 text-xs text-gray">
                  <Icon name="ph:user-circle-bold" class="shrink-0 text-primary" />
                  <span class="truncate max-w-[180px]">{{ article.author || 'Admin' }}</span>
                </p>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-semibold tabular-nums text-black dark:text-white">{{ article.views.toLocaleString('id-ID') }} views</div>
                <div class="mt-1 text-xs text-gray">{{ article.readingTime }} menit baca</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-bold" :class="statusPresentation(article).class">{{ statusPresentation(article).label }}</span>
                  <span v-if="article.editorialNote" class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-300" :title="article.editorialNote">
                    <Icon name="ph:chat-centered-text-bold" /> Catatan
                  </span>
                </div>
                <p v-if="article.publishedAt" class="mt-1.5 text-xs text-gray">{{ new Date(article.publishedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) }}</p>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <div class="inline-flex items-center gap-0.5">
                  <NuxtLink
                    v-if="isPubliclyVisible(article)"
                    :to="`/blog/${article.slug}`"
                    target="_blank"
                    class="inline-flex rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-black dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                    title="Lihat artikel di website"
                    :aria-label="`Lihat ${article.title} di website`"
                  >
                    <Icon name="ph:arrow-square-out-bold" class="text-lg" />
                  </NuxtLink>
                  <button
                    v-if="can('blog.manage_all')"
                    type="button"
                    :disabled="busyId === article._id"
                    class="inline-flex rounded-lg p-2 transition disabled:opacity-40"
                    :class="article.isFeatured ? 'text-violet-600 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-500/15' : 'text-slate-400 hover:bg-slate-100 hover:text-violet-600 dark:hover:bg-white/10'"
                    :title="article.isFeatured ? 'Lepas status unggulan' : 'Tandai sebagai unggulan'"
                    :aria-label="`Toggle unggulan ${article.title}`"
                    @click="toggleFeatured(article)"
                  >
                    <Icon :name="article.isFeatured ? 'ph:star-fill' : 'ph:star-bold'" class="text-lg" />
                  </button>
                  <button
                    v-if="can('blog.publish') && (article.status === 'draft' || article.status === 'in_review')"
                    type="button"
                    :disabled="busyId === article._id"
                    class="inline-flex rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-40 dark:text-emerald-400 dark:hover:bg-emerald-500/15"
                    title="Terbitkan sekarang"
                    :aria-label="`Terbitkan ${article.title}`"
                    @click="quickSetStatus(article, 'published')"
                  >
                    <Icon name="ph:paper-plane-tilt-bold" class="text-lg" />
                  </button>
                  <button
                    v-else-if="can('blog.publish') && article.status === 'published'"
                    type="button"
                    :disabled="busyId === article._id"
                    class="inline-flex rounded-lg p-2 text-amber-600 transition hover:bg-amber-50 disabled:opacity-40 dark:text-amber-400 dark:hover:bg-amber-500/15"
                    title="Kembalikan ke draft"
                    :aria-label="`Jadikan draft ${article.title}`"
                    @click="quickSetStatus(article, 'draft')"
                  >
                    <Icon name="ph:archive-box-bold" class="text-lg" />
                  </button>
                  <span v-if="isLocked(article)" class="inline-flex rounded-lg p-2 text-gray" title="Artikel sudah terbit atau terjadwal; hanya editor yang bisa mengubahnya." :aria-label="`${article.title} terkunci`">
                    <Icon name="ph:lock-simple-bold" class="text-lg" />
                  </span>
                  <NuxtLink v-else-if="can('blog.update')" :to="`/admin/blog/${article._id}`" class="inline-flex rounded-lg p-2 text-primary transition hover:bg-blue-50 dark:hover:bg-primary/15" :aria-label="`Edit ${article.title}`">
                    <Icon name="ph:pencil-simple-bold" class="text-lg" />
                  </NuxtLink>
                  <button v-if="can('blog.delete') && !isLocked(article)" type="button" class="inline-flex rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/15" :aria-label="`Hapus ${article.title}`" @click="deleteItem(article)">
                    <Icon name="ph:trash-bold" class="text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="article in articles"
          :key="article._id"
          class="flex flex-col overflow-hidden rounded-xl border border-gray/15 bg-white transition hover:border-primary/40 dark:border-white/10 dark:bg-gray-dark"
        >
          <div class="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-white/5">
            <img v-if="article.coverImageUrl" :src="article.coverImageUrl" :alt="article.title" class="h-full w-full object-cover">
            <div v-else class="flex h-full items-center justify-center text-slate-300 dark:text-slate-600">
              <Icon name="ph:image-bold" class="text-3xl" />
            </div>
            <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
              <span class="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-xs" :class="statusPresentation(article).class">
                {{ statusPresentation(article).label }}
              </span>
              <span v-if="article.isFeatured" class="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-800 shadow-xs dark:bg-violet-500/20 dark:text-violet-200">
                Unggulan
              </span>
            </div>
          </div>
          <div class="flex flex-1 flex-col p-4">
            <div class="flex items-center justify-between gap-2 text-xs">
              <p class="font-semibold text-primary">{{ article.category?.name || 'Tanpa kategori' }}</p>
              <span class="truncate text-gray">{{ article.author || 'Admin' }}</span>
            </div>
            <h2 class="mt-1 line-clamp-2 text-base font-bold text-black dark:text-white" :title="article.title">{{ article.title }}</h2>
            <p class="mt-1 truncate text-xs text-gray">/blog/{{ article.slug }}</p>
            <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray">
              <span>{{ article.views.toLocaleString('id-ID') }} views · {{ article.readingTime }} mnt</span>
              <span v-if="article.publishedAt">{{ new Date(article.publishedAt).toLocaleDateString('id-ID', { dateStyle: 'medium' }) }}</span>
            </div>
            <div class="mt-4 flex items-center justify-end gap-1 border-t border-gray/10 pt-3">
              <NuxtLink
                v-if="isPubliclyVisible(article)"
                :to="`/blog/${article.slug}`"
                target="_blank"
                class="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                title="Lihat di website"
              >
                <Icon name="ph:arrow-square-out-bold" class="text-base" />
              </NuxtLink>
              <span v-if="isLocked(article)" class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray" title="Artikel sudah terbit atau terjadwal; hanya editor yang bisa mengubahnya." :aria-label="`${article.title} terkunci`">
                <Icon name="ph:lock-simple-bold" class="text-base" />
                <span>Terkunci</span>
              </span>
              <NuxtLink v-else-if="can('blog.update')" :to="`/admin/blog/${article._id}`" class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary transition hover:bg-blue-50 dark:hover:bg-primary/10" :aria-label="`Edit ${article.title}`">
                <Icon name="ph:pencil-simple-bold" class="text-base" />
                <span>Edit</span>
              </NuxtLink>
              <button v-if="can('blog.delete') && !isLocked(article)" type="button" class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10" :aria-label="`Hapus ${article.title}`" @click="deleteItem(article)">
                <Icon name="ph:trash-bold" class="text-base" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </article>
      </div>

      <footer v-if="data?.totalPages && data.totalPages > 1" class="flex items-center justify-between border-t border-gray/10 px-6 py-4">
        <p class="text-sm text-gray">Halaman {{ page }} dari {{ data.totalPages }}</p>
        <div class="flex gap-2">
          <button class="admin-btn-ghost !px-3 !py-2" :disabled="page === 1" @click="page--">Sebelumnya</button>
          <button class="admin-btn-ghost !px-3 !py-2" :disabled="page === data.totalPages" @click="page++">Berikutnya</button>
        </div>
      </footer>
    </section>
  </div>
</template>
