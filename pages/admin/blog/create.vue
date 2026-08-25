<script setup lang="ts">
import BlogPostForm from '~/components/admin/blog/BlogPostForm.vue'

definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Tulis Artikel | KJPP HJA'R" })

const router = useRouter()
const saving = ref(false)

async function saveArticle(payload: FormData) {
  saving.value = true
  try {
    await $fetch('/api/admin/blog', { method: 'POST', body: payload })
    alert('Artikel berhasil disimpan.')
    await router.push('/admin/blog')
  } catch (error: any) {
    alert(error?.data?.statusMessage || 'Artikel gagal disimpan.')
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
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Tulis artikel baru</h1>
        <p class="mt-1 text-sm text-gray">Simpan sebagai draft, terbitkan sekarang, atau jadwalkan publikasi.</p>
      </div>
    </header>

    <BlogPostForm :saving="saving" submit-label="Simpan artikel" @submit="saveArticle" />
  </div>
</template>
