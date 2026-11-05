<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'staff.view' })
useHead({ title: "Admin Staff | KJPP HJA'R" })

const { can } = useAdminAuth()

const { data: staffList, refresh, pending } = await useFetch<any[]>('/api/staff')
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
  mappiNumber: ''
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
    refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Gagal menyimpan data')
  } finally {
    saving.value = false
  }
}

const { ask } = useConfirm()

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
    refresh()
  } catch (err) {
    alert('Gagal menghapus data')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Staff</h1>
        <p class="mt-1 text-sm text-gray">Daftar staff yang terdaftar di KJPP HJA'R, kantor pusat maupun cabang.</p>
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
              <th class="px-6 py-3 text-right text-xs font-bold text-gray uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray/10">
            <tr v-for="staff in filteredStaff" :key="staff._id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ staff.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ staff.position }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="staff.branchId" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{{ staff.branchId.name }}</span>
                <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Kantor terhapus</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ staff.mappiNumber || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button v-if="can('staff.update')" @click="openEdit(staff)" class="text-primary hover:text-blue-900 mr-4">Edit</button>
                <button v-if="can('staff.delete')" @click="deleteItem(staff)" class="text-red-600 hover:text-red-900">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <UiModal v-model="modalOpen" :title="isEditing ? 'Edit Staff' : 'Tambah Staff Baru'">
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nama</label>
          <input v-model="form.name" type="text" required maxlength="200" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Jabatan</label>
          <input v-model="form.position" type="text" required maxlength="200" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Kantor Penempatan (Pusat / Cabang)</label>
          <select v-model="form.branchId" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
            <option value="" disabled>Pilih kantor</option>
            <option v-for="branch in branchOptions" :key="branch._id" :value="branch._id">
              {{ branch.name }}{{ branch.city ? ` (${branch.city})` : '' }}
            </option>
          </select>
          <p v-if="isEditing && !form.branchId" class="mt-1 text-xs text-red-600">Kantor sebelumnya sudah dihapus. Pilih kantor yang baru.</p>
          <p v-else class="mt-1 text-xs text-gray-500">Daftar kantor diambil dari menu Cabang.</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nomor MAPPI <span class="font-normal text-gray-500">(opsional)</span></label>
          <input v-model="form.mappiNumber" type="text" maxlength="100" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
        </div>

        <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-2">
          <button type="submit" :disabled="saving" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:w-auto sm:text-sm disabled:opacity-50">
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
          <button type="button" @click="modalOpen = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
            Batal
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>
