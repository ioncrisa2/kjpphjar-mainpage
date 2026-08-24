<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Admin Pimpinan | KJPP HJA'R" })

const { data: leaders, refresh, pending } = await useFetch('/api/leaders')

const modalOpen = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editId = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  name: '',
  position: '',
  bio: '',
  order: 0,
  isActive: true
})

function resetForm() {
  isEditing.value = false
  editId.value = ''
  form.name = ''
  form.position = ''
  form.bio = ''
  form.order = 0
  form.isActive = true
  if (fileInput.value) fileInput.value.value = ''
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
  form.order = item.order || 0
  form.isActive = item.isActive !== false
  if (fileInput.value) fileInput.value.value = ''
  modalOpen.value = true
}

async function submitForm() {
  const file = fileInput.value?.files?.[0]
  if (!isEditing.value && !file) {
    alert('Foto wajib diunggah untuk pimpinan baru')
    return
  }

  saving.value = true
  try {
    const formData = new FormData()
    if (file) formData.append('image', file)
    formData.append('name', form.name)
    formData.append('position', form.position)
    formData.append('bio', form.bio)
    formData.append('order', String(form.order))
    formData.append('isActive', String(form.isActive))

    const url = isEditing.value ? `/api/leaders/${editId.value}` : '/api/leaders'
    const method = isEditing.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: formData
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
  if (!confirm('Yakin ingin menghapus data ini?')) return
  try {
    await $fetch(`/api/leaders/${id}`, { method: 'DELETE' })
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
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Pimpinan</h1>
        <p class="mt-1 text-sm text-gray">Kelola profil pimpinan KJPP HJA'R.</p>
      </div>
      <button @click="openAdd" class="admin-btn-primary">
        + Tambah Pimpinan
      </button>
    </div>

    <!-- Table -->
    <div class="admin-card overflow-hidden">
      <div v-if="pending" class="p-6 text-center text-gray-500">Memuat data...</div>
      <div v-else-if="!leaders?.length" class="p-6 text-center text-gray-500">
        Belum ada data pimpinan.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Profil</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Jabatan</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Urutan</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-bold text-gray uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray/10">
            <tr v-for="leader in leaders" :key="leader._id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full object-cover" :src="leader.photoUrl" :alt="leader.name">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ leader.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ leader.position }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ leader.order }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="leader.isActive" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>
                <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Nonaktif</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openEdit(leader)" class="text-primary hover:text-blue-900 mr-4">Edit</button>
                <button @click="deleteItem(leader._id)" class="text-red-600 hover:text-red-900">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <UiModal v-model="modalOpen" :title="isEditing ? 'Edit Pimpinan' : 'Tambah Pimpinan Baru'">
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Foto</label>
          <input type="file" ref="fileInput" accept="image/*" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm" :required="!isEditing">
          <p v-if="isEditing" class="mt-1 text-xs text-gray-500">Biarkan kosong jika tidak ingin mengubah foto.</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nama</label>
          <input v-model="form.name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Jabatan</label>
          <input v-model="form.position" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Biografi Singkat</label>
          <textarea v-model="form.bio" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Urutan Tampil (Order)</label>
          <input v-model="form.order" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
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
