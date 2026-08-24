<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Admin Blog | KJPP HJA'R" })

const page = ref(1)
const { data, refresh, pending } = await useFetch('/api/blog', {
  query: computed(() => ({ page: page.value, limit: 10, admin: true }))
})

const articles = computed(() => data.value?.items || [])

async function deleteItem(id: string) {
  if (!confirm('Yakin ingin menghapus artikel ini?')) return
  try {
    await $fetch(`/api/blog/${id}`, { method: 'DELETE' })
    refresh()
  } catch (err) {
    alert('Gagal menghapus artikel')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-black dark:text-white">Blog & Artikel</h1>
        <p class="mt-1 text-sm text-gray">Kelola artikel, berita, atau publikasi.</p>
      </div>
      <NuxtLink to="/admin/blog/create" class="admin-btn-primary">
        + Tulis Artikel
      </NuxtLink>
    </div>

    <!-- Table -->
    <div class="admin-card overflow-hidden">
      <div v-if="pending" class="p-6 text-center text-gray-500">Memuat data...</div>
      <div v-else-if="!articles?.length" class="p-6 text-center text-gray-500">
        Belum ada artikel.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray/10">
          <thead class="bg-gray/5">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Artikel</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Kategori</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Views</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-bold text-gray uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray/10">
            <tr v-for="article in articles" :key="article._id">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-16 bg-gray-200 rounded overflow-hidden">
                    <img v-if="article.coverUrl" :src="article.coverUrl" :alt="article.title" class="h-full w-full object-cover">
                  </div>
                  <div class="ml-4">
                    <div class="font-bold text-black dark:text-white truncate max-w-xs">{{ article.title }}</div>
                    <div class="text-xs text-gray mt-1">{{ new Date(article.createdAt).toLocaleDateString('id-ID') }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray">{{ article.category || '-' }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray">
                {{ article.views }}
              </td>
              <td class="px-6 py-4">
                <span v-if="article.isPublished" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Published</span>
                <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Draft</span>
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <NuxtLink :to="`/admin/blog/${article._id}`" class="text-primary hover:text-blue-900 mr-4">Edit</NuxtLink>
                <button @click="deleteItem(article._id)" class="text-red-600 hover:text-red-900">Hapus</button>
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
  </div>
</template>
