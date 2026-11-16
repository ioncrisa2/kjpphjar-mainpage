<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'staff.view' })
useHead({ title: "Admin Staff | KJPP HJA'R" })

const { can } = useAdminAuth()
const toast = useToast()

const { data: staffList, refresh, pending } = await useFetch<any[]>('/api/staff', { query: { admin: 'true' } })
const { data: branches } = await useFetch<any[]>('/api/branches')

const modalOpen = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editId = ref('')
// Kantor staff yang sedang diedit, agar tetap bisa dipilih walau kantornya sudah nonaktif
const editingBranch = ref<any | null>(null)

const form = reactive({
  name: '',
  position: '',
  branchId: '',
  mappiNumber: '',
  order: 0,
  isActive: true
})

const search = ref('')
const branchFilter = ref('')

const branchOptions = computed(() => {
  const list = [...(branches.value || [])]
  if (editingBranch.value && !list.some((branch) => branch._id === editingBranch.value._id)) {
    list.push(editingBranch.value)
  }
  return list
})

const filteredStaff = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  return (staffList.value || []).filter((staff) => {
    if (branchFilter.value && staff.branchId?._id !== branchFilter.value) return false
    if (!keyword) return true
    return [staff.name, staff.position, staff.mappiNumber]
      .some((value) => String(value || '').toLowerCase().includes(keyword))
  })
})

function resetForm() {
  isEditing.value = false
  editId.value = ''
  editingBranch.value = null
  form.name = ''
  form.position = ''
  form.branchId = ''
  form.mappiNumber = ''
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
  editingBranch.value = item.branchId || null
  form.name = item.name
  form.position = item.position
  form.branchId = item.branchId?._id || ''
  form.mappiNumber = item.mappiNumber || ''
  form.order = item.order || 0
  form.isActive = item.isActive !== false
  modalOpen.value = true
}

async function submitForm() {
  saving.value = true
  try {
    const url = isEditing.value ? `/api/staff/${editId.value}` : '/api/staff'
    const method = isEditing.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: form
    })

    modalOpen.value = false
    toast.success(isEditing.value ? 'Data staff diperbarui.' : 'Staff berhasil ditambahkan.')
    refresh()
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Gagal menyimpan data.')
  } finally {
    saving.value = false
  }
}

const { ask } = useConfirm()

function staffActions(staff: any) {
  const actions: Array<{ label: string; icon?: string; variant?: 'default' | 'danger'; onClick?: () => void }> = []
  if (can('staff.update')) {
    actions.push({ label: 'Edit Staff', icon: 'ph:pencil-simple-bold', onClick: () => openEdit(staff) })
  }
  if (can('staff.delete')) {
    actions.push({ label: 'Hapus', icon: 'ph:trash-bold', variant: 'danger', onClick: () => deleteItem(staff) })
  }
  return actions
}

async function deleteItem(staff: any) {
  const confirmed = await ask({
    title: 'Hapus Staff',
    message: 'Apakah Anda yakin ingin menghapus data staff ini?',
    itemName: staff.name ? `${staff.name} — ${staff.position}` : undefined,
    confirmText: 'Ya, Hapus',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/staff/${staff._id}`, { method: 'DELETE' })
    toast.success('Data staff berhasil dihapus.')
    refresh()
  } catch (err) {
    toast.error('Gagal menghapus data.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Staff</h1>
        <p class="mt-1 text-sm text-gray">Daftar staff kantor pusat maupun cabang. Staff aktif ditampilkan di halaman Tentang Kami dan Kontak.</p>
      </div>
      <button v-if="can('staff.create')" @click="openAdd" class="admin-btn-primary">
        + Tambah Staff
      </button>
    </div>

    <!-- Filter -->
    <section class="admin-card" aria-label="Filter staff">
      <div class="grid gap-3 md:grid-cols-[minmax(240px,1fr)_240px]">
        <label class="relative">
          <span class="sr-only">Cari staff</span>
          <Icon name="ph:magnifying-glass-bold" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray" />
          <input v-model="search" type="search" class="admin-input !pl-11" placeholder="Cari nama, jabatan, atau nomor MAPPI">
        </label>
        <label>
          <span class="sr-only">Filter kantor</span>
          <select v-model="branchFilter" class="admin-input">
            <option value="">Semua kantor</option>
            <option v-for="branch in branches" :key="branch._id" :value="branch._id">{{ branch.name }}</option>
          </select>
        </label>
      </div>
    </section>

    <!-- Table -->
    <div class="admin-card overflow-hidden">
      <div v-if="pending" class="p-6 text-center text-gray-500">Memuat data...</div>
      <div v-else-if="!staffList?.length" class="p-6 text-center text-gray-500">
        Belum ada data staff.
      </div>
      <div v-else-if="!filteredStaff.length" class="p-6 text-center text-gray-500">
        Tidak ada staff yang cocok dengan filter.
      </div>
      <div v-else class="overflow-x-auto">
        <p class="pb-3 text-xs text-gray">{{ filteredStaff.length }} dari {{ staffList?.length }} staff</p>
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Nama</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Jabatan</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Kantor</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">No. MAPPI</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Urutan</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-bold text-gray uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray/10 bg-white dark:bg-gray-dark">
            <tr v-for="staff in filteredStaff" :key="staff._id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-black dark:text-white">{{ staff.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{{ staff.position }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="staff.branchId" class="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-200">{{ staff.branchId.name }}</span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Kantor terhapus</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray">{{ staff.mappiNumber || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm tabular-nums text-gray">{{ staff.order || 0 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="staff.isActive !== false" class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">Aktif</span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Nonaktif</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UiActionMenu v-if="staffActions(staff).length" :items="staffActions(staff)" :label="`Aksi untuk ${staff.name}`" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <UiModal v-model="modalOpen" :title="isEditing ? 'Edit Staff' : 'Tambah Staff Baru'" size="md">
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="admin-label">Nama</label>
          <input v-model="form.name" type="text" required maxlength="200" class="admin-input">
        </div>
        <div>
          <label class="admin-label">Jabatan</label>
          <input v-model="form.position" type="text" required maxlength="200" class="admin-input">
        </div>
        <div>
          <label class="admin-label">Kantor Penempatan (Pusat / Cabang)</label>
          <select v-model="form.branchId" required class="admin-input">
            <option value="" disabled>Pilih kantor</option>
            <option v-for="branch in branchOptions" :key="branch._id" :value="branch._id">
              {{ branch.name }}{{ branch.city ? ` (${branch.city})` : '' }}
            </option>
          </select>
          <p v-if="isEditing && !form.branchId" class="mt-1 text-xs text-red-600 dark:text-red-400">Kantor sebelumnya sudah dihapus. Pilih kantor yang baru.</p>
          <p v-else class="mt-1 text-xs text-gray">Daftar kantor diambil dari menu Cabang.</p>
        </div>
        <UiAdvancedOptions label="Opsi Lanjutan" hint="Nomor MAPPI, urutan tampil, dan status aktif">
          <div>
            <label class="admin-label">Nomor MAPPI <span class="font-normal text-gray">(opsional)</span></label>
            <input v-model="form.mappiNumber" type="text" maxlength="100" class="admin-input">
            <p class="mt-1 text-xs text-gray">Jika diisi, nomor MAPPI ikut tampil di website.</p>
          </div>
          <div>
            <label class="admin-label">Urutan Tampil</label>
            <input v-model.number="form.order" type="number" min="0" max="9999" step="1" class="admin-input">
            <p class="mt-1 text-xs text-gray">Angka kecil tampil lebih dulu dalam kantor yang sama.</p>
          </div>
          <div class="flex items-center gap-2 pt-1">
            <input id="staff-active" v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
            <label for="staff-active" class="text-sm font-semibold text-black dark:text-white">Aktif (ditampilkan di website)</label>
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
