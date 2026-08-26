<script setup lang="ts">
useHead({
  title: "Contact Us | KJPP HJA'R",
  meta: [{ name: 'description', content: 'Hubungi KJPP HJA\'R — kantor pusat di Palembang, cabang di Surabaya dan Balikpapan.' }],
})

const { data: branchesData } = await useFetch('/api/branches')
const branches = computed(() => branchesData.value || [])

const form = ref({ fullname: '', email: '', phone: '', city: '', message: '' })
const errors = ref<Record<string, string>>({})
const loading = ref(false)
const isSubmitted = ref(false)
const submittedData = ref<{ fullname: string; email: string; submittedAt: string } | null>(null)
const generalError = ref('')
const toast = ref<{ show: boolean; success: boolean; message: string }>({ show: false, success: false, message: '' })

function showToast(success: boolean, message: string) {
  toast.value = { show: true, success, message }
  setTimeout(() => { toast.value.show = false }, 5000)
}

function clearError(field: string) {
  if (errors.value[field]) {
    delete errors.value[field]
  }
  generalError.value = ''
}

function validate(): boolean {
  errors.value = {}
  generalError.value = ''

  if (!form.value.fullname.trim()) {
    errors.value.fullname = 'Nama lengkap wajib diisi'
  } else if (form.value.fullname.trim().length < 2) {
    errors.value.fullname = 'Nama terlalu pendek (minimal 2 karakter)'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email.trim()) {
    errors.value.email = 'Alamat email wajib diisi'
  } else if (!emailRegex.test(form.value.email.trim())) {
    errors.value.email = 'Format alamat email tidak valid (contoh: nama@email.com)'
  }

  if (!form.value.message.trim()) {
    errors.value.message = 'Pesan atau pertanyaan wajib diisi'
  } else if (form.value.message.trim().length < 5) {
    errors.value.message = 'Pesan terlalu pendek (minimal 5 karakter)'
  }

  return Object.keys(errors.value).length === 0
}

async function submitForm() {
  if (!validate()) {
    generalError.value = 'Mohon lengkapi kolom yang bertanda merah di bawah.'
    return
  }

  loading.value = true
  generalError.value = ''
  try {
    const result = await $fetch('/api/contacts/submit', { method: 'POST', body: form.value })
    
    // Save submitted data for visual receipt
    submittedData.value = {
      fullname: form.value.fullname,
      email: form.value.email,
      submittedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    }

    // Set interactive success state
    isSubmitted.value = true
    showToast(true, (result as { message: string }).message || 'Pesan Anda berhasil dikirim!')

    // Reset form fields
    form.value = { fullname: '', email: '', phone: '', city: '', message: '' }
    errors.value = {}
  } catch (err: unknown) {
    const e = err as { data?: { statusMessage?: string } }
    const errMsg = e?.data?.statusMessage || 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.'
    generalError.value = errMsg
    showToast(false, errMsg)
  } finally {
    loading.value = false
  }
}

function resetFormToNewMessage() {
  isSubmitted.value = false
  submittedData.value = null
  generalError.value = ''
  errors.value = {}
}
</script>

<template>
  <div>
    <!-- Banner -->
    <div class="bg-[url(/assets/images/consulting/banner-bg.jpg)] bg-cover bg-bottom bg-no-repeat pt-[82px] lg:pt-[106px]">
      <div class="container">
        <div class="items-center py-10 md:flex md:h-[400px] md:py-0">
          <div class="heading mb-0 text-center md:text-left">
            <h1 class="!text-white text-2xl font-extrabold sm:text-3xl lg:text-[40px] lg:!leading-[50px]">Contact Us</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Form & Socials -->
    <section class="bg-gradient-to-t from-white/[55%] to-transparent py-14 dark:bg-none lg:py-[50px]">
      <div class="container">
        <div class="relative z-10 lg:flex lg:gap-16">
          <div class="heading text-center lg:text-left">
            <h2 class="text-2xl font-extrabold text-black dark:text-white sm:text-3xl lg:text-[40px] lg:!leading-[50px]">Get in touch with us</h2>
            <p class="mt-2 text-sm text-gray max-w-xl">Kirimkan pesan atau pertanyaan Anda kepada kami. Tim ahli kami siap membantu kebutuhan penilaian dan konsultasi properti Anda.</p>
          </div>
        </div>

        <!-- Contact Form / Interactive Feedback Area -->
        <div class="mt-8 max-w-2xl">
          <!-- Interactive Success Card -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="isSubmitted"
              class="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-white to-white p-8 dark:from-emerald-950/30 dark:via-gray-dark dark:to-gray-dark shadow-xl"
            >
              <div class="flex flex-col items-center text-center">
                <!-- Success Animated Icon -->
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-8 ring-emerald-500/10">
                  <Icon name="ph:check-bold" class="h-8 w-8" />
                </div>

                <h3 class="mt-5 text-2xl font-extrabold text-black dark:text-white">
                  Pesan Berhasil Terkirim!
                </h3>

                <p class="mt-2 text-sm text-gray leading-relaxed max-w-lg">
                  Terima kasih, <strong class="text-black dark:text-white">{{ submittedData?.fullname }}</strong>! Pesan Anda telah kami terima di sistem admin kami. Tim KJPP HJA'R akan segera menghubungi Anda melalui email <strong class="text-black dark:text-white">{{ submittedData?.email }}</strong> atau nomor telepon Anda.
                </p>

                <!-- Receipt / Confirmation Summary Box -->
                <div class="mt-6 w-full rounded-2xl bg-stone-50 p-4 text-left text-xs border border-gray/10 dark:bg-gray-800/60">
                  <div class="flex items-center justify-between py-1.5 border-b border-gray/10">
                    <span class="text-gray">Status Pengiriman</span>
                    <span class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Diterima di Admin Panel KJPP HJA'R
                    </span>
                  </div>
                  <div class="flex items-center justify-between py-1.5 border-b border-gray/10">
                    <span class="text-gray">Email Pengirim</span>
                    <span class="font-semibold text-black dark:text-white">{{ submittedData?.email }}</span>
                  </div>
                  <div class="flex items-center justify-between py-1.5 pt-2">
                    <span class="text-gray">Waktu Kirim</span>
                    <span class="font-semibold text-black dark:text-white">{{ submittedData?.submittedAt }}</span>
                  </div>
                </div>

                <!-- Button to Send Another Message -->
                <button
                  type="button"
                  @click="resetFormToNewMessage"
                  class="btn !rounded-xl mt-6 inline-flex items-center gap-2 !bg-primary !text-black hover:!bg-secondary hover:!text-white transition"
                >
                  <Icon name="ph:plus-bold" class="h-4 w-4" />
                  <span>Kirim Pesan Lainnya</span>
                </button>
              </div>
            </div>

            <!-- Active Form -->
            <form v-else @submit.prevent="submitForm" class="space-y-4" novalidate>
              <!-- General Error Alert -->
              <div
                v-if="generalError"
                class="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs font-semibold text-red-600 dark:text-red-400 animate-fade-in"
              >
                <Icon name="ph:warning-circle-bold" class="h-5 w-5 shrink-0 mt-0.5" />
                <div class="flex-1">{{ generalError }}</div>
                <button type="button" @click="generalError = ''" class="text-red-400 hover:text-red-600">
                  <Icon name="ph:x-bold" class="h-4 w-4" />
                </button>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1.5 block text-sm font-semibold text-black dark:text-white">
                    Nama Lengkap <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.fullname"
                    @input="clearError('fullname')"
                    :disabled="loading"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition dark:bg-gray-dark dark:text-white"
                    :class="errors.fullname ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 focus:border-red-500' : 'border-gray/20 focus:border-primary'"
                  />
                  <p v-if="errors.fullname" class="text-xs text-red-500 mt-1 font-medium">{{ errors.fullname }}</p>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-semibold text-black dark:text-white">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.email"
                    @input="clearError('email')"
                    :disabled="loading"
                    type="email"
                    placeholder="email@contoh.com"
                    class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition dark:bg-gray-dark dark:text-white"
                    :class="errors.email ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 focus:border-red-500' : 'border-gray/20 focus:border-primary'"
                  />
                  <p v-if="errors.email" class="text-xs text-red-500 mt-1 font-medium">{{ errors.email }}</p>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-semibold text-black dark:text-white">Telepon</label>
                  <input
                    v-model="form.phone"
                    :disabled="loading"
                    type="tel"
                    placeholder="08xx-xxxx-xxxx"
                    class="w-full rounded-xl border border-gray/20 px-4 py-3 text-sm outline-none transition focus:border-primary dark:bg-gray-dark dark:text-white"
                  />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-semibold text-black dark:text-white">Kota</label>
                  <input
                    v-model="form.city"
                    :disabled="loading"
                    type="text"
                    placeholder="Kota Anda"
                    class="w-full rounded-xl border border-gray/20 px-4 py-3 text-sm outline-none transition focus:border-primary dark:bg-gray-dark dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-semibold text-black dark:text-white">
                  Pesan <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="form.message"
                  @input="clearError('message')"
                  :disabled="loading"
                  rows="5"
                  placeholder="Tuliskan pesan atau pertanyaan Anda seputar layanan penilaian properti kami..."
                  class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition dark:bg-gray-dark dark:text-white resize-none"
                  :class="errors.message ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 focus:border-red-500' : 'border-gray/20 focus:border-primary'"
                />
                <p v-if="errors.message" class="text-xs text-red-500 mt-1 font-medium">{{ errors.message }}</p>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="btn !rounded-xl inline-flex items-center justify-center gap-2 min-w-[160px] disabled:opacity-50 shadow-md"
              >
                <Icon v-if="loading" name="ph:spinner-gap-bold" class="h-4 w-4 animate-spin" />
                <Icon v-else name="ph:paper-plane-tilt-bold" class="h-4 w-4" />
                <span>{{ loading ? 'Sedang Mengirim Pesan...' : 'Kirim Pesan' }}</span>
              </button>
            </form>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Branches with Map -->
    <section class="py-14 lg:py-[50px]">
      <div class="container">
        <div class="heading text-center">
          <p class="subtitle">Lokasi Kami</p>
          <h2 class="text-2xl font-extrabold text-black dark:text-white sm:text-3xl lg:text-[40px] lg:!leading-[50px]">Kantor & Cabang</h2>
        </div>

        <div v-if="branches.length === 0" class="text-center text-gray py-10">Memuat data lokasi...</div>

        <div v-else class="space-y-10">
          <div
            v-for="branch in branches"
            :key="branch._id"
            class="flex flex-col gap-6 rounded-[32px] border border-gray/10 overflow-hidden sm:flex-row"
          >
            <!-- Map -->
            <ClientOnly>
              <BranchMap
                v-if="branch.latitude && branch.longitude"
                :lat="branch.latitude"
                :lng="branch.longitude"
                :title="branch.name"
                class="sm:w-1/2 h-64 sm:h-auto min-h-[250px]"
              />
              <div v-else class="sm:w-1/2 h-64 sm:h-auto min-h-[250px] bg-gray-100 flex items-center justify-center text-gray-500">
                Peta tidak tersedia
              </div>
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

    <!-- Floating Toast notification -->
    <Transition name="slide-up">
      <div
        v-if="toast.show"
        class="toast"
        :class="toast.success ? 'toast-success' : 'toast-error'"
      >
        <Icon :name="toast.success ? 'ph:check-circle-bold' : 'ph:warning-circle-bold'" class="h-5 w-5 shrink-0" />
        <span class="text-xs font-semibold">{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(20px); }
</style>
