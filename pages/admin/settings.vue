<script setup lang="ts">
import {
  MAX_RESTORE_BYTES,
  createDefaultAppSettings,
  type AppSettings,
  type PublicAppSettings,
  type RestorePreviewResponse,
} from '~/types/settings'

definePageMeta({ layout: 'admin', middleware: 'auth' })
useHead({ title: "Pengaturan Aplikasi | Admin KJPP HJA'R" })

type TabId = 'general' | 'maintenance' | 'backup'

const tabs: Array<{ id: TabId; label: string; description: string }> = [
  { id: 'general', label: 'Umum & Footer', description: 'Identitas dan informasi publik' },
  { id: 'maintenance', label: 'Maintenance', description: 'Akses website publik' },
  { id: 'backup', label: 'Backup & Restore', description: 'Cadangan data aplikasi' },
]

const activeTab = ref<TabId>('general')
const { data: settings, pending: loadingSettings, refresh } = await useAppSettings()
const form = reactive<AppSettings>(createDefaultAppSettings())
const expectedEndLocal = ref('')
const saving = ref(false)
const feedback = reactive<{ type: 'success' | 'error' | ''; message: string }>({
  type: '',
  message: '',
})

const backupLoading = ref(false)
const restoreFile = ref<File | null>(null)
const restoreInput = ref<HTMLInputElement | null>(null)
const restorePreview = ref<RestorePreviewResponse | null>(null)
const previewLoading = ref(false)
const restoreLoading = ref(false)
const restoreConfirmation = ref('')

function showFeedback(type: 'success' | 'error', message: string) {
  feedback.type = type
  feedback.message = message
  window.setTimeout(() => {
    if (feedback.message === message) {
      feedback.type = ''
      feedback.message = ''
    }
  }, 6000)
}

function toLocalDateTime(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

function toIsoDateTime(value: string) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function hydrateForm(value: PublicAppSettings) {
  form.siteName = value.siteName
  Object.assign(form.footerAddress, value.footerAddress)
  Object.assign(form.socialMedia, value.socialMedia)
  Object.assign(form.generalContacts, value.generalContacts)
  form.copyrightText = value.copyrightText
  Object.assign(form.maintenanceMode, value.maintenanceMode)
  expectedEndLocal.value = toLocalDateTime(value.maintenanceMode.expectedEndTime)
}

watch(
  settings,
  (value) => {
    if (value) hydrateForm(value)
  },
  { immediate: true }
)

async function saveSettings() {
  saving.value = true
  feedback.type = ''
  try {
    const result = await $fetch<{ settings: PublicAppSettings }>('/api/settings', {
      method: 'PUT',
      body: {
        siteName: form.siteName,
        footerAddress: { ...form.footerAddress },
        socialMedia: { ...form.socialMedia },
        generalContacts: { ...form.generalContacts },
        copyrightText: form.copyrightText,
        maintenanceMode: {
          ...form.maintenanceMode,
          expectedEndTime: toIsoDateTime(expectedEndLocal.value),
        },
      },
    })
    hydrateForm(result.settings)
    await refresh()
    showFeedback('success', 'Pengaturan berhasil disimpan dan diterapkan.')
  } catch (error: any) {
    showFeedback('error', error?.data?.statusMessage || 'Pengaturan gagal disimpan.')
  } finally {
    saving.value = false
  }
}

async function downloadBackup() {
  backupLoading.value = true
  try {
    const response = await fetch('/api/settings/backup', { credentials: 'same-origin' })
    if (!response.ok) {
      const error = await response.json().catch(() => null)
      throw new Error(error?.statusMessage || 'Backup gagal dibuat.')
    }

    const blob = await response.blob()
    const disposition = response.headers.get('content-disposition') || ''
    const filename = disposition.match(/filename="([^"]+)"/)?.[1] || 'kjpphjar-backup.json'
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    showFeedback('success', 'Backup berhasil diunduh. Simpan file di lokasi yang aman.')
  } catch (error: any) {
    showFeedback('error', error?.message || 'Backup gagal dibuat.')
  } finally {
    backupLoading.value = false
  }
}

function selectRestoreFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null
  restorePreview.value = null
  restoreConfirmation.value = ''

  if (file && file.size > MAX_RESTORE_BYTES) {
    restoreFile.value = null
    input.value = ''
    showFeedback('error', 'Ukuran file melebihi batas 4 MB.')
    return
  }

  restoreFile.value = file
}

async function requestRestore(dryRun: boolean) {
  if (!restoreFile.value) throw new Error('Pilih file backup JSON terlebih dahulu.')

  const response = await fetch(`/api/settings/restore?dryRun=${dryRun}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...(dryRun ? {} : { 'X-Restore-Confirmation': 'MERGE' }),
    },
    body: restoreFile.value,
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(result?.statusMessage || result?.message || 'File backup tidak dapat diproses.')
  }
  return result
}

async function previewRestore() {
  previewLoading.value = true
  try {
    restorePreview.value = await requestRestore(true)
    showFeedback('success', 'File valid. Periksa ringkasan sebelum melanjutkan restore.')
  } catch (error: any) {
    restorePreview.value = null
    showFeedback('error', error?.message || 'Preview restore gagal.')
  } finally {
    previewLoading.value = false
  }
}

async function commitRestore() {
  if (!restorePreview.value || restoreConfirmation.value !== 'PULIHKAN') return
  restoreLoading.value = true
  try {
    const result = await requestRestore(false)
    await refresh()
    showFeedback('success', result.message || 'Restore merge berhasil diselesaikan.')
    restoreFile.value = null
    restorePreview.value = null
    restoreConfirmation.value = ''
    if (restoreInput.value) restoreInput.value.value = ''
  } catch (error: any) {
    showFeedback('error', error?.message || 'Restore gagal dijalankan.')
  } finally {
    restoreLoading.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <header>
      <h1 class="text-2xl font-extrabold text-black dark:text-white">Pengaturan Aplikasi</h1>
      <p class="mt-1 max-w-2xl text-sm leading-6 text-gray">
        Kelola informasi global, akses saat pemeliharaan, dan cadangan data website.
      </p>
    </header>

    <div
      v-if="feedback.message"
      role="status"
      aria-live="polite"
      class="flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-semibold"
      :class="
        feedback.type === 'success'
          ? 'bg-green-50 text-green-800 dark:bg-green-500/10 dark:text-green-300'
          : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
      "
    >
      <span aria-hidden="true">{{ feedback.type === 'success' ? '✓' : '!' }}</span>
      <span>{{ feedback.message }}</span>
    </div>

    <div class="admin-card !p-0 overflow-hidden">
      <nav
        class="flex overflow-x-auto border-b border-gray/10 px-2 sm:px-4"
        role="tablist"
        aria-label="Bagian pengaturan"
      >
        <button
          v-for="tab in tabs"
          :id="`settings-tab-${tab.id}`"
          :key="tab.id"
          type="button"
          role="tab"
          class="min-w-max border-b-2 px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:px-5"
          :class="
            activeTab === tab.id
              ? 'border-primary text-black dark:text-white'
              : 'border-transparent text-gray hover:text-black dark:hover:text-white'
          "
          :aria-selected="activeTab === tab.id"
          :aria-controls="`settings-panel-${tab.id}`"
          @click="activeTab = tab.id"
        >
          <span class="block text-sm font-bold">{{ tab.label }}</span>
          <span class="mt-0.5 hidden text-xs font-normal text-gray sm:block">{{ tab.description }}</span>
        </button>
      </nav>

      <div v-if="loadingSettings" class="space-y-4 p-6 sm:p-8" aria-busy="true">
        <div class="h-5 w-40 animate-pulse rounded bg-gray/10" />
        <div class="h-11 animate-pulse rounded-xl bg-gray/10" />
        <div class="h-24 animate-pulse rounded-xl bg-gray/10" />
      </div>

      <form
        v-else-if="activeTab === 'general'"
        id="settings-panel-general"
        role="tabpanel"
        aria-labelledby="settings-tab-general"
        class="p-6 sm:p-8"
        @submit.prevent="saveSettings"
      >
        <div class="space-y-8">
          <section aria-labelledby="identity-heading">
            <h2 id="identity-heading" class="text-base font-extrabold text-black dark:text-white">
              Identitas website
            </h2>
            <p class="mt-1 text-sm text-gray">Nama publik dan teks legal pada bagian bawah website.</p>
            <div class="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label for="site-name" class="admin-label">Nama situs</label>
                <input id="site-name" v-model="form.siteName" required maxlength="160" class="admin-input" />
              </div>
              <div>
                <label for="copyright" class="admin-label">Teks copyright</label>
                <input id="copyright" v-model="form.copyrightText" maxlength="300" class="admin-input" />
              </div>
            </div>
          </section>

          <section class="border-t border-gray/10 pt-8" aria-labelledby="address-heading">
            <h2 id="address-heading" class="text-base font-extrabold text-black dark:text-white">
              Alamat & Google Maps
            </h2>
            <div class="mt-5 space-y-5">
              <div>
                <label for="head-office" class="admin-label">Alamat kantor pusat</label>
                <textarea
                  id="head-office"
                  v-model="form.footerAddress.headOffice"
                  rows="3"
                  maxlength="1000"
                  class="admin-input resize-y"
                />
              </div>
              <div class="grid gap-5 md:grid-cols-2">
                <div>
                  <label for="maps-url" class="admin-label">URL Google Maps</label>
                  <input
                    id="maps-url"
                    v-model="form.footerAddress.googleMapsUrl"
                    type="url"
                    inputmode="url"
                    placeholder="https://maps.google.com/..."
                    class="admin-input"
                  />
                </div>
                <div>
                  <label for="maps-embed" class="admin-label">URL embed Google Maps</label>
                  <input
                    id="maps-embed"
                    v-model="form.footerAddress.googleMapsEmbedUrl"
                    type="url"
                    inputmode="url"
                    placeholder="https://www.google.com/maps/embed?..."
                    class="admin-input"
                  />
                  <p class="mt-1.5 text-xs leading-5 text-gray">Gunakan nilai HTTPS pada atribut src iframe.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="border-t border-gray/10 pt-8" aria-labelledby="contacts-heading">
            <h2 id="contacts-heading" class="text-base font-extrabold text-black dark:text-white">
              Kontak umum
            </h2>
            <p class="mt-1 text-sm text-gray">
              Daftar contact person bernama tetap dikelola melalui menu Kontak Footer.
            </p>
            <div class="mt-5 grid gap-5 md:grid-cols-3">
              <div>
                <label for="general-email" class="admin-label">Email</label>
                <input id="general-email" v-model="form.generalContacts.email" type="email" class="admin-input" />
              </div>
              <div>
                <label for="general-phone" class="admin-label">Telepon kantor</label>
                <input id="general-phone" v-model="form.generalContacts.phone" type="tel" class="admin-input" />
              </div>
              <div>
                <label for="general-whatsapp" class="admin-label">WhatsApp</label>
                <input
                  id="general-whatsapp"
                  v-model="form.generalContacts.whatsapp"
                  type="tel"
                  inputmode="tel"
                  placeholder="628117101066"
                  class="admin-input"
                />
              </div>
            </div>
          </section>

          <section class="border-t border-gray/10 pt-8" aria-labelledby="social-heading">
            <h2 id="social-heading" class="text-base font-extrabold text-black dark:text-white">
              Media sosial
            </h2>
            <div class="mt-5 grid gap-5 md:grid-cols-2">
              <div v-for="network in ['instagram', 'linkedin', 'facebook', 'youtube']" :key="network">
                <label :for="`social-${network}`" class="admin-label capitalize">{{ network }}</label>
                <input
                  :id="`social-${network}`"
                  v-model="form.socialMedia[network as keyof typeof form.socialMedia]"
                  type="url"
                  inputmode="url"
                  placeholder="https://"
                  class="admin-input"
                />
              </div>
            </div>
          </section>
        </div>

        <div class="mt-8 flex justify-end border-t border-gray/10 pt-6">
          <button type="submit" class="admin-btn-primary" :disabled="saving">
            {{ saving ? 'Menyimpan…' : 'Simpan pengaturan' }}
          </button>
        </div>
      </form>

      <form
        v-else-if="activeTab === 'maintenance'"
        id="settings-panel-maintenance"
        role="tabpanel"
        aria-labelledby="settings-tab-maintenance"
        class="p-6 sm:p-8"
        @submit.prevent="saveSettings"
      >
        <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div class="max-w-xl">
            <h2 class="text-base font-extrabold text-black dark:text-white">Mode maintenance</h2>
            <p class="mt-1 text-sm leading-6 text-gray">
              Pengunjung publik dialihkan ke halaman pemberitahuan. Panel admin tetap dapat diakses.
            </p>
          </div>
          <label class="inline-flex cursor-pointer items-center gap-3">
            <span class="text-sm font-bold text-black dark:text-white">
              {{ form.maintenanceMode.isActive ? 'Aktif' : 'Nonaktif' }}
            </span>
            <span class="relative inline-flex">
              <input v-model="form.maintenanceMode.isActive" type="checkbox" class="peer sr-only" />
              <span
                class="h-7 w-12 rounded-full bg-gray/20 transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-focus-visible:ring-offset-2 dark:bg-white/20"
              />
              <span
                class="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5"
              />
            </span>
          </label>
        </div>

        <div
          v-if="form.maintenanceMode.isActive"
          class="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200"
        >
          Website publik akan masuk maintenance sesaat setelah pengaturan disimpan. Pastikan pesan di bawah sudah jelas.
        </div>

        <div class="mt-8 space-y-5 border-t border-gray/10 pt-8">
          <div>
            <label for="maintenance-message" class="admin-label">Pesan untuk pengunjung</label>
            <textarea
              id="maintenance-message"
              v-model="form.maintenanceMode.message"
              rows="4"
              maxlength="1000"
              :required="form.maintenanceMode.isActive"
              class="admin-input resize-y"
            />
            <div class="mt-1.5 text-right text-xs text-gray">{{ form.maintenanceMode.message.length }}/1000</div>
          </div>
          <div class="max-w-sm">
            <label for="maintenance-end" class="admin-label">Estimasi selesai</label>
            <input id="maintenance-end" v-model="expectedEndLocal" type="datetime-local" class="admin-input" />
            <p class="mt-1.5 text-xs leading-5 text-gray">Opsional. Waktu ditampilkan dalam zona Asia/Jakarta.</p>
          </div>
        </div>

        <div class="mt-8 flex justify-end border-t border-gray/10 pt-6">
          <button type="submit" class="admin-btn-primary" :disabled="saving">
            {{ saving ? 'Menyimpan…' : 'Simpan status maintenance' }}
          </button>
        </div>
      </form>

      <section
        v-else
        id="settings-panel-backup"
        role="tabpanel"
        aria-labelledby="settings-tab-backup"
        class="p-6 sm:p-8"
      >
        <div class="flex flex-col gap-5 border-b border-gray/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div class="max-w-xl">
            <h2 class="text-base font-extrabold text-black dark:text-white">Download backup data</h2>
            <p class="mt-1 text-sm leading-6 text-gray">
              Menghasilkan Extended JSON dari koleksi aplikasi. Password admin, log sementara, dan binary media tidak disertakan.
            </p>
          </div>
          <button type="button" class="admin-btn-primary shrink-0" :disabled="backupLoading" @click="downloadBackup">
            {{ backupLoading ? 'Menyiapkan…' : 'Download backup' }}
          </button>
        </div>

        <div class="pt-8">
          <div class="max-w-2xl">
            <h2 class="text-base font-extrabold text-black dark:text-white">Restore dengan mode merge</h2>
            <p class="mt-1 text-sm leading-6 text-gray">
              Data dengan ID yang sama diperbarui dan data baru ditambahkan. Restore tidak menghapus dokumen apa pun.
            </p>
            <p class="mt-2 text-xs leading-5 text-gray">
              Commit restore membutuhkan MongoDB replica set atau cluster dengan dukungan transaction. Preview tetap tersedia pada database standalone.
            </p>
          </div>

          <div class="mt-5 rounded-xl border border-gray/20 p-5">
            <label for="restore-file" class="admin-label">File backup JSON</label>
            <input
              id="restore-file"
              ref="restoreInput"
              type="file"
              accept="application/json,.json"
              class="block w-full text-sm text-gray file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2.5 file:font-bold file:text-primary hover:file:bg-primary/20"
              @change="selectRestoreFile"
            />
            <p class="mt-2 text-xs text-gray">Maksimum 4 MB. Jalankan preview sebelum restore.</p>

            <button
              type="button"
              class="admin-btn-ghost mt-5"
              :disabled="!restoreFile || previewLoading"
              @click="previewRestore"
            >
              {{ previewLoading ? 'Memvalidasi…' : 'Preview isi backup' }}
            </button>
          </div>

          <div v-if="restorePreview" class="mt-6 space-y-5">
            <div class="overflow-hidden rounded-xl border border-gray/20">
              <div class="border-b border-gray/10 bg-gray/5 px-4 py-3">
                <p class="text-sm font-bold text-black dark:text-white">
                  {{ restorePreview.totalDocuments }} dokumen siap digabungkan
                </p>
                <p class="mt-0.5 text-xs text-gray">
                  Backup dibuat {{ new Date(restorePreview.backupCreatedAt).toLocaleString('id-ID') }}
                </p>
              </div>
              <div class="max-h-64 overflow-auto">
                <table class="min-w-full divide-y divide-gray/10 text-sm">
                  <thead class="bg-white dark:bg-gray-dark">
                    <tr>
                      <th class="px-4 py-2.5 text-left font-bold text-gray">Koleksi</th>
                      <th class="px-4 py-2.5 text-right font-bold text-gray">Baru</th>
                      <th class="px-4 py-2.5 text-right font-bold text-gray">Diperbarui</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray/10">
                    <tr v-for="item in restorePreview.collections" :key="item.collection">
                      <td class="px-4 py-2.5 font-semibold text-black dark:text-white">{{ item.collection }}</td>
                      <td class="px-4 py-2.5 text-right text-gray">{{ item.inserts }}</td>
                      <td class="px-4 py-2.5 text-right text-gray">{{ item.updates }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p class="rounded-xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900 dark:bg-blue-500/10 dark:text-blue-200">
              {{ restorePreview.uploadNotice }}
            </p>

            <div>
              <label for="restore-confirmation" class="admin-label">
                Ketik <strong>PULIHKAN</strong> untuk mengonfirmasi
              </label>
              <input
                id="restore-confirmation"
                v-model="restoreConfirmation"
                autocomplete="off"
                class="admin-input max-w-sm"
              />
            </div>

            <button
              type="button"
              class="admin-btn-danger"
              :disabled="restoreConfirmation !== 'PULIHKAN' || restoreLoading"
              @click="commitRestore"
            >
              {{ restoreLoading ? 'Memulihkan…' : 'Jalankan restore merge' }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
