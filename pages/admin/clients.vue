<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Admin Klien | KJPP HJA'R" })

const { data: clients, refresh, pending } = await useFetch('/api/clients')

const modalOpen = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editId = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  name: '',
  category: '',
  order: 0,
  isActive: true
})

function resetForm() {
  isEditing.value = false
  editId.value = ''
  form.name = ''
  form.category = ''
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
  form.category = item.category || ''
  form.order = item.order || 0
  form.isActive = item.isActive !== false
  if (fileInput.value) fileInput.value.value = ''
  modalOpen.value = true
}

async function submitForm() {
  const file = fileInput.value?.files?.[0]
  if (!isEditing.value && !file) {
    alert('Logo wajib diunggah untuk klien baru')
    return
  }

  saving.value = true
  try {
    const formData = new FormData()
    if (file) formData.append('image', file)
    formData.append('name', form.name)
    formData.append('category', form.category)
    formData.append('order', String(form.order))
    formData.append('isActive', String(form.isActive))

    const url = isEditing.value ? `/api/clients/${editId.value}` : '/api/clients'
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
  if (!confirm('Yakin ingin menghapus klien ini?')) return
  try {
    await $fetch(`/api/clients/${id}`, { method: 'DELETE' })
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
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Rekan & Klien</h1>
        <p class="mt-1 text-sm text-gray">Kelola logo klien yang tampil di website.</p>
      </div>
      <button @click="openAdd" class="admin-btn-primary">
        + Tambah Klien
      </button>
    </div>

    <!-- Grid -->
    <div class="admin-card">
      <div v-if="pending" class="p-6 text-center text-gray-500">Memuat data...</div>
      <div v-else-if="!clients?.length" class="p-6 text-center text-gray-500">
        Belum ada data klien.
      </div>
      <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-4">
        <div v-for="client in clients" :key="client._id" class="border rounded-lg p-4 flex flex-col items-center relative group bg-white">
          <div class="h-24 w-full flex items-center justify-center mb-4">
            <img :src="client.logoUrl" :alt="client.name" class="max-h-full max-w-full object-contain">
          </div>
          <h3 class="text-sm font-medium text-gray-900 text-center line-clamp-1 w-full" :title="client.name">{{ client.name }}</h3>
          <p class="text-xs text-gray-500 mt-1">{{ client.category || 'Tanpa Kategori' }}</p>
          
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-4">
            <button @click="openEdit(client)" class="text-white hover:text-blue-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </button>
            <button @click="deleteItem(client._id)" class="text-white hover:text-red-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
          <div v-if="!client.isActive" class="absolute top-2 left-2">
            <span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">Hidden</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <UiModal v-model="modalOpen" :title="isEditing ? 'Edit Klien' : 'Tambah Klien Baru'">
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Logo</label>
          <input type="file" ref="fileInput" accept="image/*" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm" :required="!isEditing">
          <p v-if="isEditing" class="mt-1 text-xs text-gray-500">Biarkan kosong jika tidak ingin mengubah logo.</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nama Klien</label>
          <input v-model="form.name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Kategori (Opsional)</label>
          <input v-model="form.category" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" placeholder="Contoh: BUMN, Swasta, Perbankan">
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
