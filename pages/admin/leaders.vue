<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'leaders.view' })
useHead({ title: "Admin Pimpinan | KJPP HJA'R" })

const { can } = useAdminAuth()
const toast = useToast()
const viewMode = useAdminViewMode('leaders', 'table')

interface LeaderItem {
  _id: string
  name: string
  position: string
  bio?: string
  photoUrl: string
  mappiNumber?: string
  publicValuerLicense?: string
  order: number
  isActive: boolean
}

const { data: leaders, refresh, pending } = await useFetch<LeaderItem[]>('/api/leaders')

const modalOpen = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editId = ref('')
const selectedPhoto = ref<File | null>(null)
const editingPhotoUrl = ref('')

const form = reactive({
  name: '',
  position: '',
  bio: '',
  mappiNumber: '',
  publicValuerLicense: '',
  order: 0,
  isActive: true
})

function resetForm() {
  isEditing.value = false
  editId.value = ''
  form.name = ''
  form.position = ''
  form.bio = ''
  form.mappiNumber = ''
  form.publicValuerLicense = ''
  form.order = 0
  form.isActive = true
  selectedPhoto.value = null
  editingPhotoUrl.value = ''
}

function openAdd() {
  resetForm()
  modalOpen.value = true
}

function openEdit(item: any) {
  isEditing.value = true
  editId.value = item._id
  form.name = item.name
  form.position = item.position
  form.bio = item.bio || ''
  form.mappiNumber = item.mappiNumber || ''
  form.publicValuerLicense = item.publicValuerLicense || ''
  form.order = item.order || 0
  form.isActive = item.isActive !== false
  selectedPhoto.value = null
  editingPhotoUrl.value = item.photoUrl || ''
  modalOpen.value = true
}

async function submitForm() {
  const file = selectedPhoto.value
  if (!isEditing.value && !file) {
    toast.error('Foto wajib diunggah untuk pimpinan baru.')
    return
  }

  saving.value = true
  try {
    const formData = new FormData()
    if (file) formData.append('image', file)
    formData.append('name', form.name)
    formData.append('position', form.position)
    formData.append('bio', form.bio)
    formData.append('mappiNumber', form.mappiNumber)
    formData.append('publicValuerLicense', form.publicValuerLicense)
    formData.append('order', String(form.order))
    formData.append('isActive', String(form.isActive))

    const url = isEditing.value ? `/api/leaders/${editId.value}` : '/api/leaders'
    const method = isEditing.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: formData
    })
    
    modalOpen.value = false
    toast.success(isEditing.value ? 'Data pimpinan diperbarui.' : 'Pimpinan berhasil ditambahkan.')
    refresh()
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Gagal menyimpan data.')
  } finally {
    saving.value = false
  }
}

const { ask } = useConfirm()

function leaderActions(leader: any) {
  const actions: Array<{ label: string; icon?: string; variant?: 'default' | 'danger'; onClick?: () => void }> = []
  if (can('leaders.update')) {
    actions.push({ label: 'Edit Pimpinan', icon: 'ph:pencil-simple-bold', onClick: () => openEdit(leader) })
  }
  if (can('leaders.delete')) {
    actions.push({ label: 'Hapus', icon: 'ph:trash-bold', variant: 'danger', onClick: () => deleteItem(leader) })
  }
  return actions
}

async function deleteItem(leader: any) {
  const confirmed = await ask({
    title: 'Hapus Pimpinan',
    message: 'Apakah Anda yakin ingin menghapus data profil pimpinan ini?',
    itemName: leader.name ? `${leader.name} — ${leader.position}` : undefined,
    confirmText: 'Ya, Hapus',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/leaders/${leader._id}`, { method: 'DELETE' })
    toast.success('Pimpinan berhasil dihapus.')
    refresh()
  } catch (err) {
    toast.error('Gagal menghapus data.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Pimpinan</h1>
        <p class="mt-1 text-sm text-gray">Kelola profil pimpinan KJPP HJA'R.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <AdminViewSwitcher v-model="viewMode" />
        <button v-if="can('leaders.create')" @click="openAdd" class="admin-btn-primary">
          + Tambah Pimpinan
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-if="pending" class="admin-card p-6 text-center text-gray-500">Memuat data...</div>
    <div v-else-if="!leaders?.length" class="admin-card p-6 text-center text-gray-500">
      Belum ada data pimpinan.
    </div>

    <!-- Table View -->
    <div v-else-if="viewMode === 'table'" class="admin-card !p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Profil</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Jabatan</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">No. MAPPI / Ijin PP</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Urutan</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-bold text-gray uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray/10 bg-white dark:bg-gray-dark">
            <tr v-for="leader in leaders" :key="leader._id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full object-cover" :src="leader.photoUrl" :alt="leader.name">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-bold text-black dark:text-white">{{ leader.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-black dark:text-gray-200">{{ leader.position }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="text-black dark:text-gray-200">MAPPI: {{ leader.mappiNumber || '-' }}</div>
                <div class="text-gray">Ijin PP: {{ leader.publicValuerLicense || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm tabular-nums text-gray">
                {{ leader.order }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="leader.isActive" class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">Aktif</span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Nonaktif</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UiActionMenu v-if="leaderActions(leader).length" :items="leaderActions(leader)" :label="`Aksi untuk ${leader.name}`" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article v-for="leader in leaders" :key="leader._id" class="admin-card flex flex-col gap-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <img class="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-primary/20" :src="leader.photoUrl" :alt="leader.name">
            <div class="min-w-0">
              <h2 class="truncate text-base font-extrabold text-black dark:text-white" :title="leader.name">{{ leader.name }}</h2>
              <p class="truncate text-xs font-semibold text-gray" :title="leader.position">{{ leader.position }}</p>
            </div>
          </div>
          <UiActionMenu v-if="leaderActions(leader).length" :items="leaderActions(leader)" :label="`Aksi untuk ${leader.name}`" />
        </div>
        <div class="space-y-1 rounded-xl bg-gray/5 p-3 text-xs">
          <div class="flex justify-between gap-2">
            <span class="text-gray">No. MAPPI</span>
            <span class="font-semibold text-black dark:text-white">{{ leader.mappiNumber || '-' }}</span>
          </div>
          <div class="flex justify-between gap-2">
            <span class="text-gray">Ijin PP</span>
            <span class="font-semibold text-black dark:text-white">{{ leader.publicValuerLicense || '-' }}</span>
          </div>
        </div>
        <div class="mt-auto flex items-center justify-between border-t border-gray/10 pt-3">
          <span class="text-xs tabular-nums text-gray">Urutan: {{ leader.order }}</span>
          <span v-if="leader.isActive" class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">Aktif</span>
          <span v-else class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Nonaktif</span>
        </div>
      </article>
    </div>

    <!-- Modal Form -->
    <UiModal v-model="modalOpen" :title="isEditing ? 'Edit Pimpinan' : 'Tambah Pimpinan Baru'" size="lg">
      <form @submit.prevent="submitForm" class="space-y-4">
        <UiMediaInput
          v-model="selectedPhoto"
          :existing-url="editingPhotoUrl"
          label="Foto"
          accept="image/*"
          preview-aspect="square"
          :required="!isEditing"
          :hint="isEditing ? 'Biarkan jika tidak ingin mengubah foto.' : 'Gunakan foto potret beresolusi baik.'"
        />
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="admin-label">Nama</label>
            <input v-model="form.name" type="text" required class="admin-input">
          </div>
          <div>
            <label class="admin-label">Jabatan</label>
            <input v-model="form.position" type="text" required class="admin-input">
          </div>
        </div>
        <div>
          <label class="admin-label">Biografi Singkat</label>
          <textarea v-model="form.bio" rows="3" class="admin-input resize-y"></textarea>
        </div>
        <UiAdvancedOptions label="Kredensial & Opsi Lanjutan" hint="Nomor MAPPI, ijin penilai publik, urutan tampil, dan status">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="admin-label">Nomor MAPPI</label>
              <input v-model="form.mappiNumber" type="text" maxlength="100" class="admin-input">
            </div>
            <div>
              <label class="admin-label">No. Ijin Penilai Publik</label>
              <input v-model="form.publicValuerLicense" type="text" maxlength="100" class="admin-input">
            </div>
            <div>
              <label class="admin-label">Urutan Tampil (Order)</label>
              <input v-model="form.order" type="number" class="admin-input">
            </div>
            <div class="flex items-center gap-2 sm:pt-7">
              <input id="leader-active" v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
              <label for="leader-active" class="text-sm font-semibold text-black dark:text-white">Aktif (Ditampilkan)</label>
            </div>
          </div>
        </UiAdvancedOptions>
        
        <div class="flex flex-col-reverse gap-2 border-t border-gray/10 pt-4 sm:flex-row sm:justify-end">
          <button type="button" @click="modalOpen = false" class="admin-btn-ghost justify-center">
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
