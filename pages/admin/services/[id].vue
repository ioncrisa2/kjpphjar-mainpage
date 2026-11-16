<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'services.update' })
useHead({ title: "Edit Layanan | KJPP HJA'R" })

const route = useRoute()
const router = useRouter()
const toast = useToast()
const id = route.params.id as string

const { data: service, pending } = await useFetch(`/api/services/${id}`)

const saving = ref(false)
const form = reactive({
  title: '',
  titleEn: '',
  slug: '',
  description: '',
  content: '',
  icon: '',
  order: 0,
  isActive: true
})

// Populate form when data is ready
watchEffect(() => {
  if (service.value) {
    form.title = service.value.title
    form.titleEn = service.value.titleEn
    form.slug = service.value.slug
    form.description = service.value.description || ''
    form.content = service.value.content || ''
    form.icon = service.value.icon || ''
    form.order = service.value.order || 0
    form.isActive = service.value.isActive !== false
  }
})

async function submitForm() {
  saving.value = true
  try {
    await $fetch(`/api/services/${id}`, {
      method: 'PUT',
      body: form
    })
    toast.success('Perubahan layanan berhasil disimpan.')
    router.push('/admin/services')
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Gagal menyimpan perubahan.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <div class="flex items-center gap-4">
      <NuxtLink to="/admin/services" class="admin-btn-ghost !px-3" aria-label="Kembali ke daftar layanan">
        <Icon name="ph:arrow-left-bold" />
      </NuxtLink>
      <h1 class="text-2xl font-extrabold text-black dark:text-white">Edit Layanan</h1>
    </div>

    <div v-if="pending" class="admin-card p-6 text-center text-gray">Memuat data...</div>
    <div v-else-if="!service" class="admin-card p-6 text-center text-red-500">Layanan tidak ditemukan</div>
    <div v-else class="admin-card">
      <form @submit.prevent="submitForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="admin-label">Nama Layanan (ID)</label>
            <input v-model="form.title" type="text" required class="admin-input">
          </div>
          <div>
            <label class="admin-label">Nama Layanan (EN)</label>
            <input v-model="form.titleEn" type="text" required class="admin-input">
          </div>
          <div class="md:col-span-2">
            <label class="admin-label">Icon Layanan</label>
            <AdminIconPicker v-model="form.icon" />
          </div>
          <div class="md:col-span-2">
            <label class="admin-label">Deskripsi Singkat (Tampil di card beranda)</label>
            <textarea v-model="form.description" rows="2" required class="admin-input resize-y"></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="admin-label">Konten Lengkap</label>
            <UiWysiwygEditor v-model="form.content" />
          </div>
          <div class="md:col-span-2">
            <UiAdvancedOptions label="Opsi Lanjutan" hint="Slug URL kustom dan status aktif">
              <div>
                <label class="admin-label">Slug URL</label>
                <input v-model="form.slug" type="text" class="admin-input" placeholder="Otomatis dari nama jika dikosongkan">
              </div>
              <div class="flex items-center gap-2">
                <input id="service-edit-active" v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
                <label for="service-edit-active" class="text-sm font-semibold text-black dark:text-white">Aktif (Ditampilkan)</label>
              </div>
            </UiAdvancedOptions>
          </div>
        </div>

        <div class="border-t border-gray/10 pt-4 flex justify-end">
          <button type="submit" :disabled="saving" class="admin-btn-primary">
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
