<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'careers.view' })
useHead({ title: "Admin Karir | KJPP HJA'R" })

const { can } = useAdminAuth()
const toast = useToast()
const viewMode = useAdminViewMode('careers', 'table')

interface CareerItem {
  _id: string
  title: string
  location: string
  type: string
  description?: string
  requirements?: string[]
  postedAt: string
  closingDate?: string | null
  isActive: boolean
}

const { data: careers, refresh, pending } = await useFetch<CareerItem[]>('/api/careers?admin=true')

const modalOpen = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editId = ref('')

const form = reactive({
  title: '',
  location: '',
  type: 'Full-time',
  description: '',
  requirements: '',
  closingDate: '',
  isActive: true
})

function resetForm() {
  isEditing.value = false
  editId.value = ''
  form.title = ''
  form.location = ''
  form.type = 'Full-time'
  form.description = ''
  form.requirements = ''
  form.closingDate = ''
  form.isActive = true
}

function openAdd() {
  resetForm()
  modalOpen.value = true
}

function openEdit(item: any) {
  isEditing.value = true
  editId.value = item._id
  form.title = item.title
  form.location = item.location
  form.type = item.type
  form.description = item.description || ''
  form.requirements = Array.isArray(item.requirements) ? item.requirements.join('\n') : ''
  form.closingDate = item.closingDate ? new Date(item.closingDate).toISOString().split('T')[0] : ''
  form.isActive = item.isActive !== false
  modalOpen.value = true
}

async function submitForm() {
  saving.value = true
  try {
    const payload = { ...form }
    
    const url = isEditing.value ? `/api/careers/${editId.value}` : '/api/careers'
    const method = isEditing.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: payload
    })
    
    modalOpen.value = false
    toast.success(isEditing.value ? 'Lowongan diperbarui.' : 'Lowongan berhasil ditambahkan.')
    refresh()
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Gagal menyimpan data.')
  } finally {
    saving.value = false
  }
}

const { ask } = useConfirm()

function careerActions(career: any) {
  const actions: Array<{ label: string; icon?: string; variant?: 'default' | 'danger'; onClick?: () => void }> = []
  if (can('careers.update')) {
    actions.push({ label: 'Edit Lowongan', icon: 'ph:pencil-simple-bold', onClick: () => openEdit(career) })
  }
  if (can('careers.delete')) {
    actions.push({ label: 'Hapus', icon: 'ph:trash-bold', variant: 'danger', onClick: () => deleteItem(career) })
  }
  return actions
}

async function deleteItem(career: any) {
  const confirmed = await ask({
    title: 'Hapus Lowongan Karir',
    message: 'Apakah Anda yakin ingin menghapus lowongan pekerjaan ini?',
    itemName: career.title ? `${career.title} (${career.type} - ${career.location})` : undefined,
    confirmText: 'Ya, Hapus',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/careers/${career._id}`, { method: 'DELETE' })
    toast.success('Lowongan berhasil dihapus.')
    refresh()
  } catch (err) {
    toast.error('Gagal menghapus lowongan.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Karir / Lowongan</h1>
        <p class="mt-1 text-sm text-gray">Kelola informasi lowongan pekerjaan.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <AdminViewSwitcher v-model="viewMode" />
        <button v-if="can('careers.create')" @click="openAdd" class="admin-btn-primary">
          + Tambah Lowongan
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-if="pending" class="admin-card p-6 text-center text-gray-500">Memuat data...</div>
    <div v-else-if="!careers?.length" class="admin-card p-6 text-center text-gray-500">
      Belum ada lowongan pekerjaan.
    </div>

    <!-- Table View -->
    <div v-else-if="viewMode === 'table'" class="admin-card !p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Posisi</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Tipe & Lokasi</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Tgl Tutup</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-bold text-gray uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray/10 bg-white dark:bg-gray-dark">
            <tr v-for="career in careers" :key="career._id">
              <td class="px-6 py-4">
                <div class="font-bold text-black dark:text-white">{{ career.title }}</div>
                <div class="text-xs text-gray mt-1">Dibuat: {{ new Date(career.postedAt).toLocaleDateString('id-ID') }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-semibold text-black dark:text-gray-200">{{ career.type }}</div>
                <div class="text-sm text-gray">{{ career.location }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray">
                {{ career.closingDate ? new Date(career.closingDate).toLocaleDateString('id-ID') : 'Tidak Ada Batas' }}
              </td>
              <td class="px-6 py-4">
                <span v-if="career.isActive" class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">Aktif</span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Nonaktif</span>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <UiActionMenu v-if="careerActions(career).length" :items="careerActions(career)" :label="`Aksi untuk ${career.title}`" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article v-for="career in careers" :key="career._id" class="admin-card flex flex-col gap-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="line-clamp-2 text-base font-extrabold text-black dark:text-white" :title="career.title">{{ career.title }}</h2>
            <p class="mt-1 text-xs text-gray">Dibuat: {{ new Date(career.postedAt).toLocaleDateString('id-ID') }}</p>
          </div>
          <UiActionMenu v-if="careerActions(career).length" :items="careerActions(career)" :label="`Aksi untuk ${career.title}`" />
        </div>
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="rounded-full bg-primary/15 px-2.5 py-0.5 font-bold text-black dark:text-primary">{{ career.type }}</span>
          <span class="inline-flex items-center gap-1 text-gray">
            <Icon name="ph:map-pin-bold" class="h-3.5 w-3.5" aria-hidden="true" />
            {{ career.location }}
          </span>
        </div>
        <div class="mt-auto flex items-center justify-between border-t border-gray/10 pt-3 text-xs">
          <span class="text-gray">Tutup: {{ career.closingDate ? new Date(career.closingDate).toLocaleDateString('id-ID') : 'Tidak Ada Batas' }}</span>
          <span v-if="career.isActive" class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">Aktif</span>
          <span v-else class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Nonaktif</span>
        </div>
      </article>
    </div>

    <!-- Modal Form -->
    <UiModal v-model="modalOpen" :title="isEditing ? 'Edit Lowongan' : 'Tambah Lowongan Baru'" size="lg">
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="admin-label">Posisi Pekerjaan</label>
          <input v-model="form.title" type="text" required class="admin-input">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="admin-label">Tipe</label>
            <select v-model="form.type" required class="admin-input">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label class="admin-label">Lokasi</label>
            <input v-model="form.location" type="text" required class="admin-input">
          </div>
        </div>
        <div>
          <label class="admin-label">Deskripsi Pekerjaan</label>
          <textarea v-model="form.description" rows="3" required class="admin-input resize-y"></textarea>
        </div>
        <div>
          <label class="admin-label">Persyaratan (Pisahkan dengan baris baru)</label>
          <textarea v-model="form.requirements" rows="4" class="admin-input resize-y" placeholder="- Minimal S1&#10;- Pengalaman 1 tahun"></textarea>
        </div>

        <UiAdvancedOptions label="Opsi Lanjutan" hint="Batas waktu pendaftaran dan status tayang">
          <div>
            <label class="admin-label">Batas Waktu (Opsional)</label>
            <input v-model="form.closingDate" type="date" class="admin-input">
            <p class="mt-1 text-xs text-gray">Kosongkan jika lowongan dibuka terus-menerus.</p>
          </div>
          <div class="flex items-center gap-2 pt-1">
            <input id="career-active" v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
            <label for="career-active" class="text-sm font-semibold text-black dark:text-white">Aktif (Ditampilkan)</label>
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
