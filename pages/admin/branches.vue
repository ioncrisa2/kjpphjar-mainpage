<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Admin Cabang | KJPP HJA'R" })

const { data: branches, refresh, pending } = await useFetch('/api/branches')

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
    refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Gagal menyimpan data')
  } finally {
    saving.value = false
  }
}

async function deleteItem(id: string) {
  if (!confirm('Yakin ingin menghapus cabang ini?')) return
  try {
    await $fetch(`/api/branches/${id}`, { method: 'DELETE' })
    refresh()
  } catch (err) {
    alert('Gagal menghapus cabang')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Cabang</h1>
        <p class="mt-1 text-sm text-gray">Kelola informasi cabang KJPP HJA'R.</p>
      </div>
      <button @click="openAdd" class="admin-btn-primary">
        + Tambah Cabang
      </button>
    </div>

    <!-- Table -->
    <div class="admin-card overflow-hidden">
      <div v-if="pending" class="p-6 text-center text-gray-500">Memuat data...</div>
      <div v-else-if="!branches?.length" class="p-6 text-center text-gray-500">
        Belum ada data cabang.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Nama Cabang</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Kota / Kontak</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-bold text-gray uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray/10">
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
                <span v-if="branch.isActive" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>
                <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Nonaktif</span>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <button @click="openEdit(branch)" class="text-primary hover:text-blue-900 mr-4">Edit</button>
                <button @click="deleteItem(branch._id)" class="text-red-600 hover:text-red-900">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <UiModal v-model="modalOpen" :title="isEditing ? 'Edit Cabang' : 'Tambah Cabang Baru'">
      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama Cabang</label>
            <input v-model="form.name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Kota</label>
            <input v-model="form.city" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Telepon</label>
            <input v-model="form.phone" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="form.email" type="email" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
            <textarea v-model="form.address" rows="2" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Latitude</label>
            <input v-model="form.latitude" type="number" step="any" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Longitude</label>
            <input v-model="form.longitude" type="number" step="any" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">URL Google Maps (Opsional)</label>
            <input v-model="form.mapsUrl" type="url" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Urutan Tampil (Order)</label>
            <input v-model="form.order" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
          </div>
          <div class="flex items-center mt-6">
            <input v-model="form.isActive" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
            <label class="ml-2 block text-sm text-gray-900">Aktif (Ditampilkan)</label>
          </div>
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
