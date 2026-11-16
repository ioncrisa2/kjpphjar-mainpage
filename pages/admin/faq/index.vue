<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'faq.view' })
useHead({ title: "Admin FAQ | KJPP HJA'R" })

const { can } = useAdminAuth()

const { data: faqsResponse, refresh, pending } = await useFetch('/api/faq', { query: { admin: 'true' } })
const faqs = computed(() => faqsResponse.value || [])

const saving = ref(false)
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const { ask } = useConfirm()
const toast = useToast()

async function deleteItem(faq: any) {
  const confirmed = await ask({
    title: 'Hapus FAQ',
    message: 'Apakah Anda yakin ingin menghapus pertanyaan ini?',
    itemName: faq.question || undefined,
    confirmText: 'Ya, Hapus',
  })
  if (!confirmed) return
  try {
    await $fetch(`/api/faq/${faq._id}`, { method: 'DELETE' })
    toast.success('FAQ berhasil dihapus.')
    refresh()
  } catch (err) {
    toast.error('Gagal menghapus FAQ.')
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

  const items = [...faqs.value]
  
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
    await $fetch('/api/faq/reorder', {
      method: 'PUT',
      body: { items }
    })
    await refresh()
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
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Q&A (FAQ)</h1>
        <p class="mt-1 text-sm text-gray">Kelola pertanyaan yang sering diajukan. Anda bisa drag & drop (geser) baris di bawah untuk mengatur urutannya.</p>
      </div>
      <NuxtLink v-if="can('faq.create')" to="/admin/faq/create" class="admin-btn-primary">
        + Tambah Pertanyaan
      </NuxtLink>
    </div>

    <!-- Table -->
    <div class="admin-card overflow-hidden">
      <div v-if="pending" class="p-6 text-center text-gray-500">Memuat data...</div>
      <div v-else-if="!faqs?.length" class="p-6 text-center text-gray-500">
        Belum ada data FAQ.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Pertanyaan</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Urutan</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-bold text-gray uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray/10 bg-white dark:bg-gray-dark">
            <tr v-for="(faq, index) in faqs" :key="faq._id"
                :draggable="can('faq.update')"
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
                    <div class="font-bold text-black dark:text-white line-clamp-2">{{ faq.question }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm tabular-nums text-gray">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4">
                <span v-if="faq.isActive" class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-500/20 dark:text-green-300">Aktif</span>
                <span v-else class="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-500/20 dark:text-red-300">Nonaktif</span>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <NuxtLink v-if="can('faq.update')" :to="`/admin/faq/${faq._id}`" class="mr-4 font-semibold text-primary hover:underline">Edit</NuxtLink>
                <button v-if="can('faq.delete')" @click="deleteItem(faq)" class="font-semibold text-red-600 hover:underline dark:text-red-400">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
