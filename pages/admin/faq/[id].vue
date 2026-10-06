<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Edit FAQ | KJPP HJA'R" })

const route = useRoute()
const router = useRouter()
const id = route.params.id

const { data: faq, pending } = await useFetch(`/api/faq`, { query: { admin: 'true' } })

const form = ref({
  question: '',
  answer: '',
  isActive: true,
})

watchEffect(() => {
  if (faq.value) {
    const item = Array.isArray(faq.value) ? faq.value.find(f => f._id === id) : null
    if (item) {
      form.value = {
        question: item.question,
        answer: item.answer,
        isActive: item.isActive
      }
    } else {
      // If we don't find it, we might want to redirect or show error, but wait until loaded.
    }
  }
})

const saving = ref(false)
const error = ref('')

async function save() {
  if (!form.value.question || !form.value.answer) {
    error.value = 'Pertanyaan dan Jawaban harus diisi.'
    return
  }
  
  saving.value = true
  error.value = ''
  
  try {
    await $fetch(`/api/faq/${id}`, {
      method: 'PUT',
      body: form.value
    })
    router.push('/admin/faq')
  } catch (err: any) {
    error.value = err.data?.message || 'Gagal menyimpan perubahan'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <div class="flex items-center gap-4">
      <NuxtLink to="/admin/faq" class="text-gray-500 hover:text-black dark:hover:text-white transition">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      </NuxtLink>
      <h1 class="text-2xl font-extrabold text-black dark:text-white">Edit FAQ</h1>
    </div>

    <div v-if="pending" class="admin-card p-6 text-center text-gray-500">
      Memuat data...
    </div>
    
    <div v-else class="admin-card p-6">
      <form @submit.prevent="save" class="space-y-6">
        <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Pertanyaan <span class="text-red-500">*</span></label>
          <input v-model="form.question" type="text" required class="admin-input" placeholder="Masukkan pertanyaan" />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Jawaban <span class="text-red-500">*</span></label>
          <textarea v-model="form.answer" required class="admin-input min-h-[150px]" placeholder="Masukkan jawaban"></textarea>
        </div>

        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.isActive" type="checkbox" class="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary" />
            <span class="text-sm font-bold text-gray-700 dark:text-gray-300">Tampilkan di website</span>
          </label>
        </div>

        <div class="pt-4 border-t border-gray/10 flex justify-end gap-3">
          <NuxtLink to="/admin/faq" class="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            Batal
          </NuxtLink>
          <button type="submit" :disabled="saving" class="admin-btn-primary disabled:opacity-50">
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
