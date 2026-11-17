<script setup lang="ts">
import type { PublicStaffGroup, PublicStaffMember } from '~/types/staff'

const config = useRuntimeConfig()
const baseUrl = String(config.public.baseUrl || 'https://kjpp-hjar.co.id').replace('://www.', '://').replace(/\/$/, '')
const { company, headOffice, branches, buildProfessionalServiceJsonLd } = useCompanyProfile()

const contactTitle = "Hubungi Kami – Kantor Pusat Palembang & Cabang | KJPP HJA'R"
const contactDescription =
  "Hubungi Kantor Pusat KJPP HJA'R di Palembang serta kantor cabang di Surabaya, Balikpapan, dan Tangerang Selatan untuk konsultasi dan penawaran penilaian."

useSeoMeta({
  title: contactTitle,
  description: contactDescription,
  ogTitle: contactTitle,
  ogDescription: contactDescription,
  twitterTitle: contactTitle,
  twitterDescription: contactDescription,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(buildProfessionalServiceJsonLd(baseUrl)),
    },
  ],
})

// Ringkasan staff di kartu kantor; daftar lengkap ada di halaman Tentang Kami.
const STAFF_PREVIEW_LIMIT = 6
const { data: staffData } = await useFetch<PublicStaffGroup[]>('/api/staff')
const staffByBranch = computed(() => new Map<string, PublicStaffMember[]>(
  (staffData.value || []).map((group) => [group.branch._id, group.staff])
))
function branchStaff(branchId: string) {
  return staffByBranch.value.get(branchId) ?? []
}

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
    <div class="pub-page-banner">
      <div class="container">
        <span class="pub-eyebrow">Hubungi Kami</span>
        <h1 class="pub-h1">Contact Us</h1>
      </div>
    </div>

    <!-- Form & Head Office Info + Google Maps Embed -->
    <section class="pub-section bg-[var(--paper)]">
      <div class="container">
        <UiBreadcrumbs :items="[{ label: 'Contact Us' }]" class="mb-10" />
        <h2 class="pub-h2">Hubungi Kantor Kami</h2>
        <p class="mt-3 max-w-[68ch] text-[17px] leading-[1.6] text-[var(--muted)]">Kirimkan pesan atau pertanyaan Anda kepada kami. Tim penilai publik {{ company.name }} siap membantu kebutuhan penilaian properti, bisnis, studi kelayakan, dan pengawasan proyek Anda.</p>

        <div class="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-start">
          <!-- Contact Form / Interactive Feedback Area -->
          <div>
            <div
              v-if="isSubmitted"
              class="pub-box border-l-4 border-l-[var(--brand-navy)] p-8"
            >
              <h3 class="pub-serif text-[24px] text-[var(--ink)]">
                Pesan Berhasil Terkirim!
              </h3>

              <p class="mt-3 max-w-[68ch] text-[16px] leading-[1.6] text-[var(--muted)]">
                Terima kasih, <strong class="text-[var(--ink)]">{{ submittedData?.fullname }}</strong>! Pesan Anda telah kami terima di sistem admin kami. Tim KJPP HJA'R akan segera menghubungi Anda melalui email <strong class="text-[var(--ink)]">{{ submittedData?.email }}</strong> atau nomor telepon Anda.
              </p>

              <!-- Receipt / Confirmation Summary Box -->
              <dl class="mt-6 border-t border-[var(--rule)] text-[14px]">
                <div class="flex items-center justify-between gap-4 border-b border-[var(--rule)] py-3">
                  <dt class="text-[var(--muted)]">Status Pengiriman</dt>
                  <dd class="font-bold text-[var(--ink)]">Diterima di Admin Panel KJPP HJA'R</dd>
                </div>
                <div class="flex items-center justify-between gap-4 border-b border-[var(--rule)] py-3">
                  <dt class="text-[var(--muted)]">Email Pengirim</dt>
                  <dd class="font-bold text-[var(--ink)]">{{ submittedData?.email }}</dd>
                </div>
                <div class="flex items-center justify-between gap-4 border-b border-[var(--rule)] py-3">
                  <dt class="text-[var(--muted)]">Waktu Kirim</dt>
                  <dd class="font-bold tabular-nums text-[var(--ink)]">{{ submittedData?.submittedAt }}</dd>
                </div>
              </dl>

              <button
                type="button"
                class="pub-btn mt-6"
                @click="resetFormToNewMessage"
              >
                Kirim Pesan Lainnya
              </button>
            </div>

            <!-- Active Form -->
            <form v-else class="space-y-5" novalidate @submit.prevent="submitForm">
              <!-- General Error Alert -->
              <div
                v-if="generalError"
                role="alert"
                class="flex items-start gap-3 rounded-[2px] border border-red-600/40 bg-red-600/5 p-4 text-[14px] font-bold text-red-700 dark:text-red-300"
              >
                <div class="flex-1">{{ generalError }}</div>
                <button type="button" class="text-red-700 dark:text-red-300" aria-label="Tutup pesan kesalahan" @click="generalError = ''">
                  <Icon name="ph:x-bold" class="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label for="contact-fullname" class="mb-2 block text-[14px] font-bold text-[var(--ink)]">
                    Nama Lengkap <span class="text-red-700 dark:text-red-300">*</span>
                  </label>
                  <input
                    id="contact-fullname"
                    v-model="form.fullname"
                    :disabled="loading"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    class="w-full rounded-[2px] border bg-[var(--surface)] px-4 py-3 text-[16px] text-[var(--ink)] outline-none transition-colors duration-150 placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[#47BDFF]/40"
                    :class="errors.fullname ? 'border-red-600 focus:border-red-600' : 'border-[var(--rule)] focus:border-[var(--brand-navy)]'"
                    @input="clearError('fullname')"
                  />
                  <p v-if="errors.fullname" class="mt-1 text-[14px] text-red-700 dark:text-red-300">{{ errors.fullname }}</p>
                </div>

                <div>
                  <label for="contact-email" class="mb-2 block text-[14px] font-bold text-[var(--ink)]">
                    Email <span class="text-red-700 dark:text-red-300">*</span>
                  </label>
                  <input
                    id="contact-email"
                    v-model="form.email"
                    :disabled="loading"
                    type="email"
                    placeholder="email@contoh.com"
                    class="w-full rounded-[2px] border bg-[var(--surface)] px-4 py-3 text-[16px] text-[var(--ink)] outline-none transition-colors duration-150 placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[#47BDFF]/40"
                    :class="errors.email ? 'border-red-600 focus:border-red-600' : 'border-[var(--rule)] focus:border-[var(--brand-navy)]'"
                    @input="clearError('email')"
                  />
                  <p v-if="errors.email" class="mt-1 text-[14px] text-red-700 dark:text-red-300">{{ errors.email }}</p>
                </div>

                <div>
                  <label for="contact-phone" class="mb-2 block text-[14px] font-bold text-[var(--ink)]">Telepon</label>
                  <input
                    id="contact-phone"
                    v-model="form.phone"
                    :disabled="loading"
                    type="tel"
                    placeholder="08xx-xxxx-xxxx"
                    class="w-full rounded-[2px] border bg-[var(--surface)] px-4 py-3 text-[16px] text-[var(--ink)] outline-none transition-colors duration-150 placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[#47BDFF]/40 border-[var(--rule)] focus:border-[var(--brand-navy)] tabular-nums"
                  />
                </div>

                <div>
                  <label for="contact-city" class="mb-2 block text-[14px] font-bold text-[var(--ink)]">Kota</label>
                  <input
                    id="contact-city"
                    v-model="form.city"
                    :disabled="loading"
                    type="text"
                    placeholder="Kota Anda"
                    class="w-full rounded-[2px] border bg-[var(--surface)] px-4 py-3 text-[16px] text-[var(--ink)] outline-none transition-colors duration-150 placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[#47BDFF]/40 border-[var(--rule)] focus:border-[var(--brand-navy)]"
                  />
                </div>
              </div>

              <div>
                <label for="contact-message" class="mb-2 block text-[14px] font-bold text-[var(--ink)]">
                  Pesan <span class="text-red-700 dark:text-red-300">*</span>
                </label>
                <textarea
                  id="contact-message"
                  v-model="form.message"
                  :disabled="loading"
                  rows="5"
                  placeholder="Tuliskan pesan atau pertanyaan Anda seputar layanan penilaian properti kami..."
                  class="w-full rounded-[2px] border bg-[var(--surface)] px-4 py-3 text-[16px] text-[var(--ink)] outline-none transition-colors duration-150 placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[#47BDFF]/40 resize-none"
                  :class="errors.message ? 'border-red-600 focus:border-red-600' : 'border-[var(--rule)] focus:border-[var(--brand-navy)]'"
                  @input="clearError('message')"
                />
                <p v-if="errors.message" class="mt-1 text-[14px] text-red-700 dark:text-red-300">{{ errors.message }}</p>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="pub-btn min-w-[160px] disabled:opacity-50"
              >
                <Icon v-if="loading" name="ph:spinner-gap-bold" class="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>{{ loading ? 'Sedang Mengirim Pesan...' : 'Kirim Pesan' }}</span>
              </button>
            </form>
          </div>

          <!-- Kantor Pusat Palembang, Jam Operasional & Google Maps Embed -->
          <aside class="pub-box space-y-6 p-6 lg:p-8">
            <div>
              <span class="text-[14px] font-bold text-[var(--brand-navy)]">
                {{ headOffice.name }}
              </span>
              <h3 class="pub-serif mt-2 text-[24px] leading-[1.25] text-[var(--ink)]">
                {{ company.name }}
              </h3>
              <dl class="mt-5 border-t border-[var(--rule)] text-[16px]">
                <div class="border-b border-[var(--rule)] py-3">
                  <dt class="text-[14px] text-[var(--muted)]">Alamat</dt>
                  <dd class="mt-1 leading-[1.6] text-[var(--ink)]">{{ headOffice.fullAddress }}</dd>
                </div>
                <div class="border-b border-[var(--rule)] py-3">
                  <dt class="text-[14px] text-[var(--muted)]">Telepon</dt>
                  <dd class="mt-1 tabular-nums">
                    <a :href="`tel:${headOffice.phoneE164}`" class="pub-link font-bold">{{ headOffice.phone }}</a>
                    <span class="mx-1.5 text-[var(--muted)]">·</span>
                    <a :href="`https://wa.me/${headOffice.whatsappDigits}`" target="_blank" rel="noopener noreferrer" class="pub-link font-bold">WhatsApp {{ headOffice.whatsapp }}</a>
                  </dd>
                </div>
                <div class="border-b border-[var(--rule)] py-3">
                  <dt class="text-[14px] text-[var(--muted)]">Email</dt>
                  <dd class="mt-1"><a :href="`mailto:${headOffice.email}`" class="pub-link font-bold">{{ headOffice.email }}</a></dd>
                </div>
                <div class="border-b border-[var(--rule)] py-3">
                  <dt class="text-[14px] text-[var(--muted)]">Jam Operasional Kantor</dt>
                  <dd class="mt-1 font-bold tabular-nums text-[var(--ink)]">{{ company.operatingHours.display }}</dd>
                  <dd class="text-[14px] text-[var(--muted)]">{{ company.operatingHours.weekendDisplay }}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 class="mb-3 text-[14px] font-bold text-[var(--ink)]">Peta Google Maps Kantor Pusat Palembang</h4>
              <iframe
                :src="headOffice.googleMapsEmbedUrl"
                :title="`Peta Google Maps ${headOffice.name} ${company.name}`"
                width="100%"
                height="260"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
                class="h-64 w-full rounded-[2px] border border-[var(--rule)]"
              />
              <a
                :href="headOffice.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="pub-link mt-3 inline-block text-[14px] font-bold"
              >
                Buka lokasi Kantor Pusat Palembang di Google Maps ↗
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Branches with Map -->
    <section class="pub-section border-t border-[var(--rule)] bg-[var(--paper)]">
      <div class="container">
        <span class="mb-3 block text-[14px] font-bold text-[var(--brand-navy)]">Lokasi Kami</span>
        <h2 class="pub-h2 mb-10">Kantor &amp; Cabang</h2>

        <div v-if="branches.length === 0" class="py-10 text-[var(--muted)]">Memuat data lokasi...</div>

        <div v-else class="border-t border-[var(--rule)]">
          <div
            v-for="branch in branches"
            :key="branch.id"
            class="grid gap-8 border-b border-[var(--rule)] py-10 md:grid-cols-2"
          >
            <!-- Map -->
            <ClientOnly>
              <BranchMap
                v-if="branch.latitude && branch.longitude"
                :lat="branch.latitude"
                :lng="branch.longitude"
                :title="branch.name"
                class="h-64 min-h-[250px] overflow-hidden rounded-[2px] border border-[var(--rule)] md:h-auto"
              />
              <div v-else class="flex h-64 min-h-[250px] items-center justify-center rounded-[2px] border border-[var(--rule)] bg-[var(--surface)] text-[var(--muted)] md:h-auto">
                Peta tidak tersedia
              </div>
              <template #fallback>
                <div class="h-64 animate-pulse rounded-[2px] bg-[var(--surface)]" />
              </template>
            </ClientOnly>

            <!-- Info -->
            <div class="flex flex-col justify-center">
              <h3 class="pub-serif text-[24px] leading-[1.25] text-[var(--ink)]">{{ branch.name }}</h3>
              <p class="mt-1 text-[14px] text-[var(--muted)]">{{ branch.city }}</p>
              <dl class="mt-5 border-t border-[var(--rule)] text-[16px]">
                <div class="border-b border-[var(--rule)] py-3">
                  <dt class="text-[14px] text-[var(--muted)]">Alamat</dt>
                  <dd class="mt-1"><a :href="branch.mapsUrl" target="_blank" rel="noopener noreferrer" class="leading-[1.6] text-[var(--ink)] transition-colors duration-150 hover:text-[var(--brand-navy)]">{{ branch.address }}</a></dd>
                </div>
                <div class="border-b border-[var(--rule)] py-3">
                  <dt class="text-[14px] text-[var(--muted)]">Telepon</dt>
                  <dd class="mt-1"><a :href="branch.phoneHref" class="pub-link font-bold tabular-nums">{{ branch.phone }}</a></dd>
                </div>
                <div class="border-b border-[var(--rule)] py-3">
                  <dt class="text-[14px] text-[var(--muted)]">Email</dt>
                  <dd class="mt-1"><a :href="`mailto:${branch.email}`" class="pub-link font-bold">{{ branch.email }}</a></dd>
                </div>
              </dl>

              <div v-if="branchStaff(branch.id).length" class="mt-6">
                <p class="text-[14px] font-bold text-[var(--ink)]">Tim di kantor ini</p>
                <ul class="mt-3 grid gap-x-6 gap-y-3 lg:grid-cols-2">
                  <li v-for="member in branchStaff(branch.id).slice(0, STAFF_PREVIEW_LIMIT)" :key="member._id" class="text-[14px]">
                    <p class="font-bold text-[var(--ink)]">{{ member.name }}</p>
                    <p class="text-[var(--muted)]">
                      {{ member.position }}<template v-if="member.mappiNumber"> · <span class="tabular-nums">No. MAPPI {{ member.mappiNumber }}</span></template>
                    </p>
                  </li>
                </ul>
                <NuxtLink
                  v-if="branchStaff(branch.id).length > STAFF_PREVIEW_LIMIT"
                  :to="`/about-us#staff-${branch.id}`"
                  class="pub-link mt-4 inline-block text-[14px] font-bold"
                >
                  Lihat semua {{ branchStaff(branch.id).length }} staff →
                </NuxtLink>
              </div>
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
        role="status"
      >
        <Icon :name="toast.success ? 'ph:check-circle-bold' : 'ph:warning-circle-bold'" class="h-5 w-5 shrink-0" aria-hidden="true" />
        <span class="text-xs font-semibold">{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(20px); }
</style>
