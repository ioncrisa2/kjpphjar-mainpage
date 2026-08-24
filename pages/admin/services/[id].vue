<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Edit Layanan | KJPP HJA'R" })

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { data: service, pending } = await useFetch(`/api/services/${id}`)

const saving = ref(false)
const form = reactive({
  title: '',
  titleEn: '',
  slug: '',
  description: '',
  content: '',
  icon: '',
  order: 0,
  isActive: true
})

// Populate form when data is ready
watchEffect(() => {
  if (service.value) {
    form.title = service.value.title
    form.titleEn = service.value.titleEn
    form.slug = service.value.slug
    form.description = service.value.description || ''
    form.content = service.value.content || ''
    form.icon = service.value.icon || ''
    form.order = service.value.order || 0
    form.isActive = service.value.isActive !== false
  }
})

async function submitForm() {
  saving.value = true
  try {
    await $fetch(`/api/services/${id}`, {
      method: 'PUT',
      body: form
    })
    alert('Perubahan berhasil disimpan!')
    router.push('/admin/services')
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Gagal menyimpan perubahan')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <div class="flex items-center space-x-4">
      <NuxtLink to="/admin/services" class="text-gray-500 hover:text-gray-900">
        &larr; Kembali
      </NuxtLink>
      <h1 class="text-2xl font-extrabold text-black dark:text-white">Edit Layanan</h1>
    </div>

    <div v-if="pending" class="p-6 text-center text-gray-500">Memuat data...</div>
    <div v-else-if="!service" class="p-6 text-center text-red-500">Layanan tidak ditemukan</div>
    <div v-else class="admin-card">
      <form @submit.prevent="submitForm" class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama Layanan (ID)</label>
            <input v-model="form.title" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama Layanan (EN)</label>
            <input v-model="form.titleEn" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Slug URL</label>
            <input v-model="form.slug" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Icon (Nama atau Class)</label>
            <input v-model="form.icon" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Deskripsi Singkat (Tampil di card beranda)</label>
            <textarea v-model="form.description" rows="2" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Konten Lengkap</label>
            <UiWysiwygEditor v-model="form.content" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Urutan (Order)</label>
            <input v-model="form.order" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
          </div>
          <div class="flex items-center pt-6">
            <input v-model="form.isActive" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
            <label class="ml-2 block text-sm text-gray-900">Aktif (Ditampilkan)</label>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-200 flex justify-end">
          <button type="submit" :disabled="saving" class="admin-btn-primary disabled:opacity-50">
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
