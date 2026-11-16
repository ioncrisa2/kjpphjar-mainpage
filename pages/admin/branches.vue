<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'branches.view' })
useHead({ title: "Admin Cabang | KJPP HJA'R" })

const { can } = useAdminAuth()
const toast = useToast()
const viewMode = useAdminViewMode('branches', 'table')

interface BranchItem {
  _id: string
  name: string
  city: string
  phone: string
  email: string
  address: string
  latitude: number | string
  longitude: number | string
  mapsUrl?: string
  order?: number
  isActive: boolean
}

const { data: branches, refresh, pending } = await useFetch<BranchItem[]>('/api/branches')

const modalOpen = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editId = ref('')

const form = reactive({
  name: '',
  city: '',
  phone: '',
  email: '',
  address: '',
  latitude: '',
  longitude: '',
  mapsUrl: '',
  order: 0,
  isActive: true
})

function resetForm() {
  isEditing.value = false
  editId.value = ''
  form.name = ''
  form.city = ''
  form.phone = ''
  form.email = ''
  form.address = ''
  form.latitude = ''
  form.longitude = ''
  form.mapsUrl = ''
  form.order = 0
  form.isActive = true
}

function openAdd() {
  resetForm()
  modalOpen.value = true
}

function openEdit(item: any) {
  isEditing.value = true
  editId.value = item._id
  form.name = item.name
  form.city = item.city
  form.phone = item.phone
  form.email = item.email
  form.address = item.address
  form.latitude = item.latitude
  form.longitude = item.longitude
  form.mapsUrl = item.mapsUrl || ''
  form.order = item.order || 0
  form.isActive = item.isActive !== false
  modalOpen.value = true
}

async function submitForm() {
  saving.value = true
  try {
    const url = isEditing.value ? `/api/branches/${editId.value}` : '/api/branches'
    const method = isEditing.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: form
    })
    
    modalOpen.value = false
    toast.success(isEditing.value ? 'Cabang berhasil diperbarui.' : 'Cabang berhasil ditambahkan.')
    refresh()
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Gagal menyimpan data.')
  } finally {
    saving.value = false
  }
}

const { ask } = useConfirm()

function branchActions(branch: any) {
  const actions: Array<{ label: string; icon?: string; variant?: 'default' | 'danger'; onClick?: () => void }> = []
  if (can('branches.update')) {
    actions.push({ label: 'Edit Cabang', icon: 'ph:pencil-simple-bold', onClick: () => openEdit(branch) })
  }
  if (can('branches.delete')) {
    actions.push({ label: 'Hapus', icon: 'ph:trash-bold', variant: 'danger', onClick: () => deleteItem(branch) })
  }
  return actions
}

async function deleteItem(branch: any) {
  const confirmed = await ask({
    title: 'Hapus Cabang',
    message: 'Apakah Anda yakin ingin menghapus data cabang ini?',
    itemName: branch.name ? `${branch.name} (${branch.city})` : undefined,
    confirmText: 'Ya, Hapus',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/branches/${branch._id}`, { method: 'DELETE' })
    toast.success('Cabang berhasil dihapus.')
    refresh()
  } catch (err) {
    toast.error('Gagal menghapus cabang.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Cabang</h1>
        <p class="mt-1 text-sm text-gray">Kelola informasi cabang KJPP HJA'R.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <AdminViewSwitcher v-model="viewMode" />
        <button v-if="can('branches.create')" @click="openAdd" class="admin-btn-primary">
          + Tambah Cabang
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-if="pending" class="admin-card p-6 text-center text-gray-500">Memuat data...</div>
    <div v-else-if="!branches?.length" class="admin-card p-6 text-center text-gray-500">
      Belum ada data cabang.
    </div>

    <!-- Table View -->
    <div v-else-if="viewMode === 'table'" class="admin-card !p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Nama Cabang</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Kota / Kontak</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-bold text-gray uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray/10 bg-white dark:bg-gray-dark">
            <tr v-for="branch in branches" :key="branch._id">
              <td class="px-6 py-4">
                <div class="font-bold text-black dark:text-white">{{ branch.name }}</div>
                <div class="text-sm text-gray truncate w-48" :title="branch.address">{{ branch.address }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-black dark:text-white">{{ branch.city }}</div>
                <div class="text-sm text-gray">{{ branch.phone }}</div>
              </td>
              <td class="px-6 py-4">
                <span v-if="branch.isActive" class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">Aktif</span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Nonaktif</span>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <UiActionMenu v-if="branchActions(branch).length" :items="branchActions(branch)" :label="`Aksi untuk ${branch.name}`" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article v-for="branch in branches" :key="branch._id" class="admin-card flex flex-col gap-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="truncate text-base font-extrabold text-black dark:text-white" :title="branch.name">{{ branch.name }}</h2>
            <p class="mt-0.5 text-xs font-semibold text-primary">{{ branch.city }}</p>
          </div>
          <UiActionMenu v-if="branchActions(branch).length" :items="branchActions(branch)" :label="`Aksi untuk ${branch.name}`" />
        </div>
        <p class="line-clamp-2 text-xs text-gray" :title="branch.address">{{ branch.address }}</p>
        <div class="space-y-1 rounded-xl bg-gray/5 p-3 text-xs">
          <div class="flex items-center gap-2 text-black dark:text-gray-200">
            <Icon name="ph:phone-bold" class="h-3.5 w-3.5 shrink-0 text-gray" aria-hidden="true" />
            <span class="truncate">{{ branch.phone }}</span>
          </div>
          <div v-if="branch.email" class="flex items-center gap-2 text-gray">
            <Icon name="ph:envelope-simple-bold" class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span class="truncate">{{ branch.email }}</span>
          </div>
        </div>
        <div class="mt-auto flex items-center justify-between border-t border-gray/10 pt-3">
          <span class="text-xs tabular-nums text-gray">Urutan: {{ branch.order ?? 0 }}</span>
          <span v-if="branch.isActive" class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">Aktif</span>
          <span v-else class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Nonaktif</span>
        </div>
      </article>
    </div>

    <!-- Modal Form -->
    <UiModal v-model="modalOpen" :title="isEditing ? 'Edit Cabang' : 'Tambah Cabang Baru'" size="lg">
      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="admin-label">Nama Cabang</label>
            <input v-model="form.name" type="text" required class="admin-input">
          </div>
          <div>
            <label class="admin-label">Kota</label>
            <input v-model="form.city" type="text" required class="admin-input">
          </div>
          <div>
            <label class="admin-label">Telepon</label>
            <input v-model="form.phone" type="text" required class="admin-input">
          </div>
          <div>
            <label class="admin-label">Email</label>
            <input v-model="form.email" type="email" required class="admin-input">
          </div>
          <div class="md:col-span-2">
            <label class="admin-label">Alamat Lengkap</label>
            <textarea v-model="form.address" rows="2" required class="admin-input resize-y"></textarea>
          </div>
          <div>
            <label class="admin-label">Latitude</label>
            <input v-model="form.latitude" type="number" step="any" required class="admin-input">
          </div>
          <div>
            <label class="admin-label">Longitude</label>
            <input v-model="form.longitude" type="number" step="any" required class="admin-input">
          </div>
        </div>
        <UiAdvancedOptions label="Opsi Lanjutan" hint="URL Google Maps, urutan tampil, dan visibilitas cabang">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="admin-label">URL Google Maps (Opsional)</label>
              <input v-model="form.mapsUrl" type="url" class="admin-input">
            </div>
            <div>
              <label class="admin-label">Urutan Tampil (Order)</label>
              <input v-model="form.order" type="number" class="admin-input">
            </div>
            <div class="flex items-center gap-2 md:pt-7">
              <input id="branch-active" v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
              <label for="branch-active" class="text-sm font-semibold text-black dark:text-white">Aktif (Ditampilkan)</label>
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
