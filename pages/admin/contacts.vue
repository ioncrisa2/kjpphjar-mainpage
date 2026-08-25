<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Inbox Pesan | KJPP HJA'R" })

const page = ref(1)
const showUnreadOnly = ref(false)

const query = computed(() => {
  const q: any = { page: page.value, limit: 10 }
  if (showUnreadOnly.value) q.isRead = 'false'
  return q
})

const { data, refresh, pending } = await useFetch('/api/contacts', { query })

const { unreadCount, setUnreadCount, decrementUnread } = useUnreadContacts()

watch(
  data,
  (val) => {
    if (val?.unread !== undefined) {
      setUnreadCount(val.unread)
    }
  },
  { immediate: true }
)

const contacts = computed(() => data.value?.items || [])

const selectedContact = ref<any>(null)
const detailModalOpen = ref(false)

async function openDetail(contact: any) {
  selectedContact.value = contact
  detailModalOpen.value = true
  
  if (!contact.isRead) {
    try {
      await $fetch(`/api/contacts/${contact._id}`, {
        method: 'PATCH',
        body: { isRead: true }
      })
      contact.isRead = true
      decrementUnread()
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }
}

watch(showUnreadOnly, () => {
  page.value = 1
  refresh()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Inbox Pesan</h1>
        <p class="mt-1 text-sm text-gray">Pesan dari pengunjung website via form Contact Us.</p>
      </div>

      <!-- Export to Excel Button -->
      <div>
        <a
          href="/api/contacts/export"
          download
          class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
          title="Download semua data pesan kontak ke file Excel (.csv)"
        >
          <Icon name="ph:microsoft-excel-logo-bold" class="h-4 w-4" aria-hidden="true" />
          <span>Export ke Excel</span>
        </a>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-xl shadow-xs border border-gray/10 flex justify-between items-center dark:bg-gray-dark">
      <div class="flex items-center space-x-2">
        <label class="text-xs font-bold text-gray uppercase tracking-wider">Filter:</label>
        <select v-model="showUnreadOnly" class="border border-gray/20 rounded-lg text-xs py-1.5 px-3 bg-stone-50 dark:bg-gray-800 dark:text-white outline-none">
          <option :value="false">Semua Pesan</option>
          <option :value="true">Belum Dibaca</option>
        </select>
      </div>
      <div class="text-xs font-semibold text-gray">
        Total: {{ data?.total || 0 }} pesan
      </div>
    </div>

    <!-- Table -->
    <div class="admin-card overflow-hidden">
      <div v-if="pending" class="p-6 text-center text-gray-500">Memuat data...</div>
      <div v-else-if="!contacts?.length" class="p-6 text-center text-gray-500">
        Belum ada pesan.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Pengirim</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Kontak</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Cuplikan Pesan</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-3 text-right text-xs font-bold text-gray uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray/10">
            <tr v-for="contact in contacts" :key="contact._id" :class="{'bg-blue-50': !contact.isRead}">
              <td class="px-6 py-4">
                <div class="font-bold" :class="contact.isRead ? 'text-gray-900' : 'text-black'">{{ contact.fullname }}</div>
                <div class="text-xs text-gray mt-1" v-if="contact.city">{{ contact.city }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ contact.email }}</div>
                <div class="text-xs text-gray" v-if="contact.phone">{{ contact.phone }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 truncate max-w-xs" :title="contact.message">{{ contact.message }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray">
                {{ new Date(contact.submittedAt).toLocaleDateString('id-ID') }}
                <div class="text-xs">{{ new Date(contact.submittedAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) }}</div>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <button @click="openDetail(contact)" class="text-primary hover:text-blue-900 font-semibold">Buka</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="data?.totalPages && data.totalPages > 1" class="flex justify-center border-t border-gray/10 p-4 gap-2">
        <button
          class="admin-btn-ghost !px-3 !py-1.5"
          :disabled="page === 1"
          @click="page--"
        >Prev</button>
        <span class="flex items-center px-4 text-sm font-bold text-black dark:text-white">{{ page }} / {{ data.totalPages }}</span>
        <button
          class="admin-btn-ghost !px-3 !py-1.5"
          :disabled="page === data.totalPages"
          @click="page++"
        >Next</button>
      </div>
    </div>

    <!-- Detail Modal -->
    <UiModal v-model="detailModalOpen" title="Detail Pesan">
      <div v-if="selectedContact" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h4 class="text-xs font-semibold text-gray-500 uppercase">Pengirim</h4>
            <p class="text-sm font-medium text-gray-900 mt-1">{{ selectedContact.fullname }}</p>
          </div>
          <div>
            <h4 class="text-xs font-semibold text-gray-500 uppercase">Tanggal Kirim</h4>
            <p class="text-sm text-gray-900 mt-1">{{ new Date(selectedContact.submittedAt).toLocaleString('id-ID') }}</p>
          </div>
          <div>
            <h4 class="text-xs font-semibold text-gray-500 uppercase">Email</h4>
            <p class="text-sm text-gray-900 mt-1"><a :href="`mailto:${selectedContact.email}`" class="text-blue-600 hover:underline">{{ selectedContact.email }}</a></p>
          </div>
          <div>
            <h4 class="text-xs font-semibold text-gray-500 uppercase">Telepon</h4>
            <p class="text-sm text-gray-900 mt-1">{{ selectedContact.phone || '-' }}</p>
          </div>
          <div class="col-span-2" v-if="selectedContact.city">
            <h4 class="text-xs font-semibold text-gray-500 uppercase">Kota/Lokasi</h4>
            <p class="text-sm text-gray-900 mt-1">{{ selectedContact.city }}</p>
          </div>
          <div class="col-span-2 bg-gray-50 p-4 rounded-md border border-gray-200 mt-2">
            <h4 class="text-xs font-semibold text-gray-500 uppercase mb-2">Isi Pesan</h4>
            <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ selectedContact.message }}</p>
          </div>
        </div>
      </div>
    </UiModal>
  </div>
</template>
