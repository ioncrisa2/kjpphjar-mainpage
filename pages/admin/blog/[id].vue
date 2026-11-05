<script setup lang="ts">
import BlogPostForm from '~/components/admin/blog/BlogPostForm.vue'

definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'blog.update' })
useHead({ title: "Edit Artikel | KJPP HJA'R" })

const route = useRoute()
const router = useRouter()
const id = route.params.id as string
const { data: article, pending, error } = await useFetch(`/api/admin/blog/${id}`)
const saving = ref(false)

// Keputusan D3: tanpa blog.publish, artikel terbit/terjadwal tidak bisa diubah.
const { can } = useAdminAuth()
const isLocked = computed(() => !can('blog.publish') && !!article.value && article.value.status !== 'draft')
const forbiddenMessage = computed(() =>
  error.value?.statusCode === 403 ? error.value.data?.statusMessage || 'Anda tidak memiliki akses ke artikel ini.' : ''
)

async function saveArticle(payload: FormData) {
  saving.value = true
  try {
    await $fetch(`/api/admin/blog/${id}`, { method: 'PUT', body: payload })
    alert('Perubahan artikel berhasil disimpan.')
    await router.push('/admin/blog')
  } catch (fetchError: any) {
    alert(fetchError?.data?.statusMessage || 'Perubahan artikel gagal disimpan.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center gap-4">
      <NuxtLink to="/admin/blog" class="admin-btn-ghost !px-3" aria-label="Kembali ke daftar artikel">
        <Icon name="ph:arrow-left-bold" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Edit artikel</h1>
        <p class="mt-1 text-sm text-gray">Perbarui konten, SEO, dan pengaturan publikasi.</p>
      </div>
    </header>

    <div v-if="pending" class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]" aria-label="Memuat artikel">
      <div class="h-96 animate-pulse rounded-2xl bg-white dark:bg-gray-dark"></div>
      <div class="h-72 animate-pulse rounded-2xl bg-white dark:bg-gray-dark"></div>
    </div>
    <div v-else-if="error || !article" class="admin-card text-center">
      <Icon :name="forbiddenMessage ? 'ph:lock-key-bold' : 'ph:file-x-bold'" class="mx-auto text-4xl text-red-500" />
      <h2 class="mt-3 text-lg font-bold text-black dark:text-white">{{ forbiddenMessage || 'Artikel tidak ditemukan' }}</h2>
      <NuxtLink to="/admin/blog" class="admin-btn-primary mt-5">Kembali ke daftar</NuxtLink>
    </div>
    <div v-else-if="isLocked" class="admin-card text-center">
      <Icon name="ph:lock-simple-bold" class="mx-auto text-4xl text-amber-600" />
      <h2 class="mt-3 text-lg font-bold text-black dark:text-white">Artikel sudah terbit atau terjadwal</h2>
      <p class="mx-auto mt-2 max-w-md text-sm text-gray">
        Artikel ini hanya bisa diubah oleh editor. Hubungi editor bila ada perbaikan yang diperlukan.
      </p>
      <NuxtLink :to="`/blog/${article.slug}`" target="_blank" class="admin-btn-ghost mt-5">Lihat di website</NuxtLink>
    </div>
    <BlogPostForm v-else :initial-value="article" :saving="saving" submit-label="Simpan perubahan" @submit="saveArticle" />
  </div>
</template>
