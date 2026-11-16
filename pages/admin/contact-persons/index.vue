<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'contact_persons.view' })

const { can } = useAdminAuth()
const toast = useToast()
const viewMode = useAdminViewMode('contact-persons', 'table')

interface ContactPersonItem {
  _id: string
  name: string
  phone: string
  order?: number
  isActive: boolean
}

const { data: contacts, refresh } = await useFetch<ContactPersonItem[]>('/api/contact-persons')

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
    toast.success(modalMode.value === 'add' ? 'Kontak berhasil ditambahkan.' : 'Kontak berhasil diperbarui.')
    refresh()
  } catch (err: any) {
    toast.error(err.data?.message || 'Terjadi kesalahan.')
  } finally {
    isSubmitting.value = false
  }
}

const { ask } = useConfirm()

const deleteContact = async (item: any) => {
  const confirmed = await ask({
    title: 'Hapus Kontak Footer',
    message: 'Apakah Anda yakin ingin menghapus contact person ini dari footer website?',
    itemName: item.name ? `${item.name} (${item.phone})` : undefined,
    confirmText: 'Ya, Hapus',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/contact-persons/${item._id}`, { method: 'DELETE' })
    toast.success('Kontak berhasil dihapus.')
    refresh()
  } catch (err: any) {
    toast.error(err.data?.message || 'Terjadi kesalahan.')
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
    toast.error('Gagal menyimpan urutan.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Manajemen Kontak Footer</h1>
        <p class="mt-1 text-sm text-gray">Kelola daftar contact person yang tampil di footer website publik.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <AdminViewSwitcher v-model="viewMode" />
        <button v-if="can('contact_persons.create')" @click="openAddModal" class="admin-btn-primary">
          <Icon name="ph:plus-bold" class="h-4 w-4" aria-hidden="true" />
          <span>Tambah Kontak</span>
        </button>
      </div>
    </div>

    <!-- Instructions -->
    <div class="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-black dark:bg-primary/10 dark:text-gray-200">
      <Icon name="ph:info-bold" class="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <p class="text-sm leading-relaxed">
        Kontak yang ditambahkan di sini akan ditampilkan secara otomatis pada bagian footer (bawah) dari setiap halaman website publik. Anda bisa mengurutkan daftar kontak dengan cara menarik dan melepas {{ viewMode === 'table' ? 'baris' : 'kartu' }} (Drag &amp; Drop).
      </p>
    </div>

    <!-- Contacts Table -->
    <div v-if="viewMode === 'table'" class="admin-card !p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="w-10 px-6 py-3"></th>
              <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray">Nama &amp; Telepon</th>
              <th class="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray">Status</th>
              <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray/10 bg-white dark:bg-gray-dark">
            <tr v-if="!items || items.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-sm text-gray">
                Belum ada data kontak. Silakan tambah baru.
              </td>
            </tr>
            <tr
              v-for="(item, index) in items"
              :key="item._id"
              :draggable="can('contact_persons.update')"
              @dragstart="onDragStart(index)"
              @dragover.prevent
              @drop="onDrop(index)"
              class="transition-colors hover:bg-gray/5"
              :class="{ 'cursor-move': can('contact_persons.update'), 'opacity-50': draggedIndex === index }"
            >
              <td class="px-6 py-4 whitespace-nowrap text-gray-400">
                <Icon v-if="can('contact_persons.update')" name="ph:dots-six-vertical-bold" class="h-5 w-5 cursor-move" aria-hidden="true" />
              </td>
              <td class="px-6 py-4">
                <div class="font-bold text-black dark:text-white">{{ item.name }}</div>
                <div class="text-sm text-gray">{{ item.phone }}</div>
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="item.isActive ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'"
                >
                  {{ item.isActive ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button v-if="can('contact_persons.update')" @click="openEditModal(item)" class="mr-4 font-semibold text-primary hover:underline">Edit</button>
                <button v-if="can('contact_persons.delete')" @click="deleteContact(item)" class="font-semibold text-red-600 hover:underline dark:text-red-400">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Contacts Grid -->
    <div v-else>
      <div v-if="!items || items.length === 0" class="admin-card px-6 py-12 text-center text-sm text-gray">
        Belum ada data kontak. Silakan tambah baru.
      </div>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(item, index) in items"
          :key="item._id"
          :draggable="can('contact_persons.update')"
          @dragstart="onDragStart(index)"
          @dragover.prevent
          @drop="onDrop(index)"
          class="admin-card flex flex-col gap-3 transition-all"
          :class="{ 'cursor-move': can('contact_persons.update'), 'opacity-50 ring-2 ring-primary': draggedIndex === index }"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2 min-w-0">
              <Icon v-if="can('contact_persons.update')" name="ph:dots-six-vertical-bold" class="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
              <h2 class="truncate text-base font-bold text-black dark:text-white" :title="item.name">{{ item.name }}</h2>
            </div>
            <span
              class="shrink-0 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
              :class="item.isActive ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'"
            >
              {{ item.isActive ? 'Aktif' : 'Tidak Aktif' }}
            </span>
          </div>
          <p class="inline-flex items-center gap-2 text-sm text-gray">
            <Icon name="ph:phone-bold" class="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{{ item.phone }}</span>
          </p>
          <div class="mt-auto flex items-center justify-end gap-4 border-t border-gray/10 pt-3 text-sm font-medium">
            <button v-if="can('contact_persons.update')" type="button" class="font-semibold text-primary hover:underline" @click="openEditModal(item)">Edit</button>
            <button v-if="can('contact_persons.delete')" type="button" class="font-semibold text-red-600 hover:underline dark:text-red-400" @click="deleteContact(item)">Hapus</button>
          </div>
        </article>
      </div>
    </div>

    <!-- Modal Form -->
    <UiModal v-model="isModalOpen" :title="modalMode === 'add' ? 'Tambah Kontak Baru' : 'Edit Kontak'" size="sm">
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="admin-label">Nama Contact Person</label>
          <input v-model="form.name" type="text" required class="admin-input" placeholder="Misal: Henricus Judi Adrianto">
        </div>

        <div>
          <label class="admin-label">Nomor Telepon</label>
          <input v-model="form.phone" type="text" required class="admin-input" placeholder="Misal: 0811-7101-066">
        </div>

        <UiAdvancedOptions label="Opsi Lanjutan" hint="Visibilitas pada footer publik">
          <div class="flex items-center gap-2">
            <input v-model="form.isActive" id="isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
            <label for="isActive" class="text-sm font-semibold text-black dark:text-white">Tampilkan di Footer (Aktif)</label>
          </div>
        </UiAdvancedOptions>

        <div class="flex flex-col-reverse gap-2 border-t border-gray/10 pt-4 sm:flex-row sm:justify-end">
          <button @click="closeModal" type="button" class="admin-btn-ghost justify-center">Batal</button>
          <button type="submit" :disabled="isSubmitting" class="admin-btn-primary justify-center">
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>
