<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Admin Layanan | KJPP HJA'R" })

const { data: services, refresh, pending } = await useFetch('/api/services')

async function deleteItem(id: string) {
  if (!confirm('Yakin ingin menghapus layanan ini?')) return
  try {
    await $fetch(`/api/services/${id}`, { method: 'DELETE' })
    refresh()
  } catch (err) {
    alert('Gagal menghapus layanan')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Layanan Kami</h1>
        <p class="mt-1 text-sm text-gray">Kelola informasi layanan yang ditawarkan.</p>
      </div>
      <NuxtLink to="/admin/services/create" class="admin-btn-primary">
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
          <tbody class="bg-white divide-y divide-gray/10">
            <tr v-for="service in services" :key="service._id">
              <td class="px-6 py-4">
                <div class="font-bold text-black dark:text-white">{{ service.title }}</div>
                <div class="text-xs text-gray mt-1">{{ service.slug }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray">{{ service.icon || '-' }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray">
                {{ service.order }}
              </td>
              <td class="px-6 py-4">
                <span v-if="service.isActive" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>
                <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Nonaktif</span>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <NuxtLink :to="`/admin/services/${service._id}`" class="text-primary hover:text-blue-900 mr-4">Edit</NuxtLink>
                <button @click="deleteItem(service._id)" class="text-red-600 hover:text-red-900">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
