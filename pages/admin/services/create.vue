<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth', permission: 'services.create' })
useHead({ title: "Tambah Layanan | KJPP HJA'R" })

const router = useRouter()
const toast = useToast()
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

async function submitForm() {
  saving.value = true
  try {
    await $fetch('/api/services', {
      method: 'POST',
      body: form
    })
    toast.success('Layanan berhasil ditambahkan.')
    router.push('/admin/services')
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Gagal menyimpan layanan.')
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
      <h1 class="text-2xl font-extrabold text-black dark:text-white">Tambah Layanan Baru</h1>
    </div>

    <div class="admin-card">
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
                <label class="admin-label">Slug URL (Opsional)</label>
                <input v-model="form.slug" type="text" class="admin-input" placeholder="Otomatis jika dikosongkan">
              </div>
              <div class="flex items-center gap-2">
                <input id="service-active" v-model="form.isActive" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary">
                <label for="service-active" class="text-sm font-semibold text-black dark:text-white">Aktif (Ditampilkan)</label>
              </div>
            </UiAdvancedOptions>
          </div>
        </div>

        <div class="border-t border-gray/10 pt-4 flex justify-end">
          <button type="submit" :disabled="saving" class="admin-btn-primary">
            {{ saving ? 'Menyimpan...' : 'Simpan Layanan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
