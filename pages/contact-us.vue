<script setup lang="ts">
useHead({
  title: "Contact Us | KJPP HJA'R",
  meta: [{ name: 'description', content: 'Hubungi KJPP HJA\'R — kantor pusat di Palembang, cabang di Surabaya dan Balikpapan.' }],
})

const { data: branchesData } = await useFetch('/api/branches')
const branches = computed(() => branchesData.value || [])

const form = ref({ fullname: '', email: '', phone: '', city: '', message: '' })
const loading = ref(false)
const toast = ref<{ show: boolean; success: boolean; message: string }>({ show: false, success: false, message: '' })

function showToast(success: boolean, message: string) {
  toast.value = { show: true, success, message }
  setTimeout(() => { toast.value.show = false }, 4000)
}

async function submitForm() {
  if (!form.value.fullname || !form.value.email || !form.value.message) {
    showToast(false, 'Nama, email, dan pesan wajib diisi.')
    return
  }
  loading.value = true
  try {
    const result = await $fetch('/api/contacts/submit', { method: 'POST', body: form.value })
    showToast(true, (result as { message: string }).message)
    form.value = { fullname: '', email: '', phone: '', city: '', message: '' }
  } catch (err: unknown) {
    const e = err as { data?: { statusMessage?: string } }
    showToast(false, e?.data?.statusMessage || 'Terjadi kesalahan. Coba lagi.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <!-- Banner -->
    <div class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
      <div class="container">
        <div class="items-center py-10 md:flex md:h-[400px] md:py-0">
          <div class="heading mb-0 text-center ltr:md:text-left">
            <h4 class="!text-white">Contact Us</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Form & Socials -->
    <section class="bg-gradient-to-t from-white/[55%] to-transparent py-14 dark:bg-none lg:py-[50px]">
      <div class="container">
        <div class="relative z-10 lg:flex lg:gap-16">
          <div class="heading text-center ltr:lg:text-left">
            <h4>Get in touch with us</h4>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="mt-8 max-w-2xl">
          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-black dark:text-white">Nama Lengkap *</label>
                <input v-model="form.fullname" type="text" placeholder="Nama lengkap Anda" class="w-full rounded-xl border border-gray/20 px-4 py-3 text-sm outline-none transition focus:border-primary dark:bg-gray-dark dark:text-white" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-black dark:text-white">Email *</label>
                <input v-model="form.email" type="email" placeholder="email@contoh.com" class="w-full rounded-xl border border-gray/20 px-4 py-3 text-sm outline-none transition focus:border-primary dark:bg-gray-dark dark:text-white" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-black dark:text-white">Telepon</label>
                <input v-model="form.phone" type="tel" placeholder="08xx-xxxx-xxxx" class="w-full rounded-xl border border-gray/20 px-4 py-3 text-sm outline-none transition focus:border-primary dark:bg-gray-dark dark:text-white" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-black dark:text-white">Kota</label>
                <input v-model="form.city" type="text" placeholder="Kota Anda" class="w-full rounded-xl border border-gray/20 px-4 py-3 text-sm outline-none transition focus:border-primary dark:bg-gray-dark dark:text-white" />
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-black dark:text-white">Pesan *</label>
              <textarea v-model="form.message" rows="5" placeholder="Tuliskan pesan atau pertanyaan Anda..." class="w-full rounded-xl border border-gray/20 px-4 py-3 text-sm outline-none transition focus:border-primary dark:bg-gray-dark dark:text-white resize-none" />
            </div>
            <button type="submit" :disabled="loading" class="btn !rounded-xl">
              {{ loading ? 'Mengirim...' : 'Kirim Pesan' }}
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Branches with Map -->
    <section class="py-14 lg:py-[50px]">
      <div class="container">
        <div class="heading text-center">
          <h6>Lokasi Kami</h6>
          <h4>Kantor & Cabang</h4>
        </div>

        <div v-if="branches.length === 0" class="text-center text-gray py-10">Memuat data lokasi...</div>

        <div v-else class="space-y-10">
          <div
            v-for="branch in branches"
            :key="branch._id"
            class="flex flex-col gap-6 rounded-[32px] border border-gray/10 overflow-hidden sm:flex-row"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <!-- Map -->
            <ClientOnly>
              <div :id="`map-branch-${branch._id}`" class="sm:w-1/2 h-64 sm:h-auto min-h-[250px]" />
              <template #fallback>
                <div class="sm:w-1/2 h-64 bg-gray/10 animate-pulse" />
              </template>
            </ClientOnly>

            <!-- Info -->
            <div class="sm:w-1/2 flex flex-col justify-center py-8 px-6">
              <h3 class="text-xl font-extrabold text-primary">{{ branch.name }}</h3>
              <p class="text-gray font-semibold mt-1">{{ branch.city }}</p>
              <ul class="mt-4 space-y-3 text-sm">
                <li class="flex gap-3">
                  <span class="text-primary mt-0.5">📍</span>
                  <a :href="branch.mapsUrl" target="_blank" class="hover:text-primary transition text-black dark:text-white">{{ branch.address }}</a>
                </li>
                <li class="flex gap-3">
                  <span class="text-primary mt-0.5">📞</span>
                  <a :href="`tel:${branch.phone}`" class="hover:text-primary transition text-black dark:text-white">{{ branch.phone }}</a>
                </li>
                <li class="flex gap-3">
                  <span class="text-primary mt-0.5">✉️</span>
                  <a :href="`mailto:${branch.email}`" class="hover:text-primary transition text-black dark:text-white">{{ branch.email }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Toast notification -->
    <Transition name="slide-up">
      <div
        v-if="toast.show"
        class="toast"
        :class="toast.success ? 'toast-success' : 'toast-error'"
      >
        <span>{{ toast.success ? '✅' : '❌' }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(20px); }
</style>
