<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Tambah Layanan | KJPP HJA'R" })

const router = useRouter()
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

async function submitForm() {
  saving.value = true
  try {
    await $fetch('/api/services', {
      method: 'POST',
      body: form
    })
    alert('Layanan berhasil ditambahkan!')
    router.push('/admin/services')
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Gagal menyimpan layanan')
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
      <h1 class="text-2xl font-extrabold text-black dark:text-white">Tambah Layanan Baru</h1>
    </div>

    <div class="admin-card">
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
            <label class="block text-sm font-medium text-gray-700">Slug URL (Opsional)</label>
            <input v-model="form.slug" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm text-gray-500" placeholder="Otomatis jika dikosongkan">
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
            {{ saving ? 'Menyimpan...' : 'Simpan Layanan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
