<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Edit Artikel | KJPP HJA'R" })

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { data: article, pending } = await useFetch(`/api/blog/${id}?admin=true`)

const saving = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  title: '',
  slug: '',
  category: '',
  summary: '',
  content: '',
  isPublished: false
})

watchEffect(() => {
  if (article.value) {
    form.title = article.value.title
    form.slug = article.value.slug
    form.category = article.value.category || ''
    form.summary = article.value.summary || ''
    form.content = article.value.content || ''
    form.isPublished = article.value.isPublished !== false
  }
})

async function submitForm() {
  saving.value = true
  try {
    const formData = new FormData()
    if (fileInput.value?.files?.[0]) {
      formData.append('image', fileInput.value.files[0])
    }
    formData.append('title', form.title)
    formData.append('slug', form.slug)
    formData.append('category', form.category)
    formData.append('summary', form.summary)
    formData.append('content', form.content)
    formData.append('isPublished', String(form.isPublished))

    await $fetch(`/api/blog/${id}`, {
      method: 'PUT',
      body: formData
    })
    alert('Artikel berhasil diperbarui!')
    router.push('/admin/blog')
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Gagal menyimpan artikel')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <div class="flex items-center space-x-4">
      <NuxtLink to="/admin/blog" class="text-gray-500 hover:text-gray-900">
        &larr; Kembali
      </NuxtLink>
      <h1 class="text-2xl font-extrabold text-black dark:text-white">Edit Artikel</h1>
    </div>

    <div v-if="pending" class="p-6 text-center text-gray-500">Memuat data...</div>
    <div v-else-if="!article" class="p-6 text-center text-red-500">Artikel tidak ditemukan</div>
    <div v-else class="admin-card">
      <form @submit.prevent="submitForm" class="p-6 space-y-6">
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Judul Artikel</label>
            <input v-model="form.title" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Slug URL</label>
              <input v-model="form.slug" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Kategori</label>
              <input v-model="form.category" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Cover Image</label>
            <div v-if="article.coverUrl" class="mb-2">
              <img :src="article.coverUrl" alt="Cover" class="h-32 object-cover rounded border">
            </div>
            <input type="file" ref="fileInput" accept="image/*" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm">
            <p class="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah cover.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Ringkasan (Opsional)</label>
            <textarea v-model="form.summary" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Konten Lengkap</label>
            <UiWysiwygEditor v-model="form.content" />
          </div>
          
          <div class="flex items-center pt-2 border-t border-gray-200">
            <input v-model="form.isPublished" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
            <label class="ml-2 block text-sm text-gray-900">Publish (Bisa dilihat publik)</label>
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <button type="submit" :disabled="saving" class="admin-btn-primary disabled:opacity-50">
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
