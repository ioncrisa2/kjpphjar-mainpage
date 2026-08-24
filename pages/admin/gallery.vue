<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Admin Galeri | KJPP HJA'R" })

const page = ref(1)
const { data, refresh, pending } = await useFetch('/api/gallery', {
  query: computed(() => ({ page: page.value, limit: 12 }))
})

const photos = computed(() => data.value?.items || [])

const uploadModalOpen = ref(false)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadForm = reactive({
  title: '',
  category: '',
  isFeatured: false
})

async function submitUpload() {
  const file = fileInput.value?.files?.[0]
  if (!file) {
    alert('Pilih foto terlebih dahulu')
    return
  }
  
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('title', uploadForm.title)
    formData.append('category', uploadForm.category)
    formData.append('isFeatured', String(uploadForm.isFeatured))

    await $fetch('/api/gallery', {
      method: 'POST',
      body: formData
    })
    
    uploadModalOpen.value = false
    uploadForm.title = ''
    uploadForm.category = ''
    uploadForm.isFeatured = false
    if (fileInput.value) fileInput.value.value = ''
    
    refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Gagal mengupload foto')
  } finally {
    uploading.value = false
  }
}

const editModalOpen = ref(false)
const saving = ref(false)
const editId = ref('')
const editForm = reactive({
  title: '',
  category: '',
  order: 0,
  isFeatured: false
})

function openEdit(photo: any) {
  editId.value = photo._id
  editForm.title = photo.title || ''
  editForm.category = photo.category || ''
  editForm.order = photo.order || 0
  editForm.isFeatured = photo.isFeatured || false
  editModalOpen.value = true
}

async function submitEdit() {
  saving.value = true
  try {
    await $fetch(`/api/gallery/${editId.value}`, {
      method: 'PATCH',
      body: editForm
    })
    editModalOpen.value = false
    refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Gagal menyimpan perubahan')
  } finally {
    saving.value = false
  }
}

async function deletePhoto(id: string) {
  if (!confirm('Hapus foto ini dari galeri?')) return
  try {
    await $fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    refresh()
  } catch (error) {
    alert('Gagal menghapus foto.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Galeri Foto</h1>
        <p class="mt-1 text-sm text-gray">Kelola foto kegiatan dan momen yang tampil di website.</p>
      </div>
      <button @click="uploadModalOpen = true" class="admin-btn-primary">
        <span>📸</span> Upload Foto
      </button>
    </div>

    <!-- Grid -->
    <div v-if="pending" class="text-center py-10">Memuat...</div>
    <div v-else-if="!photos?.length" class="admin-card text-center py-16 text-gray">
      Belum ada foto di galeri. Klik "Upload Foto" untuk mulai menambahkan.
    </div>

    <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
      <div v-for="photo in photos" :key="photo._id" class="admin-card !p-3 group flex flex-col">
        <div class="relative overflow-hidden rounded-xl bg-gray/5 pb-[75%]">
          <img
            :src="photo.thumbnailUrl"
            :alt="photo.title || 'Foto'"
            class="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div v-if="photo.isFeatured" class="absolute top-2 left-2 bg-primary text-black text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            ★ Featured
          </div>
        </div>
        <div class="mt-3 flex-1">
          <p class="font-bold text-black dark:text-white truncate" :title="photo.title">{{ photo.title || 'Tanpa Judul' }}</p>
          <p class="text-xs text-gray mt-1">{{ photo.category || 'Tanpa Kategori' }}</p>
        </div>
        <div class="mt-3 flex items-center justify-between border-t border-gray/10 pt-3">
          <button class="text-xs font-bold text-primary hover:underline" @click="openEdit(photo)">Edit</button>
          <button class="text-xs font-bold text-red-500 hover:underline" @click="deletePhoto(photo._id)">Hapus</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="data?.totalPages && data.totalPages > 1" class="flex justify-center mt-8 gap-2">
      <button
        class="admin-btn-ghost !px-3 !py-1.5"
        :disabled="page === 1"
        @click="page--"
      >Prev</button>
      <span class="flex items-center px-4 text-sm font-bold text-black dark:text-white">{{ page }} / {{ data.totalPages }}</span>
      <button
        class="admin-btn-ghost !px-3 !py-1.5"
        :disabled="page === data.totalPages"
        @click="page++"
      >Next</button>
    </div>

    <!-- Upload Modal -->
    <UiModal v-model="uploadModalOpen" title="Upload Foto Baru">
      <form @submit.prevent="submitUpload" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Pilih Foto</label>
          <input type="file" ref="fileInput" accept="image/*" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Judul (Opsional)</label>
          <input v-model="uploadForm.title" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Kategori</label>
          <input v-model="uploadForm.category" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
        </div>
        <div class="flex items-center">
          <input v-model="uploadForm.isFeatured" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
          <label class="ml-2 block text-sm text-gray-900">Jadikan Featured</label>
        </div>
        <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-2">
          <button type="submit" :disabled="uploading" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:w-auto sm:text-sm disabled:opacity-50">
            {{ uploading ? 'Mengunggah...' : 'Upload' }}
          </button>
          <button type="button" @click="uploadModalOpen = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
            Batal
          </button>
        </div>
      </form>
    </UiModal>

    <!-- Edit Modal -->
    <UiModal v-model="editModalOpen" title="Edit Info Foto">
      <form @submit.prevent="submitEdit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Judul</label>
          <input v-model="editForm.title" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Kategori</label>
          <input v-model="editForm.category" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Urutan Tampil (Order)</label>
          <input v-model="editForm.order" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
        </div>
        <div class="flex items-center">
          <input v-model="editForm.isFeatured" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
          <label class="ml-2 block text-sm text-gray-900">Jadikan Featured</label>
        </div>
        <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-2">
          <button type="submit" :disabled="saving" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:w-auto sm:text-sm disabled:opacity-50">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
          <button type="button" @click="editModalOpen = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
            Batal
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>
