<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'clients.view' })
useHead({ title: "Admin Klien | KJPP HJA'R" })

const { can } = useAdminAuth()
const toast = useToast()
// Mengurutkan menyentuh semua klien, jadi khusus clients.manage_all.
const canReorder = computed(() => can('clients.manage_all'))

const { data: clientsResponse, refresh, pending } = await useFetch('/api/clients?all=true')
const clients = computed(() => clientsResponse.value?.items || [])

const modalOpen = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editId = ref('')
const selectedLogo = ref<File | null>(null)
const editingLogoUrl = ref('')

const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const form = reactive({
  name: '',
  category: '',
  isActive: true
})

function resetForm() {
  isEditing.value = false
  editId.value = ''
  form.name = ''
  form.category = ''
  form.isActive = true
  selectedLogo.value = null
  editingLogoUrl.value = ''
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
  form.isActive = item.isActive !== false
  selectedLogo.value = null
  editingLogoUrl.value = item.logoUrl || ''
  modalOpen.value = true
}

async function submitForm() {
  const file = selectedLogo.value
  if (!isEditing.value && !file) {
    toast.error('Logo wajib diunggah untuk klien baru.')
    return
  }

  saving.value = true
  try {
    const formData = new FormData()
    if (file) formData.append('image', file)
    formData.append('name', form.name)
    formData.append('category', form.category)
    formData.append('isActive', String(form.isActive))

    const url = isEditing.value ? `/api/clients/${editId.value}` : '/api/clients'
    const method = isEditing.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: formData
    })
    
    modalOpen.value = false
    toast.success(isEditing.value ? 'Data klien diperbarui.' : 'Klien berhasil ditambahkan.')
    refresh()
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Gagal menyimpan data.')
  } finally {
    saving.value = false
  }
}

const { ask } = useConfirm()

function clientActions(client: any) {
  const actions: Array<{
    label: string
    icon?: string
    variant?: 'default' | 'danger'
    onClick?: () => void
  }> = []
  if (can('clients.update')) {
    actions.push({ label: 'Edit Klien', icon: 'ph:pencil-simple-bold', onClick: () => openEdit(client) })
  }
  if (can('clients.delete')) {
    actions.push({ label: 'Hapus', icon: 'ph:trash-bold', variant: 'danger', onClick: () => deleteItem(client) })
  }
  return actions
}

async function deleteItem(client: any) {
  const confirmed = await ask({
    title: 'Hapus Klien / Rekanan',
    message: 'Apakah Anda yakin ingin menghapus data klien ini?',
    itemName: client.name || undefined,
    confirmText: 'Ya, Hapus',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/clients/${client._id}`, { method: 'DELETE' })
    toast.success('Klien berhasil dihapus.')
    refresh()
  } catch (err) {
    toast.error('Gagal menghapus data.')
  }
}

function onDragStart(index: number, event: DragEvent) {
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', index.toString())
  }
}

function onDragOver(index: number, event: DragEvent) {
  event.preventDefault()
  if (draggedIndex.value === null) return
  dragOverIndex.value = index
}

function onDragLeave(index: number, event: DragEvent) {
  if (dragOverIndex.value === index) {
    dragOverIndex.value = null
  }
}

async function onDrop(index: number, event: DragEvent) {
  event.preventDefault()
  dragOverIndex.value = null
  if (draggedIndex.value === null) return
  if (draggedIndex.value === index) return

  const items = clientsResponse.value?.items
  if (!items) return

  // Reorder visually
  const draggedItem = items[draggedIndex.value]
  items.splice(draggedIndex.value, 1)
  items.splice(index, 0, draggedItem)

  draggedIndex.value = null

  // Save to API
  await saveOrder()
}

async function saveOrder() {
  saving.value = true
  try {
    const clientIds = clientsResponse.value!.items.map((c: any) => c._id)
    await $fetch('/api/clients/reorder', {
      method: 'PUT',
      body: { clientIds }
    })
  } catch (err) {
    toast.error('Gagal menyimpan urutan baru.')
    refresh()
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Rekan & Klien</h1>
        <p class="mt-1 text-sm text-gray">
          Kelola logo klien yang tampil di website.
          <template v-if="canReorder">Anda bisa drag &amp; drop (geser) kartu klien di bawah untuk mengatur urutannya.</template>
          <template v-else>Daftar ini hanya menampilkan klien yang Anda tambahkan.</template>
        </p>
      </div>
      <button v-if="can('clients.create')" @click="openAdd" class="admin-btn-primary">
        + Tambah Klien
      </button>
    </div>

    <!-- Grid -->
    <div class="admin-card">
      <div v-if="pending" class="p-6 text-center text-gray-500">Memuat data...</div>
      <div v-else-if="!clients.length" class="p-6 text-center text-gray-500">
        Belum ada data klien.
      </div>
      <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-4">
        <div
          v-for="(client, index) in clients"
          :key="client._id"
          :draggable="canReorder"
          @dragstart="onDragStart(index, $event)"
          @dragover="onDragOver(index, $event)"
          @dragleave="onDragLeave(index, $event)"
          @drop="onDrop(index, $event)"
          :class="[
            'border border-gray/15 rounded-xl p-4 pt-10 flex flex-col items-center relative bg-white dark:border-white/10 dark:bg-gray-dark transition-all duration-200',
            canReorder ? 'cursor-move' : '',
            draggedIndex === index ? 'opacity-50 ring-2 ring-primary ring-offset-2' : '',
            dragOverIndex === index && draggedIndex !== index ? 'ring-2 ring-primary/60 ring-offset-2 bg-primary/5 transform scale-[1.02]' : ''
          ]"
        >
          <div v-if="!client.isActive" class="absolute top-2.5 left-2.5">
            <span class="inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">Hidden</span>
          </div>
          <div v-if="clientActions(client).length" class="absolute top-2 right-2">
            <UiActionMenu :items="clientActions(client)" :label="`Aksi untuk ${client.name}`" />
          </div>
          <div class="h-24 w-full flex items-center justify-center mb-3">
            <img :src="client.logoUrl" :alt="client.name" class="max-h-full max-w-full object-contain">
          </div>
          <h3 class="text-sm font-bold text-black dark:text-white text-center line-clamp-1 w-full" :title="client.name">{{ client.name }}</h3>
          <p class="text-xs text-gray mt-1">{{ client.category || 'Tanpa Kategori' }}</p>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <UiModal v-model="modalOpen" :title="isEditing ? 'Edit Klien' : 'Tambah Klien Baru'" size="sm">
      <form @submit.prevent="submitForm" class="space-y-4">
        <UiMediaInput
          v-model="selectedLogo"
          :existing-url="editingLogoUrl"
          label="Logo"
          accept="image/*"
          preview-aspect="contain"
          :required="!isEditing"
          :hint="isEditing ? 'Biarkan jika tidak ingin mengubah logo.' : 'PNG transparan, JPG, atau WebP.'"
        />
        <div>
          <label class="admin-label">Nama Klien</label>
          <input v-model="form.name" type="text" required class="admin-input">
        </div>
        <div>
          <label class="admin-label">Kategori (Opsional)</label>
          <input v-model="form.category" type="text" class="admin-input" placeholder="Contoh: BUMN, Swasta, Perbankan">
        </div>
        <UiAdvancedOptions label="Opsi Lanjutan" hint="Visibilitas di halaman publik">
          <div class="flex items-center gap-2">
            <input id="client-active" v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
            <label for="client-active" class="text-sm font-semibold text-black dark:text-white">Aktif (Ditampilkan)</label>
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
