<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Admin Blog | KJPP HJA'R" })

const page = ref(1)
const searchDraft = ref('')
const search = ref('')
const status = ref('')
const categoryId = ref('')

const { data: categoryData } = await useFetch('/api/admin/categories')
const categories = computed(() => categoryData.value?.items || [])
const { data, pending, refresh } = await useFetch('/api/admin/blog', {
  query: computed(() => ({
    page: page.value,
    limit: 10,
    q: search.value || undefined,
    status: status.value || undefined,
    categoryId: categoryId.value || undefined,
  })),
})
const articles = computed(() => data.value?.items || [])

watch([status, categoryId], () => { page.value = 1 })

function applySearch() {
  search.value = searchDraft.value.trim()
  page.value = 1
}

function resetFilters() {
  searchDraft.value = ''
  search.value = ''
  status.value = ''
  categoryId.value = ''
  page.value = 1
}

function statusPresentation(article: Record<string, any>) {
  if (article.status === 'scheduled') {
    const isDue = article.publishedAt && new Date(article.publishedAt).getTime() <= Date.now()
    return isDue
      ? { label: 'Published · terjadwal', class: 'bg-green-100 text-green-800' }
      : { label: 'Terjadwal', class: 'bg-blue-100 text-blue-800' }
  }
  if (article.status === 'published') return { label: 'Published', class: 'bg-green-100 text-green-800' }
  return { label: 'Draft', class: 'bg-amber-100 text-amber-800' }
}

async function deleteItem(article: Record<string, any>) {
  if (!confirm(`Hapus artikel “${article.title}”? Tindakan ini tidak dapat dibatalkan.`)) return
  try {
    await $fetch(`/api/admin/blog/${article._id}`, { method: 'DELETE' })
    if (articles.value.length === 1 && page.value > 1) page.value--
    else await refresh()
  } catch (error: any) {
    alert(error?.data?.statusMessage || 'Artikel gagal dihapus.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Blog & artikel</h1>
        <p class="mt-1 text-sm text-gray">Kelola publikasi, kategori, SEO, dan performa artikel.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <NuxtLink to="/admin/blog/categories" class="admin-btn-ghost">
          <Icon name="ph:folders-bold" /> Kategori
        </NuxtLink>
        <NuxtLink to="/admin/blog/create" class="admin-btn-primary">
          <Icon name="ph:plus-bold" /> Tulis artikel
        </NuxtLink>
      </div>
    </header>

    <section class="admin-card" aria-label="Filter artikel">
      <form class="grid gap-3 md:grid-cols-[minmax(240px,1fr)_180px_200px_auto]" @submit.prevent="applySearch">
        <label class="relative">
          <span class="sr-only">Cari artikel</span>
          <Icon name="ph:magnifying-glass-bold" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray" />
          <input v-model="searchDraft" type="search" class="admin-input !pl-11" placeholder="Cari judul, ringkasan, atau tag">
        </label>
        <label>
          <span class="sr-only">Filter status</span>
          <select v-model="status" class="admin-input">
            <option value="">Semua status</option>
            <option value="draft">Draft</option>
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
        <div class="flex gap-2">
          <button type="submit" class="admin-btn-primary justify-center">Cari</button>
          <button v-if="search || status || categoryId" type="button" class="admin-btn-ghost !px-3" aria-label="Reset filter" @click="resetFilters">
            <Icon name="ph:x-bold" />
          </button>
        </div>
      </form>
    </section>

    <section class="admin-card !p-0 overflow-hidden">
      <div v-if="pending" class="space-y-3 p-6" aria-label="Memuat daftar artikel">
        <div v-for="index in 5" :key="index" class="h-14 animate-pulse rounded-xl bg-slate-100"></div>
      </div>
      <div v-else-if="!articles.length" class="px-6 py-14 text-center">
        <Icon name="ph:newspaper-clipping-bold" class="mx-auto text-5xl text-slate-300" />
        <h2 class="mt-4 text-lg font-bold text-black dark:text-white">{{ search || status || categoryId ? 'Tidak ada artikel yang cocok' : 'Belum ada artikel' }}</h2>
        <p class="mx-auto mt-2 max-w-md text-sm text-gray">{{ search || status || categoryId ? 'Ubah kata kunci atau reset filter untuk melihat artikel lain.' : 'Mulai dengan menulis artikel pertama untuk halaman publik.' }}</p>
        <button v-if="search || status || categoryId" type="button" class="admin-btn-ghost mt-5" @click="resetFilters">Reset filter</button>
        <NuxtLink v-else to="/admin/blog/create" class="admin-btn-primary mt-5">Tulis artikel pertama</NuxtLink>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Artikel</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Kategori</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Performa</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Status</th>
              <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray/10 bg-white dark:bg-gray-dark">
            <tr v-for="article in articles" :key="article._id" class="transition hover:bg-slate-50/80 dark:hover:bg-white/5">
              <td class="px-6 py-4">
                <div class="flex min-w-[280px] items-center gap-4">
                  <div class="h-14 w-20 flex-none overflow-hidden rounded-lg bg-slate-100">
                    <img v-if="article.coverImageUrl" :src="article.coverImageUrl" :alt="article.title" class="h-full w-full object-cover">
                    <div v-else class="flex h-full items-center justify-center text-slate-300"><Icon name="ph:image-bold" class="text-2xl" /></div>
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="max-w-sm truncate font-bold text-black dark:text-white">{{ article.title }}</p>
                      <span v-if="article.isFeatured" class="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-800">Unggulan</span>
                    </div>
                    <p class="mt-1 truncate text-xs text-gray">/blog/{{ article.slug }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray">{{ article.category?.name || 'Tanpa kategori' }}</td>
              <td class="px-6 py-4">
                <div class="text-sm font-semibold text-black dark:text-white">{{ article.views.toLocaleString('id-ID') }} views</div>
                <div class="mt-1 text-xs text-gray">{{ article.readingTime }} menit baca</div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-bold" :class="statusPresentation(article).class">{{ statusPresentation(article).label }}</span>
                <p v-if="article.publishedAt" class="mt-1.5 text-xs text-gray">{{ new Date(article.publishedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) }}</p>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <NuxtLink :to="`/admin/blog/${article._id}`" class="inline-flex rounded-lg p-2 text-primary transition hover:bg-blue-50" :aria-label="`Edit ${article.title}`">
                  <Icon name="ph:pencil-simple-bold" class="text-lg" />
                </NuxtLink>
                <button type="button" class="inline-flex rounded-lg p-2 text-red-600 transition hover:bg-red-50" :aria-label="`Hapus ${article.title}`" @click="deleteItem(article)">
                  <Icon name="ph:trash-bold" class="text-lg" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
