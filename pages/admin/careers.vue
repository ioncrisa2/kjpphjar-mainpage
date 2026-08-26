<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Admin Karir | KJPP HJA'R" })

const { data: careers, refresh, pending } = await useFetch('/api/careers?admin=true')

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
    refresh()
  } catch (err: any) {
    alert(err.data?.statusMessage || 'Gagal menyimpan data')
  } finally {
    saving.value = false
  }
}

const { ask } = useConfirm()

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
    refresh()
  } catch (err) {
    alert('Gagal menghapus lowongan')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Karir / Lowongan</h1>
        <p class="mt-1 text-sm text-gray">Kelola informasi lowongan pekerjaan.</p>
      </div>
      <button @click="openAdd" class="admin-btn-primary">
        + Tambah Lowongan
      </button>
    </div>

    <!-- Table -->
    <div class="admin-card overflow-hidden">
      <div v-if="pending" class="p-6 text-center text-gray-500">Memuat data...</div>
      <div v-else-if="!careers?.length" class="p-6 text-center text-gray-500">
        Belum ada lowongan pekerjaan.
      </div>
      <div v-else class="overflow-x-auto">
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
          <tbody class="bg-white divide-y divide-gray/10">
            <tr v-for="career in careers" :key="career._id">
              <td class="px-6 py-4">
                <div class="font-bold text-black dark:text-white">{{ career.title }}</div>
                <div class="text-xs text-gray mt-1">Dibuat: {{ new Date(career.postedAt).toLocaleDateString('id-ID') }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium">{{ career.type }}</div>
                <div class="text-sm text-gray">{{ career.location }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray">
                {{ career.closingDate ? new Date(career.closingDate).toLocaleDateString('id-ID') : 'Tidak Ada Batas' }}
              </td>
              <td class="px-6 py-4">
                <span v-if="career.isActive" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>
                <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Nonaktif</span>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <button @click="openEdit(career)" class="text-primary hover:text-blue-900 mr-4">Edit</button>
                <button @click="deleteItem(career)" class="text-red-600 hover:text-red-900">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <UiModal v-model="modalOpen" :title="isEditing ? 'Edit Lowongan' : 'Tambah Lowongan Baru'">
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Posisi Pekerjaan</label>
          <input v-model="form.title" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Tipe</label>
            <select v-model="form.type" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Lokasi</label>
            <input v-model="form.location" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Batas Waktu (Opsional)</label>
          <input v-model="form.closingDate" type="date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
          <p class="text-xs text-gray-500 mt-1">Kosongkan jika lowongan dibuka terus-menerus.</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Deskripsi Pekerjaan</label>
          <textarea v-model="form.description" rows="3" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Persyaratan (Pisahkan dengan baris baru)</label>
          <textarea v-model="form.requirements" rows="4" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" placeholder="- Minimal S1&#10;- Pengalaman 1 tahun"></textarea>
        </div>
        
        <div class="flex items-center mt-6">
          <input v-model="form.isActive" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
          <label class="ml-2 block text-sm text-gray-900">Aktif (Ditampilkan)</label>
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
