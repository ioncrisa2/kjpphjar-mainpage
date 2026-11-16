<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'gallery.view' })
useHead({ title: "Admin Galeri | KJPP HJA'R" })

const { can } = useAdminAuth()
const toast = useToast()

const page = ref(1)
const { data, refresh, pending } = await useFetch('/api/gallery', {
  // admin=true: tanpa gallery.manage_all hanya foto milik sendiri yang dikembalikan.
  query: computed(() => ({ page: page.value, limit: 12, admin: 'true' }))
})

const photos = computed(() => data.value?.items || [])

const uploadModalOpen = ref(false)
const uploading = ref(false)
const selectedFile = ref<File | null>(null)
const uploadForm = reactive({
  title: '',
  category: '',
  isFeatured: false
})

async function submitUpload() {
  const file = selectedFile.value
  if (!file) {
    toast.error('Pilih foto terlebih dahulu.')
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
    selectedFile.value = null
    toast.success('Foto berhasil diunggah.')
    refresh()
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Gagal mengupload foto.')
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
    toast.success('Informasi foto diperbarui.')
    refresh()
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Gagal menyimpan perubahan.')
  } finally {
    saving.value = false
  }
}

const { ask } = useConfirm()

async function deletePhoto(photo: any) {
  const confirmed = await ask({
    title: 'Hapus Foto Galeri',
    message: 'Apakah Anda yakin ingin menghapus foto ini dari galeri?',
    itemName: photo.title ? photo.title : (photo.category ? `Foto Kategori ${photo.category}` : undefined),
    confirmText: 'Ya, Hapus',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/gallery/${photo._id}`, { method: 'DELETE' })
    toast.success('Foto berhasil dihapus.')
    refresh()
  } catch (error) {
    toast.error('Gagal menghapus foto.')
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
      <button v-if="can('gallery.create')" @click="uploadModalOpen = true" class="admin-btn-primary">
        <Icon name="ph:upload-simple-bold" class="h-4 w-4" aria-hidden="true" />
        <span>Upload Foto</span>
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
          <div v-if="photo.isFeatured" class="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-bold text-black shadow-sm">
            <Icon name="ph:star-fill" class="h-3.5 w-3.5" aria-hidden="true" />
            <span>Featured</span>
          </div>
        </div>
        <div class="mt-3 flex-1">
          <p class="font-bold text-black dark:text-white truncate" :title="photo.title">{{ photo.title || 'Tanpa Judul' }}</p>
          <p class="text-xs text-gray mt-1">{{ photo.category || 'Tanpa Kategori' }}</p>
        </div>
        <div class="mt-3 flex items-center justify-between border-t border-gray/10 pt-3">
          <button v-if="can('gallery.update')" class="text-xs font-bold text-primary hover:underline" @click="openEdit(photo)">Edit</button>
          <button v-if="can('gallery.delete')" class="text-xs font-bold text-red-500 hover:underline" @click="deletePhoto(photo)">Hapus</button>
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
    <UiModal v-model="uploadModalOpen" title="Upload Foto Baru" size="sm">
      <form @submit.prevent="submitUpload" class="space-y-4">
        <UiMediaInput
          v-model="selectedFile"
          label="Pilih Foto"
          accept="image/*"
          preview-aspect="cover"
          hint="JPG, PNG, atau WebP."
          required
        />
        <div>
          <label class="admin-label">Judul (Opsional)</label>
          <input v-model="uploadForm.title" type="text" class="admin-input">
        </div>
        <div>
          <label class="admin-label">Kategori</label>
          <input v-model="uploadForm.category" type="text" class="admin-input">
        </div>
        <UiAdvancedOptions v-if="can('gallery.manage_all')" label="Opsi Lanjutan" hint="Tampilkan di galeri unggulan beranda">
          <div class="flex items-center gap-2">
            <input id="upload-featured" v-model="uploadForm.isFeatured" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
            <label for="upload-featured" class="text-sm font-semibold text-black dark:text-white">Jadikan Featured</label>
          </div>
        </UiAdvancedOptions>
        <div class="flex flex-col-reverse gap-2 border-t border-gray/10 pt-4 sm:flex-row sm:justify-end">
          <button type="button" @click="uploadModalOpen = false" class="admin-btn-ghost justify-center">
            Batal
          </button>
          <button type="submit" :disabled="uploading" class="admin-btn-primary justify-center">
            {{ uploading ? 'Mengunggah...' : 'Upload' }}
          </button>
        </div>
      </form>
    </UiModal>

    <!-- Edit Modal -->
    <UiModal v-model="editModalOpen" title="Edit Info Foto" size="sm">
      <form @submit.prevent="submitEdit" class="space-y-4">
        <div>
          <label class="admin-label">Judul</label>
          <input v-model="editForm.title" type="text" class="admin-input">
        </div>
        <div>
          <label class="admin-label">Kategori</label>
          <input v-model="editForm.category" type="text" class="admin-input">
        </div>
        <UiAdvancedOptions v-if="can('gallery.manage_all')" label="Opsi Lanjutan" hint="Urutan tampil dan sorotan beranda">
          <div>
            <label class="admin-label">Urutan Tampil (Order)</label>
            <input v-model="editForm.order" type="number" class="admin-input">
          </div>
          <div class="flex items-center gap-2">
            <input id="edit-featured" v-model="editForm.isFeatured" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
            <label for="edit-featured" class="text-sm font-semibold text-black dark:text-white">Jadikan Featured</label>
          </div>
        </UiAdvancedOptions>
        <div class="flex flex-col-reverse gap-2 border-t border-gray/10 pt-4 sm:flex-row sm:justify-end">
          <button type="button" @click="editModalOpen = false" class="admin-btn-ghost justify-center">
            Batal
          </button>
          <button type="submit" :disabled="saving" class="admin-btn-primary justify-center">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>
