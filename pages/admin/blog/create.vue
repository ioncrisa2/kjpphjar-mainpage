<script setup lang="ts">
import BlogPostForm from '~/components/admin/blog/BlogPostForm.vue'

definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'blog.create' })
useHead({ title: "Tulis Artikel | KJPP HJA'R" })

const router = useRouter()
const toast = useToast()
const saving = ref(false)
const formRef = ref<{ markSaved: (enableLeave?: boolean) => void } | null>(null)

async function saveArticle({ payload, stay }: { payload: FormData; stay: boolean }) {
  saving.value = true
  try {
    const created = await $fetch<{ _id: string }>('/api/admin/blog', { method: 'POST', body: payload })
    formRef.value?.markSaved(true)
    toast.success('Artikel berhasil disimpan.')
    await router.push(stay && created?._id ? `/admin/blog/${created._id}` : '/admin/blog')
  } catch (error: any) {
    toast.error(error?.data?.statusMessage || 'Artikel gagal disimpan.')
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
        <p class="mt-1 text-sm text-gray">Simpan sebagai draft, ajukan untuk review, terbitkan, atau jadwalkan publikasi.</p>
      </div>
    </header>

    <BlogPostForm ref="formRef" :saving="saving" submit-label="Simpan artikel" @submit="saveArticle" />
  </div>
</template>
