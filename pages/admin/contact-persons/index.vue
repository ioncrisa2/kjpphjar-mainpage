<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const { data: contacts, refresh } = await useFetch('/api/contact-persons')

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const selectedContact = ref<any>(null)

const form = ref({
  name: '',
  phone: '',
  isActive: true,
})

const openAddModal = () => {
  modalMode.value = 'add'
  selectedContact.value = null
  form.value = { name: '', phone: '', isActive: true }
  isModalOpen.value = true
}

const openEditModal = (contact: any) => {
  modalMode.value = 'edit'
  selectedContact.value = contact
  form.value = { ...contact }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const submitForm = async () => {
  isSubmitting.value = true
  try {
    if (modalMode.value === 'add') {
      await $fetch('/api/contact-persons', { method: 'POST', body: form.value })
    } else {
      await $fetch(`/api/contact-persons/${selectedContact.value._id}`, { method: 'PUT', body: form.value })
    }
    closeModal()
    refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Terjadi kesalahan')
  } finally {
    isSubmitting.value = false
  }
}

const deleteContact = async (id: string) => {
  if (!confirm('Apakah Anda yakin ingin menghapus kontak ini?')) return
  try {
    await $fetch(`/api/contact-persons/${id}`, { method: 'DELETE' })
    refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Terjadi kesalahan')
  }
}

// Drag and Drop Logic
const draggedIndex = ref<number | null>(null)
const items = ref<any[]>([])

// Synchronize items with fetched data
watch(contacts, (newVal) => {
  if (newVal) {
    items.value = [...newVal]
  }
}, { immediate: true })

const onDragStart = (index: number) => {
  draggedIndex.value = index
}

const onDrop = async (dropIndex: number) => {
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) return
  
  const itemToMove = items.value[draggedIndex.value]
  items.value.splice(draggedIndex.value, 1)
  items.value.splice(dropIndex, 0, itemToMove)
  
  // Update orders internally
  items.value.forEach((item, idx) => {
    item.order = idx
  })
  
  draggedIndex.value = null
  
  // Save new orders to backend
  try {
    await Promise.all(items.value.map(item => 
      $fetch(`/api/contact-persons/${item._id}`, {
        method: 'PUT',
        body: { order: item.order }
      })
    ))
  } catch (error) {
    console.error('Failed to save order:', error)
    alert('Gagal menyimpan urutan')
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Manajemen Kontak Footer</h1>
      <button @click="openAddModal" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
        <i class="fas fa-plus mr-2"></i> Tambah Kontak
      </button>
    </div>

    <!-- Instructions -->
    <div class="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 flex items-start">
      <i class="fas fa-info-circle mt-1 mr-3"></i>
      <p class="text-sm">
        Kontak yang ditambahkan di sini akan ditampilkan secara otomatis pada bagian footer (bawah) dari setiap halaman website publik. Anda bisa mengurutkan daftar kontak dengan cara menarik dan melepas baris (Drag & Drop).
      </p>
    </div>

    <!-- Contacts Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="w-10 px-6 py-3"></th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama & Telepon</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="!items || items.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-gray-500">
              Belum ada data kontak. Silakan tambah baru.
            </td>
          </tr>
          <tr 
            v-for="(item, index) in items" 
            :key="item._id"
            draggable="true"
            @dragstart="onDragStart(index)"
            @dragover.prevent
            @drop="onDrop(index)"
            class="hover:bg-gray-50 cursor-move transition-colors"
            :class="{'opacity-50': draggedIndex === index}"
          >
            <td class="px-6 py-4 whitespace-nowrap text-gray-400">
              <i class="fas fa-grip-lines cursor-move"></i>
            </td>
            <td class="px-6 py-4">
              <div class="font-medium text-gray-900">{{ item.name }}</div>
              <div class="text-sm text-gray-500">{{ item.phone }}</div>
            </td>
            <td class="px-6 py-4 text-center whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ item.isActive ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openEditModal(item)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
              <button @click="deleteContact(item._id)" class="text-red-600 hover:text-red-900">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
      <div class="relative w-full max-w-md rounded-xl bg-white shadow-lg">
        <!-- Modal header -->
        <div class="flex items-center justify-between border-b p-5">
          <h3 class="text-xl font-bold text-gray-900">
            {{ modalMode === 'add' ? 'Tambah Kontak Baru' : 'Edit Kontak' }}
          </h3>
          <button @click="closeModal" type="button" class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6">
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-gray-900">Nama Contact Person</label>
              <input v-model="form.name" type="text" required class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500" placeholder="Misal: Henricus Judi Adrianto">
            </div>
            
            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-gray-900">Nomor Telepon</label>
              <input v-model="form.phone" type="text" required class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500" placeholder="Misal: 0811-7101-066">
            </div>

            <div class="mb-6 flex items-center">
              <input v-model="form.isActive" id="isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500">
              <label for="isActive" class="ml-2 text-sm font-medium text-gray-900">Tampilkan di Footer (Aktif)</label>
            </div>
            
            <div class="flex items-center space-x-3 rounded-b border-t border-gray-200 pt-5">
              <button type="submit" :disabled="isSubmitting" class="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50">
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
              <button @click="closeModal" type="button" class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200">Batal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
