<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Kategori Blog | KJPP HJA'R" })

const { data, pending, refresh } = await useFetch('/api/admin/categories')
const categories = computed(() => data.value?.items || [])
const saving = ref(false)
const editingId = ref('')
const form = reactive({ name: '', slug: '', description: '', isActive: true })

function resetForm() {
  editingId.value = ''
  form.name = ''
  form.slug = ''
  form.description = ''
  form.isActive = true
}

function editCategory(category: Record<string, any>) {
  editingId.value = category._id
  form.name = category.name
  form.slug = category.slug
  form.description = category.description || ''
  form.isActive = category.isActive !== false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function saveCategory() {
  saving.value = true
  try {
    await $fetch(editingId.value ? `/api/admin/categories/${editingId.value}` : '/api/admin/categories', {
      method: editingId.value ? 'PUT' : 'POST',
      body: form,
    })
    resetForm()
    await refresh()
  } catch (error: any) {
    alert(error?.data?.statusMessage || 'Kategori gagal disimpan.')
  } finally {
    saving.value = false
  }
}

async function deleteCategory(category: Record<string, any>) {
  if (!confirm(`Hapus kategori “${category.name}”?`)) return
  try {
    await $fetch(`/api/admin/categories/${category._id}`, { method: 'DELETE' })
    if (editingId.value === category._id) resetForm()
    await refresh()
  } catch (error: any) {
    alert(error?.data?.statusMessage || 'Kategori gagal dihapus.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center gap-4">
      <NuxtLink to="/admin/blog" class="admin-btn-ghost !px-3" aria-label="Kembali ke blog"><Icon name="ph:arrow-left-bold" /></NuxtLink>
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Kategori artikel</h1>
        <p class="mt-1 text-sm text-gray">Atur pengelompokan artikel yang tersedia di halaman publik.</p>
      </div>
    </header>

    <div class="grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <form class="admin-card space-y-5 lg:sticky lg:top-6" @submit.prevent="saveCategory">
        <div>
          <h2 class="text-lg font-extrabold text-black dark:text-white">{{ editingId ? 'Edit kategori' : 'Kategori baru' }}</h2>
          <p class="mt-1 text-sm text-gray">Slug otomatis dibuat dari nama bila dikosongkan.</p>
        </div>
        <div>
          <label for="category-name" class="admin-label">Nama kategori</label>
          <input id="category-name" v-model="form.name" type="text" maxlength="80" required class="admin-input" placeholder="Contoh: Wawasan Penilaian">
        </div>
        <div>
          <label for="category-slug" class="admin-label">Slug</label>
          <input id="category-slug" v-model="form.slug" type="text" maxlength="100" class="admin-input" placeholder="wawasan-penilaian">
        </div>
        <div>
          <label for="category-description" class="admin-label">Deskripsi</label>
          <textarea id="category-description" v-model="form.description" rows="4" maxlength="300" class="admin-input resize-y"></textarea>
        </div>
        <label class="flex items-center gap-3 text-sm font-semibold text-black dark:text-white">
          <input v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
          Tampilkan di filter publik
        </label>
        <div class="flex gap-2">
          <button type="submit" :disabled="saving" class="admin-btn-primary flex-1 justify-center disabled:opacity-50">{{ saving ? 'Menyimpan…' : editingId ? 'Simpan perubahan' : 'Tambah kategori' }}</button>
          <button v-if="editingId" type="button" class="admin-btn-ghost !px-3" aria-label="Batal edit" @click="resetForm"><Icon name="ph:x-bold" /></button>
        </div>
      </form>

      <section class="admin-card !p-0 overflow-hidden">
        <div v-if="pending" class="space-y-3 p-6"><div v-for="index in 4" :key="index" class="h-16 animate-pulse rounded-xl bg-slate-100"></div></div>
        <div v-else-if="!categories.length" class="px-6 py-14 text-center">
          <Icon name="ph:folders-bold" class="mx-auto text-5xl text-slate-300" />
          <h2 class="mt-4 text-lg font-bold text-black dark:text-white">Belum ada kategori</h2>
          <p class="mt-2 text-sm text-gray">Tambahkan kategori pertama menggunakan form di samping.</p>
        </div>
        <div v-else class="divide-y divide-gray/10">
          <article v-for="category in categories" :key="category._id" class="flex flex-wrap items-center justify-between gap-4 p-5 transition hover:bg-slate-50 dark:hover:bg-white/5">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="font-bold text-black dark:text-white">{{ category.name }}</h2>
                <span class="rounded-full px-2 py-0.5 text-xs font-bold" :class="category.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-700'">{{ category.isActive ? 'Aktif' : 'Nonaktif' }}</span>
              </div>
              <p class="mt-1 text-xs font-semibold text-primary">/kategori/{{ category.slug }}</p>
              <p v-if="category.description" class="mt-2 line-clamp-2 max-w-2xl text-sm text-gray">{{ category.description }}</p>
              <p class="mt-2 text-xs text-gray">{{ category.articleCount }} artikel</p>
            </div>
            <div class="flex gap-1">
              <button type="button" class="rounded-lg p-2 text-primary transition hover:bg-blue-50" :aria-label="`Edit ${category.name}`" @click="editCategory(category)"><Icon name="ph:pencil-simple-bold" class="text-lg" /></button>
              <button type="button" class="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40" :disabled="category.articleCount > 0" :title="category.articleCount > 0 ? 'Kategori yang masih dipakai tidak dapat dihapus' : 'Hapus kategori'" :aria-label="`Hapus ${category.name}`" @click="deleteCategory(category)"><Icon name="ph:trash-bold" class="text-lg" /></button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>
