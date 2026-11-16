<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'services.view' })
useHead({ title: "Admin Layanan | KJPP HJA'R" })

const { can } = useAdminAuth()

const { data: servicesResponse, refresh, pending } = await useFetch('/api/services')
const services = computed(() => servicesResponse.value || [])

const saving = ref(false)
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const { ask } = useConfirm()
const toast = useToast()

async function deleteItem(service: any) {
  const confirmed = await ask({
    title: 'Hapus Layanan',
    message: 'Apakah Anda yakin ingin menghapus data layanan ini?',
    itemName: service.title || undefined,
    confirmText: 'Ya, Hapus',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/services/${service._id}`, { method: 'DELETE' })
    toast.success('Layanan berhasil dihapus.')
    refresh()
  } catch (err) {
    toast.error('Gagal menghapus layanan.')
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

  const items = servicesResponse.value
  if (!items || !Array.isArray(items)) return

  // Reorder visually
  const draggedItem = items[draggedIndex.value]
  items.splice(draggedIndex.value, 1)
  items.splice(index, 0, draggedItem)

  draggedIndex.value = null

  // Save to API
  await saveOrder(items)
}

async function saveOrder(items: any[]) {
  saving.value = true
  try {
    const serviceIds = items.map((s: any) => s._id)
    await $fetch('/api/services/reorder', {
      method: 'PUT',
      body: { serviceIds }
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
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Layanan Kami</h1>
        <p class="mt-1 text-sm text-gray">Kelola informasi layanan. Anda bisa drag & drop (geser) baris di bawah untuk mengatur urutannya.</p>
      </div>
      <NuxtLink v-if="can('services.create')" to="/admin/services/create" class="admin-btn-primary">
        + Tambah Layanan
      </NuxtLink>
    </div>

    <!-- Table -->
    <div class="admin-card overflow-hidden">
      <div v-if="pending" class="p-6 text-center text-gray-500">Memuat data...</div>
      <div v-else-if="!services?.length" class="p-6 text-center text-gray-500">
        Belum ada data layanan.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Layanan</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Icon</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Urutan</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-bold text-gray uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray/10 bg-white dark:bg-gray-dark">
            <tr v-for="(service, index) in services" :key="service._id"
                :draggable="can('services.update')"
                @dragstart="onDragStart(index, $event)"
                @dragover="onDragOver(index, $event)"
                @dragleave="onDragLeave(index, $event)"
                @drop="onDrop(index, $event)"
                :class="[
                  'cursor-move transition-all duration-200',
                  draggedIndex === index ? 'opacity-50 bg-stone-50 dark:bg-white/5' : 'hover:bg-gray/5',
                  dragOverIndex === index && draggedIndex !== index ? 'border-t-2 border-t-primary bg-primary/5' : ''
                ]">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <Icon name="ph:dots-six-vertical-bold" class="h-5 w-5 shrink-0 cursor-move text-gray-400" aria-hidden="true" />
                  <div>
                    <div class="font-bold text-black dark:text-white">{{ service.title }}</div>
                    <div class="text-xs text-gray mt-1">{{ service.slug }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div v-if="service.icon" class="inline-flex items-center gap-2 rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  <Icon :name="getNuxtIconName(service.icon)" class="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>{{ service.icon }}</span>
                </div>
                <span v-else class="text-sm text-gray">-</span>
              </td>
              <td class="px-6 py-4 text-sm tabular-nums text-gray">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4">
                <span v-if="service.isActive" class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">Aktif</span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Nonaktif</span>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <NuxtLink v-if="can('services.update')" :to="`/admin/services/${service._id}`" class="mr-4 font-semibold text-primary hover:underline">Edit</NuxtLink>
                <button v-if="can('services.delete')" @click="deleteItem(service)" class="font-semibold text-red-600 hover:underline dark:text-red-400">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
