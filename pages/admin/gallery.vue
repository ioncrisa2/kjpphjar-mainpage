<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'gallery.view' })
useHead({ title: "Admin Galeri | KJPP HJA'R" })

const { can } = useAdminAuth()
const toast = useToast()
const viewMode = useAdminViewMode('gallery', 'grid')

interface GalleryItem {
  _id: string
  filename: string
  imageUrl: string
  thumbnailUrl: string
  uploadedAt?: string
  createdAt?: string
  title?: string
  category?: string
  isFeatured: boolean
  order: number
}

interface GalleryResponse {
  items: GalleryItem[]
  total: number
  page: number
  totalPages: number
  categories: string[]
}

const page = ref(1)
const { data, refresh, pending } = await useFetch<GalleryResponse>('/api/gallery', {
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
const downloadingId = ref<string | null>(null)

async function downloadPhoto(photo: any) {
  const sourceUrl = photo.imageUrl || photo.thumbnailUrl
  if (!sourceUrl) {
    toast.error('URL gambar tidak tersedia.')
    return
  }

  downloadingId.value = photo._id
  try {
    const filename = buildDownloadFilename({
      title: photo.title,
      filename: photo.filename,
      url: sourceUrl,
      fallbackBase: `galeri-${photo._id}`,
    })
    await downloadAssetUrl(sourceUrl, filename)
  } catch {
    toast.error('Gagal mengunduh gambar.')
  } finally {
    downloadingId.value = null
  }
}

function formatUploadedDate(value?: string) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

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
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Galeri Foto</h1>
        <p class="mt-1 text-sm text-gray">Kelola foto kegiatan dan momen yang tampil di website.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <AdminViewSwitcher v-model="viewMode" />
        <button v-if="can('gallery.create')" @click="uploadModalOpen = true" class="admin-btn-primary">
          <Icon name="ph:upload-simple-bold" class="h-4 w-4" aria-hidden="true" />
          <span>Upload Foto</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-if="pending" class="text-center py-10">Memuat...</div>
    <div v-else-if="!photos?.length" class="admin-card text-center py-16 text-gray">
      Belum ada foto di galeri. Klik "Upload Foto" untuk mulai menambahkan.
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
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
        <div class="mt-3 flex items-center justify-between gap-2 border-t border-gray/10 pt-3">
          <button
            type="button"
            class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline disabled:opacity-50 dark:text-emerald-400"
            :disabled="downloadingId === photo._id"
            :title="`Download ${photo.title || photo.filename || 'foto'}`"
            @click="downloadPhoto(photo)"
          >
            <Icon name="ph:download-simple-bold" class="h-3.5 w-3.5" aria-hidden="true" />
            <span>{{ downloadingId === photo._id ? 'Mengunduh...' : 'Download' }}</span>
          </button>
          <div class="flex items-center gap-3">
            <button v-if="can('gallery.update')" type="button" class="text-xs font-bold text-primary hover:underline" @click="openEdit(photo)">Edit</button>
            <button v-if="can('gallery.delete')" type="button" class="text-xs font-bold text-red-500 hover:underline" @click="deletePhoto(photo)">Hapus</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table View -->
    <div v-else class="admin-card !p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Foto</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Kategori</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Sorotan</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Urutan</th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Diunggah</th>
              <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray/10 bg-white dark:bg-gray-dark">
            <tr v-for="photo in photos" :key="photo._id" class="transition hover:bg-gray/5">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray/10">
                    <img
                      :src="photo.thumbnailUrl"
                      :alt="photo.title || 'Foto'"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div class="min-w-0">
                    <p class="max-w-xs truncate text-sm font-bold text-black dark:text-white" :title="photo.title">
                      {{ photo.title || 'Tanpa Judul' }}
                    </p>
                    <p class="mt-0.5 max-w-xs truncate text-xs text-gray" :title="photo.filename">
                      {{ photo.filename }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                {{ photo.category || 'Tanpa Kategori' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="photo.isFeatured"
                  class="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-black dark:text-primary"
                >
                  <Icon name="ph:star-fill" class="h-3 w-3" aria-hidden="true" />
                  <span>Featured</span>
                </span>
                <span v-else class="text-xs text-gray">Reguler</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm tabular-nums text-gray">
                {{ photo.order ?? 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray">
                {{ formatUploadedDate(photo.uploadedAt || photo.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="inline-flex items-center justify-end gap-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:underline disabled:opacity-50 dark:text-emerald-400"
                    :disabled="downloadingId === photo._id"
                    :title="`Download ${photo.title || photo.filename || 'foto'}`"
                    @click="downloadPhoto(photo)"
                  >
                    <Icon name="ph:download-simple-bold" class="h-4 w-4" aria-hidden="true" />
                    <span>Download</span>
                  </button>
                  <button
                    v-if="can('gallery.update')"
                    type="button"
                    class="font-semibold text-primary hover:underline"
                    @click="openEdit(photo)"
                  >
                    Edit
                  </button>
                  <button
                    v-if="can('gallery.delete')"
                    type="button"
                    class="font-semibold text-red-600 hover:underline dark:text-red-400"
                    @click="deletePhoto(photo)"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
